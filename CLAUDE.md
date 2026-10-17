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

There are no automated tests; everything is verified by hand.
Verification = `npm run type-check` + `npm run build` + a visual
check in the browser (MASTER.md requires a screenshot check before commit).

There is no linter or formatter: `eslint` and `prettier` are not installed and there are
no `lint` / `format` scripts.

Because `tsconfig.json` sets `noUnusedLocals` + `noUnusedParameters`, a leftover import
is a build error, not a warning.

## Architecture

Marketing site for Tryzeon (創然科技有限公司), an AI virtual-try-on fashion-tech
startup. Next.js 16 App Router, React 18, TypeScript strict, TailwindCSS 3. Primary
content language is Traditional Chinese.

### Page composition pattern

The site is **zh-TW only** — there is no i18n, language switch or `/en` route.

Public content pages (keep this list in sync with `app/sitemap.ts`):

| Route | Content |
|---|---|
| `/` | Product overview — hero, four channels, LINE flow, customer experience (written to the brand), AI engine as one line linking to `/about#engine`, FAQ, CTA |
| `/business` | Brand partnership — hero CTAs, who it's for, three onboarding steps, the three listing methods + brand-backend screens, what a brand gets (try-on, recommendation, per-product try-on rate, try-on video as IG material, channel integration), brand FAQ, consultation form + email |
| `/about` | Company — origin, AI engine flywheel (`#engine`), vision (`#vision`); no team section |
| `/download` | Shopper entry — store badges, three-step how-to, privacy points |
| `/privacy`, `/terms`, `/delete-account` | Legal / app-store requirement |

Each page is a server component that owns `metadata`, `revalidate = 3600` and renders
`<Navigation />` + content + `<Footer />` directly (both read `lib/copy.ts` themselves).
The homepage is the one exception: `components/HomePageClient.tsx` is a `'use client'`
default export because its CTA carries an `onClick` analytics handler (it no longer
loads anything with `dynamic`).
`components/PageLayout.tsx` is the same shell plus a back-link, used by `/privacy` and
`/terms`. Split by the reader's question: the homepage says what Tryzeon does (channels, the
shopper side, the engine); `/business` says what a brand does and gets (listing,
onboarding, features). Each thing is described once — `/business` links to `/#line` from the
「四通路上線」 step instead of repeating the LINE flow, and the LINE section links back.

### Root layout

`app/layout.tsx` owns four Google fonts wired to CSS variables consumed by
`tailwind.config.ts`. Note the deliberate mismatch: `--font-outfit` is actually **Geist**
(renamed variable kept for downstream compatibility), and `font-serif` is a two-font
stack — Latin resolves to Playfair Display, CJK falls through to Noto Serif TC (宋體).
Playfair must keep weight `900` loaded or mixed-script `font-black` headings render the
Latin a weight lighter than the adjacent 宋體.

The layout also mounts the global chrome: `SmoothScrollProvider`, `NavigationProgress`,
`WebVitals` (development only), `CustomCursor`, `SkipToContent`, the `noise-overlay` div, and the
Organization/WebSite JSON-LD graph.

### Scroll + motion stack (the fragile part)

`components/SmoothScrollProvider.tsx` registers GSAP `ScrollTrigger`, creates the Lenis
instance (exposed as `window.__lenis`), pumps `ScrollTrigger.update()` from Lenis's scroll
event, bails out entirely under `prefers-reduced-motion`, and wraps children in
`<MotionConfig reducedMotion="user">` so Framer enters degrade to opacity-only globally.

Constraints that have already cost debugging time:

1. **Never use Framer `useScroll({target, offset})` scrub.** It conflicts with Lenis on
   this site. Reveal-on-scroll = `whileInView` + `viewport={{ once: true, amount: 0.15 }}`
   (only `SectionHeader` keeps 0.3) + stagger, or the `ScrollReveal` IntersectionObserver component.
   The shared presets (`EASE`, `inView`, `staggerList`, `fadeUpItem`) live in `lib/motion.ts`.
2. **`app/template.tsx` must not animate `transform`.** Any transform value — even
   identity — creates a containing block that traps `position: fixed` descendants and
   breaks GSAP pinning site-wide. It uses an opacity-only `pageEnter` fade.
3. **`@keyframes pageEnter` lives in `app/globals.css`, not styled-jsx.** A client
   component's styled-jsx is absent from SSR HTML, so the `opacity: 0` wrapper would stay
   blank until hydration.
