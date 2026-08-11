# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (Turbopack) on :3000
npm run build        # production build
npm run type-check   # tsc --noEmit — THE verification gate before committing
npm run build:analyze  # build + scripts/analyze-bundle.js size report
npm run clean        # rm -rf .next node_modules/.cache
```

There is no test suite. Verification = `npm run type-check` + `npm run build` + a visual
check in the browser (MASTER.md requires a screenshot check before commit).

Two package scripts are currently broken — don't rely on them and don't "fix" a phantom
error they report:
- `npm run lint` — `next lint` was removed in Next 16 and there is no `eslint.config.*`
  in the repo (`eslint` / `eslint-config-next` are installed but unwired).
- `npm run format` — `prettier` is not installed.

Because `tsconfig.json` sets `noUnusedLocals` + `noUnusedParameters`, a leftover import
is a build error, not a warning.

## Architecture

Marketing site for Tryzeon (創然科技股份有限公司), an AI virtual-try-on fashion-tech
startup. Next.js 16 App Router, React 18, TypeScript strict, TailwindCSS 3. Primary
content language is Traditional Chinese.

### Page composition pattern

Every content route splits in two:

- `app/<route>/page.tsx` — server component. Owns `metadata`, `revalidate = 3600`, the
  static data arrays, and all SEO-critical copy so it lands in the SSR HTML.
- `app/<route>/<Name>PageClient.tsx` — `'use client'` shell (default export, unlike the
  named exports used everywhere else). Holds `useState('zh-TW')` and renders
  `<Navigation>` + `{children}` + `<Footer>`.

Language is per-page React state, not a router locale or context: each client shell owns
its own `currentLang`, passes `setCurrentLang` to `Navigation`, and resolves copy via
`translations[lang] ?? translations['zh-TW']`. Switching language does not persist across
navigation — that's the current design, not a bug to chase.

`components/PageLayout.tsx` is the same shell plus a back-link, used by the legal/simple
pages.

### Root layout

`app/layout.tsx` owns four Google fonts wired to CSS variables consumed by
`tailwind.config.ts`. Note the deliberate mismatch: `--font-outfit` is actually **Geist**
(renamed variable kept for downstream compatibility), and `font-serif` is a two-font
stack — Latin resolves to Playfair Display, CJK falls through to Noto Serif TC (宋體).
Playfair must keep weight `900` loaded or mixed-script `font-black` headings render the
Latin a weight lighter than the adjacent 宋體.

The layout also mounts the global chrome: `SmoothScrollProvider`, `NavigationProgress`,
`WebVitals`, `CustomCursor`, `SkipToContent`, the `noise-overlay` div, and the
Organization/WebSite JSON-LD graph.

### Scroll + motion stack (the fragile part)

`components/SmoothScrollProvider.tsx` registers GSAP `ScrollTrigger`, creates the Lenis
instance (exposed as `window.__lenis`), pumps `ScrollTrigger.update()` from Lenis's scroll
event, bails out entirely under `prefers-reduced-motion`, and wraps children in
`<MotionConfig reducedMotion="user">` so Framer enters degrade to opacity-only globally.

Three constraints that have already cost debugging time:

1. **Never use Framer `useScroll({target, offset})` scrub.** It conflicts with Lenis on
   this site. Reveal-on-scroll = `whileInView` + `viewport={{ once: true, amount: 0.3 }}`
   + stagger, or the `ScrollReveal` IntersectionObserver component.
2. **`app/template.tsx` must not animate `transform`.** Any transform value — even
   identity — creates a containing block that traps `position: fixed` descendants and
   breaks GSAP pinning site-wide. It uses an opacity-only `pageEnter` fade.
3. **`@keyframes pageEnter` lives in `app/globals.css`, not styled-jsx.** A client
   component's styled-jsx is absent from SSR HTML, so the `opacity: 0` wrapper would stay
   blank until hydration.

### Styling layers

Three sources, in order of preference: Tailwind utilities → the `neo` design tokens in
`tailwind.config.ts` → the `@layer components` / `@layer utilities` classes in
`app/globals.css` (`glass-card`, `dot-grid`, `noise-overlay`, `cjk-punct`, `text-balance`,
`text-gradient-blue`, `animate-mesh-float`, `btn-apple`, …). Reach for an existing
`globals.css` class before writing new CSS; no inline `style` blocks or CSS modules.

`components/SectionHeader.tsx` is the single section-title pattern (mono kicker + 宋體
display heading + lede, with locked sizes and enter animation). `BentoFeatures` hand-copies
its `clamp()` size curve for a special layout — change one, sync the other.

### App download / deep-link subsystem

`lib/app-links.ts` is the single source of truth for store URLs and UA platform detection.
Built on top of it:

- `app/get/route.ts` — one pasteable short link; sniffs UA, 302s to the matching store,
  falls back to `/download` for desktop and iPad-in-desktop-mode (which is
  server-indistinguishable from macOS).
- `app/download/ios/route.ts`, `app/download/android/route.ts` — bare 302s to the stores.
- `app/download/page.tsx` — the pick-your-platform landing page. In-site CTAs point here.
- `app/store/[[...slug]]/page.tsx`, `app/product/[[...slug]]/page.tsx` — Universal Link /
  App Link fallbacks rendering `components/AppDownload.tsx`. The **optional** catch-all
  matters: bare `/store` and `/product` must not 404.
- `app/s/[code]/route.ts` — where store QR codes land. Calls `SHORT_LINKS_URL` (a Supabase
  edge function) which owns the lookup, UA classification and open-event logging, and 302s
  to the LIFF URL it returns; anything else degrades to the site root. `/s/` must not be
  claimed by the app or the OS intercepts a scan before the browser sees it, which is why
  the path is gone from the AASA here and from the app's AndroidManifest — note an Android
  intent-filter is compiled into the installed binary and iOS caches the AASA until
  reinstall, so an older install still intercepts.
  Not built yet, deliberately: distinguishing an expired link from an outage, and letting
  non-LINE scans tap through instead of redirecting (iOS 18.3 stopped honouring redirects
  into Universal Links). Both wait until this path is verified on a device.
Route handlers here all use `runtime = 'edge'`, `dynamic = 'force-dynamic'`,
`Cache-Control: no-store`, and `X-Robots-Tag: noindex`. The paths are declared in
`public/.well-known/apple-app-site-association` and `assetlinks.json` — changing a path
requires editing those files and the app side too.

### Content and SEO wiring

- User-visible copy belongs in `lib/translations.ts` (and `lib/faq-data.ts`), keyed
  `'zh-TW'` / `'en'`. Never hardcode user-facing strings in components.
- `app/page.tsx` generates FAQPage JSON-LD from `faq-data.ts`, so FAQ edits change
  structured data as well as the rendered accordion.
- Adding a route means adding it to `app/sitemap.ts`.
- Own images live under `public/images/`; remote images are restricted to
  `images.unsplash.com` by `next.config.js` and the CSP.

### Security headers

`next.config.js` sets CSP, HSTS, X-Frame-Options, Permissions-Policy on all paths. The CSP
allows no third-party script or connect origins beyond Google Fonts / Google Docs — a new
analytics or embed script will be blocked at runtime. **Do not modify the security headers
block**; if a feature needs a new origin, raise it rather than widening the policy.

### Removed components

`FeaturesCinema`, `PainCinema`, `StatsCinema`, `ProcessScroll`, `ScrollLinkedAnimations`,
`VisionManifesto`, `WireframeMagic` were unreferenced leftovers from earlier designs and
have been deleted. Don't resurrect them from git history — MASTER.md bans pain-point /
stats / market-analysis sections, and `StatsCinema` in particular hardcoded the banned
84% / 71% figures, so re-importing it would ship a redline violation.

## Design system

**`design-system/tryzeon/MASTER.md` is the source of truth for all UI work — read it before
touching visuals.** Identity: Editorial Tech × Liquid Glass, light only. Hard rules from it:

- Palette is blue→cyan only (`#2563EB → #60A5FA → #06B6D4`) on `#FAFAFA`/`#FFFFFF`.
  Purple/pink/rainbow gradients are banned; the Footer is the only dark section allowed.
