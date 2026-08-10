# Build Log

## 2026-08-10 — Hero fan redesign
- Removed CursorImageTrail (ghost sticker scroll effect) from Hero.tsx and deleted the component + its CSS keyframes (unused after removal).
- Redesigned HeroFan.tsx: 7-card spread (was 5), radial glow + gold pivot point, gradient top accent, elevated center card with "Precision Built" badge, spring hover lift.
- Verified hero fits one screen at 1366x768 (heroH 688px vs 701px available below navbar) — no scroll needed for hero section.
- Source images confirmed at Untitled design (2)/*.png — already mirrored in public/products/, no new asset import needed.