4. **Never branch Framer `initial` on `useReducedMotion()`.** It returns `null` on the
   server and `true` on a reduced-motion client, so `initial={reduced ? false : 'hidden'}`
   hydrates with mismatched styles. Always pass `initial="hidden"`; the `MotionConfig` above
   already degrades enters to opacity-only.
5. **No root `app/loading.tsx`.** Next looks up a `/#section` hash once, when the new page
   mounts; behind a loading boundary it mounts the skeleton first, finds no section and
   scrolls to the top. Public pages rely on `NavigationProgress` instead (`/admin` has its
   own `loading.tsx`).
6. **No `scroll-behavior: smooth` on `html`.** Lenis does the smoothing; a CSS smooth scroll
   on top races it during route transitions.
7. **In-site links that can point at the current page use `components/SiteLink.tsx`**
   (nav, footer). Lenis swallows native same-page anchor jumps and a
   same-URL soft navigation doesn't scroll, so `SiteLink` smooth-scrolls to the section or
   the top itself (`samePageTarget` in `lib/section-nav.ts`).
8. **The homepage hero text column animates with the CSS-only `.hero-enter` (`app/globals.css`),
   not Framer.** Framer's `initial` ships `opacity: 0` in the SSR HTML, so the headline stayed
   blank until hydration; the CSS keyframe runs on first paint. The H1 renders each line once
   (no per-character spans with an `sr-only` copy, which duplicated the H1 text in the HTML).
9. **On every route change `SmoothScrollProvider` stops, restarts and re-measures Lenis**
   (`stop()` → `start()` → `resize()` in a layout effect keyed on the pathname). Otherwise a
   click made while the wheel momentum is still easing lands the new page mid-way: Lenis
   pulls the scroll back to its old target. Don't swap this for
   `scrollTo(scrollY, { immediate })` — Lenis clamps to the old page's height and returns
   early when the target equals its current one.

### Styling layers

Three sources, in order of preference: Tailwind utilities → the `neo` design tokens in
`tailwind.config.ts` → the `@layer components` / `@layer utilities` classes in
`app/globals.css` (`glass-panel` — the default static glass surface, `glass-card` — the
hover-lift variant, `btn-primary`, `focus-ring`, `noise-overlay`, `cjk-punct`, `text-balance`,
…). `animate-mesh-float` comes from `tailwind.config.ts`; `components/AmbientGlow.tsx` is the
two-orb background and `components/MoreLink.tsx` the blue chevron link. Reach for an existing
`globals.css` class before writing new CSS; no inline `style` blocks or CSS modules.

`components/SectionHeader.tsx` is the single section-title pattern (宋體 display
heading + lede, with locked sizes and enter animation; no kicker). Every homepage section title
goes through it; string titles are split after CJK punctuation so narrow screens only wrap
at 「，」-type breaks.

### App download / deep-link subsystem

`lib/app-links.ts` is the single source of truth for store URLs and UA platform detection.
Built on top of it:

- `app/get/route.ts` — one pasteable short link; sniffs UA, 302s to the matching store,
  falls back to `/download` for desktop and iPad-in-desktop-mode (which is
  server-indistinguishable from macOS).
- `app/download/ios/route.ts`, `app/download/android/route.ts` — bare 302s to the stores.
- `app/download/page.tsx` — the shopper landing page (light, `components/StoreBadges.tsx`).
  In-site CTAs point here. `StoreBadges` is shared with `AppDownload` so store buttons live
  in one place.
- `app/store/[[...slug]]/page.tsx`, `app/product/[[...slug]]/page.tsx` — Universal Link /
  App Link fallbacks rendering `components/AppDownload.tsx`. The **optional** catch-all
  matters: bare `/store` and `/product` must not 404.
- `/s/[code]` — where store QR codes land. The decision runs in `proxy.ts` (before rendering,
  so the LINE path is a clean 302): it calls `SHORT_LINKS_URL` (a Supabase edge function
  that owns the lookup, UA classification and open-event logging) via `lib/short-link.ts`.
  Four exits: inside LINE → 302 to the LIFF URL; outside LINE → render
  `app/s/[code]/page.tsx` (`LiffLanding`, a tap-through interstitial, because iOS 18.3 no
  longer opens Universal Links from redirects); unknown/disabled code → 302 `/link-expired`;
  backend failure → 302 `/link-unavailable`. `/s/` must not be claimed by the app or the OS
  intercepts a scan before the browser sees it, which is why the path is gone from the AASA
  here and from the app's AndroidManifest — note an Android intent-filter is compiled into
  the installed binary and iOS caches the AASA until reinstall, so an older install still
  intercepts.
