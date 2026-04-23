// renderer.js: Canvas 2D card renderer.
//
// Canvas spec (brief Ch 6):
//   internal resolution 640x640px, CSS display size 220x220px.
//   Five rotating background tints: cream, mint, lavender, blush, ice.

(function () {
  'use strict';

  const CANVAS_SIZE = 640;
  const DISPLAY_SIZE = 220;
  const TINTS = [
    '#fff8e7', // cream
    '#e7f7ef', // mint
    '#ece4fb', // lavender
    '#fde4ec', // blush
    '#e6f2fb', // ice
  ];

  const imageCache = new Map(); // dataURL -> HTMLImageElement

  function loadImage(dataURL) {
    if (imageCache.has(dataURL)) {
      const img = imageCache.get(dataURL);
      if (img.complete && img.naturalWidth) return Promise.resolve(img);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        imageCache.set(dataURL, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error('image load failed'));
      img.src = dataURL;
    });
  }

  function setupCanvas(canvas, opts) {
    const o = opts || {};
    const size = o.size || CANVAS_SIZE;
    canvas.width = size;
    canvas.height = size;
    if (o.display !== false) {
      const disp = o.displaySize || DISPLAY_SIZE;
      canvas.style.width = disp + 'px';
      canvas.style.height = disp + 'px';
    }
    return canvas.getContext('2d');
  }

  // Pile border colours for Q/A two-pile decks. Red on the Question
  // pile, blue on the Answer pile — strong contrast against the pastel
  // tints and visible once a stack is cut and mixed on a table.
  const PILE_BORDER = { Q: '#e8291c', A: '#1b73d9' };

  function drawCardBackground(ctx, opts) {
    const o = opts || {};
    const size = o.size || CANVAS_SIZE;
    const r = size / 2;
    const tint = o.tint || TINTS[0];
    const shape = o.shape || 'circle';
    const pileColor = o.pileSide ? PILE_BORDER[o.pileSide] : null;
    ctx.save();
    ctx.clearRect(0, 0, size, size);
    if (shape === 'rounded') {
      const radius = size * 0.14;
      roundRect(ctx, 2, 2, size - 4, size - 4, radius);
    } else {
      ctx.beginPath();
      ctx.arc(r, r, r - 2, 0, Math.PI * 2);
      ctx.closePath();
    }
    ctx.fillStyle = tint;
    ctx.fill();
    if (pileColor) {
      // Thicker coloured ring replaces the default black border so Q
      // vs A cards are sortable at a glance after printing and cutting.
      ctx.lineWidth = 16;
      ctx.strokeStyle = pileColor;
    } else {
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#0d0d0d';
    }
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── symbol drawing ─────────────────────────────────────────────────────
  function drawWordSymbol(ctx, item, opts) {
    const o = opts || {};
    const halo = o.halo;
    ctx.save();
    ctx.translate(item.cx, item.cy);
    ctx.rotate(item.rot);
    const w = item.hw * 2;
    const h = item.hh * 2;
    // Rounded-rectangle corners. Not a full stadium; full stadiums had
    // curved ends that chewed into the horizontal text room for short
    // labels. Bounded by w/2 so paths are valid for very narrow pills.
    const radius = Math.min(h * 0.4, w * 0.5);

    if (halo) {
      ctx.save();
      ctx.shadowColor = 'rgba(255, 200, 50, 0.85)';
      ctx.shadowBlur = 32;
      ctx.fillStyle = '#ffe033';
      roundRect(ctx, -w / 2, -h / 2, w, h, radius);
      ctx.fill();
      ctx.restore();
    }

    // pill background
    roundRect(ctx, -w / 2, -h / 2, w, h, radius);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0d0d0d';
    ctx.stroke();

    // label
    ctx.fillStyle = '#0d0d0d';
    ctx.textBaseline = 'middle';

    if (item.segments) {
      // Rich label: draw segments left-to-right with sub/sup baseline shift.
      ctx.textAlign = 'left';
      const L = FindIt.layout;
      const subSize = item.size * L.SUB_SCALE;
      const shift = item.size * L.SUB_SHIFT_FRAC;
      let x = -item.richWidth / 2;
      for (const seg of item.segments) {
        const segSize = seg.style === 'normal' ? item.size : subSize;
        ctx.font = 'bold ' + Math.round(segSize) + 'px Nunito, sans-serif';
        const dy =
          seg.style === 'sub' ? shift :
          seg.style === 'sup' ? -shift : 0;
        ctx.fillText(seg.text, x, dy);
        x += ctx.measureText(seg.text).width;
      }
    } else {
      ctx.textAlign = 'center';
      ctx.font = 'bold ' + Math.round(item.size) + 'px Nunito, sans-serif';
      ctx.fillText(item.label, 0, 1);
    }

    ctx.restore();
  }

  async function drawImageSymbol(ctx, item, opts) {
    const o = opts || {};
    const halo = o.halo;
    try {
      const img = await loadImage(item.sym.value);
      ctx.save();
      ctx.translate(item.cx, item.cy);
      ctx.rotate(item.rot);
      if (halo) {
        ctx.save();
        ctx.shadowColor = 'rgba(255, 200, 50, 0.85)';
        ctx.shadowBlur = 40;
        ctx.fillStyle = 'rgba(255, 224, 51, 0.6)';
        ctx.beginPath();
        ctx.arc(0, 0, item.size * 0.58, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.drawImage(img, -item.size / 2, -item.size / 2, item.size, item.size);
      ctx.restore();
    } catch {
      // placeholder on load failure
      drawPlaceholderSymbol(ctx, item);
    }
  }

  function drawBlankSymbol(ctx, item, opts) {
    const o = opts || {};
    ctx.save();
    ctx.translate(item.cx, item.cy);
    const r = item.size / 2;
    if (o.halo) {
      ctx.save();
      ctx.shadowColor = 'rgba(255, 200, 50, 0.85)';
      ctx.shadowBlur = 40;
      ctx.fillStyle = 'rgba(255, 224, 51, 0.6)';
      ctx.beginPath();
      ctx.arc(0, 0, r + 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.strokeStyle = 'rgba(13, 13, 13, 0.28)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    // small centre dot so the thing reads as "marker" not "random circle"
    ctx.fillStyle = 'rgba(13, 13, 13, 0.28)';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPlaceholderSymbol(ctx, item) {
    ctx.save();
    ctx.translate(item.cx, item.cy);
    ctx.rotate(item.rot);
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#0d0d0d';
    ctx.lineWidth = 3;
    const s = item.size;
    ctx.fillRect(-s / 2, -s / 2, s, s);
    ctx.strokeRect(-s / 2, -s / 2, s, s);
    ctx.fillStyle = '#999';
    ctx.font = Math.round(s * 0.4) + 'px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 0, 1);
    ctx.restore();
  }

  function drawDebugOutlines(ctx, placed) {
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 41, 28, 0.7)';
    ctx.lineWidth = 1.5;
    for (const item of placed) {
      const corners = FindIt.layout.obbCorners({
        cx: item.cx, cy: item.cy, hw: item.hw, hh: item.hh, rot: item.rot,
      });
      ctx.beginPath();
      ctx.moveTo(corners[0][0], corners[0][1]);
      for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i][0], corners[i][1]);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  // ── top-level: render a single card ────────────────────────────────────
  // cardSymbols: array of symbol objects (content.js shape).
  // opts: { tint, shape, highlightId, showDebug, sizeVariance, symbolsPerCard }
  async function renderCard(canvas, cardSymbols, opts) {
    const o = opts || {};
    const ctx = setupCanvas(canvas, o);
    drawCardBackground(ctx, {
      size: canvas.width,
      tint: o.tint,
      shape: o.shape,
      pileSide: o.pileSide || null,
    });

    // Every symbol on a Dobble card is the pair-mate with some other card,
    // so silently dropping one breaks the "every pair shares exactly one"
    // invariant for all n cards that share it. Shrink until everything fits.
    const SHRINK_STEPS = [1.0, 0.85, 0.72, 0.6, 0.5, 0.42];
    let placed, dropped;
    for (const scale of SHRINK_STEPS) {
      const measured = FindIt.layout.measurePass(ctx, cardSymbols, {
        sizeVariance: o.sizeVariance,
        symbolsPerCard: o.symbolsPerCard,
        scale,
        pairSide: o.pileSide || null,
      });
      const result = FindIt.layout.placePass(measured, canvas.width / 2, {
        cx: canvas.width / 2,
        cy: canvas.height / 2,
      });
      placed = result.placed;
      dropped = result.dropped;
      if (dropped.length === 0) break;
    }

    // Draw symbols. Images drawn first (async), then words on top.
    const drawJobs = [];
    for (const item of placed) {
      const halo = o.highlightId && item.sym.id === o.highlightId;
      if (item.type === 'image') {
        drawJobs.push(drawImageSymbol(ctx, item, { halo }));
      } else if (item.type === 'blank') {
        drawBlankSymbol(ctx, item, { halo });
      } else {
        drawWordSymbol(ctx, item, { halo });
      }
    }
    await Promise.all(drawJobs);

    if (o.showDebug) drawDebugOutlines(ctx, placed);

    return { placed, dropped };
  }

  function pickTint(index) {
    return TINTS[((index % TINTS.length) + TINTS.length) % TINTS.length];
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.renderer = {
    CANVAS_SIZE,
    DISPLAY_SIZE,
    TINTS,
    PILE_BORDER,
    imageCache,
    loadImage,
    setupCanvas,
    drawCardBackground,
    drawWordSymbol,
    drawImageSymbol,
    drawBlankSymbol,
    drawPlaceholderSymbol,
    renderCard,
    pickTint,
  };
})();
