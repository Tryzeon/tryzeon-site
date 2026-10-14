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
2. **Atmosphere** = Aurora/flowing mesh in blue→cyan (the GradientWave hero and the
   closing-CTA aurora blooms are the same DNA — fluid, iridescent). It appears only in
   those two places; see 0.1 rule 2.
3. **Type** = Playfair Display (editorial display moments) + Geist (tech/UI/body).
4. **Motion** = slow, luxurious, fluid (400–600ms), ease-out enter. Never snappy.
5. **Color discipline** = blue→cyan only. No rainbow, no purple/pink.

If a new element can't be expressed in this language, it does not belong.

### 0.1 Restraint rules (2026-10, Apple / Tesla / Meta reading)

1. **One idea per viewport.** One headline, at most one supporting line, one visual focus.
2. **Type leads, decoration recedes.** Atmosphere (GradientWave, aurora bloom)
   appears in exactly two places on the homepage: Hero (GradientWave) and the closing CTA
   (aurora blooms). No `dot-grid` on the homepage. Every other section is plain `#FAFAFA` / `#FFF`.
3. **Fewer, larger surfaces.** No card-in-card nesting; one glass container per idea.
4. **Motion is a whisper.** One enter per section; hover only on interactive elements;
   never a looping animation on content (icons included).
5. **Every section ends with a next step** — an Apple-style `了解更多 ›` link or anchor.

---

## 1. Color (CORRECTED — brand blue/cyan, NOT the tool's default pink)

| Role | Hex | Use |
|------|-----|-----|
| Ink (primary text) | `#101828` | Headlines, primary text |
| Steel (secondary) | `#475467` | Body, captions |
| Brand Blue | `#2563EB` | Primary accent, brands side |
| Cyan | `#06B6D4` | Secondary accent, consumer side |
| Blue Light | `#60A5FA` | Hover, gradient mid |
| Background | `#FAFAFA` | Base (light only) |
| Surface white | `#FFFFFF` | Cards, glass base |
| Ice | `#F2F4F7` | Subtle fills |

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
- Enter = ease-out; exit = ease-in. Never `linear` for UI.
- Reveal on scroll = `whileInView` + `viewport={{ once: true, amount: 0.15 }}`
  (only `SectionHeader` keeps 0.3)
  + staggerChildren. (❌ NOT framer `useScroll({target,offset})` scrub — conflicts
  with Lenis on this site; see `feedback_lenis_useScroll_conflict` memory.)
- Continuous animation only for ambient/atmosphere (shaders, aurora), never on
  content icons. One requested exception: the engine flywheel's comet (slow 8s lap,
  only while on screen, static under reduced motion).
- ALWAYS honor `prefers-reduced-motion` with a static fallback.

**Stack:** Framer Motion (component interaction) · GSAP+ScrollTrigger (existing
cinema) · Lenis (smooth scroll) · raw WebGL (GradientWave shader atmosphere). 21st.dev for
component patterns. UI/UX Pro Max for direction.

---

## 4. Surface / Material Spec (Liquid Glass)

Frosted glass card (the default container):
```
bg-white/70  backdrop-blur-xl  border border-white/60
shadow-[0_8px_32px_rgba(16,24,40,0.10)]  rounded-3xl
```
- Iridescent edge option: 1px gradient border `#2563EB→#06B6D4` at low opacity.
- Aurora bloom backdrop: soft radial `rgba(37,99,235,0.06)` + `rgba(6,182,212,0.05)`,
  blurred, slow drift (`animate-mesh-float`).
- Shader atmosphere (GradientWave, Hero only): blue→cyan iridescent, slow flow.

---

## 5. Section Blueprint (current site → visual treatment)

| # | id | Section | Treatment |
|---|----|---------|-----------|
| 01 | — | Hero | Two columns: kinetic 宋體 H1 / sub / 2 CTAs on the left, `PhoneFrame` with `tryonSimple` plus two input cards on the right, GradientWave behind |
| 02 | `manifesto` | Manifesto | 「別人做工具，我們做生態系。」 editorial spread; beside it「看我們怎麼做」is a chapter index of the next four sections (spec section name + that section's title, smooth-scroll link) |
| 03 | `brands` | List once, four channels | Four channel tiles only (listing methods + backend screens live on `/business`); no atmosphere |
| 04 | `line` | LINE flow | Text-only timeline (no phone), closing link back to `/business` |
| 05 | `experience` | For Shoppers | Desktop: selector + `PhoneFrame` crossfade; mobile: stacked; includes `TryOnVideo` |
| 06 | `engine` | One AI Engine | One centered `SectionHeader` line + `MoreLink` to `/about#engine`; the flywheel itself lives on `/about` (see below) |
| 07 | `vision` | Vision | Centered serif quote (no pillars) |
| 08 | `faq` | FAQ | Light glass accordion |
| 09 | `contact` | CTA | Aurora bloom + single `/business` primary (no email button) |
| 10 | — | Footer | Dark (the ONLY dark section allowed) |

Subpages (`/business`, `/download`, `/about`) reuse the same parts: a hero (宋體 H1
via `clauseWrap` + lede + CTAs, no kicker; centered on `/business` and `/about`, two-column text + phone on `/download`) over two soft aurora blooms, then `SectionHeader`
sections of glass cards on alternating `#FFF` / `#FAFAFA`. No dark sections, no stats rows,
no repeated feature lists — link to the homepage instead. No page carries awards, programs or a
team section. `/about` hosts the engine flywheel (`EngineFlywheel`, centered header + inline SVG ring + HTML nodes: ring draws in,
nodes pop in 01→04, then a comet laps the ring every 8s lighting each node it reaches; runs only while
visible, static under reduced motion).

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
- ❌ framer `useScroll` scroll-scrub (Lenis conflict) — use whileInView stagger
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
