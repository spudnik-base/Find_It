// content.js: content manager. Data model, persistence, ingest.
//
// Data shape (localStorage key 'findit-content-v1'):
// {
//   setName: string,
//   symbolsPerCard: 4|6|8,
//   sizeVariance: number,       // 1.0 .. 3.0
//   abbreviations: { [term]: short },
//   symbols: [{ id, type: 'word'|'image', value, display }]
// }

(function () {
  'use strict';

  const STORAGE_KEY = 'findit-content-v1';
  const MAX_DISPLAY_CHARS = 8;

  const defaults = () => ({
    setName: '',
    symbolsPerCard: 6,
    sizeVariance: 2.0,
    abbreviations: {},
    symbols: [],
  });

  let state = defaults();
  const listeners = new Set();
  let saveTimer = null;

  function emit() {
    for (const fn of listeners) {
      try { fn(state); } catch (err) { console.error('content listener', err); }
    }
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = { ...defaults(), ...JSON.parse(raw) };
    } catch (err) {
      console.warn('content: load failed, using defaults', err);
      state = defaults();
    }
    return state;
  }

  function saveNow() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return { ok: true };
    } catch (err) {
      // QuotaExceededError mostly
      return { ok: false, error: err };
    }
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const res = saveNow();
      for (const fn of listeners) fn(state, { savedAt: Date.now(), res });
    }, 350);
  }

  function get() { return state; }
  function snapshot() { return JSON.parse(JSON.stringify(state)); }

  function setName(name) {
    state.setName = String(name || '');
    scheduleSave();
    emit();
  }

  function setSymbolsPerCard(n) {
    const v = Number(n);
    if (![4, 6, 8].includes(v)) return;
    state.symbolsPerCard = v;
    scheduleSave();
    emit();
  }

  function setSizeVariance(v) {
    const num = Math.min(3, Math.max(1, Number(v) || 1));
    state.sizeVariance = num;
    scheduleSave();
    emit();
  }

  function setAbbreviation(term, short) {
    if (!term) return;
    const key = String(term).trim().toLowerCase();
    if (!short) delete state.abbreviations[key];
    else state.abbreviations[key] = String(short).slice(0, MAX_DISPLAY_CHARS);
    refreshDisplays();
    scheduleSave();
    emit();
  }

  // Truncating a rich label (contains ~sub~ or ^sup^ tokens) would break
  // the tokens, so leave rich labels untouched. They're typically short
  // formulas like H~2~SO~4~ whose visible length is already under the cap.
  function isRichLabel(word) {
    const s = String(word);
    return s.indexOf('~') !== -1 || s.indexOf('^') !== -1;
  }

  function capDisplay(word, max) {
    const limit = max || MAX_DISPLAY_CHARS;
    if (isRichLabel(word)) return String(word);
    const chars = [...String(word)];
    return chars.length <= limit ? String(word) : chars.slice(0, limit).join('') + '.';
  }

  function deriveDisplay(sym) {
    if (sym.type === 'image') return null;
    const key = String(sym.value).trim().toLowerCase();
    if (state.abbreviations[key]) return state.abbreviations[key];
    return capDisplay(sym.value, MAX_DISPLAY_CHARS);
  }

  function refreshDisplays() {
    for (const sym of state.symbols) {
      sym.display = deriveDisplay(sym);
    }
  }

  let idCounter = 0;
  function nextId() {
    idCounter++;
    return 'sym_' + Date.now().toString(36) + '_' + idCounter;
  }

  function addWord(value, opts) {
    const raw = String(value == null ? '' : value).trim();
    if (!raw) return null;
    // Dedupe (case-insensitive) on raw value.
    const exists = state.symbols.find(
      (s) => s.type === 'word' && s.value.toLowerCase() === raw.toLowerCase()
    );
    if (exists) return exists;
    const sym = {
      id: nextId(),
      type: 'word',
      value: raw,
      display: null,
    };
    if (opts && opts.abbreviation) {
      state.abbreviations[raw.toLowerCase()] = String(opts.abbreviation).slice(0, MAX_DISPLAY_CHARS);
    }
    sym.display = deriveDisplay(sym);
    state.symbols.push(sym);
    scheduleSave();
    emit();
    return sym;
  }

  function addImage(dataURL, opts) {
    if (!dataURL || typeof dataURL !== 'string') return null;
    const sym = {
      id: nextId(),
      type: 'image',
      value: dataURL,
      display: (opts && opts.label) || null,
    };
    state.symbols.push(sym);
    scheduleSave();
    emit();
    return sym;
  }

  function removeSymbol(id) {
    const before = state.symbols.length;
    state.symbols = state.symbols.filter((s) => s.id !== id);
    if (state.symbols.length !== before) {
      scheduleSave();
      emit();
    }
  }

  function clearSymbols() {
    state.symbols = [];
    scheduleSave();
    emit();
  }

  // Accept pasted text containing newlines, commas, semicolons, or tabs.
  function ingestText(text) {
    if (!text) return 0;
    const parts = String(text)
      .split(/[\r\n,;\t]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    let added = 0;
    for (const p of parts) {
      const sym = addWord(p);
      if (sym) added++;
    }
    return added;
  }

  // CSV: one term per line. Optional second column = abbreviation.
  function ingestCSV(text) {
    if (!text) return 0;
    const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let added = 0;
    for (const line of lines) {
      const [term, abbr] = line.split(',').map((s) => s && s.trim());
      if (!term) continue;
      const sym = addWord(term, abbr ? { abbreviation: abbr } : undefined);
      if (sym) added++;
    }
    return added;
  }

  function readImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type || !file.type.startsWith('image/')) {
        reject(new Error('Not an image file'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error('read failed'));
      reader.readAsDataURL(file);
    });
  }

  async function ingestImageFiles(files) {
    let added = 0;
    for (const file of files || []) {
      try {
        const dataURL = await readImageFile(file);
        if (addImage(dataURL, { label: file.name.replace(/\.[^.]+$/, '') })) added++;
      } catch (err) {
        console.warn('content: image ingest failed', file && file.name, err);
      }
    }
    return added;
  }

  function storageUsageBytes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '';
      // rough estimate: 2 bytes per char for utf-16 storage
      return raw.length * 2;
    } catch {
      return 0;
    }
  }

  function reset() {
    state = defaults();
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    emit();
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.content = {
    STORAGE_KEY,
    MAX_DISPLAY_CHARS,
    onChange,
    load,
    saveNow,
    get,
    snapshot,
    setName,
    setSymbolsPerCard,
    setSizeVariance,
    setAbbreviation,
    capDisplay,
    addWord,
    addImage,
    removeSymbol,
    clearSymbols,
    ingestText,
    ingestCSV,
    readImageFile,
    ingestImageFiles,
    storageUsageBytes,
    reset,
  };
})();
