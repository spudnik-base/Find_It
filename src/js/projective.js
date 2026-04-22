// projective.js — finite projective plane generator for FIND IT.
//
// For a projective plane of order q (q prime), the standard construction
// produces q^2 + q + 1 cards, each with exactly q + 1 symbols, and every
// pair of cards shares exactly one symbol.
//
// Brief terminology: "order" = q. "symbolsPerCard" (n) = q + 1.
//   order 3 -> 4 per card -> 13 cards / 13 symbols
//   order 5 -> 6 per card -> 31 cards / 31 symbols
//   order 7 -> 8 per card -> 57 cards / 57 symbols
//
// Note: the literal code in the brief Ch 3 has an off-by-one bug
// (it truncates affine cards to n symbols instead of n+1). This
// implementation uses the standard construction, which satisfies
// the table in brief Ch 3 and the verification property.

(function () {
  'use strict';

  const VALID_ORDERS = [3, 5, 7];

  function generateProjectivePlane(order) {
    if (!VALID_ORDERS.includes(order)) {
      throw new Error(
        'Invalid order ' + order + '. Use one of: ' + VALID_ORDERS.join(', ')
      );
    }
    const q = order;
    const cards = [];

    // Symbol index layout:
    //   affine point (x, y) -> x * q + y       (indices 0 .. q^2 - 1)
    //   infinity point for slope m -> q^2 + m  (indices q^2 .. q^2 + q - 1)
    //   vertical infinity point    -> q^2 + q  (one index)
    const INF_VERT = q * q + q;
    const infSlope = (m) => q * q + m;
    const affine = (x, y) => x * q + y;

    // 1) Finite-slope lines y = m*x + b. q^2 such cards, one per (m, b).
    for (let m = 0; m < q; m++) {
      for (let b = 0; b < q; b++) {
        const card = [infSlope(m)];
        for (let x = 0; x < q; x++) {
          card.push(affine(x, (m * x + b) % q));
        }
        cards.push(card);
      }
    }

    // 2) Vertical lines x = c. q such cards, one per column.
    for (let c = 0; c < q; c++) {
      const card = [INF_VERT];
      for (let y = 0; y < q; y++) card.push(affine(c, y));
      cards.push(card);
    }

    // 3) The line at infinity: all q + 1 infinity points.
    const infCard = [INF_VERT];
    for (let m = 0; m < q; m++) infCard.push(infSlope(m));
    cards.push(infCard);

    return cards;
  }

  function setShape(symbolsPerCard) {
    const n = symbolsPerCard;
    const order = n - 1;
    const total = order * order + order + 1;
    return { order, symbolsPerCard: n, totalCards: total, totalSymbols: total };
  }

  // Returns null on success or an { a, b, shared } report on the first mismatch.
  function verifyDeck(cards) {
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const a = cards[i], b = cards[j];
        const shared = a.filter((s) => b.includes(s));
        if (shared.length !== 1) {
          return { a: i, b: j, shared };
        }
      }
    }
    return null;
  }

  function selfTest() {
    const results = [];
    for (const order of VALID_ORDERS) {
      const q = order;
      const expectedCount = q * q + q + 1;
      const expectedLen = q + 1;
      const cards = generateProjectivePlane(order);
      const shape = {
        order,
        gotCards: cards.length,
        expectedCards: expectedCount,
        allLenOK: cards.every((c) => c.length === expectedLen),
      };
      const bad = verifyDeck(cards);
      const pass =
        shape.gotCards === shape.expectedCards && shape.allLenOK && !bad;
      results.push({ ...shape, bad, pass });
      console.log(
        (pass ? 'PASS' : 'FAIL') +
          ' order=' +
          order +
          ' cards=' +
          shape.gotCards +
          '/' +
          shape.expectedCards +
          ' each-len=' +
          expectedLen +
          (bad ? ' mismatch@' + bad.a + ',' + bad.b : '')
      );
    }
    return results;
  }

  window.FindIt = window.FindIt || {};
  Object.assign(window.FindIt, {
    generateProjectivePlane,
    setShape,
    verifyDeck,
    selfTest,
    VALID_ORDERS,
  });
})();
