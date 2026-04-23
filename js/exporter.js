// exporter.js: PDF export via window.print() and PNG-sheet download.
//
// Flow (brief Ch 7):
//   1. Build the full deck (projective -> assign symbols -> layout each card).
//   2. Render each card to an offscreen 640x640 canvas.
//   3. Convert each canvas to a PNG data URL.
//   4. Build a hidden div.print-grid filled with <img> tags.
//   5. Wait for every image to fully decode, then call window.print().
//   6. Remove the hidden grid shortly after.

(function () {
  'use strict';

  const PRINT_CONTAINER_ID = 'findit-print-container';

  // Print layout presets (all mm, A4 portrait):
  //   compact  -> 3x3 of 55mm (9 per page; traditional Dobble size)
  //   standard -> 2x3 of 68mm (6 per page; easier to read)
  //   large    -> 2x2 of 90mm (4 per page; trading-card size)
  const PRINT_SIZES = {
    compact:  { label: 'Compact',  cardMM: 55, cols: 3, rows: 3, gutter: 5 },
    standard: { label: 'Standard', cardMM: 68, cols: 2, rows: 3, gutter: 6 },
    large:    { label: 'Large',    cardMM: 90, cols: 2, rows: 2, gutter: 8 },
  };

  function printLayout(size) {
    return PRINT_SIZES[size] || PRINT_SIZES.standard;
  }

  // ── lazy loader for jsPDF ──────────────────────────────────────────────
  // We only pull the ~100KB library when the user clicks the PDF download
  // button, so initial page load stays dependency-free.
  const JSPDF_URL = 'js/jspdf.umd.min.js';
  let jsPDFLoader = null;
  function ensureJsPDF() {
    if (jsPDFLoader) return jsPDFLoader;
    jsPDFLoader = new Promise((resolve, reject) => {
      if (window.jspdf && window.jspdf.jsPDF) {
        resolve(window.jspdf.jsPDF);
        return;
      }
      const s = document.createElement('script');
      s.src = JSPDF_URL;
      s.async = true;
      s.onload = () => {
        if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
        else reject(new Error('jsPDF failed to initialise'));
      };
      s.onerror = () => reject(new Error('Failed to load jsPDF from ' + JSPDF_URL));
      document.head.appendChild(s);
    });
    return jsPDFLoader;
  }

  async function buildDeckForExport() {
    const content = FindIt.content.get();
    const deck = FindIt.deck.buildDeck(content.symbols, content.symbolsPerCard);
    const twoPile = FindIt.deck.isTwoPileMode(content.symbols);
    return {
      deck,
      sizeVariance: content.sizeVariance,
      symbolsPerCard: content.symbolsPerCard,
      twoPile,
    };
  }

  async function renderAllCards(deck, sizeVariance, shape, symbolsPerCard, pileSide) {
    const dataURLs = [];
    const size = FindIt.renderer.CANVAS_SIZE;
    // Render sequentially to avoid large parallel memory spikes with many
    // image symbols.
    for (let i = 0; i < deck.cards.length; i++) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      await FindIt.renderer.renderCard(canvas, deck.cards[i], {
        size,
        display: false,
        tint: FindIt.renderer.pickTint(i),
        shape: shape || 'circle',
        sizeVariance,
        symbolsPerCard,
        pileSide: pileSide || null,
      });
      dataURLs.push(canvas.toDataURL('image/png'));
    }
    return dataURLs;
  }

  // In two-pile mode, emit the deck as an ordered list of "piles":
  // [{ dataURLs, label?, pileSide }]. Callers iterate this to lay out
  // pages, inserting a divider before each pile after the first.
  async function renderPiles(opts) {
    const { deck, sizeVariance, symbolsPerCard, twoPile } = opts;
    if (!twoPile) {
      const urls = await renderAllCards(deck, sizeVariance, opts.shape, symbolsPerCard, null);
      return [{ dataURLs: urls, pileSide: null, label: null }];
    }
    const qUrls = await renderAllCards(deck, sizeVariance, opts.shape, symbolsPerCard, 'Q');
    const aUrls = await renderAllCards(deck, sizeVariance, opts.shape, symbolsPerCard, 'A');
    return [
      { dataURLs: qUrls, pileSide: 'Q', label: 'Questions' },
      { dataURLs: aUrls, pileSide: 'A', label: 'Answers' },
    ];
  }

  function clearPrintContainer() {
    const existing = document.getElementById(PRINT_CONTAINER_ID);
    if (existing) existing.remove();
  }

  function buildDividerPrintPage(label) {
    const page = document.createElement('div');
    page.className = 'print-page print-divider';
    page.style.display = 'flex';
    page.style.alignItems = 'center';
    page.style.justifyContent = 'center';
    page.style.pageBreakBefore = 'always';
    page.style.pageBreakAfter = 'always';
    page.style.textAlign = 'center';
    const h = document.createElement('div');
    h.style.fontFamily = "'Bangers', 'Nunito', sans-serif";
    h.style.fontSize = '96pt';
    h.style.color = '#0d0d0d';
    h.style.letterSpacing = '2px';
    h.textContent = (label || '').toUpperCase() + '  →';
    page.appendChild(h);
    return page;
  }

  // Accepts either a flat dataURLs array (legacy) or an ordered list of
  // piles [{ dataURLs, label? }]. When multiple piles are passed, insert
  // a full-page titled divider between them and never cross pile
  // boundaries with a partial card row.
  function buildPrintGrid(piles, size) {
    clearPrintContainer();
    const list = Array.isArray(piles) && piles.length && piles[0].dataURLs
      ? piles
      : [{ dataURLs: piles, label: null }];
    const L = printLayout(size);
    const perPage = L.cols * L.rows;

    const container = document.createElement('div');
    container.id = PRINT_CONTAINER_ID;

    list.forEach((pile, pileIdx) => {
      if (pileIdx > 0 && pile.label) {
        container.appendChild(buildDividerPrintPage(pile.label));
      }
      const urls = pile.dataURLs;
      for (let i = 0; i < urls.length; i += perPage) {
        const page = document.createElement('div');
        page.className = 'print-page';
        const grid = document.createElement('div');
        grid.className = 'print-grid';
        // Inline styles override the @media print defaults so the grid
        // adapts to the chosen n (e.g. 2x3 of 68mm for n=8).
        grid.style.gridTemplateColumns = 'repeat(' + L.cols + ', ' + L.cardMM + 'mm)';
        grid.style.gridAutoRows = L.cardMM + 'mm';
        grid.style.gap = L.gutter + 'mm';
        for (let j = i; j < Math.min(i + perPage, urls.length); j++) {
          const wrap = document.createElement('div');
          wrap.className = 'print-card-wrap';
          wrap.style.width = L.cardMM + 'mm';
          wrap.style.height = L.cardMM + 'mm';
          const img = document.createElement('img');
          img.src = urls[j];
          img.alt = 'card ' + (j + 1);
          wrap.appendChild(img);
          grid.appendChild(wrap);
        }
        page.appendChild(grid);
        container.appendChild(page);
      }
    });
    document.body.appendChild(container);
    return container;
  }

  function waitForImages(container) {
    const imgs = Array.from(container.querySelectorAll('img'));
    return Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve; // fail open; still print
            })
      )
    );
  }

  async function printDeck(opts) {
    const o = opts || {};
    const buildOpts = await buildDeckForExport();
    const piles = await renderPiles({ ...buildOpts, shape: o.shape });
    const container = buildPrintGrid(piles, o.size);
    await waitForImages(container);
    // Defer slightly so the browser has painted the grid before print.
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 50)));
    window.print();
    setTimeout(clearPrintContainer, 2000);
    const totalCards = piles.reduce((n, p) => n + p.dataURLs.length, 0);
    return {
      cards: totalCards,
      size: (printLayout(o.size)).label,
      twoPile: buildOpts.twoPile,
    };
  }

  // Instant PDF download via jsPDF (lazy-loaded). Lays the cards out on
  // A4 portrait using the user's chosen size preset and triggers a browser
  // download with no print dialog.
  function addDividerPDFPage(doc, label, pageW, pageH) {
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(48);
    doc.setTextColor(13, 13, 13);
    const text = (label || '').toUpperCase() + '  →';
    doc.text(text, pageW / 2, pageH / 2, { align: 'center', baseline: 'middle' });
  }

  async function downloadPDF(opts) {
    const o = opts || {};
    const JsPDF = await ensureJsPDF();
    const buildOpts = await buildDeckForExport();
    const piles = await renderPiles({ ...buildOpts, shape: o.shape });

    const doc = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = 210, pageH = 297;
    const layout = printLayout(o.size);
    const cardMM = layout.cardMM;
    const gutter = layout.gutter;
    const cols = layout.cols, rows = layout.rows;
    const gridW = cols * cardMM + (cols - 1) * gutter;
    const gridH = rows * cardMM + (rows - 1) * gutter;
    const marginX = (pageW - gridW) / 2;
    const marginY = Math.max(15, (pageH - gridH) / 2);
    const cardsPerPage = cols * rows;

    // Page policy: jsPDF auto-creates page 1. The first pile's cards
    // fill it in place. Each subsequent pile gets a full-page divider
    // followed by a fresh cards page, so piles never share a page.
    let totalCards = 0;
    piles.forEach((pile, pileIdx) => {
      if (pileIdx > 0) {
        addDividerPDFPage(doc, pile.label || 'Next Pile', pageW, pageH);
        doc.addPage();
      }
      const urls = pile.dataURLs;
      for (let i = 0; i < urls.length; i++) {
        const slot = i % cardsPerPage;
        if (i > 0 && slot === 0) doc.addPage();
        const col = slot % cols;
        const row = Math.floor(slot / cols);
        const x = marginX + col * (cardMM + gutter);
        const y = marginY + row * (cardMM + gutter);
        doc.addImage(urls[i], 'PNG', x, y, cardMM, cardMM, undefined, 'FAST');

        // Subtle corner cut guides (0.1mm grey) at each card's top-left and
        // bottom-right so teachers can trim cleanly.
        doc.setDrawColor(200);
        doc.setLineWidth(0.1);
        doc.line(x - 1, y, x + 2, y);
        doc.line(x, y - 1, x, y + 2);
        doc.line(x + cardMM + 1, y + cardMM, x + cardMM - 2, y + cardMM);
        doc.line(x + cardMM, y + cardMM + 1, x + cardMM, y + cardMM - 2);
      }
      totalCards += urls.length;
    });

    const raw = FindIt.content.get().setName || 'find-it';
    const name = raw.replace(/[^a-z0-9-_]+/gi, '_').toLowerCase() || 'find-it';
    doc.save(name + '.pdf');
    return { cards: totalCards, filename: name + '.pdf', twoPile: buildOpts.twoPile };
  }

  async function downloadPNGSheet(opts) {
    const o = opts || {};
    const { deck, sizeVariance, symbolsPerCard } = await buildDeckForExport();
    const dataURLs = await renderAllCards(deck, sizeVariance, o.shape, symbolsPerCard);

    // Build a single composite canvas: 3 cards wide, rows stacked.
    const cols = 3;
    const rows = Math.ceil(dataURLs.length / cols);
    const cardSize = 320; // thumbnail
    const pad = 16;
    const sheet = document.createElement('canvas');
    sheet.width = cols * cardSize + (cols + 1) * pad;
    sheet.height = rows * cardSize + (rows + 1) * pad;
    const sctx = sheet.getContext('2d');
    sctx.fillStyle = '#ffffff';
    sctx.fillRect(0, 0, sheet.width, sheet.height);

    const imgs = await Promise.all(
      dataURLs.map(
        (url) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
          })
      )
    );
    imgs.forEach((img, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = pad + col * (cardSize + pad);
      const y = pad + row * (cardSize + pad);
      sctx.drawImage(img, x, y, cardSize, cardSize);
    });

    const url = sheet.toDataURL('image/png');
    const name = (FindIt.content.get().setName || 'find-it').replace(/[^a-z0-9-_]+/gi, '_').toLowerCase();
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '-sheet.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // Share link: compress content (name + symbols + abbreviations) to the URL
  // hash. Keeps it simple: JSON -> base64 (URL-safe).
  function makeShareLink() {
    const c = FindIt.content.get();
    const payload = {
      n: c.setName,
      s: c.symbolsPerCard,
      v: c.sizeVariance,
      a: c.abbreviations,
      // Strip image symbols from the share (they bloat URLs massively).
      // Pair symbols serialise with both sides so Q/A decks survive the
      // round-trip.
      sy: c.symbols
        .filter((s) => s.type === 'word' || s.type === 'pair')
        .map((s) => s.type === 'pair'
          ? { t: 'p', v: s.value, pv: s.pairValue }
          : { v: s.value, d: s.display }),
    };
    const json = JSON.stringify(payload);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    const url = location.origin + location.pathname + '#s=' + b64;
    return { url, omittedImages: c.symbols.some((s) => s.type === 'image') };
  }

  function loadShareLinkFromHash() {
    const m = location.hash.match(/#s=([A-Za-z0-9+/=]+)/);
    if (!m) return false;
    try {
      const json = decodeURIComponent(escape(atob(m[1])));
      const payload = JSON.parse(json);
      const content = FindIt.content;
      content.reset();
      if (payload.n) content.setName(payload.n);
      if (payload.s) content.setSymbolsPerCard(payload.s);
      if (payload.v) content.setSizeVariance(payload.v);
      if (payload.a) {
        for (const [term, short] of Object.entries(payload.a)) {
          content.setAbbreviation(term, short);
        }
      }
      (payload.sy || []).forEach((s) => {
        if (s && s.t === 'p') content.addPair(s.v, s.pv);
        else if (s) content.addWord(s.v);
      });
      return true;
    } catch (err) {
      console.warn('share: failed to load', err);
      return false;
    }
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.exporter = {
    PRINT_SIZES,
    printLayout,
    printDeck,
    downloadPDF,
    downloadPNGSheet,
    makeShareLink,
    loadShareLinkFromHash,
    clearPrintContainer,
  };
})();
