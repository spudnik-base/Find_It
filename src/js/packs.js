// packs.js — starter content packs.
//
// Packs are inlined so the app still works from file://.
// A pack has the same shape as findit-content-v1 but is a constant.

(function () {
  'use strict';

  const svg = (s) => 'data:image/svg+xml;utf8,' + encodeURIComponent(s);

  // 120x120 viewBox; black ink outline on palette fills.
  // Designs stay shape-based (minimal text) so cards read as icons.
  const INK = '#0d0d0d';
  const YELLOW = '#ffe033';
  const RED = '#e8291c';
  const BLUE = '#1a4ed8';
  const TEAL = '#00b4a0';
  const GREEN = '#1a8c4e';

  const ICONS = {
    water: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M60 14 C60 14 28 54 28 78 a32 32 0 0 0 64 0 C92 54 60 14 60 14 Z" ' +
          'fill="' + BLUE + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M44 70 q10 -14 22 -4" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    ),

    glucose: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="60,14 104,40 104,86 60,112 16,86 16,40" ' +
          'fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<polygon points="60,32 88,48 88,80 60,96 32,80 32,48" ' +
          'fill="none" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<circle cx="60" cy="14" r="6" fill="' + RED + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '</svg>'
    ),

    ribose: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="60,18 102,48 86,98 34,98 18,48" ' +
          'fill="' + RED + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<polygon points="60,34 88,54 78,88 42,88 32,54" ' +
          'fill="none" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<circle cx="60" cy="18" r="6" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '</svg>'
    ),

    nucleotide: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // sugar (pentagon)
        '<polygon points="46,46 72,46 80,68 59,84 38,68" ' +
          'fill="' + RED + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        // base (rectangle, attached right)
        '<rect x="78" y="28" width="34" height="28" rx="4" ' +
          'fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4"/>' +
        '<line x1="72" y1="46" x2="78" y2="42" stroke="' + INK + '" stroke-width="3"/>' +
        // phosphate (circle, attached bottom-left)
        '<circle cx="24" cy="84" r="16" ' +
          'fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4"/>' +
        '<text x="24" y="90" text-anchor="middle" font-family="Nunito,sans-serif" font-size="18" font-weight="800" fill="' + INK + '">P</text>' +
        '<line x1="38" y1="76" x2="44" y2="72" stroke="' + INK + '" stroke-width="3"/>' +
      '</svg>'
    ),

    aminoAcid: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // central carbon
        '<circle cx="60" cy="60" r="12" fill="#fff" stroke="' + INK + '" stroke-width="4"/>' +
        '<text x="60" y="66" text-anchor="middle" font-family="Nunito,sans-serif" font-size="16" font-weight="800" fill="' + INK + '">C</text>' +
        // bonds
        '<line x1="48" y1="60" x2="20" y2="60" stroke="' + INK + '" stroke-width="4"/>' +
        '<line x1="72" y1="60" x2="100" y2="60" stroke="' + INK + '" stroke-width="4"/>' +
        '<line x1="60" y1="48" x2="60" y2="20" stroke="' + INK + '" stroke-width="4"/>' +
        '<line x1="60" y1="72" x2="60" y2="100" stroke="' + INK + '" stroke-width="4"/>' +
        // NH2 group (left)
        '<circle cx="14" cy="60" r="10" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="3"/>' +
        '<text x="14" y="65" text-anchor="middle" font-family="Nunito,sans-serif" font-size="10" font-weight="800" fill="#fff">N</text>' +
        // COOH group (right)
        '<circle cx="106" cy="60" r="10" fill="' + RED + '" stroke="' + INK + '" stroke-width="3"/>' +
        '<text x="106" y="65" text-anchor="middle" font-family="Nunito,sans-serif" font-size="9" font-weight="800" fill="#fff">OOH</text>' +
        // R group (top)
        '<circle cx="60" cy="14" r="10" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3"/>' +
        '<text x="60" y="19" text-anchor="middle" font-family="Nunito,sans-serif" font-size="11" font-weight="800" fill="' + INK + '">R</text>' +
      '</svg>'
    ),

    atp: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // adenine hexagon (left)
        '<polygon points="28,30 52,30 64,48 52,66 28,66 16,48" ' +
          'fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<text x="40" y="54" text-anchor="middle" font-family="Nunito,sans-serif" font-size="16" font-weight="800" fill="#fff">A</text>' +
        // three phosphates (right chain)
        '<line x1="64" y1="48" x2="76" y2="48" stroke="' + INK + '" stroke-width="4"/>' +
        '<circle cx="84" cy="48" r="10" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3.5"/>' +
        '<text x="84" y="53" text-anchor="middle" font-family="Nunito,sans-serif" font-size="12" font-weight="800" fill="' + INK + '">P</text>' +
        '<line x1="94" y1="48" x2="96" y2="72" stroke="' + INK + '" stroke-width="4"/>' +
        '<circle cx="96" cy="82" r="10" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3.5"/>' +
        '<text x="96" y="87" text-anchor="middle" font-family="Nunito,sans-serif" font-size="12" font-weight="800" fill="' + INK + '">P</text>' +
        '<line x1="86" y1="82" x2="64" y2="96" stroke="' + INK + '" stroke-width="4"/>' +
        '<circle cx="54" cy="102" r="10" fill="' + RED + '" stroke="' + INK + '" stroke-width="3.5"/>' +
        '<text x="54" y="107" text-anchor="middle" font-family="Nunito,sans-serif" font-size="12" font-weight="800" fill="#fff">P</text>' +
      '</svg>'
    ),

    dna: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // two sinusoidal backbones
        '<path d="M32 10 C 90 30, 30 50, 88 70 C 30 90, 90 110, 88 110" fill="none" stroke="' + BLUE + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M88 10 C 30 30, 90 50, 32 70 C 90 90, 30 110, 32 110" fill="none" stroke="' + RED + '" stroke-width="5" stroke-linecap="round"/>' +
        // rungs
        '<line x1="36" y1="22" x2="84" y2="22" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="36" y1="42" x2="84" y2="42" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="36" y1="62" x2="84" y2="62" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="36" y1="82" x2="84" y2="82" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="36" y1="102" x2="84" y2="102" stroke="' + INK + '" stroke-width="3"/>' +
      '</svg>'
    ),

    phospholipid: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // head
        '<circle cx="60" cy="26" r="20" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<text x="60" y="31" text-anchor="middle" font-family="Nunito,sans-serif" font-size="14" font-weight="800" fill="' + INK + '">P</text>' +
        // two tails (zig-zag)
        '<polyline points="50,44 44,58 52,72 44,86 52,100 44,114" ' +
          'fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<polyline points="70,44 76,58 68,72 76,86 68,100 76,114" ' +
          'fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    ),

    triglyceride: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // glycerol backbone (vertical)
        '<line x1="24" y1="20" x2="24" y2="100" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="24" cy="20" r="6" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<circle cx="24" cy="60" r="6" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<circle cx="24" cy="100" r="6" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="2.5"/>' +
        // three fatty-acid tails (horizontal zig-zags)
        '<polyline points="30,20 42,14 54,20 66,14 78,20 90,14 102,20" ' +
          'fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<polyline points="30,60 42,54 54,60 66,54 78,60 90,54 102,60" ' +
          'fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<polyline points="30,100 42,94 54,100 66,94 78,100 90,94 102,100" ' +
          'fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    ),

    cholesterol: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // four fused rings (steroid skeleton: 3 hexagons + 1 pentagon)
        '<polygon points="14,78 28,62 46,62 60,78 46,94 28,94" ' +
          'fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<polygon points="46,62 60,46 78,46 92,62 78,78 60,78" ' +
          'fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<polygon points="78,46 92,30 110,30 110,62 92,62" ' +
          'fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<polygon points="60,78 74,88 68,104 52,104 46,94" ' +
          'fill="' + TEAL + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        // OH group on the first ring
        '<circle cx="14" cy="78" r="7" fill="' + RED + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '</svg>'
    ),
  };

  const IB_BIO_MOLECULES = {
    id: 'ib-bio-molecules',
    name: 'IB Biology — Biological Molecules',
    symbolsPerCard: 6,
    abbreviations: {
      'haemoglobin': 'Hb',
      'hydrogen bond': 'H-bond',
      'fatty acid': 'FA',
      'glycosidic bond': 'glyco.',
      'peptide bond': 'peptide',
      'ester bond': 'ester',
      'condensation': 'condens.',
      'unsaturated': 'unsat.',
      'saturated': 'sat.',
    },
    symbols: [
      // 10 icons
      { type: 'image', value: ICONS.water,         display: 'water' },
      { type: 'image', value: ICONS.glucose,       display: 'glucose' },
      { type: 'image', value: ICONS.ribose,        display: 'ribose' },
      { type: 'image', value: ICONS.nucleotide,    display: 'nucleotide' },
      { type: 'image', value: ICONS.aminoAcid,     display: 'amino acid' },
      { type: 'image', value: ICONS.atp,           display: 'ATP' },
      { type: 'image', value: ICONS.dna,           display: 'DNA' },
      { type: 'image', value: ICONS.phospholipid,  display: 'phospholipid' },
      { type: 'image', value: ICONS.triglyceride,  display: 'triglyceride' },
      { type: 'image', value: ICONS.cholesterol,   display: 'cholesterol' },
      // 21 words -> total 31
      { type: 'word', value: 'starch' },
      { type: 'word', value: 'cellulose' },
      { type: 'word', value: 'glycogen' },
      { type: 'word', value: 'fatty acid' },
      { type: 'word', value: 'saturated' },
      { type: 'word', value: 'unsaturated' },
      { type: 'word', value: 'peptide bond' },
      { type: 'word', value: 'glycosidic bond' },
      { type: 'word', value: 'ester bond' },
      { type: 'word', value: 'hydrogen bond' },
      { type: 'word', value: 'condensation' },
      { type: 'word', value: 'hydrolysis' },
      { type: 'word', value: 'enzyme' },
      { type: 'word', value: 'protein' },
      { type: 'word', value: 'haemoglobin' },
      { type: 'word', value: 'insulin' },
      { type: 'word', value: 'collagen' },
      { type: 'word', value: 'RNA' },
      { type: 'word', value: 'mRNA' },
      { type: 'word', value: 'NADH' },
      { type: 'word', value: 'NADPH' },
    ],
  };

  const PACKS = [IB_BIO_MOLECULES];

  function get(id) {
    return PACKS.find((p) => p.id === id) || null;
  }

  function apply(pack) {
    if (!pack) return { ok: false, reason: 'no pack' };
    const c = window.FindIt.content;
    c.reset();
    c.setName(pack.name);
    c.setSymbolsPerCard(pack.symbolsPerCard);
    for (const [term, short] of Object.entries(pack.abbreviations || {})) {
      c.setAbbreviation(term, short);
    }
    for (const s of pack.symbols) {
      if (s.type === 'image') c.addImage(s.value, { label: s.display });
      else c.addWord(s.value);
    }
    return { ok: true, loaded: pack.symbols.length };
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.packs = { all: PACKS, get, apply, ICONS };
})();
