# Vardann Tech and Engg LLP — Project Memory

## What this is
Marketing website for Vardann Tech and Engg LLP (NDT / inspection / metallography /
precision manufacturing, est. 2019, formerly Advanced NDT Services LLP). Separate
project from the `leisure` speaker-brand repo — unrelated business, same machine.

## Source of truth for copy
`C:\Users\Lenovo\Downloads\Company Brouchure.pdf` (also copied into this folder).
All service/product/vision/mission text in `src/lib/content.ts` is sourced from it.
Category cards without a specific product (Services, Capabilities) still use
inline SVG line-art icons (`src/components/ui/TechIcon.tsx`) — no photos exist
for those. Actual products DO have real photos, see below.

## Product photography
User supplied 10 real product photos in `Untitled design (2)/1.png..10.png`
(project root, pristine originals — never overwritten) — copied into
`public/products/` under descriptive filenames, identified by visual
inspection (no product-name metadata came with them): welded-specimen-set,
ect-rft-probes, calibration-step-block-a/b, magnetic-yoke, tr-probe,
normal-beam-probe, transducer-cable, weld-scanner (has the real Vardann
logo printed on it), cleaning-bulb. Wired into `bestsellerProducts` in
`content.ts` (each entry has an `image` field), rendered via `next/image`
in `BestsellersCarousel.tsx` and `products/page.tsx` inside an
`aspect-square` box with `object-contain p-6` directly on the graphite
card — no light tile/background box behind them (that read as unwanted
"white space" to the user; don't reintroduce one).

**Background removal — two-pass, not a simple threshold.** The originals
are opaque white studio photos. A single border-seeded flood-fill (Pillow
`ImageDraw.floodfill`, seeded from corners/edge-midpoints) only clears
background *connected to the image edge*; it misses large white regions
fully enclosed by the product (e.g. the gap inside the magnetic yoke's
cable loop) or cut off from the seed points by a soft drop-shadow gradient.
The working pipeline is:
1. Border flood-fill (thresh=26) from ~12 seed points around the edges.
2. `scipy.ndimage.label` on the remaining near-white opaque pixels; any
   connected component over ~1200px is background that pass 1 missed —
   clear it too. Components under that size are left alone (label
   backgrounds like weld-scanner's white-backed "VARDANN TECH" text,
   engraved numbers, etc. — real product detail, not background).
3. Feather the alpha channel (~1.4px Gaussian blur) to soften the cut edge.
4. Auto-crop to the content bounding box (+6% padding) for a tight frame.
Re-run this full pipeline from the *pristine originals* if new photos need
processing — don't reprocess the already-cropped `public/products/` files,
data is lost each pass. Verify by compositing onto a dark background AND by
a live cache-busted (`?v=timestamp`) pixel read through the actual dev
server before trusting it fixed — Next.js's `.next/cache/images` (plus the
browser) will happily keep serving stale pre-removal bytes otherwise; clear
`.next/cache/images` after reprocessing.

## Cursor image trail
`src/components/ui/CursorImageTrail.tsx` — click-through sticker-trail
overlay (mounted in `Hero.tsx`, scoped to that section). Tracks via a
`window` mousemove listener rather than listening on the overlay itself,
since the overlay must stay `pointer-events-none` for real click-through.
Spawns are gated by cursor travel distance (`spacing` prop), not raw event
count. Uses the 10 product images cycled in order.

There is no more hero orbit ring — `HeroOrbitCarousel.tsx` was built, then
explicitly removed at the user's request ("remove this circle thing").
Don't re-add a circular product-thumbnail ring to the hero without being
asked again.

## Brand system
**Current (as of the third design pass): light theme, blue/navy/gold — from
the actual logo.** History matters here because the palette has flipped
twice; don't resurrect an earlier one without the user asking again:
1. Original build: dark obsidian bg + blue/gold accents.
2. User said that "looks like AI" → replaced with dark monochrome grey,
   no color at all.
3. **Current**: user supplied an exact brand table derived from the logo
   (engineering blue + lion gold + deep navy on a light ground) and asked
   for it literally, with a specific per-element hierarchy. This is now
   a **light** theme, not dark.

Tokens (`src/app/globals.css` `@theme`): `--color-navy: #283848` (headings,
navbar/footer bg, primary body text default), `--color-vblue: #0050A0`
(primary buttons/links/borders), `--color-vblue-hover: #003F80` (primary
button hover — darker), `--color-vblue-bright: #0058A0` (other hover/
highlight accents — brighter), `--color-gold: #F8C028` (sparing accent only
— eyebrows, active nav state, numbers; client was explicit: keep it to
~5-10% of the interface, don't overuse), `--color-offwhite: #F8F8F8` (main
section bg), `--color-lightblue: #E0F0F8` (alternating section bg + hover
tints), `--color-body: #4A5560` (body copy), `--color-steel: #7A8A9A`
(tertiary/spec text). `--foreground` defaults to navy now (not white) —
`text-foreground` on a light section is correct; don't assume it's light
text like in the old dark-theme code.

