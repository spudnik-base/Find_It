# FIND IT — Claude Code Brief

> One match. Every pair. Any subject. Build it.

**Project:** FIND IT — a browser-based educational card game generator for teachers.
The mechanic: every pair of cards shares *exactly one* symbol. Teachers upload their own content (words, images) and get a print-ready PDF card set. No design skills needed. No server. No sign-up.

---

## Chapter 1: Stack & Constraints

- **Pure vanilla** — HTML + CSS + JS. No framework. No build step. Single `index.html` + asset files.
- **No server** — everything runs client-side. LocalStorage for persistence.
- **PDF export** — `window.print()` with `@media print` CSS. No jsPDF, no html2canvas, no dependencies.
- **Canvas rendering** — all card drawing via the Canvas 2D API.
- **Fonts** — Google Fonts: Bangers (headings), Nunito (body), Caveat (handwritten accents).

---

## Chapter 2: File Structure

```
find-it/
├── index.html          # Single entry point — teacher tool UI
├── style.css           # Global styles + print stylesheet
├── js/
│   ├── projective.js   # Dobble math — projective plane generator
│   ├── layout.js       # Card layout — SAT collision, circle packing
│   ├── renderer.js     # Canvas card drawing engine
│   ├── exporter.js     # PDF print layout + cut guides
│   ├── content.js      # Content manager — words, images, CSV
│   └── app.js          # UI wiring + state management
├── assets/
│   └── icon.svg
└── README.md
```

---

## Chapter 3: Core Algorithm — Projective Plane

> This is the heart of FIND IT. Get this right first.

Every valid set is built from a **finite projective plane of order n-1**, where n = symbols per card.

### Valid configurations

| Symbols per card | Order | Total cards | Total symbols |
|-----------------|-------|-------------|---------------|
| 4               | 3     | 13          | 13            |
| 6               | 5     | 31          | 31            |
| 8               | 7     | 57          | 57            |

The 31-card set is the sweet spot for a class — maps perfectly to a single topic with ~30 key terms.

### Generation algorithm (`projective.js`)

```js
// Returns array of cards, each card is an array of symbol indices.
// Every pair of cards shares exactly one symbol index. Guaranteed.
function generateProjectivePlane(order) {
  const n = order;
  const cards = [];

  // 1. "Infinity" cards — one per slope plus the vertical
  for (let slope = 0; slope < n; slope++) {
    const card = [n * n + slope];
    for (let x = 0; x < n; x++) {
      card.push(x * n + ((slope * x) % n));
    }
    cards.push(card);
  }

  // Vertical infinity card
  const vertCard = [n * n + n];
  for (let x = 0; x < n; x++) vertCard.push(x * n + (n - 1));
  cards.push(vertCard);

  // 2. Affine cards — one per (x, y) point
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const card = [];
      for (let slope = 0; slope < n; slope++) {
        card.push(x * n + ((y - slope * x + n * n) % n));
        card.push(n * n + slope);
      }
      const unique = [...new Set(card)].slice(0, n);
      cards.push(unique);
    }
  }

  return cards; // array of (n²+n+1) cards, each length n
}
```

### Symbol count handling

- **Too few symbols** → pad with placeholder blanks. Warn the teacher. Still generates.
- **Too many symbols** → take the first n²+n+1. Warn that extras are unused.
- Expose this mismatch clearly in the UI **before** generating.

---

## Chapter 4: Card Layout Engine (`layout.js`)

### Inputs

- `symbols[]` — array of symbol objects `{ type: 'word'|'image', value, displayLabel }`
- `cardRadius` — canvas radius in px (default: 640px canvas = 320px radius)
- `sizeVariance` — max ratio between smallest and largest symbol (1.0–3.0)
- `showDebug` — boolean, draws OBB outlines for testing

### Word display cap

Labels are capped at **8 characters** for display on cards. Full term stored internally.

```js
function capDisplay(word, max = 8) {
  return [...word].length <= max ? word : word.slice(0, max) + '.';
}
```

