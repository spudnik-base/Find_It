// packs.js: starter content packs.
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

    // ─── Solar System ────────────────────────────────────────────────────
    sun: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // rays
        '<g stroke="' + INK + '" stroke-width="4" stroke-linecap="round">' +
          '<line x1="60" y1="4"   x2="60" y2="20"/>' +
          '<line x1="60" y1="100" x2="60" y2="116"/>' +
          '<line x1="4"  y1="60"  x2="20" y2="60"/>' +
          '<line x1="100" y1="60" x2="116" y2="60"/>' +
          '<line x1="18" y1="18"  x2="30" y2="30"/>' +
          '<line x1="90" y1="90"  x2="102" y2="102"/>' +
          '<line x1="18" y1="102" x2="30" y2="90"/>' +
          '<line x1="90" y1="30"  x2="102" y2="18"/>' +
        '</g>' +
        '<circle cx="60" cy="60" r="26" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
      '</svg>'
    ),

    moon: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M76 14 a48 48 0 1 0 0 92 a36 36 0 0 1 0 -92 Z" ' +
          'fill="#e8e2cf" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<circle cx="50" cy="48" r="5" fill="#b9b29f" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle cx="40" cy="72" r="4" fill="#b9b29f" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle cx="62" cy="82" r="3" fill="#b9b29f" stroke="' + INK + '" stroke-width="2"/>' +
      '</svg>'
    ),

    earth: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="44" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="5"/>' +
        // continents (stylised)
        '<path d="M30 52 q8 -10 20 -4 q10 6 22 -2 q8 -4 18 6" fill="none" stroke="' + GREEN + '" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="M24 78 q12 -6 26 2 q10 6 24 -2" fill="none" stroke="' + GREEN + '" stroke-width="8" stroke-linecap="round"/>' +
      '</svg>'
    ),

    mars: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="44" fill="' + RED + '" stroke="' + INK + '" stroke-width="5"/>' +
        // ice caps + surface marks
        '<ellipse cx="60" cy="22" rx="14" ry="5" fill="#ffffff" stroke="' + INK + '" stroke-width="2"/>' +
        '<circle cx="42" cy="60" r="4" fill="#7a1a12"/>' +
        '<circle cx="72" cy="72" r="5" fill="#7a1a12"/>' +
        '<circle cx="82" cy="48" r="3" fill="#7a1a12"/>' +
      '</svg>'
    ),

    jupiter: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="#e3b87a" stroke="' + INK + '" stroke-width="5"/>' +
        // bands
        '<path d="M18 44 h84" stroke="#8b5a2b" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M14 60 h92" stroke="#a66a2b" stroke-width="6" stroke-linecap="round"/>' +
        '<path d="M18 76 h84" stroke="#8b5a2b" stroke-width="6" stroke-linecap="round"/>' +
        // great red spot
        '<ellipse cx="72" cy="66" rx="10" ry="6" fill="' + RED + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '</svg>'
    ),

    saturn: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // rings (ellipse behind planet)
        '<ellipse cx="60" cy="64" rx="54" ry="14" fill="none" stroke="' + INK + '" stroke-width="5"/>' +
        '<ellipse cx="60" cy="64" rx="54" ry="14" fill="none" stroke="' + YELLOW + '" stroke-width="8" stroke-dasharray="2 8"/>' +
        // planet body
        '<circle cx="60" cy="58" r="28" fill="#e0c98a" stroke="' + INK + '" stroke-width="5"/>' +
        '<path d="M34 56 h52" stroke="#9a7b3a" stroke-width="4"/>' +
      '</svg>'
    ),

    comet: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // tail
        '<path d="M108 20 L54 62 L96 50 L44 70 L84 74 L38 82" fill="none" stroke="' + TEAL + '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
        // head
        '<circle cx="30" cy="90" r="16" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
      '</svg>'
    ),

    astronaut: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // helmet
        '<circle cx="60" cy="40" r="26" fill="#ffffff" stroke="' + INK + '" stroke-width="5"/>' +
        // visor
        '<path d="M44 36 a16 12 0 0 1 32 0 Z" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="3"/>' +
        // body
        '<rect x="38" y="66" width="44" height="40" rx="8" fill="#ffffff" stroke="' + INK + '" stroke-width="5"/>' +
        // chest control
        '<rect x="52" y="78" width="16" height="12" fill="' + RED + '" stroke="' + INK + '" stroke-width="2.5"/>' +
      '</svg>'
    ),

    // ─── Body Parts ──────────────────────────────────────────────────────
    eye: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M10 60 q50 -46 100 0 q-50 46 -100 0 Z" fill="#ffffff" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<circle cx="60" cy="60" r="18" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="4"/>' +
        '<circle cx="60" cy="60" r="7" fill="' + INK + '"/>' +
        '<circle cx="66" cy="54" r="3" fill="#ffffff"/>' +
      '</svg>'
    ),

    ear: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M40 16 C72 10 96 32 94 60 C92 78 78 84 74 96 C70 108 52 112 42 100 C28 86 18 64 22 46 C26 28 34 18 40 16 Z" ' +
          'fill="#f7d6bf" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M52 40 C68 38 80 52 76 66 C74 76 64 76 62 84" ' +
          'fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    ),

    nose: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M60 10 C50 30 38 62 38 82 C38 98 52 106 60 106 C68 106 82 98 82 82 C82 62 70 30 60 10 Z" ' +
          'fill="#f7d6bf" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<ellipse cx="50" cy="90" rx="5" ry="3" fill="' + INK + '"/>' +
        '<ellipse cx="70" cy="90" rx="5" ry="3" fill="' + INK + '"/>' +
      '</svg>'
    ),

    mouth: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M14 60 Q60 20 106 60 Q60 100 14 60 Z" fill="' + RED + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M14 60 Q60 62 106 60" fill="none" stroke="' + INK + '" stroke-width="4"/>' +
        '<path d="M30 58 Q60 46 90 58" fill="none" stroke="#ffffff" stroke-width="4"/>' +
      '</svg>'
    ),

    hand: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // palm
        '<rect x="34" y="60" width="52" height="48" rx="10" fill="#f7d6bf" stroke="' + INK + '" stroke-width="5"/>' +
        // fingers
        '<rect x="36" y="16" width="12" height="50" rx="6" fill="#f7d6bf" stroke="' + INK + '" stroke-width="4"/>' +
        '<rect x="52" y="10" width="12" height="56" rx="6" fill="#f7d6bf" stroke="' + INK + '" stroke-width="4"/>' +
        '<rect x="68" y="16" width="12" height="50" rx="6" fill="#f7d6bf" stroke="' + INK + '" stroke-width="4"/>' +
        // thumb
        '<rect x="82" y="56" width="24" height="12" rx="6" fill="#f7d6bf" stroke="' + INK + '" stroke-width="4"/>' +
      '</svg>'
    ),

    foot: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // heel + sole
        '<path d="M28 20 C20 32 22 58 30 74 C34 84 44 92 60 94 C82 96 100 86 100 74 C100 64 86 54 72 50 C58 46 44 36 40 24 C38 18 32 14 28 20 Z" ' +
          'fill="#f7d6bf" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        // toes
        '<circle cx="86" cy="80" r="8" fill="#f7d6bf" stroke="' + INK + '" stroke-width="3"/>' +
        '<circle cx="76" cy="94" r="6" fill="#f7d6bf" stroke="' + INK + '" stroke-width="3"/>' +
        '<circle cx="60" cy="102" r="5" fill="#f7d6bf" stroke="' + INK + '" stroke-width="3"/>' +
        '<circle cx="46" cy="104" r="4" fill="#f7d6bf" stroke="' + INK + '" stroke-width="3"/>' +
      '</svg>'
    ),

    heart: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M60 102 C16 74 10 42 30 26 C48 14 58 30 60 38 C62 30 72 14 90 26 C110 42 104 74 60 102 Z" ' +
          'fill="' + RED + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M40 42 q8 -8 16 0" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    ),

    brain: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // outer shape (two hemispheres)
        '<path d="M26 44 C26 24 48 14 60 22 C72 14 94 24 94 44 C102 52 98 70 88 74 C88 90 72 102 60 96 C48 102 32 90 32 74 C22 70 18 52 26 44 Z" ' +
          'fill="#f9b8c4" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        // central fissure + folds
        '<line x1="60" y1="22" x2="60" y2="94" stroke="' + INK + '" stroke-width="3"/>' +
        '<path d="M36 50 q10 6 0 14" fill="none" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<path d="M84 50 q-10 6 0 14" fill="none" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<path d="M42 74 q8 -6 16 0" fill="none" stroke="' + INK + '" stroke-width="2.5"/>' +
        '<path d="M62 74 q8 6 16 0" fill="none" stroke="' + INK + '" stroke-width="2.5"/>' +
      '</svg>'
    ),

    // ─── Shapes ──────────────────────────────────────────────────────────
    shapeSquare: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<rect x="20" y="20" width="80" height="80" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    shapeCircle: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="44" fill="' + RED + '" stroke="' + INK + '" stroke-width="5"/>' +
      '</svg>'
    ),
    shapeTriangle: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="60,14 14,96 106,96" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    shapeRectangle: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<rect x="10" y="32" width="100" height="56" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    shapeStar: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="60,8 73,44 112,44 81,68 92,108 60,86 28,108 39,68 8,44 47,44" ' +
          'fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    shapePentagon: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="60,10 108,45 90,104 30,104 12,45" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    shapeHexagon: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="60,10 104,36 104,84 60,110 16,84 16,36" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    shapeDiamond: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="60,10 110,60 60,110 10,60" fill="' + RED + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    shapeOval: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<ellipse cx="60" cy="60" rx="50" ry="32" fill="' + BLUE + '" stroke="' + INK + '" stroke-width="5"/>' +
      '</svg>'
    ),

    // ─── Misc (Spanish Basics) ───────────────────────────────────────────
    wave: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        // palm
        '<path d="M34 44 L34 96 Q34 108 48 108 L86 108 Q100 108 100 96 L100 58 Q100 50 92 50 Q84 50 84 58 L84 72" ' +
          'fill="#f7d6bf" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        // fingers
        '<path d="M34 58 L34 24 Q34 16 42 16 Q50 16 50 24 L50 60" fill="#f7d6bf" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M50 58 L50 18 Q50 10 58 10 Q66 10 66 18 L66 60" fill="#f7d6bf" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M66 58 L66 22 Q66 14 74 14 Q82 14 82 22 L82 60" fill="#f7d6bf" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        // motion lines
        '<path d="M106 28 q6 6 0 12" fill="none" stroke="' + YELLOW + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M108 48 q8 6 0 12" fill="none" stroke="' + YELLOW + '" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    ),

    // ─── Emotion faces ───────────────────────────────────────────────────
    faceHappy: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="44" cy="52" r="5" fill="' + INK + '"/>' +
        '<circle cx="76" cy="52" r="5" fill="' + INK + '"/>' +
        '<path d="M38 70 Q60 92 82 70" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '</svg>'
    ),
    faceSad: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="44" cy="52" r="5" fill="' + INK + '"/>' +
        '<circle cx="76" cy="52" r="5" fill="' + INK + '"/>' +
        '<path d="M38 82 Q60 62 82 82" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M44 58 q0 12 4 16" fill="none" stroke="' + BLUE + '" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>'
    ),
    faceAngry: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + RED + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="44" cy="56" r="5" fill="' + INK + '"/>' +
        '<circle cx="76" cy="56" r="5" fill="' + INK + '"/>' +
        '<line x1="34" y1="40" x2="54" y2="50" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<line x1="86" y1="40" x2="66" y2="50" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M40 80 Q60 72 80 80" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '</svg>'
    ),
    faceExcited: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="44" cy="52" r="6" fill="' + INK + '"/>' +
        '<circle cx="76" cy="52" r="6" fill="' + INK + '"/>' +
        '<path d="M32 68 Q60 100 88 68 Q60 82 32 68 Z" fill="' + INK + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M16 30 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" fill="' + RED + '"/>' +
        '<path d="M104 32 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="' + RED + '"/>' +
      '</svg>'
    ),
    faceCalm: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<path d="M36 54 q8 -6 16 0" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M68 54 q8 -6 16 0" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M44 78 Q60 84 76 78" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    ),
    faceWorried: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="44" cy="56" r="4" fill="' + INK + '"/>' +
        '<circle cx="76" cy="56" r="4" fill="' + INK + '"/>' +
        '<path d="M36 46 q8 -6 16 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M68 46 q8 -6 16 0" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M40 80 q5 -5 10 0 q5 5 10 0 q5 -5 10 0 q5 5 10 0" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    ),
    faceSurprised: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="44" cy="52" r="7" fill="' + INK + '"/>' +
        '<circle cx="76" cy="52" r="7" fill="' + INK + '"/>' +
        '<ellipse cx="60" cy="82" rx="10" ry="13" fill="' + INK + '"/>' +
      '</svg>'
    ),
    faceTired: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<circle cx="60" cy="60" r="46" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<path d="M36 58 q8 8 16 0" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M68 58 q8 8 16 0" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M42 80 q18 -4 36 0" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
        '<text x="88" y="34" font-family="Nunito,sans-serif" font-size="16" font-weight="800" fill="' + INK + '">z</text>' +
        '<text x="100" y="24" font-family="Nunito,sans-serif" font-size="12" font-weight="800" fill="' + INK + '">z</text>' +
      '</svg>'
    ),

    // ─── Weather ─────────────────────────────────────────────────────────
    // (sun is reused from the Solar System pack)
    wxCloud: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M30 78 a22 22 0 0 1 6 -42 a26 26 0 0 1 48 4 a18 18 0 0 1 8 38 Z" ' +
          'fill="#ffffff" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    wxRain: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M26 60 a20 20 0 0 1 6 -38 a24 24 0 0 1 44 4 a16 16 0 0 1 8 34 Z" ' +
          'fill="#d6deee" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M38 76 l-6 20" stroke="' + BLUE + '" stroke-width="5" stroke-linecap="round" fill="none"/>' +
        '<path d="M58 76 l-6 24" stroke="' + BLUE + '" stroke-width="5" stroke-linecap="round" fill="none"/>' +
        '<path d="M78 76 l-6 20" stroke="' + BLUE + '" stroke-width="5" stroke-linecap="round" fill="none"/>' +
      '</svg>'
    ),
    wxSnow: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<g stroke="' + INK + '" stroke-width="5" stroke-linecap="round">' +
          '<line x1="60" y1="14" x2="60" y2="106"/>' +
          '<line x1="18" y1="60" x2="102" y2="60"/>' +
          '<line x1="28" y1="28" x2="92" y2="92"/>' +
          '<line x1="92" y1="28" x2="28" y2="92"/>' +
        '</g>' +
        '<g stroke="' + TEAL + '" stroke-width="3.5" stroke-linecap="round">' +
          '<path d="M52 20 l8 8 l8 -8"/>' +
          '<path d="M52 100 l8 -8 l8 8"/>' +
          '<path d="M20 52 l8 8 l-8 8"/>' +
          '<path d="M100 52 l-8 8 l8 8"/>' +
        '</g>' +
      '</svg>'
    ),
    wxLightning: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="64,6 30,66 54,66 44,114 94,48 68,48 82,6" ' +
          'fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>'
    ),
    wxWind: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<g fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round">' +
          '<path d="M10 38 h78 a12 12 0 1 0 -12 -12"/>' +
          '<path d="M10 64 h88 a10 10 0 1 1 -10 10"/>' +
          '<path d="M10 90 h60"/>' +
        '</g>' +
      '</svg>'
    ),
    wxRainbow: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<g fill="none" stroke-width="7" stroke-linecap="butt">' +
          '<path d="M14 96 a46 46 0 0 1 92 0" stroke="' + RED + '"/>' +
          '<path d="M22 96 a38 38 0 0 1 76 0" stroke="#ff9a33"/>' +
          '<path d="M30 96 a30 30 0 0 1 60 0" stroke="' + YELLOW + '"/>' +
          '<path d="M38 96 a22 22 0 0 1 44 0" stroke="' + GREEN + '"/>' +
          '<path d="M46 96 a14 14 0 0 1 28 0" stroke="' + BLUE + '"/>' +
        '</g>' +
        '<path d="M14 96 a46 46 0 0 1 92 0" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M46 96 a14 14 0 0 1 28 0" fill="none" stroke="' + INK + '" stroke-width="2"/>' +
      '</svg>'
    ),
    wxThermo: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<rect x="50" y="14" width="20" height="72" rx="10" fill="#fff" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="60" cy="96" r="16" fill="' + RED + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<rect x="54" y="54" width="12" height="40" fill="' + RED + '"/>' +
        '<line x1="74" y1="28" x2="84" y2="28" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="74" y1="42" x2="80" y2="42" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="74" y1="56" x2="84" y2="56" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="74" y1="70" x2="80" y2="70" stroke="' + INK + '" stroke-width="3"/>' +
      '</svg>'
    ),
    wxUmbrella: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M14 58 a46 30 0 0 1 92 0 Z" fill="' + RED + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M30 58 q14 -18 30 0" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
        '<path d="M60 58 q14 -18 30 0" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="60" y1="58" x2="60" y2="104" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M54 108 q6 8 12 0" fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round"/>' +
      '</svg>'
    ),

    // ─── Animals ─────────────────────────────────────────────────────────
    aniDog: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M24 52 Q14 14 38 18 L44 44 Q60 34 76 44 L82 18 Q106 14 96 52 Q106 86 76 100 Q60 108 44 100 Q14 86 24 52 Z" ' +
          'fill="#c8a06b" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<circle cx="46" cy="60" r="5" fill="' + INK + '"/>' +
        '<circle cx="74" cy="60" r="5" fill="' + INK + '"/>' +
        '<ellipse cx="60" cy="76" rx="8" ry="6" fill="' + INK + '"/>' +
        '<path d="M56 82 q4 6 8 0" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '</svg>'
    ),
    aniCat: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<polygon points="20,48 30,14 54,36" fill="#a0a0a0" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<polygon points="100,48 90,14 66,36" fill="#a0a0a0" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<circle cx="60" cy="66" r="38" fill="#bdbdbd" stroke="' + INK + '" stroke-width="5"/>' +
        '<ellipse cx="46" cy="60" rx="4" ry="7" fill="' + INK + '"/>' +
        '<ellipse cx="74" cy="60" rx="4" ry="7" fill="' + INK + '"/>' +
        '<polygon points="56,78 64,78 60,84" fill="' + INK + '"/>' +
        '<path d="M60 84 q-4 6 -10 4" stroke="' + INK + '" stroke-width="2.5" fill="none"/>' +
        '<path d="M60 84 q4 6 10 4" stroke="' + INK + '" stroke-width="2.5" fill="none"/>' +
        '<g stroke="' + INK + '" stroke-width="2">' +
          '<line x1="30" y1="72" x2="14" y2="70"/>' +
          '<line x1="30" y1="80" x2="14" y2="82"/>' +
          '<line x1="90" y1="72" x2="106" y2="70"/>' +
          '<line x1="90" y1="80" x2="106" y2="82"/>' +
        '</g>' +
      '</svg>'
    ),
    aniFish: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M20 60 Q40 30 80 40 Q110 50 110 60 Q110 70 80 80 Q40 90 20 60 Z" ' +
          'fill="' + TEAL + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<polygon points="20,60 0,40 6,60 0,80" fill="' + TEAL + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<circle cx="92" cy="56" r="4" fill="' + INK + '"/>' +
        '<path d="M60 46 q8 14 0 28" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
      '</svg>'
    ),
    aniBird: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M22 80 Q22 42 56 38 Q92 34 100 60 Q104 76 84 90 Q56 104 32 96 Z" ' +
          'fill="' + BLUE + '" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<polygon points="96,56 118,48 100,68" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<circle cx="88" cy="52" r="3" fill="' + INK + '"/>' +
        '<path d="M44 70 Q60 60 76 70" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
        '<line x1="50" y1="96" x2="48" y2="108" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
        '<line x1="66" y1="96" x2="64" y2="108" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' +
      '</svg>'
    ),
    aniElephant: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<ellipse cx="60" cy="60" rx="40" ry="34" fill="#a0a6b0" stroke="' + INK + '" stroke-width="5"/>' +
        '<path d="M20 40 Q6 38 16 22" fill="#a0a6b0" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M100 40 Q114 38 104 22" fill="#a0a6b0" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round"/>' +
        '<path d="M48 86 Q40 108 54 102 Q60 94 66 102 Q80 108 72 86" ' +
          'fill="#a0a6b0" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '<circle cx="44" cy="56" r="4" fill="' + INK + '"/>' +
        '<circle cx="76" cy="56" r="4" fill="' + INK + '"/>' +
      '</svg>'
    ),
    aniLion: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<g fill="#c07628" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round">' +
          '<polygon points="60,6 68,22 84,10 80,28 100,22 92,38 112,42 96,52 112,68 94,70 102,88 84,82 86,100 70,90 64,108 56,108 50,90 34,100 36,82 18,88 26,68 8,68 24,52 8,42 28,38 20,22 40,28 36,10 52,22"/>' +
        '</g>' +
        '<circle cx="60" cy="60" r="30" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="4"/>' +
        '<circle cx="50" cy="54" r="3.5" fill="' + INK + '"/>' +
        '<circle cx="70" cy="54" r="3.5" fill="' + INK + '"/>' +
        '<polygon points="56,66 64,66 60,72" fill="' + INK + '"/>' +
        '<path d="M60 72 q-4 6 -8 4" stroke="' + INK + '" stroke-width="2" fill="none"/>' +
        '<path d="M60 72 q4 6 8 4" stroke="' + INK + '" stroke-width="2" fill="none"/>' +
      '</svg>'
    ),
    aniFrog: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<ellipse cx="60" cy="74" rx="46" ry="32" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="38" cy="44" r="16" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="82" cy="44" r="16" fill="' + GREEN + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="38" cy="44" r="6" fill="' + INK + '"/>' +
        '<circle cx="82" cy="44" r="6" fill="' + INK + '"/>' +
        '<path d="M40 82 Q60 96 80 82" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    ),
    aniSnake: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<path d="M14 28 C 60 10 60 60 14 60 C 60 60 60 110 106 92" ' +
          'fill="none" stroke="' + GREEN + '" stroke-width="14" stroke-linecap="round"/>' +
        '<path d="M14 28 C 60 10 60 60 14 60 C 60 60 60 110 106 92" ' +
          'fill="none" stroke="' + INK + '" stroke-width="3"/>' +
        '<circle cx="102" cy="90" r="4" fill="' + INK + '"/>' +
        '<path d="M108 92 l8 -2 l-8 -2 z" fill="' + RED + '" stroke="' + INK + '" stroke-width="2"/>' +
      '</svg>'
    ),
    aniRabbit: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<ellipse cx="42" cy="32" rx="10" ry="24" fill="#f0e5d2" stroke="' + INK + '" stroke-width="5"/>' +
        '<ellipse cx="78" cy="32" rx="10" ry="24" fill="#f0e5d2" stroke="' + INK + '" stroke-width="5"/>' +
        '<ellipse cx="42" cy="32" rx="4" ry="14" fill="#f9b8c4"/>' +
        '<ellipse cx="78" cy="32" rx="4" ry="14" fill="#f9b8c4"/>' +
        '<circle cx="60" cy="76" r="30" fill="#f0e5d2" stroke="' + INK + '" stroke-width="5"/>' +
        '<circle cx="50" cy="70" r="3.5" fill="' + INK + '"/>' +
        '<circle cx="70" cy="70" r="3.5" fill="' + INK + '"/>' +
        '<ellipse cx="60" cy="84" rx="5" ry="3" fill="#f9b8c4" stroke="' + INK + '" stroke-width="2"/>' +
        '<path d="M60 87 q-4 8 -10 4" stroke="' + INK + '" stroke-width="2" fill="none"/>' +
        '<path d="M60 87 q4 8 10 4" stroke="' + INK + '" stroke-width="2" fill="none"/>' +
      '</svg>'
    ),
    aniBee: svg(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">' +
        '<ellipse cx="60" cy="70" rx="34" ry="24" fill="' + YELLOW + '" stroke="' + INK + '" stroke-width="5"/>' +
        '<path d="M46 50 L46 90" stroke="' + INK + '" stroke-width="7"/>' +
        '<path d="M62 48 L62 92" stroke="' + INK + '" stroke-width="7"/>' +
        '<path d="M78 54 L78 88" stroke="' + INK + '" stroke-width="7"/>' +
        '<ellipse cx="40" cy="46" rx="16" ry="10" fill="#ffffff" stroke="' + INK + '" stroke-width="3" transform="rotate(-20 40 46)"/>' +
        '<ellipse cx="80" cy="46" rx="16" ry="10" fill="#ffffff" stroke="' + INK + '" stroke-width="3" transform="rotate(20 80 46)"/>' +
        '<circle cx="32" cy="62" r="3" fill="' + INK + '"/>' +
      '</svg>'
    ),
  };

  const IB_BIO_MOLECULES = {
    id: 'ib-bio-molecules',
    name: 'IB Biology: Biological Molecules',
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

  // ─── Solar System ──────────────────────────────────────────────────────
  const SOLAR_SYSTEM = {
    id: 'solar-system',
    name: 'Solar System',
    symbolsPerCard: 6,
    abbreviations: {
      'international space station': 'ISS',
      'milky way': 'milkyway',
      'constellation': 'constel.',
      'astronaut': 'astro',
    },
    symbols: [
      { type: 'image', value: ICONS.sun,       display: 'sun' },
      { type: 'image', value: ICONS.moon,      display: 'moon' },
      { type: 'image', value: ICONS.earth,     display: 'earth' },
      { type: 'image', value: ICONS.mars,      display: 'mars' },
      { type: 'image', value: ICONS.jupiter,   display: 'jupiter' },
      { type: 'image', value: ICONS.saturn,    display: 'saturn' },
      { type: 'image', value: ICONS.comet,     display: 'comet' },
      { type: 'image', value: ICONS.astronaut, display: 'astronaut' },
      { type: 'word', value: 'mercury' },
      { type: 'word', value: 'venus' },
      { type: 'word', value: 'uranus' },
      { type: 'word', value: 'neptune' },
      { type: 'word', value: 'pluto' },
      { type: 'word', value: 'star' },
      { type: 'word', value: 'galaxy' },
      { type: 'word', value: 'nebula' },
      { type: 'word', value: 'asteroid' },
      { type: 'word', value: 'meteor' },
      { type: 'word', value: 'orbit' },
      { type: 'word', value: 'eclipse' },
      { type: 'word', value: 'gravity' },
      { type: 'word', value: 'crater' },
      { type: 'word', value: 'rocket' },
      { type: 'word', value: 'satellite' },
      { type: 'word', value: 'telescope' },
      { type: 'word', value: 'solar' },
      { type: 'word', value: 'lunar' },
      { type: 'word', value: 'rings' },
      { type: 'word', value: 'constellation' },
      { type: 'word', value: 'milky way' },
      { type: 'word', value: 'black hole' },
    ],
  };

  // ─── Body Parts ────────────────────────────────────────────────────────
  const BODY_PARTS = {
    id: 'body-parts',
    name: 'Body Parts',
    symbolsPerCard: 6,
    abbreviations: {
      'shoulder': 'should.',
      'intestine': 'intest.',
    },
    symbols: [
      { type: 'image', value: ICONS.eye,    display: 'eye' },
      { type: 'image', value: ICONS.ear,    display: 'ear' },
      { type: 'image', value: ICONS.nose,   display: 'nose' },
      { type: 'image', value: ICONS.mouth,  display: 'mouth' },
      { type: 'image', value: ICONS.hand,   display: 'hand' },
      { type: 'image', value: ICONS.foot,   display: 'foot' },
      { type: 'image', value: ICONS.heart,  display: 'heart' },
      { type: 'image', value: ICONS.brain,  display: 'brain' },
      { type: 'word', value: 'head' },
      { type: 'word', value: 'neck' },
      { type: 'word', value: 'shoulder' },
      { type: 'word', value: 'arm' },
      { type: 'word', value: 'elbow' },
      { type: 'word', value: 'wrist' },
      { type: 'word', value: 'finger' },
      { type: 'word', value: 'thumb' },
      { type: 'word', value: 'chest' },
      { type: 'word', value: 'back' },
      { type: 'word', value: 'hip' },
      { type: 'word', value: 'leg' },
      { type: 'word', value: 'knee' },
      { type: 'word', value: 'ankle' },
      { type: 'word', value: 'toe' },
      { type: 'word', value: 'skull' },
      { type: 'word', value: 'spine' },
      { type: 'word', value: 'rib' },
      { type: 'word', value: 'lungs' },
      { type: 'word', value: 'liver' },
      { type: 'word', value: 'kidney' },
      { type: 'word', value: 'stomach' },
      { type: 'word', value: 'intestine' },
    ],
  };

  // ─── Spanish Basics ────────────────────────────────────────────────────
  const SPANISH_BASICS = {
    id: 'spanish-basics',
    name: 'Spanish Basics',
    symbolsPerCard: 6,
    abbreviations: {
      'por favor': 'porfvr',
      'buenos días': 'b.días',
    },
    symbols: [
      { type: 'image', value: ICONS.wave,  display: 'hola' },
      { type: 'image', value: ICONS.heart, display: 'amor' },
      { type: 'word', value: 'adiós' },
      { type: 'word', value: 'gracias' },
      { type: 'word', value: 'por favor' },
      { type: 'word', value: 'sí' },
      { type: 'word', value: 'no' },
      { type: 'word', value: 'buenos días' },
      { type: 'word', value: 'uno' },
      { type: 'word', value: 'dos' },
      { type: 'word', value: 'tres' },
      { type: 'word', value: 'cuatro' },
      { type: 'word', value: 'cinco' },
      { type: 'word', value: 'seis' },
      { type: 'word', value: 'rojo' },
      { type: 'word', value: 'azul' },
      { type: 'word', value: 'verde' },
      { type: 'word', value: 'amarillo' },
      { type: 'word', value: 'casa' },
      { type: 'word', value: 'perro' },
      { type: 'word', value: 'gato' },
      { type: 'word', value: 'agua' },
      { type: 'word', value: 'pan' },
      { type: 'word', value: 'libro' },
      { type: 'word', value: 'escuela' },
      { type: 'word', value: 'amigo' },
      { type: 'word', value: 'familia' },
      { type: 'word', value: 'madre' },
      { type: 'word', value: 'padre' },
      { type: 'word', value: 'sol' },
      { type: 'word', value: 'luna' },
    ],
  };

  // ─── KS1 Reading (First Words) ─────────────────────────────────────────
  const KS1_READING = {
    id: 'ks1-reading',
    name: 'KS1 First Reading Words',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: [
      { type: 'word', value: 'the' },
      { type: 'word', value: 'and' },
      { type: 'word', value: 'is' },
      { type: 'word', value: 'it' },
      { type: 'word', value: 'a' },
      { type: 'word', value: 'I' },
      { type: 'word', value: 'to' },
      { type: 'word', value: 'of' },
      { type: 'word', value: 'in' },
      { type: 'word', value: 'my' },
      { type: 'word', value: 'go' },
      { type: 'word', value: 'see' },
      { type: 'word', value: 'me' },
      { type: 'word', value: 'can' },
      { type: 'word', value: 'like' },
      { type: 'word', value: 'you' },
      { type: 'word', value: 'look' },
      { type: 'word', value: 'come' },
      { type: 'word', value: 'cat' },
      { type: 'word', value: 'dog' },
      { type: 'word', value: 'hat' },
      { type: 'word', value: 'sun' },
      { type: 'word', value: 'red' },
      { type: 'word', value: 'big' },
      { type: 'word', value: 'up' },
      { type: 'word', value: 'day' },
      { type: 'word', value: 'play' },
      { type: 'word', value: 'said' },
      { type: 'word', value: 'was' },
      { type: 'word', value: 'yes' },
      { type: 'word', value: 'no' },
    ],
  };

  // ─── GCSE Chemistry ────────────────────────────────────────────────────
  // Uses markdown-style sub/sup tokens rendered by layout.js/renderer.js:
  //   ~n~  -> subscript (H~2~O)
  //   ^n+^ -> superscript (Fe^2+^)
  const GCSE_CHEMISTRY = {
    id: 'gcse-chemistry',
    name: 'GCSE Chemistry: Elements & Compounds',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: [
      // 16 elements
      { type: 'word', value: 'H' },
      { type: 'word', value: 'He' },
      { type: 'word', value: 'C' },
      { type: 'word', value: 'N' },
      { type: 'word', value: 'O' },
      { type: 'word', value: 'F' },
      { type: 'word', value: 'Na' },
      { type: 'word', value: 'Mg' },
      { type: 'word', value: 'Al' },
      { type: 'word', value: 'S' },
      { type: 'word', value: 'Cl' },
      { type: 'word', value: 'K' },
      { type: 'word', value: 'Ca' },
      { type: 'word', value: 'Fe' },
      { type: 'word', value: 'Cu' },
      { type: 'word', value: 'Zn' },
      // 9 compounds with subscripts
      { type: 'word', value: 'H~2~O' },
      { type: 'word', value: 'CO~2~' },
      { type: 'word', value: 'NaCl' },
      { type: 'word', value: 'HCl' },
      { type: 'word', value: 'NaOH' },
      { type: 'word', value: 'H~2~SO~4~' },
      { type: 'word', value: 'CH~4~' },
      { type: 'word', value: 'NH~3~' },
      { type: 'word', value: 'CaCO~3~' },
      // 6 oxidation-state ions with superscripts
      { type: 'word', value: 'Fe^2+^' },
      { type: 'word', value: 'Fe^3+^' },
      { type: 'word', value: 'Cu^2+^' },
      { type: 'word', value: 'Al^3+^' },
      { type: 'word', value: 'O^2-^' },
      { type: 'word', value: 'Cl^-^' },
    ],
  };

  // ─── French Basics ─────────────────────────────────────────────────────
  const FRENCH_BASICS = {
    id: 'french-basics',
    name: 'French Basics',
    symbolsPerCard: 6,
    abbreviations: {
      "s'il vous plaît": 'svp',
      'au revoir': 'au rev.',
      'bonne nuit': 'bon.nuit',
    },
    symbols: [
      { type: 'image', value: ICONS.wave,  display: 'bonjour' },
      { type: 'image', value: ICONS.heart, display: 'amour' },
      { type: 'word', value: 'au revoir' },
      { type: 'word', value: 'merci' },
      { type: 'word', value: "s'il vous plaît" },
      { type: 'word', value: 'oui' },
      { type: 'word', value: 'non' },
      { type: 'word', value: 'bonne nuit' },
      { type: 'word', value: 'un' },
      { type: 'word', value: 'deux' },
      { type: 'word', value: 'trois' },
      { type: 'word', value: 'quatre' },
      { type: 'word', value: 'cinq' },
      { type: 'word', value: 'six' },
      { type: 'word', value: 'sept' },
      { type: 'word', value: 'rouge' },
      { type: 'word', value: 'bleu' },
      { type: 'word', value: 'vert' },
      { type: 'word', value: 'jaune' },
      { type: 'word', value: 'noir' },
      { type: 'word', value: 'blanc' },
      { type: 'word', value: 'chat' },
      { type: 'word', value: 'chien' },
      { type: 'word', value: 'maison' },
      { type: 'word', value: 'école' },
      { type: 'word', value: 'livre' },
      { type: 'word', value: 'ami' },
      { type: 'word', value: 'famille' },
      { type: 'word', value: 'mère' },
      { type: 'word', value: 'père' },
      { type: 'word', value: 'eau' },
    ],
  };

  // ─── KS1 Phonics Phase 3 ───────────────────────────────────────────────
  // A mix of Phase 2 single-letter sounds and Phase 3 digraphs/trigraphs.
  const KS1_PHONICS = {
    id: 'ks1-phonics',
    name: 'KS1 Phonics (Phase 2-3)',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: [
      // Phase 2 single-letter sounds
      { type: 'word', value: 's' },
      { type: 'word', value: 'a' },
      { type: 'word', value: 't' },
      { type: 'word', value: 'p' },
      { type: 'word', value: 'i' },
      { type: 'word', value: 'n' },
      { type: 'word', value: 'm' },
      { type: 'word', value: 'd' },
      { type: 'word', value: 'g' },
      { type: 'word', value: 'o' },
      { type: 'word', value: 'c' },
      { type: 'word', value: 'e' },
      { type: 'word', value: 'u' },
      { type: 'word', value: 'r' },
      { type: 'word', value: 'h' },
      { type: 'word', value: 'b' },
      // Phase 3 digraphs + trigraphs
      { type: 'word', value: 'ck' },
      { type: 'word', value: 'sh' },
      { type: 'word', value: 'ch' },
      { type: 'word', value: 'th' },
      { type: 'word', value: 'ng' },
      { type: 'word', value: 'ai' },
      { type: 'word', value: 'ee' },
      { type: 'word', value: 'igh' },
      { type: 'word', value: 'oa' },
      { type: 'word', value: 'oo' },
      { type: 'word', value: 'ar' },
      { type: 'word', value: 'or' },
      { type: 'word', value: 'ur' },
      { type: 'word', value: 'ow' },
      { type: 'word', value: 'oi' },
    ],
  };

  // ─── KS2 Tier-2 Vocabulary ─────────────────────────────────────────────
  // Y3-6 reading / writing vocabulary, all 4-8 letters so the 8-char
  // display cap doesn't kick in.
  const KS2_VOCAB = {
    id: 'ks2-vocab',
    name: 'KS2 Tier-2 Vocabulary',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: [
      { type: 'word', value: 'although' },
      { type: 'word', value: 'suddenly' },
      { type: 'word', value: 'enormous' },
      { type: 'word', value: 'furious' },
      { type: 'word', value: 'curious' },
      { type: 'word', value: 'ancient' },
      { type: 'word', value: 'fierce' },
      { type: 'word', value: 'gentle' },
      { type: 'word', value: 'rapid' },
      { type: 'word', value: 'pleasant' },
      { type: 'word', value: 'unusual' },
      { type: 'word', value: 'ordinary' },
      { type: 'word', value: 'valuable' },
      { type: 'word', value: 'generous' },
      { type: 'word', value: 'vicious' },
      { type: 'word', value: 'peculiar' },
      { type: 'word', value: 'average' },
      { type: 'word', value: 'precious' },
      { type: 'word', value: 'obvious' },
      { type: 'word', value: 'various' },
      { type: 'word', value: 'cautious' },
      { type: 'word', value: 'clever' },
      { type: 'word', value: 'anxious' },
      { type: 'word', value: 'modest' },
      { type: 'word', value: 'weary' },
      { type: 'word', value: 'humble' },
      { type: 'word', value: 'sincere' },
      { type: 'word', value: 'eager' },
      { type: 'word', value: 'merry' },
      { type: 'word', value: 'bold' },
      { type: 'word', value: 'grim' },
    ],
  };

  // ─── Times Tables 2x, 5x, 10x ──────────────────────────────────────────
  // 11 items of 2x + 10 of 5x + 10 of 10x = 31. All rendered as "2×1"
  // etc. using the unicode multiplication sign.
  const TIMES_TABLES = {
    id: 'times-tables',
    name: 'Times Tables (2×, 5×, 10×)',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: (function () {
      const out = [];
      for (let k = 1; k <= 11; k++) out.push({ type: 'word', value: '2×' + k });
      for (let k = 1; k <= 10; k++) out.push({ type: 'word', value: '5×' + k });
      for (let k = 1; k <= 10; k++) out.push({ type: 'word', value: '10×' + k });
      return out;
    })(),
  };

  // ─── Times Tables Q&A (two-pile) ───────────────────────────────────────
  // 31 Q/A pair symbols: question side shows the expression, answer side
  // shows the product. The exporter emits two piles (62 printed cards)
  // with a red Q border and a blue A border so every match is Q↔A.
  const TIMES_TABLES_QA = {
    id: 'times-tables-qa',
    name: 'Times Tables Q&A (2×, 5×, 10×)',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: (function () {
      const out = [];
      const push = (a, b) => out.push({
        type: 'pair',
        value: a + ' × ' + b,
        pairValue: String(a * b),
      });
      for (let k = 1; k <= 11; k++) push(2, k);
      for (let k = 1; k <= 10; k++) push(5, k);
      for (let k = 1; k <= 10; k++) push(10, k);
      return out;
    })(),
  };

  // ─── Simple Addition Q&A (two-pile) ────────────────────────────────────
  // 31 pair symbols spanning sums 2..12 with single-digit operands, so the
  // answer pile shows small numbers distinct enough to read at 55mm.
  const ADDITION_QA = {
    id: 'addition-qa',
    name: 'Simple Addition Q&A',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: (function () {
      const out = [];
      const TARGET = 31;
      for (let s = 2; s <= 18 && out.length < TARGET; s++) {
        for (let a = 1; a <= Math.floor(s / 2) && out.length < TARGET; a++) {
          const b = s - a;
          if (b <= 9) {
            out.push({
              type: 'pair',
              value: a + ' + ' + b,
              pairValue: String(s),
            });
          }
        }
      }
      return out;
    })(),
  };

  // ─── Shapes & Numbers (KS1 Numeracy) ───────────────────────────────────
  // 10 shape icons + 10 digits + 5 operators + 6 concept words = 31.
  const SHAPES_NUMBERS = {
    id: 'shapes-numbers',
    name: 'Shapes & Numbers',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: [
      { type: 'image', value: ICONS.shapeSquare,    display: 'square' },
      { type: 'image', value: ICONS.shapeCircle,    display: 'circle' },
      { type: 'image', value: ICONS.shapeTriangle,  display: 'triangle' },
      { type: 'image', value: ICONS.shapeRectangle, display: 'rectangle' },
      { type: 'image', value: ICONS.shapeStar,      display: 'star' },
      { type: 'image', value: ICONS.heart,          display: 'heart' },
      { type: 'image', value: ICONS.shapePentagon,  display: 'pentagon' },
      { type: 'image', value: ICONS.shapeHexagon,   display: 'hexagon' },
      { type: 'image', value: ICONS.shapeDiamond,   display: 'diamond' },
      { type: 'image', value: ICONS.shapeOval,      display: 'oval' },
      { type: 'word', value: '0' },
      { type: 'word', value: '1' },
      { type: 'word', value: '2' },
      { type: 'word', value: '3' },
      { type: 'word', value: '4' },
      { type: 'word', value: '5' },
      { type: 'word', value: '6' },
      { type: 'word', value: '7' },
      { type: 'word', value: '8' },
      { type: 'word', value: '9' },
      { type: 'word', value: '+' },
      { type: 'word', value: '−' },
      { type: 'word', value: '×' },
      { type: 'word', value: '÷' },
      { type: 'word', value: '=' },
      { type: 'word', value: 'half' },
      { type: 'word', value: 'pair' },
      { type: 'word', value: 'double' },
      { type: 'word', value: 'odd' },
      { type: 'word', value: 'even' },
      { type: 'word', value: 'dozen' },
    ],
  };

  // ─── Emotions & Feelings ───────────────────────────────────────────────
  const EMOTIONS = {
    id: 'emotions',
    name: 'Emotions & Feelings',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: [
      { type: 'image', value: ICONS.faceHappy,     display: 'happy' },
      { type: 'image', value: ICONS.faceSad,       display: 'sad' },
      { type: 'image', value: ICONS.faceAngry,     display: 'angry' },
      { type: 'image', value: ICONS.faceExcited,   display: 'excited' },
      { type: 'image', value: ICONS.faceCalm,      display: 'calm' },
      { type: 'image', value: ICONS.faceWorried,   display: 'worried' },
      { type: 'image', value: ICONS.faceSurprised, display: 'surprised' },
      { type: 'image', value: ICONS.faceTired,     display: 'tired' },
      { type: 'word', value: 'proud' },
      { type: 'word', value: 'nervous' },
      { type: 'word', value: 'grateful' },
      { type: 'word', value: 'bored' },
      { type: 'word', value: 'shy' },
      { type: 'word', value: 'brave' },
      { type: 'word', value: 'jealous' },
      { type: 'word', value: 'lonely' },
      { type: 'word', value: 'guilty' },
      { type: 'word', value: 'hopeful' },
      { type: 'word', value: 'curious' },
      { type: 'word', value: 'relieved' },
      { type: 'word', value: 'kind' },
      { type: 'word', value: 'cheerful' },
      { type: 'word', value: 'anxious' },
      { type: 'word', value: 'content' },
      { type: 'word', value: 'thrilled' },
      { type: 'word', value: 'scared' },
      { type: 'word', value: 'joyful' },
      { type: 'word', value: 'furious' },
      { type: 'word', value: 'silly' },
      { type: 'word', value: 'loving' },
      { type: 'word', value: 'upset' },
    ],
  };

  // ─── Weather ───────────────────────────────────────────────────────────
  const WEATHER = {
    id: 'weather',
    name: 'Weather',
    symbolsPerCard: 6,
    abbreviations: {
      'forecast': 'forecst',
    },
    symbols: [
      { type: 'image', value: ICONS.sun,         display: 'sun' },
      { type: 'image', value: ICONS.wxCloud,     display: 'cloud' },
      { type: 'image', value: ICONS.wxRain,      display: 'rain' },
      { type: 'image', value: ICONS.wxSnow,      display: 'snow' },
      { type: 'image', value: ICONS.wxLightning, display: 'lightning' },
      { type: 'image', value: ICONS.wxWind,      display: 'wind' },
      { type: 'image', value: ICONS.wxRainbow,   display: 'rainbow' },
      { type: 'image', value: ICONS.wxThermo,    display: 'thermometer' },
      { type: 'image', value: ICONS.wxUmbrella,  display: 'umbrella' },
      { type: 'word', value: 'sunny' },
      { type: 'word', value: 'cloudy' },
      { type: 'word', value: 'rainy' },
      { type: 'word', value: 'snowy' },
      { type: 'word', value: 'storm' },
      { type: 'word', value: 'breeze' },
      { type: 'word', value: 'hot' },
      { type: 'word', value: 'cold' },
      { type: 'word', value: 'warm' },
      { type: 'word', value: 'cool' },
      { type: 'word', value: 'dry' },
      { type: 'word', value: 'wet' },
      { type: 'word', value: 'fog' },
      { type: 'word', value: 'mist' },
      { type: 'word', value: 'dew' },
      { type: 'word', value: 'drizzle' },
      { type: 'word', value: 'humid' },
      { type: 'word', value: 'frost' },
      { type: 'word', value: 'mild' },
      { type: 'word', value: 'forecast' },
      { type: 'word', value: 'hail' },
      { type: 'word', value: 'tornado' },
    ],
  };

  // ─── Animals ───────────────────────────────────────────────────────────
  const ANIMALS = {
    id: 'animals',
    name: 'Animals',
    symbolsPerCard: 6,
    abbreviations: {},
    symbols: [
      { type: 'image', value: ICONS.aniDog,      display: 'dog' },
      { type: 'image', value: ICONS.aniCat,      display: 'cat' },
      { type: 'image', value: ICONS.aniFish,     display: 'fish' },
      { type: 'image', value: ICONS.aniBird,     display: 'bird' },
      { type: 'image', value: ICONS.aniElephant, display: 'elephant' },
      { type: 'image', value: ICONS.aniLion,     display: 'lion' },
      { type: 'image', value: ICONS.aniFrog,     display: 'frog' },
      { type: 'image', value: ICONS.aniSnake,    display: 'snake' },
      { type: 'image', value: ICONS.aniRabbit,   display: 'rabbit' },
      { type: 'image', value: ICONS.aniBee,      display: 'bee' },
      { type: 'word', value: 'cow' },
      { type: 'word', value: 'pig' },
      { type: 'word', value: 'sheep' },
      { type: 'word', value: 'horse' },
      { type: 'word', value: 'duck' },
      { type: 'word', value: 'goose' },
      { type: 'word', value: 'tiger' },
      { type: 'word', value: 'bear' },
      { type: 'word', value: 'wolf' },
      { type: 'word', value: 'fox' },
      { type: 'word', value: 'deer' },
      { type: 'word', value: 'mouse' },
      { type: 'word', value: 'owl' },
      { type: 'word', value: 'eagle' },
      { type: 'word', value: 'whale' },
      { type: 'word', value: 'shark' },
      { type: 'word', value: 'zebra' },
      { type: 'word', value: 'giraffe' },
      { type: 'word', value: 'panda' },
      { type: 'word', value: 'monkey' },
      { type: 'word', value: 'parrot' },
    ],
  };

  const PACKS = [
    IB_BIO_MOLECULES,
    GCSE_CHEMISTRY,
    SOLAR_SYSTEM,
    BODY_PARTS,
    ANIMALS,
    WEATHER,
    EMOTIONS,
    SPANISH_BASICS,
    FRENCH_BASICS,
    SHAPES_NUMBERS,
    KS1_READING,
    KS1_PHONICS,
    KS2_VOCAB,
    TIMES_TABLES,
    TIMES_TABLES_QA,
    ADDITION_QA,
  ];

  function get(id) {
    return PACKS.find((p) => p.id === id) || null;
  }

  function apply(pack, opts) {
    if (!pack) return { ok: false, reason: 'no pack' };
    const append = !!(opts && opts.append);
    const c = window.FindIt.content;
    const before = c.get().symbols.length;

    if (!append) {
      c.reset();
      c.setName(pack.name);
      c.setSymbolsPerCard(pack.symbolsPerCard);
    } else if (!c.get().setName) {
      // In append mode, adopt the pack's name only if the set is
      // unnamed so we don't overwrite the user's custom title.
      c.setName(pack.name);
    }

    for (const [term, short] of Object.entries(pack.abbreviations || {})) {
      c.setAbbreviation(term, short);
    }
    for (const s of pack.symbols) {
      if (s.type === 'image') c.addImage(s.value, { label: s.display });
      else if (s.type === 'pair') c.addPair(s.value, s.pairValue);
      else c.addWord(s.value);
    }

    const after = c.get().symbols.length;
    return { ok: true, loaded: pack.symbols.length, added: after - before, append };
  }

  window.FindIt = window.FindIt || {};
  window.FindIt.packs = { all: PACKS, get, apply, ICONS };
})();