Layout convention: Navbar and Footer are **solid navy with white text**
regardless of the rest of the page being light (`bg-navy`, explicit
`text-white`/`text-white/60` in `Logo.tsx`/`Navbar.tsx`/`Footer.tsx` — they
don't rely on the global `text-foreground` default since that's navy-on-light
now, wrong for a navy bg). General sections alternate `bg-offwhite`/
`bg-lightblue` for rhythm; cards are always `bg-white`. Primary buttons:
`bg-vblue text-white hover:bg-vblue-hover`. Secondary buttons: `bg-white
border-vblue text-vblue hover:bg-lightblue`. The CTA banner
(`CtaSection.tsx`) uses the client's suggested premium gradient
`linear-gradient(135deg,#283848,#0050A0)` with white text and an
inverted white/blue button.
- Fonts: Manrope (body/heading), IBM Plex Mono (eyebrow/technical labels) — unchanged across all three palette passes.
- No light/dark toggle — `layout.tsx` no longer forces a `dark` class (removed when the theme went light); `color-scheme: light` in globals.css.
- Logo is a text lockup (`src/components/layout/Logo.tsx`) — no source logo SVG was supplied, only a raster mark inside the brochure PDF.

## Services section — scroll-driven list + content pane
This went through two designs before landing. (1) User rejected a pill-nav
+ card-grid layout as not premium enough and specced an editorial
scroll-jacked stacked-card deck. (2) That deck had two real bugs on first
look — the active card's number was clipped by the sticky navbar, and the
per-service SVG pattern rendered as a dominant graph-paper texture instead
of a subtle accent — so the user rejected it too and pointed at a
step-list-plus-content-pane reference. **Current** design:
`src/components/sections/ServiceDeck.tsx` (rendered by the one-line
`Services.tsx`) + `src/components/ui/ServicePattern.tsx` (six small 120x120
corner motifs, one per service, ~30% opacity accent — not a full-bleed
texture). Layout is two columns: left is a static list of all 6 services
(always visible, active row gets a white pill + gold dot), right is a
single navy content pane that crossfades per active service. The section
is `420vh` (`6 × 70vh`) tall with a `sticky top-20 h-[calc(100vh-5rem)]`
inner stage — deliberately offset from `top-0` so it pins *below* the
sticky navbar instead of underneath it (that offset is the fix for bug #1
above; don't change it back to `top-0`/`h-screen` without re-checking for
navbar overlap). Scroll position is the source of truth for which service
is active; click optimistically updates state then smooth-scrolls to that
service's band. Don't revert this to a grid, pills, or a stacked-card deck
without being asked again — both of those were explicitly rejected.

**Debugging notes for this environment (both from building this section):**
- Don't gate a scroll/resize handler behind a `requestAnimationFrame`
  "ticking" ref-lock. In this sandboxed session's backgrounded browser
  pane, rAF is suppressed almost entirely — the first scroll event sets the
  lock and its rAF callback may never fire to release it, permanently
  freezing the handler after one tick. Call cheap update logic directly
  from the event instead; a `prev === next` check in `setState` already
  bails out redundant re-renders.
- Don't use Framer Motion's `<AnimatePresence mode="wait">` for content
  that must update reliably (like this pane) — it defers mounting the new
  child until the old child's exit-animation *completion callback* fires,
  which is itself rAF-scheduled. Same suppression as above froze the deck
  on the first card forever, even though the React state updated correctly
  underneath. Use the default mode (`initial={false}`, no `mode` prop) so
  the new child mounts immediately on key change and simply paints over
  the old one — correct regardless of whether the exit animation ever
  completes. This isn't just a sandbox workaround: a genuinely backgrounded
  real tab throttles rAF too, just less severely, so `mode="wait"` was a
  real latent fragility, not only a test artifact.
- `window.scrollTo()` in this harness does not dispatch a native `scroll`
  event at all (confirmed: a bare listener saw zero calls despite
  `window.scrollY` updating). To test scroll-driven UI here, dispatch
  `window.dispatchEvent(new Event('scroll'))` manually right after
  `scrollTo()`, or use the `computer` tool's real scroll action instead of JS.
- When DOM-querying to verify a fix, prefer checking plain DOM properties
  (`.textContent`, `.className`) over `getComputedStyle()` — computed style
  (and CSS transitions specifically) can read back stale/frozen values in
  this backgrounded pane even when the underlying React state and rendered
  className are already correct. Confirmed via a direct `useEffect` that
  mirrored state onto `window` — state was right while `getComputedStyle`
  based checks kept reporting the old value.