Single-message screens (short-link states, `/store` / `/product` fallbacks, 404, error) share
`components/Notice.tsx`, the light glass shell. Route handlers here all use `runtime = 'edge'`, `dynamic = 'force-dynamic'`,
`Cache-Control: no-store`, and `X-Robots-Tag: noindex`. The paths are declared in
`public/.well-known/apple-app-site-association` and `assetlinks.json` — changing a path
requires editing those files and the app side too.

### Internal admin dashboard (`/admin`)

Team-only brand analytics (KAN-50). Auth is Supabase Google OAuth via `@supabase/ssr`,
entirely server-side (`lib/supabase/server.ts` for pages/actions/route handlers,
`lib/supabase/proxy.ts` for `proxy.ts`), so the CSP's `connect-src 'self'` is untouched —
keep it that way; never create a browser Supabase client here. Authorization is RLS: the
app repo's migrations add an `admin_users` allowlist, an `is_admin()` helper, and
staff-read SELECT policies on the event tables. Every number comes from a
`security_invoker` view that aggregates the raw events on read, per store (or product)
and Taipei calendar month: `analytics_store_monthly_summary`, `analytics_product_monthly_summary`,
`scan_store_monthly_summary` (the product view keeps the old table's name because
installed app versions read it). The site queries them through PostgREST with the signed-in user's
own session and the anon key — `lib/admin-analytics/data.ts` (paged, ordered reads),
`aggregate.ts` (period filtering and sums, pure), and `queries.ts` (one
`fetchOverview` / `fetchBrand` per page; it asks `is_admin()` first because RLS answers
a non-admin with empty results, not an error, and throws `AdminAccessDeniedError` which
each page turns into the `AccessDenied` card). `requireSession()`
(`lib/admin-analytics/session.ts`, React `cache`) only verifies the JWT locally with
`getClaims()`. Image paths become URLs via `lib/images.ts`.

`proxy.ts` now matches `/admin/:path*` too: it refreshes the session cookie and bounces
anonymous visitors to `/admin/login`; `/admin/login` and `/admin/auth/callback` are the
only unauthenticated paths. All `/admin` responses are `no-store` + `noindex`, and
`robots.ts` disallows the prefix.

Copy is zh-TW only and written inline in the admin components and helpers: the
`lib/copy.ts` rule does not apply here (internal tool, no language switch). Pure helpers under
`lib/admin-analytics/` use relative `.ts` imports; `allowImportingTsExtensions` in
`tsconfig.json` exists for that.

Onboarding a teammate: they sign in once at `/admin/login`, then someone runs
`insert into admin_users (user_id) select id from auth.users where email = '<their email>'`
in the Supabase SQL editor. The Google provider needs a Web client ID + secret and
`https://tryzeon.com/admin/auth/callback` (plus the localhost equivalent) in Auth →
URL Configuration → Redirect URLs.

### Content and SEO wiring

- User-visible copy belongs in `lib/copy.ts` (`copy`, `as const`) and `lib/faq-data.ts`
  (`faqItems`). Never hardcode user-facing strings in components. Homepage sections take
  their slice (`HomeCopy['brands']` …) as a `copy` prop; `/business` and `/download` read
  `copy.business` / `copy.download`. Server SEO copy (`metadata`) stays in each `page.tsx`.
- Every string in `copy.ts`, `faq-data.ts` and page/layout `metadata` must respect the
  redlines below; check them by hand when editing copy. Components index into some copy
  lists by position, so keep list lengths stable.
- String headings and ledes go through `components/clauseWrap.tsx` (also used inside
  `SectionHeader`) so CJK lines only break after 「，；：。」.
  Long ledes use its `sentenceWrap`, which splits at 「。」 only.
- Real App screenshots: paths and dimensions live in `lib/app-images.ts` (`APP_IMAGES`,
  `TRYON_VIDEO`, `GET_QR_SRC`), alt text in `copy.images`. Every referenced file must exist and nothing in
  `public/` may be 500KB or larger. Screenshots go
  in `PhoneFrame` unedited (no drawn mock UIs). No visible 「AI 生成」 caption under images
  with AI-generated people (removed on request); the alt text still says so.
