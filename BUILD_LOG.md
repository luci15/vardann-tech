# Build Log

## 2026-08-09 — Initial site build

**Scope:** Full marketing site from scratch (Next.js 16 + TS + Tailwind v4 +
shadcn), homepage with Hero/Services/Global Presence/Products/Why Vardann/CTA,
plus About/Services/Products/Contact pages, nav + footer. Plan approved before
build; brand palette and copy sourced from the company brochure PDF.

**Built:**
- Scaffolded project in `VARDANN TECH/` (create-next-app → moved from a
  temp dir since npm rejected the folder name for `package.json`).
- shadcn init (Radix base, Nova preset) + `cobe`, `framer-motion`, `clsx`.
- Brand palette/fonts wired into `globals.css` (Manrope + IBM Plex Mono,
  obsidian/graphite/blue/gold tokens).
- `content.ts` — typed data for services, products, capabilities, regions,
  all sourced from the brochure.
- Navbar/Footer, Hero + half-circle orbiting product ring
  (`HeroOrbitCarousel.tsx`, pure CSS spin + counter-spin, no JS per-frame cost),
  Services auto-rolling stacked cards (`ServiceStackCards.tsx`), Global Presence
  with cobe globe + region legend, Products (Bestsellers carousel +
  Capabilities stacked-card showcase with promote-to-front interaction),
  Why Vardann, CTA.
- About / Services / Products / Contact pages (Contact has a client-validated
  form, no backend — none requested).

**Bug found + fixed during verification:**
cobe@2.0.1's `markers`/`arcs` broke the entire globe draw call on this
machine's ANGLE/Direct3D11 WebGL backend (confirmed via `gl.readPixels` —
canvas was fully transparent with markers present, rendered correctly without
them). Also found the library doesn't support the `onRender` callback shown
in its own README (confirmed by grepping the shipped JS — no match); switched
to a manual `requestAnimationFrame` + `globe.update()` loop instead, and
dropped markers/arcs from the globe in favor of legend cards.

**Verified:**
- All 5 routes render correct content (checked via DOM text extraction).
- Contact form: empty-submit shows validation errors, valid submit shows
  success state — both confirmed via DOM inspection.
- Mobile nav menu opens and lists all links at 375px width.
- `npm run build` passes clean (TypeScript + static generation, 6 routes).
- Globe re-render animation confirmed running (rAF ticking) — visual
  screenshot could not be captured because the browser preview pane was not
  in the foreground this session; pixel-level readback was used instead as
  proof of correct rendering.

**Not done / left for follow-up:**
- No source logo SVG — navbar/footer use a text lockup, not the raster mark
  from the brochure. Swap in a real logo file if the user provides one.
- Contact form has no backend/email wiring (client-side validation only).

## 2026-08-09 — Real product photos + palette overhaul

**Trigger:** User supplied 10 real product photos (`Untitled design (2)/1.png`
...`10.png`) and said the site "looks like AI" — asked for a grey/dark,
minimal palette instead of the blue/gold scheme.

**Built:**
- Identified each of the 10 photos by visual inspection (welded specimen set,
  ECT/RFT probes, 2 calibration step-wedge blocks, magnetic particle yoke,
  TR probe, normal beam probe, transducer cable, Vardann-branded weld
  scanner, coupling/cleaning bulb) and copied them into `public/products/`
  with descriptive filenames.
- Replaced the 5 icon-only `bestsellerProducts` entries in `content.ts` with
  10 real entries, each carrying an `image` path. Descriptions were written
  from what's visible in the photo, not fabricated specs.
- `BestsellersCarousel.tsx`, `products/page.tsx`, and `HeroOrbitCarousel.tsx`
  now render `next/image` photos on a light neutral tile (`#e4e4e7`) instead
  of `TechIcon` — the photos have white/light backgrounds, so a plain dark
  card would show a harsh white rectangle; the light tile makes it read as
  deliberate framing instead.
