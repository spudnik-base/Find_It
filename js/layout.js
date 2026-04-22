// layout.js: card layout engine.
//
// Three-pass placement as per brief Ch 4:
//   1. measurePass: compute half-width/height for each symbol.
//   2. placePass:   try up to 500 random positions per symbol,
//                    testing circle boundary and SAT overlap against
//                    already-placed OBBs.
//   3. (drawing is done by renderer.js)
//
// Inputs use the symbol shape from content.js: { id, type, value, display }.

(function () {
  'use strict';

  const WORD_PADDING = 8;       // px padding around measured text box
  const OBB_GAP = 5;            // px separation between OBBs
  const BORDER = 14;            // px inset from the card boundary
  const MAX_ATTEMPTS = 500;

  // Base symbol sizes (measured for canvas 640 / radius 320) chosen so
  // short labels stay legible when the card is scaled down to ~220px on
  // screen, while still leaving room for up to 8 symbols on a single card.
  // Denser cards use smaller bases than sparse ones.
  function baseSizesForN(n) {
    const v = Number(n) || 6;
    if (v <= 4) return { wordBase: 52, imageBase: 170 };
    if (v <= 6) return { wordBase: 44, imageBase: 135 };
    return       { wordBase: 34, imageBase: 100 };
  }

  // ── sub/sup rich-text parsing ──────────────────────────────────────────
  // Markdown-style tokens: ~foo~ => subscript, ^foo^ => superscript.
  // Returns null if the label has no rich tokens (fast path).
  function parseRich(text) {
    if (!text || (text.indexOf('~') === -1 && text.indexOf('^') === -1)) return null;
    const segs = [];
    let i = 0;
    while (i < text.length) {
      const ch = text[i];
      if (ch === '~' || ch === '^') {
        const end = text.indexOf(ch, i + 1);
        if (end > i) {
          segs.push({ text: text.slice(i + 1, end), style: ch === '~' ? 'sub' : 'sup' });
          i = end + 1;
          continue;
        }
      }
      let j = i;
      while (j < text.length && text[j] !== '~' && text[j] !== '^') j++;
      if (j > i) segs.push({ text: text.slice(i, j), style: 'normal' });
      i = j;
    }
    return segs;
  }

  const SUB_SCALE = 0.62;
  const SUB_SHIFT_FRAC = 0.22;  // baseline offset as fraction of base size

  function escapeHTML(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Render a label string (possibly with ~sub~ or ^sup^ tokens) to safe HTML.
  // Non-rich labels pass through with HTML-escaping.
  function richToHTML(text) {
    const segs = parseRich(text);
    if (!segs) return escapeHTML(text);
    return segs.map((s) => {
      const safe = escapeHTML(s.text);
      if (s.style === 'sub') return '<sub>' + safe + '</sub>';
      if (s.style === 'sup') return '<sup>' + safe + '</sup>';
      return safe;
    }).join('');
  }

  // ── size assignment (brief Ch 4) ───────────────────────────────────────
  function randSize(baseMin, baseMax) {
    const t = Math.random();
    if (t < 0.35) return baseMin;
    if (t < 0.72) return baseMin + (baseMax - baseMin) * 0.45;
    return baseMax;
  }

  // ── OBB / SAT (brief Ch 4) ─────────────────────────────────────────────
  function obbCorners(o) {
    const cos = Math.cos(o.rot), sin = Math.sin(o.rot);
    const cx = o.cx, cy = o.cy, hw = o.hw, hh = o.hh;
    return [
      [cx + cos * hw - sin * hh, cy + sin * hw + cos * hh],
      [cx - cos * hw - sin * hh, cy - sin * hw + cos * hh],
      [cx - cos * hw + sin * hh, cy - sin * hw - cos * hh],
      [cx + cos * hw + sin * hh, cy + sin * hw - cos * hh],
    ];
  }

  function project(corners, ax, ay) {
    let min = Infinity, max = -Infinity;
    for (const [x, y] of corners) {
      const p = x * ax + y * ay;
      if (p < min) min = p;
      if (p > max) max = p;
    }
    return { min, max };
  }

  function obbOverlap(a, b, gap) {
    const g = gap == null ? OBB_GAP : gap;
    const ca = obbCorners(a), cb = obbCorners(b);
    const axes = [
      [Math.cos(a.rot), Math.sin(a.rot)],
      [-Math.sin(a.rot), Math.cos(a.rot)],
      [Math.cos(b.rot), Math.sin(b.rot)],
      [-Math.sin(b.rot), Math.cos(b.rot)],
    ];
    for (const [ax, ay] of axes) {
      const pa = project(ca, ax, ay);
      const pb = project(cb, ax, ay);
      if (pa.max + g < pb.min || pb.max + g < pa.min) return false;
    }
    return true;
  }

  function insideCircle(obb, cx, cy, rUsable) {
    const corners = obbCorners(obb);
    const rSq = rUsable * rUsable;
    for (const [x, y] of corners) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy > rSq) return false;
    }
    return true;
  }

  // ── pass 1: measure ────────────────────────────────────────────────────
  // For words: set ctx.font, measure, use actualBoundingBox if available.
  // For images: the caller provides (or omits) a width/height; we use size.
  function measurePass(ctx, symbols, opts) {
    const o = opts || {};
    const wordFont = o.wordFont || 'bold 34px Nunito, sans-serif';
    const sizeVariance = Math.max(1, Math.min(3, o.sizeVariance || 2.0));
    const defaults = o.symbolsPerCard ? baseSizesForN(o.symbolsPerCard) : { wordBase: 34, imageBase: 120 };
    const wordBase = o.wordBase || defaults.wordBase;
    const imageBase = o.imageBase || defaults.imageBase;

    ctx.save();
    ctx.font = wordFont;

    const measured = symbols.map((sym) => {
      if (sym.type === 'image') {
        const size = randSize(imageBase, imageBase * sizeVariance);
        return {
          sym,
          type: 'image',
          size,
          hw: size / 2,
          hh: size / 2,
        };
      }
      // word
      const size = randSize(wordBase, wordBase * sizeVariance);
      const rawLabel = sym.display || sym.value || '';
      const segments = parseRich(rawLabel);

      if (segments) {
        // Rich label with sub/sup. Measure each segment at its own size
        // and sum widths; height accounts for the vertical shift.
        let totalW = 0;
        let maxAscent = size * 0.75;
        let maxDescent = size * 0.25;
        const subSize = size * SUB_SCALE;
        const shift = size * SUB_SHIFT_FRAC;
        for (const seg of segments) {
          const segSize = seg.style === 'normal' ? size : subSize;
          ctx.font = wordFont.replace(/\d+px/, Math.round(segSize) + 'px');
          const m = ctx.measureText(seg.text);
          totalW += m.width;
          const a = m.actualBoundingBoxAscent || segSize * 0.75;
          const d = m.actualBoundingBoxDescent || segSize * 0.25;
          if (seg.style === 'sup') maxAscent = Math.max(maxAscent, a + shift);
          else if (seg.style === 'sub') maxDescent = Math.max(maxDescent, d + shift);
          else { maxAscent = Math.max(maxAscent, a); maxDescent = Math.max(maxDescent, d); }
        }
        return {
          sym,
          type: 'word',
          label: rawLabel,
          segments,
          size,
          ascent: maxAscent,
          descent: maxDescent,
          hw: totalW / 2 + WORD_PADDING,
          hh: (maxAscent + maxDescent) / 2 + WORD_PADDING,
          richWidth: totalW,
        };
      }

      // plain label fast path
      ctx.font = wordFont.replace(/\d+px/, Math.round(size) + 'px');
      const m = ctx.measureText(rawLabel);
      const textW = m.width;
      const ascent = m.actualBoundingBoxAscent || size * 0.75;
      const descent = m.actualBoundingBoxDescent || size * 0.25;
      const textH = ascent + descent;
      return {
        sym,
        type: 'word',
        label: rawLabel,
        size,
        ascent,
        descent,
        hw: textW / 2 + WORD_PADDING,
        hh: textH / 2 + WORD_PADDING,
      };
    });
    ctx.restore();
    return measured;
  }

  // ── pass 2: place ──────────────────────────────────────────────────────
  function shuffled(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function placePass(measured, cardRadius, opts) {
    const o = opts || {};
    const cx = o.cx == null ? cardRadius : o.cx;
    const cy = o.cy == null ? cardRadius : o.cy;
    const border = o.border == null ? BORDER : o.border;
    const maxAttempts = o.maxAttempts || MAX_ATTEMPTS;
    const gap = o.gap == null ? OBB_GAP : o.gap;

    const rUsable = cardRadius - border;
    const placed = [];
    const dropped = [];
    const order = shuffled(measured);

    for (const item of order) {
      let success = false;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // jitter center position inside the usable disc, rotation random.
        const r = Math.sqrt(Math.random()) * (rUsable - Math.max(item.hw, item.hh));
        const theta = Math.random() * Math.PI * 2;
        const rot = (Math.random() - 0.5) * Math.PI * 0.8;
        const candidate = {
          cx: cx + r * Math.cos(theta),
          cy: cy + r * Math.sin(theta),
          hw: item.hw,
          hh: item.hh,
          rot,
        };
        if (!insideCircle(candidate, cx, cy, rUsable)) continue;
        let collides = false;
        for (const p of placed) {
          if (obbOverlap(candidate, p, gap)) { collides = true; break; }
        }
        if (collides) continue;

        const result = { ...item, cx: candidate.cx, cy: candidate.cy, rot };
        placed.push(result);
        success = true;
        break;
      }
      if (!success) dropped.push(item);
    }

    return { placed, dropped };
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.layout = {
    WORD_PADDING,
    OBB_GAP,
    BORDER,
    MAX_ATTEMPTS,
    SUB_SCALE,
    SUB_SHIFT_FRAC,
    baseSizesForN,
    parseRich,
    richToHTML,
    escapeHTML,
    randSize,
    obbCorners,
    obbOverlap,
    insideCircle,
    measurePass,
    placePass,
  };
})();
