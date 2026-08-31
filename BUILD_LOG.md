# Build Log

## 2026-08-10 — Hero fan redesign
- Removed CursorImageTrail (ghost sticker scroll effect) from Hero.tsx and deleted the component + its CSS keyframes (unused after removal).
- Redesigned HeroFan.tsx: 7-card spread (was 5), radial glow + gold pivot point, gradient top accent, elevated center card with "Precision Built" badge, spring hover lift.
- Verified hero fits one screen at 1366x768 (heroH 688px vs 701px available below navbar) — no scroll needed for hero section.
- Source images confirmed at Untitled design (2)/*.png — already mirrored in public/products/, no new asset import needed.

## 2026-09-01 — Product catalogue expansion from IMAGES folder
- Reviewed all 78 files in `IMAGES-20260831T183334Z-1-001/IMAGES/` (real client
  photo dump). Classified real/distinct products vs. excluded service photos,
  training/workshop shots, duplicate probe-box renders, and all "ChatGPT
  Image *" AI concept art files.
- `bestsellerProducts` in `src/lib/content.ts` grew 10 → 24 entries: 4
  existing entries got a better replacement photo (welded-specimen-set,
  calibration-step-block-a, magnetic-yoke, tr-probe); 14 new products added
  (IIW Type 1 / V1 / V2 calibration blocks, stainless-clad step block,
  radius reference gauge set, COD wedge block, PM-50 permanent yoke, gauss
  meter, UV-A inspection lamp, PWHT thermocouple wire, miniature TR probe,
  single element probe, probe wedges & membranes, weld pie gauge).
- New photos copied into `public/products/*.png` (kebab-case filenames);
  raw source folder left untouched, nothing from it committed directly.
- Studio-background photos needed transparency to match the existing card
  style — built an edge-aware (Sobel + border flood-fill via
  scipy.ndimage.label) background-removal pipeline in Python/OpenCV to
  handle this batch's radial-vignette backgrounds, since the prior
  corner-flood-fill approach (see memory.md) doesn't handle a gradient bg.
  One image (Pie Gauge, textured leather background) was left on its
  natural background — no clean automatic cutout was achievable.
- `npm run build` passes cleanly (static export, all 10 routes, no
  TypeScript errors); confirmed all 24 image paths referenced in
  `content.ts` exist on disk; confirmed all 24 `/products` page image
  requests return 200 via a live dev-server check.