- Palette overhaul: dropped Vardann Blue (`#0057A4`) and Vardann Gold
  (`#FFC727`) entirely. New tokens in `globals.css` are all neutral greys —
  `--color-vblue: #6e6e76` (structural/borders), `--color-vgold: #d6d6da`
  (the one "bright" accent, replaces gold), obsidian `#0b0b0c` / graphite
  `#17171a`. Primary CTA buttons (Hero, CtaSection, ContactForm) changed from
  a blue-filled button to `bg-foreground`/`text-obsidian` (light pill, dark
  text) instead of repointing the `vblue` token to white, so borders/icons
  that also use `vblue` stay a muted grey rather than blowing out to white.
  All hardcoded decorative `rgba(0,87,164,...)`/`rgba(255,199,39,...)`
  gradients (Hero, CtaSection, PageHeader, CapabilitiesShowcase,
  ServiceStackCards) replaced with neutral white-tinted low-opacity versions.
  Removed the now-unused `scan-line` keyframe and its blue hover animation
  from `BestsellersCarousel` — cut for minimalism, not just recolored.
  cobe globe `baseColor`/`markerColor`/`glowColor` also converted to
  neutral greys (though markers/arcs remain disabled, see prior entry).

**Verified:**
- `npm run build` passes clean after both changes.
- Computed styles confirm the CTA button renders `rgb(241,241,242)` bg /
  `rgb(11,11,12)` text (light pill, dark text) as intended.
- All 10 real products render with correct copy on `/products`.
- Image files confirmed loading correctly (`new Image()` load test hit
  1587×2245 successfully) — the on-page `<img>` elements read
  `complete:false` in this session only because the browser preview pane
  was backgrounded, which suppresses native lazy-loading same as it
  throttled the globe's rAF loop earlier; not a site bug.

## 2026-08-09 — Background removal, full-width product images, cursor sticker trail

**Trigger:** User pointed at the hero orbit chips (light circle behind each
product thumbnail) and said "remove this and add images... no extra white
space to be seen" — the source photos have opaque white studio backgrounds,
so the light tile I'd used to frame them was still showing as an unwanted
box. Also asked for a Framer-style cursor-trailing image-sticker effect,
pasting that listing's full feature description as the spec.

**Built:**
- `public/products/*.png` backgrounds removed in place via a Python/Pillow
  flood-fill script (seeded from all 4 corners + edge midpoints, threshold
  26, then a 1.4px Gaussian blur on the alpha channel to soften the cut
  edge) — not a global brightness threshold, which would've eaten into
  the products' own light/metallic surfaces. Verified via composited
  previews against a dark background before touching any component code;
  interior background gaps (e.g. between the magnetic yoke's two poles)
  correctly came out transparent too since they're topologically connected
  to the outer background.
- `BestsellersCarousel.tsx`, `products/page.tsx`: dropped the `bg-[#e4e4e7]`
  light tile, image now sits directly on the card in a full-width
  `aspect-[4/5]` box (no padding) so the transparent PNG blends straight
  into the graphite card with no boxed-in look.
- `HeroOrbitCarousel.tsx`: same background removal for the small orbit
  thumbnails, just dropped the light circle backing.
- New `components/ui/CursorImageTrail.tsx`: click-through sticker trail.
  Tracks mouse via a `window` `mousemove` listener (not on the overlay
  itself, since the overlay is `pointer-events-none` for true click-through)
  and gates spawning on distance-from-last-spawn (`spacing` prop) rather
  than raw event frequency, so trail density doesn't depend on how fast
  Next.js/the browser fires mousemove. Each sticker gets a random
  size/rotation, animates in/out via a `sticker-fade` keyframe (added to
  `globals.css`) driven by a `--sticker-rotation` CSS var (can't mix
  animated and inline `transform` on the same property otherwise), and
  self-removes via `setTimeout` after `fadeDuration`. Cycles through the
  10 product images in order. Mounted inside `Hero.tsx`, scoped to that
  section only (checks the pointer position against the overlay's own
  bounding rect on every window-level move).

**Verified:**
- Composited image previews (background removal) inspected directly before
  wiring into components — clean cutouts, no bites into product surfaces.
- Cursor trail: dispatched synthetic `mousemove` events across the hero at
  40px steps and confirmed a sticker `<img>` actually appears in the DOM
  with the expected src, position, randomized size/rotation, and the
  `sticker-fade` animation attached — not just that no errors were thrown.
- `npm run build` clean after both changes.

## 2026-08-09 — White boxes still showing, globe redesign, hero cleanup

**Trigger:** User screenshotted the products grid still showing solid white
boxes behind 3 products (despite the prior fix), the Global Presence globe
rendering as a broken white square with a region-name legend beside it, and
the hero's circular product-thumbnail ring — asked for the white gone and
products centered/focused, a `cobe.vercel.app`-style light dotted globe with
no text at all (no legend, no marker labels), centered as the section's sole
focus, auto-rotating and *also* responsive to page scroll, and the "circle
thing" (hero orbit ring) removed entirely.

**Root-caused the white boxes — two separate bugs, not one:**
1. **Caching, not data.** `calibration-step-block-a/b`'s on-disk files were
   already correctly transparent (re-verified in Python) — the white the
   user saw was Next.js's `.next/cache/images` optimizer cache (and/or the
   browser) still serving pre-removal bytes for those URLs. Cleared the
   cache directory; confirmed via a cache-busted `?v=timestamp` fetch +
   canvas pixel read that the served bytes are actually transparent now.