- The site has no programs/accelerators, awards, sustainability / SDG copy, MOU count or team
  section anywhere (all removed on request); those stay in the pitch deck.
- FAQs are per page, not a central FAQ page, and each question lives in exactly one place. The
  homepage `faqItems` is a short router: what Tryzeon is, how it differs from general AI tools,
  speed/accuracy, then one question each that sends brands to `/business` and shoppers to
  `/download` (an item's optional `link` renders under the answer). Brand detail questions live
  in `brandFaqGroups` on `/business#faq`, grouped in the order a brand decides (適用範圍 → 費用與導入
  → 數據與素材). There is no FAQ item in the top nav; the footer links `/business#faq`. Don't add
  a question whose answer the team hasn't settled (data ownership, contract terms, shopper pricing,
  whether photos train the model…) — leave it out instead of hedging.
- `app/page.tsx` generates FAQPage JSON-LD from `faqItems`, and `app/business/page.tsx` from the
  flattened `brandFaqGroups`, so FAQ edits change structured data as well as the rendered
  accordion.
- Company registration (統一編號 82970406, registered address) is shown from
  `copy.footer.company` and repeated in the Organization JSON-LD in `app/layout.tsx` — change
  both together.
- Adding or removing a public page means updating `app/sitemap.ts`, the route table above, and the
  Footer columns in `copy.footer`.
- Tryzeon's own LINE OA is `@tryzeon` (`copy.contact.lineOa`; QR at `LINE_OA_QR_SRC`). It is
  a consumer try-on channel with no human replies, so it appears only where shoppers try
  things (the homepage LINE section's 「親自試試」, `/download`, the footer's 產品 column) —
  never as a contact route in 聯絡 or on `/business`.
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
have been deleted, as were `FabricFlow` and `BentoFeatures`, which were replaced by real App
screenshots (`ExperienceShowcase`), and `ScrollManifesto` (the「別人做工具，我們做生態系」
section, cut in the 2026-10 content audit as a slogan with no information for brands).
Don't resurrect them from git history — MASTER.md bans pain-point / stats /
market-analysis sections, and `StatsCinema` in particular hardcoded the banned
84% / 71% figures, so re-importing it would ship a redline violation.

## Design system

**`design-system/tryzeon/MASTER.md` is the source of truth for all UI work — read it before
touching visuals.** Identity: Editorial Tech × Liquid Glass, light only. Hard rules from it:

- Palette is blue→cyan only (`#2563EB → #60A5FA → #06B6D4`) on `#FAFAFA`/`#FFFFFF`.
  Purple/pink/rainbow gradients are banned; the Footer is the only dark section allowed.
- One continuous `#FAFAFA` canvas: every section sits on the same background and is separated
  by whitespace and its heading — never alternate `#FFF` / `#FAFAFA` bands (a ~2% step reads as
  a rendering seam on some screens). White is for surfaces (cards, glass); the Footer is the only
  background change.
- Default surface is frosted glass (`bg-white/70 backdrop-blur-xl border border-white/60`),
  never flat opaque colored blocks.
- Motion is slow and fluid: 400–600ms, `cubic-bezier(0.16, 1, 0.3, 1)` ease-out,
  0.06–0.15s stagger; continuous animation only for ambient shader/aurora layers (exception: the
  engine flywheel's comet, at the owner's request).
- CJK typography: display headings are `font-black` + `.cjk-punct` (halt punctuation trim);
  serif quotes declare `font-semibold` explicitly (Noto Serif TC has no 400); no italic on
  Chinese.
- Lucide SVG icons only, no emoji; visible focus states; ≥4.5:1 contrast; responsive at
  375 / 768 / 1024 / 1440 with no horizontal scroll.

## Conventions

- Components use **named** exports (`export function Foo`) — except `HomePageClient`'s
  default export. PascalCase filenames. `'use client'` at the top of client components.
- Props always get an `interface`. No `any` — use `unknown` + narrowing. Constant objects
  get `as const`.
- Import order: React → Next.js → third-party → `@/` internal → relative. `@/*` maps to
  the repo root.
