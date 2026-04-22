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

  async function buildDeckForExport() {
    const content = FindIt.content.get();
    const deck = FindIt.deck.buildDeck(content.symbols, content.symbolsPerCard);
    return { deck, sizeVariance: content.sizeVariance, symbolsPerCard: content.symbolsPerCard };
  }

  async function renderAllCards(deck, sizeVariance, shape, symbolsPerCard) {
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
      });
      dataURLs.push(canvas.toDataURL('image/png'));
    }
    return dataURLs;
  }

  function clearPrintContainer() {
    const existing = document.getElementById(PRINT_CONTAINER_ID);
    if (existing) existing.remove();
  }

  function buildPrintGrid(dataURLs) {
    clearPrintContainer();
    const container = document.createElement('div');
    container.id = PRINT_CONTAINER_ID;

    // Chunk into pages of 9.
    for (let i = 0; i < dataURLs.length; i += 9) {
      const page = document.createElement('div');
      page.className = 'print-page';
      const grid = document.createElement('div');
      grid.className = 'print-grid';
      for (let j = i; j < Math.min(i + 9, dataURLs.length); j++) {
        const wrap = document.createElement('div');
        wrap.className = 'print-card-wrap';
        const img = document.createElement('img');
        img.src = dataURLs[j];
        img.alt = 'card ' + (j + 1);
        wrap.appendChild(img);
        grid.appendChild(wrap);
      }
      page.appendChild(grid);
      container.appendChild(page);
    }
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
    const { deck, sizeVariance, symbolsPerCard } = await buildDeckForExport();
    const dataURLs = await renderAllCards(deck, sizeVariance, o.shape, symbolsPerCard);
    const container = buildPrintGrid(dataURLs);
    await waitForImages(container);
    // Defer slightly so the browser has painted the grid before print.
    await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 50)));
    window.print();
    setTimeout(clearPrintContainer, 2000);
    return { cards: deck.cards.length };
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
      sy: c.symbols
        .filter((s) => s.type === 'word')
        .map((s) => ({ v: s.value, d: s.display })),
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
      (payload.sy || []).forEach((s) => content.addWord(s.v));
      return true;
    } catch (err) {
      console.warn('share: failed to load', err);
      return false;
    }
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.exporter = {
    printDeck,
    downloadPNGSheet,
    makeShareLink,
    loadShareLinkFromHash,
    clearPrintContainer,
  };
})();
