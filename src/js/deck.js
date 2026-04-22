// deck.js — maps content symbols onto projective-plane indices to form a deck.
//
// A "deck" is an array of cards, each card being an array of content symbol
// objects (type/value/display) plus a deckIndex for rotation of background
// tints. Pads with blank placeholders when there are too few symbols.

(function () {
  'use strict';

  function blankSymbol(i) {
    return { id: 'blank_' + i, type: 'word', value: '', display: '·', isBlank: true };
  }

  // Build a deck from the content symbols and a chosen symbolsPerCard (n = q+1).
  // Returns:
  //   { cards: [ [symbolObj, ...], ... ],
  //     shape: { order, symbolsPerCard, totalCards, totalSymbols },
  //     usedSymbols: number,
  //     droppedSymbols: symbolObj[],
  //     blanksAdded: number }
  function buildDeck(symbols, symbolsPerCard) {
    const n = symbolsPerCard;
    const shape = FindIt.setShape(n);
    const q = shape.order;
    const planeIndices = FindIt.generateProjectivePlane(q); // cards of symbol indices 0..q^2+q
    const slots = shape.totalSymbols; // q^2 + q + 1

    const allSymbols = symbols.slice();
    const dropped = allSymbols.length > slots ? allSymbols.slice(slots) : [];
    const pool = allSymbols.slice(0, slots);
    const blanksAdded = Math.max(0, slots - pool.length);
    while (pool.length < slots) pool.push(blankSymbol(pool.length));

    const cards = planeIndices.map((indices) => indices.map((i) => pool[i]));

    return {
      cards,
      shape,
      usedSymbols: Math.min(symbols.length, slots),
      droppedSymbols: dropped,
      blanksAdded,
    };
  }

  // Given two cards (arrays of symbol objects), return the one symbol they
  // share (by id) or null.
  function findSharedSymbol(a, b) {
    const ids = new Set(a.map((s) => s.id));
    const shared = b.find((s) => ids.has(s.id));
    return shared || null;
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.deck = { buildDeck, findSharedSymbol, blankSymbol };
})();
