# FIND IT

> One match. Every pair. Any subject. Build it.

Browser-based Dobble-style card generator for teachers. Upload your own words or images; FIND IT produces a print-ready card deck where every pair of cards shares exactly one symbol.

Pure vanilla HTML/CSS/JS. No framework, no build step, no server.

## Run it

```
open index.html
```

Or serve the repo root from any static HTTP server.

## Usage

1. **Content** — enter a subject name, then add words (Enter or comma to separate), paste a CSV, or drop in images.
2. **Configure** — pick 4, 6, or 8 symbols per card; set size variance; choose circle or rounded-square cards.
3. **Preview** — six sample cards render in a grid. Click any two to highlight the shared symbol; a green `MATCH ✓` badge confirms correctness.
4. **Export** — print-to-PDF (9 cards per A4, faint cut guides), download a PNG sheet, or copy a share link.

## How the math works

Every valid FIND IT set is a finite projective plane of order `q`, where `q` is prime and each card holds `q + 1` symbols. For `q = 5` (6 per card), the plane has 31 points (symbols) and 31 lines (cards); any two lines meet in exactly one point, guaranteeing every pair of cards shares exactly one symbol.

Valid shapes shipped: `q = 3` (13 cards × 4 symbols), `q = 5` (31 × 6), `q = 7` (57 × 8).

## Edge cases

- **Too few symbols** — blank placeholders pad the set; a yellow bar on Preview lists how many are missing.
- **Too many symbols** — extras are ignored; the bar lists which ones.
- **Long labels** — auto-truncated to 8 chars (`"amino acid" → "amino ac."`). Override in the Abbreviations panel.
- **Image load failure** — renders a `?` placeholder.
- **Browser storage full** — a toast warns at 80% of a ~5 MB cap. Use the toolbar reset button to clear state.

## Structure

- `index.html` — entry point
- `style.css` — global + print stylesheet
- `js/projective.js` — projective-plane generator (math core)
- `js/content.js` — data model, CRUD, localStorage, CSV, images
- `js/layout.js` — OBB + SAT circle packing
- `js/renderer.js` — Canvas 2D card drawing
- `js/deck.js` — maps content symbols onto plane indices
- `js/exporter.js` — `window.print()` pipeline, PNG sheet, share links
- `js/packs.js` — starter content packs (IB Biology)
- `js/app.js` — UI wiring
- `docs/find_it_brief.md` — the full build brief
- `docs/find_it.html` — standalone brief viewer

## LocalStorage keys

- `findit-content-v1` — current set (name, symbols, abbreviations, config)
- `findit-settings-v1` — UI preferences (card shape)

Run `FindIt.selfTest()` in the browser console to verify the projective-plane generator for orders 3, 5, 7.