## Global Presence / globe
`src/components/sections/GlobalPresence.tsx` + `src/components/ui/cobe-globe-cdn.tsx`.
Just the globe — no region legend, no marker/city text labels, centered as
the sole visual focus (`max-w-xl`, centered). Styled in cobe's **dark**
mode (`dark: 1`, navy `baseColor` [0.157,0.219,0.282], blue `glowColor`) —
flipped from light-mode back to dark when the site palette itself went
light, for contrast against the now-light section background (a light globe
on a light page had no contrast). If the page bg ever goes dark again,
flip the globe back to light mode. It auto-rotates continuously AND picks
up extra rotation from page scroll (a passive `scroll` listener accumulates
into a ref added to `phi` every frame) on top of drag-to-spin. Now `max-w-md`
(~448px, up from 280px) per the user's "globe should be a little big" ask —
re-check it still fits the section's `min-h-[calc(100vh-5rem)]` one-screen
constraint if resized again.

**Markers/arcs are a custom 2D overlay, not cobe's native `markers`/`arcs`
option** — see `project()` in `cobe-globe-cdn.tsx`. cobe@2.0.1's own
marker/arc instancing silently fails to draw anything (no crash, no full
canvas break like earlier — the base sphere still renders — but zero gold
pixels found across a full-canvas scan with valid marker data reaching
`createGlobe`, confirmed via `gl.readPixels`) on the ANGLE/Direct3D11 GL
backend, the default Chrome-on-Windows backend, so re-test before trusting
cobe's native path again. The overlay instead projects each marker's
lat/lon onto the sphere using the *same* `phi`/`theta` the animation loop
already computes (standard spherical-to-screen projection with front/back
culling), then positions absolutely-positioned `<span>` dots and SVG
`<path>` arcs to match — updated imperatively via refs inside the existing
`animate()` rAF loop, not through React state (avoids a 60fps re-render).
The flowing-dash motion on the arcs (`arc-flow` keyframe in `globals.css`)
is deliberately plain CSS `stroke-dashoffset` animation, not JS-driven —
runs on the browser's own animation timeline so it keeps moving smoothly
regardless of rAF health. Region data (India hub + 3 spokes) lives inline
in `GlobalPresence.tsx`, not `content.ts`.

Alignment of the overlay against cobe's own dot-map texture could not be
pixel-verified in this session (no working screenshot tool this session) —
only checked that projected coordinates land within canvas bounds and
cluster sensibly (India/Middle East/Africa/Asia-Pacific projecting close
together, front/back culling consistent between markers and their arcs).
If a user reports the dots looking off-globe or misplaced relative to the
actual landmass, that's the first thing to re-verify with a real screenshot.

### Known library issue — cobe markers/arcs
`cobe@2.0.1` (latest on npm) doesn't draw its own `markers`/`arcs` option
correctly on the ANGLE/Direct3D11 GL backend (see above) — that's why the
custom overlay exists. Re-test cobe's native path if a newer version ships.

Also: this cobe version's `createGlobe` does **not** support an `onRender`
callback (despite the npm README showing one) — grepped `dist/index.esm.js`,
no match. Must drive animation via `globe.update({phi, theta})` inside your own
`requestAnimationFrame` loop.

### CSS overflow-x/overflow-y coupling
Setting only `overflow-x: auto` on an element forces the browser to also
compute `overflow-y` as `auto` (CSS Overflow Module — one axis can't stay
`visible` while the other scrolls). Bit us in `BestsellersCarousel.tsx`:
the horizontally-scrolling track was silently clipping each card's
`hover:-translate-y-1 hover:shadow-xl`. Fix pattern: pad the scroll track
itself, and if a card needs a decorative element that must NOT be clipped
(e.g. a highlight-blob glow), put that element in a non-clipping outer
wrapper around the actual `overflow-hidden` visual card, not inside it.

### Don't add "definition" chrome speculatively
Added a soft box-shadow ring behind the light-mode globe on the theory
that a light globe needs an edge cue against a light page — user flagged
it immediately as an unwanted extra circle. Lesson: a light sphere with
its own shadow/glow is usually enough definition on its own; don't add
a second concentric shape "just in case" without checking a render first.

## Structure
- `src/lib/content.ts` — all copy/data (services, products, capabilities).
- `src/components/sections/*` — one file per homepage section.
- `src/components/ui/*` — shadcn primitives + TechIcon + SectionHeading/PageHeader +
  GlobeCdn + CursorImageTrail.
- Pages: `/`, `/about`, `/services`, `/products`, `/contact` — all verified render
  correctly and `npm run build` passes cleanly (static export, 6 routes).
