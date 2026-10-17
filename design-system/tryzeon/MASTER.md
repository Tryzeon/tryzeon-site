# Tryzeon — Master Design System (Source of Truth)

> Generated from UI/UX Pro Max (style + color + typography + landing + ux domains),
> then corrected to Tryzeon brand truth. When building any section, follow this file.
> Page-specific overrides live in `design-system/tryzeon/pages/[page].md`.

**Identity:** Editorial Tech × Liquid Glass — fashion editorial calm meets fluid,
iridescent, premium motion. Apple AirPods Max + COS + Stripe, in light.

---

## 0. The Coherence Rule (why the site felt 突兀 before, and the fix)

Every section MUST speak ONE visual language so nothing reads as a bolted-on
experiment. The language is:

1. **Surface** = Liquid Glass — frosted translucent panels, soft backdrop blur,
   iridescent blue→cyan edges. Never flat opaque colored blocks.
2. **Atmosphere** = white satin with a blue→cyan sheen (`SilkField`) — fashion's material
   lit like technology. Where it appears is listed in 0.1 rule 5.
3. **Type** = Playfair Display (editorial display moments) + Geist (tech/UI/body).
4. **Motion** = slow, luxurious, fluid (400–600ms), ease-out enter. Never snappy.
5. **Color discipline** = blue→cyan only. No rainbow, no purple/pink.

If a new element can't be expressed in this language, it does not belong.

### 0.1 Depth & motion rules (2026-10-17, replaces the 2026-10 restraint rules)

The owner asked for a site that amazes — more animation, interaction and 3D. Spectacle is
allowed, but it keeps a hierarchy (plan reviewed with Codex):

1. **Two signature scenes on the homepage.** Hero: white satin (`SilkField`) with one broad fold
   running from the product photo to the phone; a blue→cyan light travels along it once while
   the 3D phone settles. Channels: four silk ribbons fan out from one point to the four tiles,
   one pulse runs down all four and the four 「上線」 lights come on together.
2. **Every other section gets its own authored moment**, never one shared fade-up: the LINE
   timeline draws itself with a light head, the experience phone swings toward each new screen,
   the engine line has a light band passing through it, the CTA closes on the same satin.
3. **One dominant moving subject per viewport; movement resolves into readable content.**
   Text is never dimmed to make an effect work; screenshots are never covered, scanned,
   blurred, zoomed or cropped by an effect (depth goes on the device, not the screen).
4. **Pointer interaction enhances a complete composition.** Tilt (±3–8°) only on product
   imagery and diagrams (phones, the flywheel) — never on informational cards, which don't
   pretend to be interactive.
5. **Atmosphere** = `SilkField` only: homepage hero + closing CTA (bookend), subpage heroes and
   the `/business` closing CTA, always paler on subpages (`tint` 0.75). No `dot-grid`.
6. Every section still ends with a next step (`了解更多 ›` link or anchor).

Cut on review and not to be reintroduced: particle logo, typed chat bubbles (there are no real
LINE screenshots), a scan line over screenshots, universal card tilt / spotlights, a four-phone
cover-flow, a second top progress bar, a footer wordmark, the SVG-displacement "liquid glass"
nav (WebKit drops the whole backdrop filter when the SVG reference fails).

---

## 1. Color (CORRECTED — brand blue/cyan, NOT the tool's default pink)

| Role | Hex | Use |
|------|-----|-----|
| Ink (primary text) | `#101828` | Headlines, primary text |
| Steel (secondary) | `#475467` | Body, captions |
| Brand Blue | `#2563EB` | Primary accent, brands side |
| Cyan | `#06B6D4` | Secondary accent, consumer side |
| Blue Light | `#60A5FA` | Hover, gradient mid |
| Background | `#FAFAFA` | The one page canvas: every section, light only |
| Surface white | `#FFFFFF` | Cards, glass base — surfaces only, never a section band |
| Ice | `#F2F4F7` | Subtle fills |

**One canvas.** Every section sits on the same `#FAFAFA`; sections are separated by whitespace
and their `SectionHeader`, not by background. Alternating `#FFF` / `#FAFAFA` bands are banned: a
~2% step shows as a seam on some screens and vanishes on others, so it reads as a rendering bug
rather than rhythm. The Footer is the only background change — one deliberate chapter contrast.

**Iridescent gradient (the signature):** `#2563EB → #60A5FA → #06B6D4`.
Used for: text gradients, shader ramps, glass edges, aurora blooms.
❌ NEVER rainbow / magenta / purple (`#7C3AED`, `#EC4899` etc.) — reads as AI slop.

---

## 2. Typography

- **Display / editorial moments:** Playfair Display (italic for manifesto/quotes).
  e.g. Brand Statement, big pull-quotes. Loaded as `--font-serif`.
- **CJK display:** Noto Serif TC（宋體）via `--font-serif-tc` in the same
  `font-serif` stack — Latin resolves to Playfair, CJK falls through to 宋體.
  中文禁 italic（假斜體醜）。