2. **Real gap in the removal algorithm, for `magnetic-yoke.png` (and to a
   lesser extent `tr-probe`/`transducer-cable`/`ect-rft-probes`).** The
   original border-seeded flood-fill only clears background *connected to
   the image edge*; a large white region fully enclosed by the product (the
   gap inside the yoke's cable loop) — or one merely cut off from the seed
   points by a soft drop-shadow gradient acting as a color-tolerance
   barrier — never got reached. Diagnosed by running `scipy.ndimage.label`
   on the remaining near-white pixels post-flood-fill and printing
   connected-component sizes per file: every affected file had one
   dominant component tens of thousands of pixels larger than the next
   (e.g. magnetic-yoke: 409,087 vs runner-up 849) — a clean, obvious cutoff
   from small legitimate white bits like label backgrounds and engraved
   text (all under ~1,300px). Reprocessed all 10 images from the pristine
   originals in `Untitled design (2)/`: border flood-fill, then remove any
   remaining near-white connected component over 1,200px (via
   `scipy.ndimage.label` + `ndimage.sum`), then feather + auto-crop to
   content bbox as before. Re-verified every previously-broken file by
   compositing onto a dark background and by live cache-busted pixel reads
   through the actual dev server — all clean now, and the weld-scanner's
   white-backed "VARDANN TECH" label (a legitimate small white area)
   survived intact since it's well under the size threshold.
2. **Products grid/carousel**: switched the image box from `aspect-[4/5]`
   to `aspect-square` with `object-contain p-6` — the auto-cropped photos
   now vary a lot in aspect ratio (from 2.1:1 landscape to 0.57:1 portrait),
   and square reads better across that mix than a fixed portrait box.

**Global Presence rewritten** (`GlobalPresence.tsx`, `cobe-globe-cdn.tsx`):
- Removed the region legend cards and the two-column layout entirely — the
  globe is now the section's only visual content, centered, up to
  `max-w-xl`.
- Switched the globe from the dark-grey config to cobe's classic light
  mode (`dark: 0`, `baseColor: [0.94,0.94,0.95]`, `glowColor: [1,1,1]`,
  `mapBrightness: 6`) to match the reference screenshot's white dotted-map
  look — confirmed via `gl.readPixels` returning nea-white values
  post-change (was dark grey before).
- Added scroll-linked rotation: a passive `scroll` listener accumulates
  `(scrollDelta * scrollSensitivity)` into a ref that's added to `phi`
  every animation frame, on top of the existing continuous auto-spin and
  drag-to-rotate — so it keeps spinning on its own AND turns further as
  the page scrolls.
- Deleted the unused `regions`/`Region` export from `content.ts` (nothing
  else referenced it once the legend cards were gone) and the two now-dead
  `orbit-spin`/`orbit-spin-reverse` keyframes from `globals.css`.

**Hero cleanup:** deleted `HeroOrbitCarousel.tsx` and its usage in
`Hero.tsx` per the user's explicit "remove this circle thing" — the ring of
small circular product-thumbnail chips is gone. Bumped the section's bottom
padding to keep it visually balanced without that block.

**Verified:** `npm run build` clean; all previously-white product images
confirmed transparent via live pixel reads through the dev server (not just
on disk); Global Presence page text confirmed no region names/legend
remain; Hero page text confirmed no orbit-chip labels remain.

## 2026-08-09 — Full palette pivot: dark monochrome → light blue/navy/gold

**Trigger:** User supplied an explicit brand color table derived from the
Vardann logo (engineering blue `#0050A0`, lion gold `#F8C028`, deep navy
`#283848`, off-white/light-blue backgrounds) with a full per-element
hierarchy (navbar, hero, buttons, headings, cards, footer, even suggested
gradients), and asked for it applied literally. This supersedes the
previous request for dark monochrome minimalism — the user is explicitly
asking for color again, with a very specific spec, not a partial tweak.

**Built:** Rewrote every color token in `globals.css` (`--color-navy`,
`--color-vblue` / `-hover` / `-bright`, `--color-gold`, `--color-offwhite`,
`--color-lightblue`, `--color-body`, `--color-steel`) and the shadcn
semantic tokens (`--background`, `--foreground`, etc.) for a light theme —
removed `color-scheme: dark` and the forced `dark` class on `<html>` in
`layout.tsx`. Went through every component and page (`Navbar`, `Footer`,
`Logo`, `Hero`, `Services`, `ServiceStackCards`, `GlobalPresence` +
`cobe-globe-cdn.tsx`, `Products`, `BestsellersCarousel`,
`CapabilitiesShowcase`, `WhyVardann`, `CtaSection`, `ContactForm`,
`PageHeader`, `SectionHeading`, and the About/Services/Products/Contact
pages) rewriting every background/text/border class to match the spec's
hierarchy — this was a full rewrite pass, not a token repoint, because the
light/dark flip breaks assumptions baked into specific classes
(`border-white/10` meant "faint border on dark bg", invisible on light;
`bg-foreground text-obsidian` buttons assumed foreground was light text on
a dark page). Specific decisions:
- Navbar/Footer/Logo: solid navy (`bg-navy`) with explicit white text
  (`text-white`, not `text-foreground`, since foreground is navy-on-light
  now and these two components are the one place that stays dark).
- Primary button: `bg-vblue text-white hover:bg-vblue-hover` (darker on
  hover, per spec). Secondary button: `bg-white border-vblue text-vblue
  hover:bg-lightblue`.
- Sections alternate `bg-offwhite`/`bg-lightblue` for rhythm; cards are
  always `bg-white`.
- CTA banner uses the client's own suggested "premium" gradient
  `linear-gradient(135deg,#283848,#0050A0)` with white text and an inverted
  white/blue button — the one section that intentionally breaks the
  light-page pattern for impact.
- Gold is used only for eyebrows, active nav state, numbers, and the
  success-state check icon — never a large fill, per the client's explicit
  "keep gold to 5-10%, don't overuse it" instruction.
- Form validation error text switched from gold to `text-red-600` — gold is
  the brand's positive-highlight color, not a semantically appropriate
  error color.
- Globe flipped from light mode back to **dark** mode (navy `baseColor`,
  blue `glowColor`) since the page background is light now — a light globe
  on a light page had no contrast. If the page goes dark again, flip it
  back to light mode.

**Verified:** `npm run build` clean. Computed-style checks through the live
dev server confirmed exact hex matches: primary button
`rgb(0,80,160)`/white text, secondary button white bg/`rgb(0,80,160)`
border+text, CTA section `background-image: linear-gradient(135deg,
rgb(40,56,72), rgb(0,80,160))` with white heading text, navbar
`lab(22.65...)` ≈ navy, footer `rgb(40,56,72)`. Globe center pixel read
back as dark navy (was near-white before this pass). Full page-text dump
confirmed no content was lost across the rewrite. No console errors on
any of home/about/services/products/contact.

## 2026-08-09 — Services section rebuilt as a scroll-driven card deck

**Trigger:** User rejected the pill-nav + card-grid Services section outright
("does NOT work visually... Do NOT create a normal card grid") and gave a
very detailed spec for an editorial scroll-jacked deck of 6 physical-feeling
service cards, referencing a scroll-driven portfolio site as interaction
inspiration (composition/interaction only, not literal copy).

**Built:**
- New `components/ui/ServicePattern.tsx` — six distinct abstract SVG
  line-art patterns (wave/scan, grid, crosshair, cell-like microstructure,
  diagonal-hatch + gear ticks, node grid), one per service, procedurally
  generated rather than hand-drawn stock art. Rendered at ~9% opacity in
  white on the active card only.
- New `components/sections/ServiceDeck.tsx` replaces the old
  `ServiceStackCards.tsx` (deleted) — a `510vh` (`6 x 85vh`) tall section
  with a `sticky top-0 h-screen` inner stage. A scroll listener computes
  `progress = clamp(-rect.top, 0, total) / total` against the section's own
  bounding rect and maps it to an active index (0-5); each card's stack
  `depth` is `(i - active + N) % N`, so the deck rotates through the
  sequence rather than needing a reordered array. Depth drives x/y offset,
  scale, and opacity (`baseTarget()`); the active card (depth 0) gets the
  navy fill, full content (number, title, split category tags, description,
  gold accent bar), and its `ServicePattern`; inactive cards show a faint
  title only. Click calls `goTo(i)`, which optimistically sets `active`
  immediately (so the UI responds before the scroll finishes) and then
  smooth-scrolls the page to the middle of that card's scroll band - scroll
  position stays the single source of truth. Hover independently lifts the
  hovered inactive card (via a parent `hovered` index, not `whileHover`,
  so the *active* card can also be told to recede slightly while another
  card is hovered, per spec) and bumps its z-index above the active card's.
- `Services.tsx` is now a one-line wrapper around `ServiceDeck`.

**Bug caught during verification:** the scroll listener originally throttled
updates via a `requestAnimationFrame` "ticking" ref (a completely standard
pattern) - but in this sandboxed session's backgrounded browser pane, rAF
callbacks are suppressed almost entirely (same root cause as the earlier
cobe-globe rAF-throttling finding), so the very first scroll event set the
ticking flag and its rAF callback then never fired to clear it, permanently
freezing the deck after one scroll tick. Fixed by calling the (cheap - one
`getBoundingClientRect` + arithmetic) update function directly on every
scroll event, no rAF gate; React's `prev === idx` check already prevents
redundant re-renders. This is more robust for real users too, not just a
workaround for the sandbox.

**Verified:** Since `window.scrollTo()` in this harness doesn't dispatch a
native `scroll` event at all (confirmed: a bare listener saw zero calls
across two `scrollTo` calls despite `window.scrollY` updating correctly),
scroll-driven behavior was verified by manually dispatching `scroll` events
after each `scrollTo` and reading back the resulting active card title at
five scroll depths - progressed correctly through Advanced NDT, Inspection
Services, Metallography, then Training & Certification as scroll position
increased. Click-to-select verified by dispatching a real `click` event on
an inactive card and confirming the active title changed immediately.
Hover's actual Framer Motion transform couldn't be visually confirmed in
this session (same rAF-suppression issue prevents the animation from
progressing while the pane is backgrounded) - the state/logic wiring is
verified correct; the animation itself is standard Framer Motion usage that
will run normally for real users in a foregrounded browser. No horizontal
overflow at 375px mobile width. `npm run build` clean.

## 2026-08-09 — Services deck redesigned again: list + content pane

**Trigger:** User rejected the stacked-card-deck version on sight — two real
bugs, not just taste: the active card's number ("02") was visually clipped
by the sticky navbar, and the per-service SVG background pattern (grid
lines at what was meant to be 9% opacity) rendered as a dominant graph-paper
texture covering the whole card. User pasted a reference (a numbered
step-list on the left + a single content pane on the right that swaps per
step) and said to redesign it properly, keeping the scroll-driven switching.

**Root cause of the navbar clipping:** the sticky inner stage used
`sticky top-0 h-screen`, vertically centering card content in the *full*
100vh box — but the navbar (itself `sticky top-0`, ~72px tall) sits on top
of that same viewport region at z-50, so anything centered in the upper
portion of the 100vh box rendered underneath/behind the navbar. Not an
animation issue this time — pure layout math not accounting for a sibling
sticky header.

**Rebuilt:**
- `ServicePattern.tsx` shrunk from full-bleed 400x500 background textures
  to compact 120x120 corner motifs, applied at a much smaller footprint
  (`h-28 w-28`, positioned as a corner accent, not a background fill) and a
  more sensible opacity — abstract accent, not a texture.
- `ServiceDeck.tsx` replaced the absolute-stacked 6-card deck with a
  two-column layout: left is a static vertical list of all 6 services
  (number + title, active row gets a white pill background and gold dot,
  matching the reference's left list) that's always fully visible; right is
  a *single* content pane (navy, one service's number/title/tags/
  description/pattern) that crossfades as `active` changes. Fixed the
  navbar overlap by changing the sticky stage to `sticky top-20
  h-[calc(100vh-5rem)]` — pinned starting *below* the navbar instead of at
  the true viewport top. Scroll-driven progression logic (bounding-rect
  progress -> index, `goTo()` for click-to-jump) is otherwise unchanged
  from the previous version.

**Second bug found during verification — a real one, not a test artifact:**
the content pane used `<AnimatePresence mode="wait">`, which defers
mounting the *new* card until the *old* card's exit-animation completion
callback fires. That callback is itself scheduled through
`requestAnimationFrame`. In this session's backgrounded pane rAF barely
runs at all, so the callback never fired and the deck froze on the first
card forever — confirmed by exposing `active` state directly (it *did*
update correctly to 1 on click) while the DOM's rendered title stayed on
the old card, proving the state/logic was right and only the
animation-gated mount was stuck. Fixed by dropping `mode="wait"` (now just
`initial={false}`) so the incoming card mounts immediately on key change
instead of waiting for the outgoing one to finish exiting — both react
correctly regardless of whether that exit animation ever visually
completes, since the newer DOM node paints over the older one anyway. This
is also more robust for real users, not only a sandbox workaround: a
genuinely backgrounded real browser tab throttles rAF too (just less
severely), so `mode="wait"` was a latent fragility beyond this test
environment.

**Verified:** manually dispatching `scroll` events at six scroll depths
progressed correctly through all six service titles in order; a real
`click` event on an inactive list row updated the pane immediately; no
horizontal overflow at 375px; `npm run build` clean.

## 2026-08-09 — Globe restyle, carousel crop fix, Why Vardann accent

**Scope:** Final alignment/polish pass — restyle the globe to match a
light wireframe reference, fix a hover-crop bug on the product carousel,
add visual differentiation to Why Vardann, remove a leftover ring
artifact the user flagged after the first look.

**Built:**
- `cobe-globe-cdn.tsx`: switched `createGlobe` config from dark-navy to
  light (`dark: 0`, pale-blue `baseColor`, blue `markerColor`, white
  `glowColor`), added `label?: string` to `GlobeMarker`, restructured the
  marker overlay into a dot+label pill flex row, fixed the dot's own
  centering transform (`translate(-4px, -50%)`, since the label text now
  shares the flex container and would otherwise throw off `-50%,-50%`
  centering), changed arc stroke from gold to blue.
- `GlobalPresence.tsx`: added `label` values to the 4 existing markers
  (India, Middle East, Africa, Asia-Pacific) and a "Supplied To"-style
  pill list below the globe using those same 4 real regions — not the
  fabricated country list shown in the user's reference screenshot, which
  was template placeholder content, not actual Vardann data. Enlarged the
  globe container (`max-w-md` → `max-w-lg`).
- `BestsellersCarousel.tsx`: fixed a CSS overflow bug clipping the card
  hover-lift + shadow — an element with only `overflow-x: auto` forces
  the browser to also compute `overflow-y` as `auto` (an axis can't stay
  `visible` while the other scrolls, per the CSS Overflow spec), so the
  track was clipping its own children's hover transforms. Fixed via
  padding inside the scroll track plus a non-clipping outer wrapper per
  card (for a new decorative highlight-blob glow) around the actual
  `overflow-hidden` visual card.
- `WhyVardann.tsx`: gave the Vision card a navy→blue gradient fill (white
  text, gold corner glow) so it visually contrasts with the plain-white
  Mission card, per "something diff in that why vardann section."

**Bug found after first look (user-reported, not caught in verification):**
the globe had a soft box-shadow "definition ring" div sitting behind the
canvas — added earlier on the theory that a light globe needs edge
definition against a light page — but on review it read as an unwanted
extra circle around the globe. Removed the div entirely; the globe's own
edge (base sphere + glow) is definition enough.

**Crop audit:** grepped every component for `overflow-hidden` and for
`hover:-translate-y` to check for the same clipping pattern elsewhere.
`ServiceDeck.tsx` and `CapabilitiesShowcase.tsx` use `overflow-hidden` only
on non-scrolling absolutely-positioned containers (no clipped hover
transform risk); `WhyVardann.tsx`'s hover-lift cards aren't inside any
clipping wrapper. `BestsellersCarousel.tsx` was the only real instance —
now fixed.

**Verified:** `npm run build` clean after every edit in this batch; DOM
inspection on the running dev server confirmed the ring div no longer
exists, marker labels render, and the region pill list renders with the
correct 4 region names.