Provide an abbreviation map override so teachers can define `"amino acid" → "aa"`, `"haemoglobin" → "Hb"`, etc.

### Three-pass placement

**Pass 1 — Measure**

Set the canvas font, call `ctx.measureText(label)`, retrieve `actualBoundingBoxAscent` + `Descent`.
Store `{ hw, hh }` (half-width, half-height) per symbol. Include 8px padding each side.
For images: `hw = hh = imageSize / 2`.

**Pass 2 — Place (SAT collision)**

For each symbol (shuffled randomly), attempt up to 500 random positions inside the card circle.
At each candidate, run two checks:

1. **Circle boundary** — all 4 corners of the rotated OBB must satisfy:
   `(corner.x - cx)² + (corner.y - cy)² ≤ (R - BORDER)²`

2. **SAT overlap** — test against every already-placed OBB on 4 axes. If any axis has a separating gap → no collision → accept.

```js
function obbCorners({ cx, cy, hw, hh, rot }) {
  const cos = Math.cos(rot), sin = Math.sin(rot);
  return [
    [cx + cos*hw - sin*hh,  cy + sin*hw + cos*hh],
    [cx - cos*hw - sin*hh,  cy - sin*hw + cos*hh],
    [cx - cos*hw + sin*hh,  cy - sin*hw - cos*hh],
    [cx + cos*hw + sin*hh,  cy + sin*hw - cos*hh],
  ];
}

function obbOverlap(a, b, gap = 5) {
  const ca = obbCorners(a), cb = obbCorners(b);
  const axes = [
    [ Math.cos(a.rot),  Math.sin(a.rot)],
    [-Math.sin(a.rot),  Math.cos(a.rot)],
    [ Math.cos(b.rot),  Math.sin(b.rot)],
    [-Math.sin(b.rot),  Math.cos(b.rot)],
  ];
  for (const [ax, ay] of axes) {
    const pa = project(ca, ax, ay);
    const pb = project(cb, ax, ay);
    if (pa.max + gap < pb.min || pb.max + gap < pa.min) return false;
  }
  return true;
}
```

**Pass 3 — Draw**

Render background circle, then each symbol at its placed position.
Words: pill background + text. Images: scaled `HTMLImageElement`.
If Pass 2 failed to place a symbol, skip it silently and log a warning.

### Size assignment

```js
function randSize(baseMin, baseMax) {
  const t = Math.random();
  if (t < 0.35) return baseMin;
  if (t < 0.72) return baseMin + (baseMax - baseMin) * 0.45;
  return baseMax;
}
// baseMin = 16px (words) or 20px (images). baseMax = baseMin × sizeVariance.
```

---

## Chapter 5: Content Manager (`content.js`)

### Data model (stored in localStorage)

```js
// Key: 'findit-content-v1'
{
  setName: "IB Biology — Biological Molecules",
  symbolsPerCard: 6,
  sizeVariance: 2.0,
  abbreviations: {
    "amino acid": "aa",
    "haemoglobin": "Hb"
  },
  symbols: [
    { id: "sym_001", type: "word",  value: "mitosis",    display: null },
    { id: "sym_002", type: "word",  value: "amino acid", display: "aa" },
    { id: "sym_003", type: "image", value: "<dataURL>",  display: null }
  ]
}
```

### Input methods

1. **Text entry** — chip grid. Type to add, click × to remove.
2. **CSV import** — `FileReader` reads .csv. One term per line. Second column = optional abbreviation.
3. **Image drag-and-drop** — drop zone reads files as base64 dataURL, stored in symbol object.
4. **Paste** — detect comma-separated or newline-separated text pasted into the input field.

### Symbol count validation

Show a live counter: *"24 of 31 symbols needed (7 more to go)"*.
Block generation if count is below n. Warn if below n²+n+1.

---

## Chapter 6: Card Renderer (`renderer.js`)

### Canvas spec

- Internal resolution: **640×640px** (2× for retina)
- CSS display size: **220×220px**
- Background colours: rotate through 5 tints — cream, mint, lavender, blush, ice

### Image symbols