- Default surface is frosted glass (`bg-white/70 backdrop-blur-xl border border-white/60`),
  never flat opaque colored blocks.
- Motion is slow and fluid: 400–600ms, `cubic-bezier(0.16, 1, 0.3, 1)` ease-out,
  0.06–0.15s stagger; continuous animation only for ambient shader/aurora layers.
- CJK typography: display headings are `font-black` + `.cjk-punct` (halt punctuation trim);
  serif quotes declare `font-semibold` explicitly (Noto Serif TC has no 400); no italic on
  Chinese.
- Lucide SVG icons only, no emoji; visible focus states; ≥4.5:1 contrast; responsive at
  375 / 768 / 1024 / 1440 with no horizontal scroll.

## Conventions

- Components use **named** exports (`export function Foo`) — except the `*PageClient`
  default exports. PascalCase filenames. `'use client'` at the top of client components.
- Props always get an `interface`. No `any` — use `unknown` + narrowing. Constant objects
  get `as const`.
- Import order: React → Next.js → third-party → `@/` internal → relative. `@/*` maps to
  the repo root.
- Split components past ~300 lines.
- Code splitting is decided by SEO impact, not by fold position: SEO-relevant content
  (product copy, features, FAQ) must be statically imported so it ships in the SSR HTML;
  only heavy pure-visual/interactive pieces get `dynamic(..., { ssr: false })` — see
  `FabricFlow` in `HomePageClient`. When unsure, import statically.
