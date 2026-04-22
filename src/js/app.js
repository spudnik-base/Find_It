// app.js — UI wiring + state orchestration.
(function () {
  'use strict';
  const C = () => window.FindIt.content;

  // ── save-status indicator ──────────────────────────────────────────────
  const saveStatusEl = () => document.getElementById('saveStatus');
  let lastSaveTick = 0;

  function markSaving() {
    const el = saveStatusEl();
    if (!el) return;
    el.className = 'save-status saving';
    el.textContent = '… saving';
  }
  function markSaved() {
    const el = saveStatusEl();
    if (!el) return;
    el.className = 'save-status saved';
    el.textContent = '✓ saved';
    lastSaveTick = Date.now();
  }

  // ── screen 1: editor ───────────────────────────────────────────────────
  function initEditor() {
    const content = C();
    content.load();

    // Subject / set name
    const setNameEl = document.getElementById('setName');
    setNameEl.value = content.get().setName || '';
    setNameEl.addEventListener('input', (e) => {
      markSaving();
      content.setName(e.target.value);
    });

    // Input tabs
    document.querySelectorAll('.input-tabs .tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        const name = tab.dataset.tab;
        document.querySelectorAll('.input-tabs .tab').forEach((t) => t.classList.toggle('active', t === tab));
        document.querySelectorAll('.tab-panel').forEach((p) => {
          p.hidden = p.dataset.panel !== name;
        });
      });
    });

    // Word input — add on Enter, comma, or paste.
    const wordInput = document.getElementById('wordInput');
    wordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = wordInput.value;
        wordInput.value = '';
        markSaving();
        content.ingestText(val);
      }
    });
    wordInput.addEventListener('paste', (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text');
      if (text && /[,;\n\t]/.test(text)) {
        e.preventDefault();
        markSaving();
        content.ingestText(text);
        wordInput.value = '';
      }
    });
    wordInput.addEventListener('blur', () => {
      if (wordInput.value.trim()) {
        markSaving();
        content.ingestText(wordInput.value);
        wordInput.value = '';
      }
    });

    // CSV: paste + file upload.
    const csvInput = document.getElementById('csvInput');
    document.getElementById('csvImportBtn').addEventListener('click', () => {
      if (!csvInput.value.trim()) return;
      markSaving();
      const added = content.ingestCSV(csvInput.value);
      csvInput.value = '';
      flashStatus('+' + added + ' imported');
    });
    document.getElementById('csvFile').addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const text = await file.text();
      markSaving();
      const added = content.ingestCSV(text);
      flashStatus('+' + added + ' imported');
      e.target.value = '';
    });

    // Image drop zone.
    const drop = document.getElementById('imageDrop');
    const imageFile = document.getElementById('imageFile');
    drop.addEventListener('click', () => imageFile.click());
    drop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); imageFile.click(); }
    });
    ['dragenter', 'dragover'].forEach((evt) =>
      drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.add('over'); })
    );
    ['dragleave', 'drop'].forEach((evt) =>
      drop.addEventListener(evt, (e) => { e.preventDefault(); drop.classList.remove('over'); })
    );
    drop.addEventListener('drop', async (e) => {
      const files = e.dataTransfer && e.dataTransfer.files;
      if (!files || !files.length) return;
      markSaving();
      const added = await content.ingestImageFiles(files);
      flashStatus('+' + added + ' images');
    });
    imageFile.addEventListener('change', async (e) => {
      if (!e.target.files || !e.target.files.length) return;
      markSaving();
      const added = await content.ingestImageFiles(e.target.files);
      flashStatus('+' + added + ' images');
      e.target.value = '';
    });

    // Clear symbols.
    document.getElementById('clearSymbolsBtn').addEventListener('click', () => {
      if (!content.get().symbols.length) return;
      if (confirm('Remove all ' + content.get().symbols.length + ' symbols?')) {
        markSaving();
        content.clearSymbols();
      }
    });

    // Reset everything.
    document.getElementById('resetBtn').addEventListener('click', () => {
      if (confirm('Reset the whole set? This clears all symbols and settings.')) {
        content.reset();
        setNameEl.value = '';
        markSaved();
      }
    });

    // Abbreviation form.
    const abbrTerm = document.getElementById('abbrTerm');
    const abbrShort = document.getElementById('abbrShort');
    document.getElementById('abbrAddBtn').addEventListener('click', () => {
      if (!abbrTerm.value.trim() || !abbrShort.value.trim()) return;
      markSaving();
      content.setAbbreviation(abbrTerm.value, abbrShort.value);
      abbrTerm.value = '';
      abbrShort.value = '';
    });

    // Live re-render on state change.
    content.onChange((state, evt) => {
      renderChipgrid(state);
      renderCounter(state);
      renderAbbrList(state);
      if (evt && evt.savedAt) markSaved();
    });

    // Initial render.
    const s = content.get();
    renderChipgrid(s);
    renderCounter(s);
    renderAbbrList(s);
    markSaved();
  }

  let flashTimer = null;
  function flashStatus(text) {
    const el = saveStatusEl();
    if (!el) return;
    el.className = 'save-status saved';
    el.textContent = text;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(markSaved, 1200);
  }

  // ── render helpers ─────────────────────────────────────────────────────
  function renderChipgrid(state) {
    const grid = document.getElementById('chipgrid');
    if (!grid) return;
    grid.innerHTML = '';
    document.getElementById('symbolsCount').textContent =
      state.symbols.length + ' symbol' + (state.symbols.length === 1 ? '' : 's');

    const frag = document.createDocumentFragment();
    for (const sym of state.symbols) {
      const chip = document.createElement('span');
      chip.className = 'chip' + (sym.type === 'image' ? ' image' : '');
      chip.dataset.id = sym.id;

      if (sym.type === 'image') {
        const img = document.createElement('img');
        img.src = sym.value;
        img.alt = sym.display || 'image';
        chip.appendChild(img);
        const label = document.createElement('span');
        label.className = 'chip-value';
        label.textContent = sym.display || 'image';
        chip.appendChild(label);
      } else {
        const label = document.createElement('span');
        label.className = 'chip-value';
        label.textContent = sym.value;
        chip.appendChild(label);
        if (sym.display && sym.display !== sym.value) {
          const disp = document.createElement('span');
          disp.className = 'chip-display';
          disp.textContent = '(' + sym.display + ')';
          chip.appendChild(disp);
        }
      }

      const rm = document.createElement('button');
      rm.type = 'button';
      rm.setAttribute('aria-label', 'Remove ' + (sym.display || sym.value));
      rm.textContent = '×';
      rm.addEventListener('click', () => {
        markSaving();
        C().removeSymbol(sym.id);
      });
      chip.appendChild(rm);
      frag.appendChild(chip);
    }
    grid.appendChild(frag);
  }

  function renderCounter(state) {
    const n = state.symbolsPerCard || 6;
    const shape = window.FindIt.setShape ? window.FindIt.setShape(n) : { totalSymbols: n * n + n + 1 };
    const target = shape.totalSymbols;
    const got = state.symbols.length;
    const fill = document.getElementById('counterFill');
    const text = document.getElementById('counterText');
    if (!fill || !text) return;
    const pct = Math.min(100, Math.round((got / target) * 100));
    fill.style.width = pct + '%';
    fill.className = 'counter-fill' +
      (got >= target ? ' full' : got < n ? ' short' : '');
    let msg;
    if (got === 0) msg = 'Add at least ' + n + ' symbols to start. ' + target + ' is the full set.';
    else if (got < n) msg = 'Need at least ' + n + ' symbols for a valid card. ' + (n - got) + ' more to go.';
    else if (got < target) msg = got + ' of ' + target + ' for a complete set (' + (target - got) + ' more). Blanks will pad the rest.';
    else if (got === target) msg = got + ' of ' + target + ' — complete set.';
    else msg = got + ' of ' + target + ' — first ' + target + ' used, ' + (got - target) + ' extra ignored.';
    text.textContent = msg;
    text.className = 'counter-text' +
      (got < n ? ' warn' : got === target ? ' ok' : '');
  }

  function renderAbbrList(state) {
    const list = document.getElementById('abbrList');
    if (!list) return;
    list.innerHTML = '';
    const entries = Object.entries(state.abbreviations || {});
    if (!entries.length) {
      const li = document.createElement('li');
      li.innerHTML = '<i style="color:#888">No custom abbreviations. Terms over 8 chars auto-truncate.</i>';
      list.appendChild(li);
      return;
    }
    for (const [term, short] of entries) {
      const li = document.createElement('li');
      const left = document.createElement('span');
      const shortEl = document.createElement('span');
      shortEl.className = 'abbr-short';
      shortEl.textContent = short;
      const termEl = document.createElement('span');
      termEl.textContent = term;
      left.appendChild(shortEl);
      left.appendChild(termEl);
      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'btn btn-ghost';
      rm.textContent = 'remove';
      rm.addEventListener('click', () => {
        markSaving();
        C().setAbbreviation(term, '');
      });
      li.appendChild(left);
      li.appendChild(rm);
      list.appendChild(li);
    }
  }

  // ── boot ───────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initEditor);
})();
