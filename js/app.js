// app.js: UI wiring and state orchestration.
(function () {
  'use strict';
  const C = () => window.FindIt.content;
  const SETTINGS_KEY = 'findit-settings-v1';

  // ── branded confirm dialog ─────────────────────────────────────────────
  // Drop-in replacement for window.confirm() that matches the manga palette.
  // Returns a Promise<boolean>.
  function confirmDialog(opts) {
    const o = opts || {};
    const title = o.title || 'Are you sure?';
    const message = o.message || '';
    const confirmText = o.confirmText || 'OK';
    const cancelText = o.cancelText || 'Cancel';
    const tag = o.tag || 'CONFIRM';
    const danger = !!o.danger;

    return new Promise((resolve) => {
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';

      const modal = document.createElement('div');
      modal.className = 'modal' + (danger ? ' danger' : '');
      modal.setAttribute('role', 'alertdialog');
      modal.setAttribute('aria-modal', 'true');
      modal.dataset.tag = tag;

      const h = document.createElement('h3');
      h.textContent = title;
      modal.appendChild(h);

      const p = document.createElement('p');
      p.innerHTML = FindIt.layout.richToHTML(message);
      modal.appendChild(p);

      const actions = document.createElement('div');
      actions.className = 'modal-actions';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-ghost';
      cancelBtn.textContent = cancelText;

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn ' + (danger ? 'btn-danger' : 'btn-primary');
      confirmBtn.textContent = confirmText;

      actions.appendChild(cancelBtn);
      actions.appendChild(confirmBtn);
      modal.appendChild(actions);
      backdrop.appendChild(modal);
      document.body.appendChild(backdrop);

      let settled = false;
      const close = (ok) => {
        if (settled) return;
        settled = true;
        document.removeEventListener('keydown', onKey);
        backdrop.remove();
        resolve(ok);
      };
      const onKey = (e) => {
        if (e.key === 'Escape') { e.preventDefault(); close(false); }
        else if (e.key === 'Enter') { e.preventDefault(); close(true); }
      };
      cancelBtn.addEventListener('click', () => close(false));
      confirmBtn.addEventListener('click', () => close(true));
      backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(false); });
      document.addEventListener('keydown', onKey);
      setTimeout(() => confirmBtn.focus(), 30);
    });
  }

  // ── toasts ─────────────────────────────────────────────────────────────
  function toast(text, kind, timeoutMs) {
    const stack = document.getElementById('toastStack');
    if (!stack) return;
    const t = document.createElement('div');
    t.className = 'toast' + (kind ? ' ' + kind : '');
    const close = document.createElement('button');
    close.className = 'toast-close';
    close.type = 'button';
    close.setAttribute('aria-label', 'dismiss');
    close.textContent = '×';
    close.addEventListener('click', () => t.remove());
    t.appendChild(close);
    const msg = document.createElement('span');
    msg.textContent = text;
    t.appendChild(msg);
    stack.appendChild(t);
    if (timeoutMs !== 0) {
      setTimeout(() => t.remove(), timeoutMs || 5000);
    }
  }

  // ── settings (ui prefs outside of content schema) ──────────────────────
  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {};
  }
  function saveSettings(patch) {
    const cur = loadSettings();
    const next = { ...cur, ...patch };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    } catch (err) {
      handleStorageError(err);
    }
  }

  function handleStorageError(err) {
    if (!err) return;
    const name = err.name || '';
    if (/Quota/i.test(name)) {
      toast('Browser storage is full. Remove some images or reset the set to free space.', 'warn', 0);
    } else {
      toast('Storage error: ' + (err.message || name), 'err');
    }
  }

  function checkStorageUsage() {
    // Rough check: warn at >80% of a conservative 5MB cap.
    try {
      const used = FindIt.content.storageUsageBytes();
      const cap = 5 * 1024 * 1024;
      if (used > cap * 0.8) {
        toast('Local storage is >80% full. Consider removing images or resetting the set.', 'warn');
      }
    } catch {}
  }

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

  // ── intro strip ────────────────────────────────────────────────────────
  function initIntro() {
    const el = document.getElementById('intro');
    const btn = document.getElementById('introClose');
    if (!el || !btn) return;
    const settings = loadSettings();
    if (settings.introDismissed) el.hidden = true;
    btn.addEventListener('click', () => {
      el.hidden = true;
      saveSettings({ introDismissed: true });
    });
  }

  // ── starter packs ──────────────────────────────────────────────────────
  function initPacks() {
    const select = document.getElementById('packSelect');
    const btn = document.getElementById('loadPackBtn');
    if (!select || !btn) return;
    const packs = (FindIt.packs && FindIt.packs.all) || [];
    for (const p of packs) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name + ' (' + p.symbols.length + ' symbols)';
      select.appendChild(opt);
    }
    btn.addEventListener('click', async () => {
      const id = select.value;
      if (!id) return;
      const pack = FindIt.packs.get(id);
      if (!pack) return;
      const cur = C().get().symbols.length;
      const ok = await confirmDialog(
        cur > 0
          ? {
              tag: 'LOAD PACK',
              title: 'Replace current set?',
              message: 'This will replace your ' + cur + ' symbol(s) with "' + pack.name + '". Your current set will be lost.',
              confirmText: 'Replace',
              cancelText: 'Keep current',
              danger: true,
            }
          : {
              tag: 'LOAD PACK',
              title: 'Load "' + pack.name + '"?',
              message: pack.symbols.length + ' symbols, ' + pack.symbolsPerCard + ' per card.',
              confirmText: 'Load',
            }
      );
      if (!ok) return;
      const res = FindIt.packs.apply(pack);
      if (res.ok) {
        toast('Loaded ' + pack.name + ': ' + res.loaded + ' symbols.');
        document.getElementById('setName').value = pack.name;
      }
    });
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

    // Word input: add on Enter, comma, or paste.
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
    document.getElementById('clearSymbolsBtn').addEventListener('click', async () => {
      const count = content.get().symbols.length;
      if (!count) return;
      const ok = await confirmDialog({
        tag: 'CLEAR',
        title: 'Remove all symbols?',
        message: 'This will delete all ' + count + ' symbol(s) in the current set. This cannot be undone.',
        confirmText: 'Remove all',
        cancelText: 'Keep them',
        danger: true,
      });
      if (ok) {
        markSaving();
        content.clearSymbols();
      }
    });

    // Reset everything.
    document.getElementById('resetBtn').addEventListener('click', async () => {
      const ok = await confirmDialog({
        tag: 'RESET',
        title: 'Reset the whole set?',
        message: 'Clears every symbol, abbreviation, and saved setting. Print, preview and share history go with it.',
        confirmText: 'Reset',
        cancelText: 'Keep',
        danger: true,
      });
      if (ok) {
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
      if (evt && evt.savedAt) {
        markSaved();
        if (evt.res && !evt.res.ok) handleStorageError(evt.res.error);
      }
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
        label.innerHTML = FindIt.layout.richToHTML(sym.value);
        chip.appendChild(label);
        if (sym.display && sym.display !== sym.value) {
          const disp = document.createElement('span');
          disp.className = 'chip-display';
          disp.innerHTML = '(' + FindIt.layout.richToHTML(sym.display) + ')';
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
    else if (got === target) msg = got + ' of ' + target + ': complete set.';
    else msg = got + ' of ' + target + ': first ' + target + ' used, ' + (got - target) + ' extra ignored.';
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

  // ── screen 2: configure ────────────────────────────────────────────────
  function initConfigure() {
    const content = C();

    // Symbols-per-card segmented control.
    document.querySelectorAll('[data-spc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const v = Number(btn.dataset.spc);
        markSaving();
        content.setSymbolsPerCard(v);
        refreshConfigUI();
        schedulePreviewRebuild();
      });
    });

    // Size variance slider.
    const vSlider = document.getElementById('varianceSlider');
    const vLabel = document.getElementById('varianceLabel');
    vSlider.addEventListener('input', () => {
      vLabel.textContent = Number(vSlider.value).toFixed(1) + '×';
    });
    vSlider.addEventListener('change', () => {
      markSaving();
      content.setSizeVariance(vSlider.value);
      schedulePreviewRebuild();
    });

    // Card-shape segmented control. Persisted in findit-settings-v1.
    document.querySelectorAll('[data-shape]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.cardShape = btn.dataset.shape;
        saveSettings({ cardShape: state.cardShape });
        refreshConfigUI();
        schedulePreviewRebuild();
      });
    });

    // Restore shape from settings on boot.
    const settings = loadSettings();
    if (settings.cardShape) state.cardShape = settings.cardShape;
  }

  // Return the symbols-per-card value that yields the largest complete deck
  // we can build with `count` symbols (without any blanks). null if count is
  // too small for even n=4.
  function suggestAltN(count) {
    const shapes = [4, 6, 8]
      .map((n) => FindIt.setShape(n))
      .filter((sh) => sh.totalSymbols <= count)
      .sort((a, b) => b.totalSymbols - a.totalSymbols);
    return shapes.length ? shapes[0].symbolsPerCard : null;
  }

  function refreshConfigUI() {
    const s = C().get();
    document.querySelectorAll('[data-spc]').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.spc) === s.symbolsPerCard);
    });
    document.querySelectorAll('[data-shape]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.shape === state.cardShape);
    });
    const vSlider = document.getElementById('varianceSlider');
    const vLabel = document.getElementById('varianceLabel');
    if (vSlider) vSlider.value = String(s.sizeVariance || 2);
    if (vLabel) vLabel.textContent = Number(s.sizeVariance || 2).toFixed(1) + '×';

    // Stats line.
    const shape = FindIt.setShape(s.symbolsPerCard);
    const got = s.symbols.length;
    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.textContent = shape.totalCards + ' cards · ' +
        Math.min(got, shape.totalSymbols) + '/' + shape.totalSymbols + ' symbols · ' +
        shape.symbolsPerCard + ' per card';
    }

    // Placeholder warning: show when the pack is smaller than the plane needs.
    const warnEl = document.getElementById('blankWarning');
    if (warnEl) {
      const short = Math.max(0, shape.totalSymbols - got);
      if (short > 0 && got > 0) {
        const alt = suggestAltN(got);
        warnEl.hidden = false;
        warnEl.innerHTML =
          '<span class="warn-icon" aria-hidden="true">&#9888;</span>' +
          '<span><b>' + short + ' blank placeholder(s)</b> will pad this set. ' +
          'Pairs that only share a blank won\'t feel like a real match.' +
          (alt ? ' Try <b>' + alt + ' per card</b> for a clean deck, or add ' + short + ' more symbols.' : '') +
          '</span>';
      } else {
        warnEl.hidden = true;
        warnEl.innerHTML = '';
      }
    }
  }

  // ── screen 3: preview ──────────────────────────────────────────────────
  const PREVIEW_COUNT = 6;
  const state = {
    cardShape: 'circle',
    deck: null,
    previewIndices: [],
    selected: [],
    rebuildTimer: null,
  };

  function initPreview() {
    document.getElementById('clearMatchBtn').addEventListener('click', () => {
      state.selected = [];
      refreshSelectionUI();
      document.getElementById('matchBar').hidden = true;
      redrawAllPreviews();
    });
  }

  function schedulePreviewRebuild() {
    clearTimeout(state.rebuildTimer);
    state.rebuildTimer = setTimeout(rebuildPreview, 120);
  }

  function pickPreviewIndices(total) {
    const count = Math.min(PREVIEW_COUNT, total);
    // Use the first `count` cards for stable preview slots.
    const out = [];
    for (let i = 0; i < count; i++) out.push(i);
    return out;
  }

  function rebuildPreview() {
    const s = C().get();
    const grid = document.getElementById('previewGrid');
    if (!grid) return;

    const deck = FindIt.deck.buildDeck(s.symbols, s.symbolsPerCard);
    state.deck = deck;
    state.previewIndices = pickPreviewIndices(deck.cards.length);
    state.selected = [];
    renderDropsBar(deck);

    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    state.previewIndices.forEach((cardIdx, slot) => {
      const wrap = document.createElement('div');
      wrap.className = 'preview-card';
      wrap.dataset.slot = String(slot);
      wrap.dataset.cardIdx = String(cardIdx);
      const tag = document.createElement('div');
      tag.className = 'card-index';
      tag.textContent = '#' + (cardIdx + 1);
      wrap.appendChild(tag);
      const canvas = document.createElement('canvas');
      wrap.appendChild(canvas);
      wrap.addEventListener('click', () => onPreviewClick(slot));
      frag.appendChild(wrap);
    });
    grid.appendChild(frag);

    // Initial render for each canvas.
    state.previewIndices.forEach((cardIdx, slot) => drawPreviewCard(slot));

    document.getElementById('matchBar').hidden = true;
  }

  async function drawPreviewCard(slot, opts) {
    const wrap = document.querySelector('.preview-card[data-slot="' + slot + '"]');
    if (!wrap) return;
    const canvas = wrap.querySelector('canvas');
    const cardIdx = state.previewIndices[slot];
    const cardSymbols = state.deck.cards[cardIdx];
    const content = C().get();
    const o = opts || {};
    const result = await FindIt.renderer.renderCard(canvas, cardSymbols, {
      tint: FindIt.renderer.pickTint(cardIdx),
      shape: state.cardShape,
      sizeVariance: content.sizeVariance,
      symbolsPerCard: content.symbolsPerCard,
      highlightId: o.highlightId,
    });
    if (result && result.dropped && result.dropped.length) {
      console.warn(
        'layout: dropped ' + result.dropped.length + ' symbol(s) on card #' + (cardIdx + 1) +
        '. Try reducing size variance or using shorter labels.'
      );
    }
  }

  function renderDropsBar(deck) {
    const bar = document.getElementById('dropsBar');
    if (!bar) return;
    const pieces = [];
    if (deck.blanksAdded > 0) {
      pieces.push(
        deck.blanksAdded + ' blank placeholder(s) added. Add ' + deck.blanksAdded + ' more symbols for a full set.'
      );
    }
    if (deck.droppedSymbols.length > 0) {
      const names = deck.droppedSymbols.slice(0, 5).map((s) => s.display || s.value).join(', ');
      const suffix = deck.droppedSymbols.length > 5 ? ', …' : '';
      pieces.push(
        deck.droppedSymbols.length + ' extra symbol(s) ignored: ' + names + suffix
      );
    }
    if (!pieces.length) {
      bar.hidden = true;
      bar.textContent = '';
      return;
    }
    bar.hidden = false;
    bar.textContent = pieces.join('. ');
  }

  function onPreviewClick(slot) {
    // Same-slot second click clears it.
    const idx = state.selected.indexOf(slot);
    if (idx !== -1) {
      state.selected.splice(idx, 1);
      refreshSelectionUI();
      document.getElementById('matchBar').hidden = true;
      redrawAllPreviews();
      return;
    }

    // If no selection yet and single-click on already-selected card: re-roll.
    if (state.selected.length === 0) {
      state.selected = [slot];
      refreshSelectionUI();
      // On second click (below), we'll check match. If the user clicks the
      // same card twice, we treat the second as "clear". So we need another
      // gesture for re-roll: shift-click or dblclick would work; for now,
      // a single click selects, and pressing the card again unselects. Re-
      // rolling happens via the "clear" button + configure change. Simpler.
      document.getElementById('matchBar').hidden = true;
      return;
    }

    if (state.selected.length === 1) {
      state.selected.push(slot);
      refreshSelectionUI();
      runMatchCheck();
      return;
    }

    // Already 2 selected: reset to this one.
    state.selected = [slot];
    refreshSelectionUI();
    document.getElementById('matchBar').hidden = true;
    redrawAllPreviews();
  }

  function refreshSelectionUI() {
    document.querySelectorAll('.preview-card').forEach((el) => {
      const slot = Number(el.dataset.slot);
      el.classList.toggle('selected', state.selected.includes(slot));
    });
  }

  function runMatchCheck() {
    if (state.selected.length !== 2) return;
    const [a, b] = state.selected.map((slot) => {
      const cardIdx = state.previewIndices[slot];
      return state.deck.cards[cardIdx];
    });
    const shared = FindIt.deck.findSharedSymbol(a, b);
    const bar = document.getElementById('matchBar');
    const badge = document.getElementById('matchBadge');
    const text = document.getElementById('matchText');
    if (shared) {
      badge.className = 'match-badge ok';
      badge.textContent = 'MATCH ✓';
      if (shared.isBlank) {
        text.textContent = '(shared blank placeholder)';
      } else {
        text.innerHTML = 'shared: ' +
          FindIt.layout.richToHTML(shared.display || shared.value || 'image');
      }
      // Draw halo on both cards.
      state.selected.forEach((slot) =>
        drawPreviewCard(slot, { highlightId: shared.id })
      );
    } else {
      badge.className = 'match-badge bad';
      badge.textContent = 'MISMATCH ✗';
      text.textContent = 'No shared symbol. This should never happen; please report.';
    }
    bar.hidden = false;
  }

  function redrawAllPreviews() {
    state.previewIndices.forEach((_, slot) => drawPreviewCard(slot));
  }

  // ── screen 4: export ───────────────────────────────────────────────────
  async function runPrint(setStatus) {
    const s = C().get();
    if (s.symbols.length === 0) {
      setStatus('Add some symbols first.');
      toast('Add some symbols before printing.', 'warn');
      return;
    }
    setStatus('Building deck…');
    try {
      const result = await FindIt.exporter.printDeck({ shape: state.cardShape });
      setStatus('Opened print dialog for ' + result.cards + ' cards.');
    } catch (err) {
      console.error(err);
      setStatus('Print failed: ' + err.message);
      toast('Print failed: ' + err.message, 'err');
    }
  }

  async function runPdfDownload(setStatus, button) {
    const s = C().get();
    if (s.symbols.length === 0) {
      setStatus('Add some symbols first.');
      toast('Add some symbols before exporting.', 'warn');
      return;
    }
    if (button) button.disabled = true;
    setStatus('Building PDF…');
    try {
      const result = await FindIt.exporter.downloadPDF({ shape: state.cardShape });
      setStatus('Downloaded ' + result.filename + ' (' + result.cards + ' cards).');
      toast('PDF saved: ' + result.filename);
    } catch (err) {
      console.error(err);
      setStatus('PDF failed: ' + err.message);
      toast('PDF failed: ' + err.message, 'err');
    } finally {
      if (button) button.disabled = false;
    }
  }

  function initExport() {
    const statusEl = document.getElementById('exportStatus');
    const setStatus = (text) => { if (statusEl) statusEl.textContent = text || ''; };

    const printBtn = document.getElementById('toolbarPrintBtn');
    if (printBtn) printBtn.addEventListener('click', () => runPrint(setStatus));
    const pdfBtn = document.getElementById('toolbarPdfBtn');
    if (pdfBtn) pdfBtn.addEventListener('click', () => runPdfDownload(setStatus, pdfBtn));

    document.getElementById('pngBtn').addEventListener('click', async () => {
      const s = C().get();
      if (s.symbols.length === 0) {
        setStatus('Add some symbols first.');
        return;
      }
      setStatus('Rendering PNG sheet…');
      try {
        await FindIt.exporter.downloadPNGSheet({ shape: state.cardShape });
        setStatus('PNG sheet downloaded.');
      } catch (err) {
        console.error(err);
        setStatus('PNG export failed: ' + err.message);
      }
    });

    document.getElementById('shareBtn').addEventListener('click', async () => {
      try {
        const { url, omittedImages } = FindIt.exporter.makeShareLink();
        try {
          await navigator.clipboard.writeText(url);
          setStatus(
            'Share link copied to clipboard' +
              (omittedImages ? ' (images omitted: URLs have a size limit).' : '.')
          );
        } catch {
          setStatus('Share link: ' + url);
        }
      } catch (err) {
        setStatus('Share failed: ' + err.message);
      }
    });
  }

  // ── boot ───────────────────────────────────────────────────────────────
  function boot() {
    // If a share link is present, load it into content before binding UI.
    const loadedFromHash = FindIt.exporter.loadShareLinkFromHash();
    initIntro();
    initEditor();
    initPacks();
    initConfigure();
    initPreview();
    initExport();
    refreshConfigUI();
    schedulePreviewRebuild();
    if (loadedFromHash) {
      toast('Loaded set from share link.');
      // Clear the hash so reloads don't keep overwriting edits.
      try { history.replaceState(null, '', location.pathname); } catch {}
    }
    checkStorageUsage();
    // Rebuild preview + refresh config when content changes (symbols added,
    // etc). Debounced to avoid hammering on rapid edits.
    C().onChange(() => {
      refreshConfigUI();
      schedulePreviewRebuild();
    });
  }
  document.addEventListener('DOMContentLoaded', boot);
})();