```js
async function drawImageSymbol(ctx, dataURL, x, y, size, rot) {
  const img = await loadImage(dataURL); // cache HTMLImageElement
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.drawImage(img, -size/2, -size/2, size, size);
  ctx.restore();
}
// Cache: Map<dataURL, HTMLImageElement>
```

### Match highlight

In *game preview mode* only — draw a gold halo behind the matching symbol.
This is **off** in print/export mode.

---

## Chapter 7: PDF Exporter (`exporter.js`)

### Layout

- Page: **A4 portrait** (210mm × 297mm)
- Cards per page: **9** (3×3 grid), each card 55mm diameter
- Margins: 15mm top/bottom, 12mm sides, 5mm gutter between cards

### Print stylesheet

```css
@media print {
  * { -webkit-print-color-adjust: exact !important; }
  .toolbar, .editor-panel { display: none !important; }
  body { background: white !important; }

  .print-grid {
    display: grid;
    grid-template-columns: repeat(3, 55mm);
    gap: 5mm;
    padding: 15mm 12mm;
  }

  .print-card-wrap {
    width: 55mm;
    height: 55mm;
    page-break-inside: avoid;
  }
}
```

### Export flow

1. Generate all cards (projective plane → assign symbols → layout each card)
2. Render each card to an offscreen canvas at 640px
3. Convert to dataURL via `canvas.toDataURL('image/png')`
4. Build a hidden `div.print-grid` with `<img>` tags
5. Call `window.print()`
6. Remove the hidden div after 2 seconds

---

## Chapter 8: UI Screens

### Screen 1 — Content Editor
- Subject name input
- Input type toggle: Words / Images / CSV
- Chip grid for current symbols
- Symbol count progress bar with target (e.g. 24/31)
- Live warning if count won't fill a valid set

### Screen 2 — Configure
- Symbols per card: segmented control 4 / 6 / 8
- Size variance slider (1.0 → 3.0, default 2.0)
- Card style: circle / rounded square
- Colour theme: classic / monochrome / subject colour
- Abbreviation editor (expandable panel)
- Stats: *31 cards · 31 symbols · 6 per card*

### Screen 3 — Preview
- 6-card preview grid (canvas elements, click to regenerate layout)
- Click two cards → highlights shared symbol
- Match verified: green badge. Mismatch: red badge (should never happen)

### Screen 4 — Export
- Print all (PDF)
- Print selected pages
- PNG sheet for digital use
- Share link (base64-encode symbol list into URL hash — no server needed)

---

## Chapter 9: LocalStorage Schema

```js
'findit-content-v1'   // current set (JSON — see Chapter 5)
'findit-settings-v1'  // UI prefs (symbolsPerCard, sizeVariance, theme)
'findit-history-v1'   // saved sets [{ name, date, symbolCount }]
```

Images stored as base64 can eat storage fast. Warn teacher at 80% capacity. Provide a "Clear old sets" option.

---

## Chapter 10: Edge Cases

| Situation | Behaviour |
|-----------|-----------|
| Fewer symbols than target | Pad with blanks. Show warning. Still generates. |
| Word over 8 chars | Auto-truncate display. Store original. Teacher can override via abbreviation map. |
| Symbol fails to place (500 attempts) | Skip it. Log to console. Show dropped count in UI. |
| Image load fails | Show placeholder ⬜ symbol. |
| localStorage full | Toast warning. Offer to clear history. |
| Printing with images | Ensure all images fully loaded before `window.print()` fires. |
| n=2 edge case | Not a valid projective plane. Disable with explanation. |

---

## Chapter 11: Stretch Goals (post-MVP)

1. Pre-made subject packs — IB Biology topics, GCSE Chemistry, KS2 Numeracy (bundled JSON imports)
2. Abbreviation suggestions — call Claude API to auto-suggest short forms for a given symbol list
3. In-browser multiplayer — teacher shares URL, students play on phones
4. QR codes on printed cards — links to a definition or hint page
5. Accessibility mode — high contrast, dyslexia-friendly font, larger minimum symbol size
6. Landing page — manga-themed marketing site at findit.study