- Images via `next/image` with explicit `width`/`height`/`alt`. Nothing over 500KB in
  `public/`.
- Expensive scroll effects (pinned cinema, complex parallax) are desktop-only (`lg:`,
  ≥1024px) and degrade to a static stack on mobile.
- No `console.log` in shipped code — use `lib/analytics.ts` (`trackCTA.*`, `trackEvent`).
- No `eval()` / `dangerouslySetInnerHTML` except the JSON-LD script tags.
- **Do not add npm dependencies without asking first.** `gsap` and `lenis` are
  pre-approved exceptions already in use.
- Don't delete existing features, and don't create a component that duplicates an existing
  one.

## Content rules

### Audience (decides the tone of every string)

The site's real readers are **① B2B brand decision-makers ② tech partners ③ startup-
competition judges / investors** — *not* B2C consumers. LINE Taiwan reached out precisely
because they read this site. Before writing copy, ask who the sentence is addressed to;
if the answer is "a shopper", rewrite or demote it. Consumer-side try-on is framed as the
traffic-and-data engine that feeds the B2B model, not as the product being sold here.

### Positioning (2026-07)

"別人做工具，我們做生態系" — an OMO integration ecosystem for Asian fashion brands, not a
single try-on tool. Revenue is B2B pay-per-use: NT$1 per 5 try-ons, first 3 months free,
no monthly or setup fee. Company is **pre-revenue**; consumer monetisation is auxiliary
and not live.

### ⛔ Outward-facing redlines (violating these is a serious error)

1. **Never use the 84% stat** — it has no reliable source. 61% / 71% (2016 Retail
   Perceptions) may appear as on-screen text only, never cited aloud as sourced.
2. **Conversion-rate figures must be attributed to Deloitte or Shopify** on screen;
   market-size figures to Grand View Research.
3. **No return-rate claims of any kind** ("reduces returns by X%", "減少退貨"). Consumer-
   side framing is only「打破想像的隔閡」(closing the imagination gap). In a B2B or
   sustainability context, "precise buying reduces overstock and textile waste" is fine.
4. **Never describe in-development features as shipped.** Live: dual-platform app,
   LINE OA (LIFF). In development: in-store QR, brand-site embed, platform integrations
   (SHOPLINE / Shopify / Cyberbiz / 91APP), the three patent directions.
5. **Pre-revenue** — never imply revenue, paying customers, or a running paid
   subscription (payments are sandbox-only).
6. **"Benchmarked against ISO 27001" — never "certified".** Keep security wording exact:
   it is SSL/TLS in transit plus RLS/JWT, *not* end-to-end encryption (try-on requires
   server-side compute, so E2EE is technically false).
7. **No partner logos until contracts are signed**; never describe a prospect as a
   confirmed partner.
8. **Never name third-party or internal AI models** (Gemini, nano-banana, Veo3 …). Public
   wording is always「團隊自家研發的專屬 AI 時尚模型」.
9. **State technical specs honestly**: static try-on 5-7s, dynamic video 10-15s. No
   rounding down into a stronger claim.
10. Market-claim boundary: "no leader yet in Asian AI OMO integration" is fair; **"no
    leader in virtual try-on" is not** (Perfect Corp is the counter-example).

Sources must be nameable before a number goes on the site. If it cannot be attributed,
leave it out. The company name is always written "Tryzeon".

## Git

- Commit format `type(scope): description` with `feat` / `fix` / `refactor` / `style` /
  `perf` / `docs` / `chore`.
- **Write commit messages in English**, even though older history is in Chinese.
- `git pull --rebase origin main` before pushing. `main` is the only long-lived branch.
