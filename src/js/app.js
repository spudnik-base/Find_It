// app.js — UI wiring + state (Phase 1 scaffold; screens fill in from Phase 2).
(function () {
  'use strict';
  window.FindIt = window.FindIt || {};

  function bootMessage() {
    const el = document.getElementById('boot-status');
    if (!el) return;
    try {
      const shapes = FindIt.VALID_ORDERS.map((o) => FindIt.setShape(o + 1));
      el.textContent =
        'Scaffold ready. Run FindIt.selfTest() in the console to verify the projective-plane generator.';
      const list = document.getElementById('set-shapes');
      if (list) {
        list.innerHTML = shapes
          .map(
            (s) =>
              '<li><b>' +
              s.symbolsPerCard +
              '</b> per card &rarr; ' +
              s.totalCards +
              ' cards / ' +
              s.totalSymbols +
              ' symbols</li>'
          )
          .join('');
      }
    } catch (err) {
      el.textContent = 'Scaffold error: ' + err.message;
    }
  }

  document.addEventListener('DOMContentLoaded', bootMessage);
})();
