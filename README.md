# FIND IT

> One match. Every pair. Any subject. Build it.

Browser-based Dobble-style card generator for teachers. Upload your own words or images; FIND IT produces a print-ready card deck where every pair of cards shares exactly one symbol.

Pure vanilla HTML/CSS/JS. No framework, no build step, no server.

## Run it

```
open src/index.html
```

Or serve the `src/` folder from any static HTTP server.

## Structure

- `src/index.html` — entry point
- `src/style.css` — global styles + print stylesheet
- `src/js/projective.js` — projective-plane generator (the math core)
- `src/js/content.js` — content manager (words, images, CSV)
- `src/js/layout.js` — SAT/OBB collision and circle packing
- `src/js/renderer.js` — Canvas 2D card renderer
- `src/js/exporter.js` — `window.print()` pipeline for PDF export
- `src/js/app.js` — UI wiring and state management
- `docs/find_it_brief.md` — full build brief
- `docs/find_it.html` — standalone brief viewer

## How the math works

Every valid FIND IT set is a finite projective plane of order `n-1`, where `n` is the number of symbols per card. For order 5 (`n = 6`), the plane has 31 points (symbols) and 31 lines (cards); any two lines meet in exactly one point, guaranteeing every pair of cards shares exactly one symbol.

## Build status

Built incrementally in six phases. See `docs/find_it_brief.md` for the full spec.