- Split components past ~300 lines.
- JSX attribute strings use double quotes (`className="…"`).
- Use semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`). Prefer CSS /
  Framer animation over `useEffect`-driven DOM work.
- Code splitting is decided by SEO impact, not by fold position: SEO-relevant content
  (product copy, features, FAQ) must be statically imported so it ships in the SSR HTML;
  only heavy pure-visual/interactive pieces may get `dynamic(..., { ssr: false })` (nothing
  uses it today; `GradientWave` in `HeroCinema` is imported statically). When unsure,
  import statically.
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

Voice: technical but not cold, professional but approachable. Headings are Traditional
Chinese; subheads and descriptions may mix in English terms.

### Positioning (2026-10)

**Vertical Fashion AI · 時尚 AI 生態系** — connecting shoppers, fashion brands and garment
makers. Integration is the entry point (brands list once — Excel / voice / photo with AI
tagging — and go live on the Tryzeon app, LINE OA, brand-site embed and in-store QR), data is
the fuel (every try-on, recommendation and browse), AI is the engine (one shared engine;
cross-brand styling on Tryzeon; the site never says brand channels recommend only their own
products — that is not the long-term plan). Garment makers (「成衣廠」) are a direction, not a
current feature, and the site doesn't mention them; never put them in present-tense
positioning (hero, footer, metadata, FAQ).
Revenue model is brand-side: usage-based try-on billing with the first 3 months free, a
recommendation module (setup + monthly), and planned platform ads and trend data. **The site
states no fees, billing model or promotions (no 「前三個月免費」, no 「依試穿用量計費」) and no
brand-side data-security strip** — pricing is discussed by email. Company is **pre-revenue**;
consumers use it free (「免費下載」 for the app is fine).

### ⛔ Outward-facing redlines (violating these is a serious error)

1. **Never use the 84% stat** — it has no reliable source. 61% / 71% (2016 Retail
   Perceptions) may appear as on-screen text only, never cited aloud as sourced.
2. **Conversion-rate figures must be attributed to Deloitte or Shopify** on screen;
   market-size figures to Grand View Research.
3. **No return-rate claims of any kind** ("reduces returns by X%", "減少退貨"). Consumer-
   side framing is only「打破想像的隔閡」(closing the imagination gap). In a B2B or
   sustainability context, "precise buying reduces overstock and textile waste" is fine.
4. **Never describe in-development features as shipped.** Live: dual-platform app,
   LINE OA (LIFF), in-store QR, brand-site embed, brand listing tools (Excel / voice /
   photo AI tagging), AI Fashion Agent with the body-fit filter and its green / yellow / red
   fit labels (極適合 / 待考慮 / 不適合), per-product try-on rate in the brand backend,
   try-on video usable as IG marketing material, try-on data feeding back into the engine.
   Try-on covers tops, trousers, skirts, outerwear and one-pieces; onboarding takes about a
   month; a brand may connect a single channel.
   In development: platform integrations (SHOPLINE / Shopify / Cyberbiz / 91APP), the three
   patent directions.
5. **Pre-revenue** — never imply revenue, paying customers, or a running paid
   subscription (payments are sandbox-only).
6. **"Benchmarked against ISO 27001" — never "certified".** Keep security wording exact:
   it is SSL/TLS in transit plus RLS/JWT, *not* end-to-end encryption (try-on requires
   server-side compute, so E2EE is technically false).
7. **No partner logos until contracts are signed**; never describe a prospect as a
   confirmed partner.
8. **Never name third-party or internal AI models** (Gemini, nano-banana, Veo3 …). Public
   wording is「團隊自研的 AI 試穿架構」. Don't call it Tryzeon's own / proprietary model: training an
   own model is a later roadmap step in the pitch deck, so the site must not imply it already exists.
9. **State technical specs honestly**: static try-on about 15–20s, dynamic video
   about 1 minute (measured 2026-10-13: 16s / 61s). No rounding down into a stronger
   claim; the old 5–7 / 10–15 秒 figures are banned.
10. Market-claim boundary: "no leader yet in Asian AI OMO integration" is fair; **"no
    leader in virtual try-on" is not** (Perfect Corp is the counter-example).

Sources must be nameable before a number goes on the site. If it cannot be attributed,
leave it out. The company name is always written "Tryzeon".

### Homepage scope

The homepage presents the product, professionally — nothing else. No milestones / awards,
first-party metrics, roadmap, team, market-size or brand-count sections, even when the pitch
deck has them. Those stay in the deck.

## Git

- Commit format `type(scope): description` with `feat` / `fix` / `refactor` / `style` /
  `perf` / `docs` / `chore`.
- **Write commit messages in English**, even though older history is in Chinese.
- `git pull --rebase origin main` before pushing. `main` is the only long-lived branch.