- **Headings / UI / body:** Geist (`--font-outfit`). Sharp, techy, neutral.
- **Kicker / metadata / labels:** Geist Mono (`--font-mono`), `tracking-[0.4em]`,
  uppercase, 10–11px, `#475467`. Not a per-section signature: `SectionHeader` has no kicker.
  Mono is reserved for metadata the spec lists explicitly — currently none on the public pages.
- Body line-height 1.5–1.75; line length 65–75ch; min 16px on mobile.

### CJK display rules (2026-07 tune)

- **Two-tier tracking:** hero display (80–108px) `-0.02em`; section display
  (32–62px) `-0.01em`; serif body/quote `0`. 不要把 hero 的緊排帶到小字級。
- **Punctuation trim:** every 宋體 display headline gets `.cjk-punct`
  (`font-feature-settings: 'halt' 1`) — 全形「。」「，」半寬化，置中標題
  不被尾標點推偏。內文不套。
- **Mixed-script weight:** display 標題一律 `font-black`；Playfair 必須載 900，
  否則「關於 Tryzeon」的英文會比宋體細一級。serif 引言明確宣告 `font-semibold`
  （Noto Serif TC 沒有 400，隱式 fallback 是意外不是設計）。
- **Section title size curve:** `clamp(2.125rem, 1.4rem + 2.8vw, 3.9rem)`
  （舊 `4.6vw` 曲線在 700–1100px 平板段會塌到 35px）。SectionHeader.tsx 是
  唯一 source，所有首頁 section 標題都走它。
  字串標題會在「，、；：」之後切成 inline-block，窄螢幕只在句讀處換行。

(Tool suggested Inter for body; we keep Geist — sharper "tech" half of the
Editorial Tech hybrid. Deliberate, documented deviation.)

---

## 3. Motion Language (the unifier — 400–600ms, fluid, slow)

| Token | Value |
|-------|-------|
| `--ease-fluid` | `cubic-bezier(0.16, 1, 0.3, 1)` (the house ease-out) |
| Enter duration | 0.6–0.9s (content) |
| Atmosphere dawn-in | up to 1.4s（僅限 ambient 層：aurora/shader canvas 淡入，不適用內容元素） |
| Morph / fluid | 400–600ms loops, organic |
| Stagger children | 0.06–0.15s |
| Micro-interaction | 150–300ms (hover, color) |

Rules:
- Enter = ease-out; exit = ease-in. Never `linear` for UI (scroll-scrubbed tweens use `ease: 'none'`
  because the scroll position is the easing).
- Reveal on scroll = `whileInView` + `viewport={{ once: true, amount: 0.15 }}`
  (only `SectionHeader` keeps 0.3)
  + staggerChildren. (❌ NOT framer `useScroll({target,offset})` scrub — conflicts
  with Lenis on this site; see `feedback_lenis_useScroll_conflict` memory.)
- Continuous animation only for ambient/atmosphere (`SilkField`), never on
  content icons. Two requested exceptions, both only while on screen and static under reduced
  motion: the engine flywheel's comet (slow 8s lap) and the channel ribbons' sync pulse
  (every 6.5s).
- Scroll-scrubbed GSAP is allowed for two desktop moments only: the hero stage leaning back as
  it scrolls away, and the engine line's light band. Everything else plays once on enter.
- ALWAYS honor `prefers-reduced-motion` with a static fallback.

**Stack:** Framer Motion (component interaction, layoutId tab indicator) ·
GSAP+ScrollTrigger (ribbon choreography, hero exit, engine sheen) · Lenis (smooth scroll) ·
raw WebGL (`SilkField` satin, `lib/webgl.ts`) · CSS 3D (`Phone3D`, `PhoneFan`, flywheel depth).
No three.js — new dependencies need the owner's approval.

---

## 4. Surface / Material Spec (Liquid Glass)

Frosted glass card (the default container):
```
bg-white/70  backdrop-blur-xl  border border-white/60
shadow-[0_8px_32px_rgba(16,24,40,0.10)]  rounded-3xl
```
- Iridescent edge option: 1px gradient border `#2563EB→#06B6D4` at low opacity.
- Satin atmosphere (`SilkField`): near-white fabric — two directional folds with soft
  creases, broad wrap diffuse, an anisotropic sheen along the folds, and a blue→sky→cyan ramp
  only at grazing angles. The pointer pushes a broad damped bulge (no ripples); scroll speed
  makes the cloth flow. A radial `#FAFAFA` veil sits over the text column. The CSS radial blooms
  under it are the fallback while it fades in or when WebGL is unavailable.
- 3D phone (`Phone3D` / `PhoneBody`): four opaque slices behind the `PhoneFrame` give ~8px of
  side thickness; a 1.5px conic rim catches blue→cyan light from the pointer direction (it
  never paints over the screenshot); the stage tilts with the pointer.

---

## 5. Section Blueprint (current site → visual treatment)

