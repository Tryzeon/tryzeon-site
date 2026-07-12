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
2. **Atmosphere** = Aurora/flowing mesh in blue→cyan (the GradientWave hero +
   FabricFlow silk are the same DNA — fluid, iridescent). Reuse this motif as the
   connective tissue between sections.
3. **Type** = Playfair Display (editorial display moments) + Geist (tech/UI/body).
4. **Motion** = slow, luxurious, fluid (400–600ms), ease-out enter. Never snappy.
5. **Color discipline** = blue→cyan only. No rainbow, no purple/pink.

If a new element can't be expressed in this language, it does not belong.

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
  uppercase, 10–11px, `#475467`. This mono kicker is a site-wide signature.
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
  唯一 source；BentoFeatures 的特殊版型手抄同值，改一處要同步另一處。

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
- Reveal on scroll = `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
  + staggerChildren. (❌ NOT framer `useScroll({target,offset})` scrub — conflicts
  with Lenis on this site; see `feedback_lenis_useScroll_conflict` memory.)
- Continuous animation only for ambient/atmosphere (shaders, aurora), never on
  content icons.
- ALWAYS honor `prefers-reduced-motion` with a static fallback.

**Stack:** Framer Motion (component interaction) · GSAP+ScrollTrigger (existing
cinema) · Lenis (smooth scroll) · Three.js (shader atmosphere). 21st.dev for
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
- Shader atmosphere (GradientWave / FabricFlow): blue→cyan iridescent, slow flow.

---

## 5. Section Blueprint (current site → visual treatment)

| # | Section | Liquid-Glass treatment |
|---|---------|------------------------|
| 01 | Hero | GradientWave aurora bg (✓ on-system) + giant ink headline + glass video card |
| 02 | Brand Statement | ScrollManifesto — Playfair italic editorial spread (✓) |
| 03 | Audience | Spotlight glass cards, blue (brands) / cyan (consumers) |
| 04 | FabricFlow | Silk shader = aurora DNA (✓). The "flow across channels" moment |
| 05 | Features | Bento grid — glass cards, hover scale 1.02, staggered reveal |
| 06 | About | Centered vision, Playfair quote |
| 07 | FAQ | Light glass accordion |
| 08 | Contact | Glass CTA + magnetic button |
| 09 | Footer | Dark (the ONLY dark section allowed) |

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
- ❌ Educational-marketing sections (pain points / stats / market analysis)
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