| # | id | Section | Treatment |
|---|----|---------|-----------|
| 01 | — | Hero | Two columns: 宋體 H1 / sub / 2 CTAs (CSS `.hero-enter`) on the left; on the right a 3D stage — `tryonSimple` in a `PhoneBody` that settles from a 30° turn (CSS, transform-only), the two input cards floating in front at different depths, pointer tilt ±3°, and the stage leaning back on scroll-out (desktop). `SilkField` behind with the product→phone fold and its one-time light |
| 02 | `brands` | List once, four channels | Desktop: four twisting silk ribbons (SVG, two-tone at each twist) from one point under the lede to the four tiles; unfold, one pulse along all four (normalized path length so they arrive together), the four 上線 dots light together; repeats every 6.5s while visible; hovering a tile brightens its ribbon. Mobile: tiles only, dots light together |
| 03 | `line` | LINE flow | Text-only timeline (no phone): desktop line draws left→right with a light head, each node lights + ripples as the head passes and its text rises; mobile each step lights as it enters. Quote gets a highlighter underline. Closing link back to `/business` |
| 04 | `experience` | For Shoppers | Desktop: tab list with a sliding glass indicator (layoutId) + one 3D phone that swings toward each new screen, halo colour follows the tab; screens crossfade whole. Mobile: stacked, each phone stands up from a tilt as it enters. Includes `TryOnVideo` |
| 05 | `engine` | One AI Engine | One centered `SectionHeader` line with `sheen` (light band through the glyphs) + `MoreLink` to `/about#engine` |
| 06 | `faq` | FAQ | Light glass accordion, grid-rows height animation, rotating plus |
| 07 | `contact` | CTA | `SilkField` bookend (top and bottom fade) + veil + single `/business` primary with the hover light sweep |
| 08 | — | Footer | Dark (the ONLY dark section allowed) |

Subpages (`/business`, `/download`, `/about`) reuse the same parts: a hero (宋體 H1
via `clauseWrap` + lede + CTAs, no kicker; centered on `/business` and `/about`, two-column text + 3D phone on `/download`) over a pale `SilkField` and a veil, then `SectionHeader`
sections of glass cards (they rise from a slight backward tilt, `cardRise`) on the same `#FAFAFA` canvas. The `/business` back-office screens are a `PhoneFan` (three thick phones angled ±12° toward the middle, still facing forward). No dark sections, no stats rows,
no repeated feature lists — link to the homepage instead. No page carries awards, programs or a
team section. `/about` hosts the engine flywheel (`EngineFlywheel`, centered header + inline SVG ring + HTML nodes: ring draws in,
nodes pop in 01→04, then a comet laps the ring every 8s lighting each node it reaches; runs only while
visible, static under reduced motion). Ring, center word and nodes sit at three depths (0 / 24 / 48px)
and the wheel tilts ±8° with the pointer.

### Real App screens

- Real screenshots (`lib/app-images.ts`, 900×1957) sit in `PhoneFrame`: pure-CSS frame,
  content locked to `aspect-[900/1957]`, no notch (the screenshot already has a status bar).
- Never retouch, crop or recolor a screenshot, and never draw a mock UI in its place.
- No caption under images with AI-generated people; their alt text says so.
- Alt text comes from `copy.images`; every asset stays under 500KB.

---

## 6. Anti-Patterns (merged tool + Tryzeon hard-won lessons)

- ❌ Purple/pink/rainbow gradients (AI slop) — blue→cyan only
- ❌ Dark sections (except footer)
- ❌ Fast/snappy animations — motion must be slow & luxurious (tool: "fast animations")
- ❌ Cheap/flat visuals — everything reads premium or it's cut
- ❌ Screaming text walls / giant marquee as hero element (`feedback_no_screaming_text`)
- ❌ Empty abstract 3D geometry with no meaning, OR AI-stock photos as the hero of a 3D
  scene (asset quality caps it). Prefer pure-shader generative beauty.
- ❌ framer `useScroll` scroll-scrub (Lenis conflict) — use whileInView stagger, or GSAP
  ScrollTrigger for the two scrubbed moments in §3
- ❌ `opacity` / `filter` / `mask` / `overflow` on anything inside a 3D chain (flattens it)
- ❌ Educational-marketing sections (pain points / stats / market analysis), and on the homepage: milestones, first-party metrics, roadmap, team, brand counts
- ❌ Emoji icons; missing cursor-pointer; layout-shifting hovers; <4.5:1 contrast;
  instant state changes; invisible focus states

---

## 7. Pre-Delivery Checklist

- [ ] Speaks the Liquid-Glass language (surface + aurora + motion + type + blue/cyan)
- [ ] Motion is slow/fluid (400–600ms), ease-out, staggered, reduced-motion fallback
- [ ] No purple/pink; no dark (except footer); no screaming text
- [ ] SVG icons (Lucide); cursor-pointer; visible focus; 4.5:1 contrast
- [ ] Responsive 375 / 768 / 1024 / 1440; no horizontal scroll
- [ ] Verified in preview (screenshot) before commit
