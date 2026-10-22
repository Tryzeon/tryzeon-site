# 中英語言切換 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 官網加上中／英切換：中文維持現有網址，英文版在 `/en/...`，導覽列有切換鈕，切過去停在同一頁。

**Architecture:** 不加 i18n 套件、不改 root layout。新增 `app/en/` 子樹（`/en`、`/en/business`、`/en/about`、`/en/download`），頁面本體抽成吃 `locale` 的共用元件，中英兩條路由各自是薄殼（只放 metadata）。文案維持「單一來源」：`lib/copy.ts`（中）＋ `lib/copy.en.ts`（英），型別強制兩份結構與陣列長度完全一致。

**Tech Stack:** Next.js 16 App Router、React 18、TypeScript strict。無新依賴。

**Spec:** 無獨立規格書；需求來自對話（「網站做一個中英切換的功能」，目的：拓展海外市場）。下面「已做的決定」就是規格。

**前置（已完成，另一個 commit）:** 原本寫死的對外字串已全部收進 `lib/copy.ts`：`meta`（各頁 title／description／分享文字、`ogCard`、`manifest`、JSON-LD description）、`a11y.skipToContent`、`legalPage.back`、`notice`（404、錯誤、短連結、App fallback）、願景引言的「」。只剩 `/privacy`、`/terms` 內文與 `/admin` 寫在頁面裡。所以下面的 task 不需要再從頁面抽字串，metadata 直接取 `getCopy(locale).meta.*`。

## 已做的決定（我的判斷，你可以推翻）

| # | 決定 | 理由 |
|---|---|---|
| D1 | 中文網址不變，英文在 `/en/*` | 既有連結、QR、SEO 全部不動；子路徑是 Google 建議的多語做法 |
| D2 | 不依瀏覽器語言自動導向 | 爬蟲與用英文系統的台灣使用者會被誤導；只靠切換鈕＋hreflang |
| D3 | `<html lang="zh-TW">` 不動；`/en` 子樹包一層 `<div lang="en">` | 改 html lang 需要拆成兩個 root layout，會碰到 Lenis／template／not-found 這些脆弱的地方。Google 讀的是 hreflang 不是 html lang，螢幕閱讀器認元素層級的 lang |
| D4 | 英文版涵蓋 `/`、`/business`、`/about`、`/download` | 這四頁是對外說明公司的頁面 |
| D5 | 法律頁（privacy / terms / delete-account）、短連結、`/store` `/product` fallback、`/admin` 維持只有中文 | 法律文字要有法務看過的英文版才能上；其餘是台灣消費者或內部用 |
| D6 | 英文頁尾的法律連結指向中文頁，標「(Chinese)」 | 不讓英文讀者點進去才發現是中文 |
| D7 | 切換鈕放導覽列（桌機在 CTA 左邊、手機在選單內），顯示「EN」／「中文」 | 最常見、最好找的位置 |
| D8 | 英文文案由實作者依紅線起草，**上線前要團隊審過** | 文案就是對海外品牌的門面 |

## 需要你決定（不擋開工，Task 1 前回覆即可）

1. **公司英文正式名稱**：經濟部有登記英文名稱嗎？沒有的話，英文頁尾就寫「創然科技有限公司 (Tryzeon)」。
2. **英文地址**：頁尾地址要用郵局標準英譯（Rm. A163, 2F.-1, No. 17, Nanke 3rd Rd., Xinshi Dist., Tainan City, Taiwan），還是英文版不顯示地址？
3. **App 在海外上架了嗎**：如果 App Store／Google Play 只開放台灣區，`/en/download` 要加一句 "Currently available in Taiwan"，不然海外讀者點下去會找不到。

## Global Constraints

- 英文文案一樣受 CLAUDE.md 的十條紅線約束，用語固定如下（Task 1 照抄）：
  - 團隊自研的 AI 試穿架構 → "an AI try-on architecture developed by our team"；**不可**寫 proprietary model / our own model / in-house model
  - 不可出現任何 AI 模型名（Gemini、Veo…）
  - 靜態試穿 "about 15–20 seconds"、動態影片 "about 1 minute"
  - 不可有 return rate / reduce returns；消費者面只能說 "closing the imagination gap"
  - ISO 27001 → "benchmarked against ISO 27001"，不可寫 certified；不可寫 end-to-end encryption
  - 不可寫費用、計費方式、免費期；不可暗示已有營收或付費客戶
  - 不可提成衣廠 / garment makers
  - 開發中功能（SHOPLINE / Shopify / Cyberbiz / 91APP 串接、專利）不可寫成已上線
  - 公司名永遠寫 "Tryzeon"
- 固定譯名：LINE 官方帳號 → "LINE Official Account"；預約導入諮詢 → "Book a consultation"；試穿率 → "try-on rate"；極適合／待考慮／不適合 → "Great fit / Worth a look / Not a fit"；門市 QR Code → "in-store QR code"；中小服飾品牌 → "small and mid-sized fashion brands"；時尚 AI 生態系 → "a fashion AI ecosystem"
- 不加 npm 依賴；不動 `next.config.js` 的 security headers
- 中文頁面的輸出不得改變（Task 3 起用「改動前後的中文頁面文字 diff」驗證）
- `noUnusedLocals`：每個 task 結束都要 `npm run type-check` 乾淨
- 驗證 = `npm run type-check` ＋ `npm run build` ＋ 瀏覽器截圖（375 / 768 / 1024 / 1440，用 headless Chrome、PORT=3002）

## Review Focus

1. **英文頁裡的站內連結漏掉 `/en`**：點英文頁尾「About」卻跳回中文 `/about`。→ Task 2 的 `localePath` 測試＋Task 4 的連結掃描。
2. **在英文首頁點 `/en#line` 類錨點不會捲動**：`samePageTarget` 用 pathname 比對，`/en` 與 `/en#line` 必須判定為同頁。→ Task 2 測試。
3. **切換語言時落點錯誤**：在 `/en/business` 按「中文」應到 `/business`；在 `/privacy` 這種沒有英文版的頁面，切換鈕不該出現或指到不存在的 `/en/privacy`。→ Task 5。
4. **英文長字串撐爆版面**：英文比中文長 1.5–2 倍，hero 標題、按鈕、四通路卡片、頁尾欄位在 375px 可能橫向溢出。→ Task 7 截圖檢查。
5. **`/en/不存在的路徑` 顯示中文 404**。→ Task 4 的 en not-found。

---

### Task 1: 英文文案與共用型別

**Files:**
- Create: `lib/copy-types.ts`
- Create: `lib/copy.en.ts`
- Create: `lib/faq-data.en.ts`
- Modify: `lib/copy.ts:1-2`（檔頭註解：移除「網站不做多語系」）、`lib/copy.ts:333-335`（型別改從 `copy-types` 匯出）
- Modify: `lib/faq-data.ts`（`faqItems`、`brandFaqGroups` 加 `as const`，供型別推導）

**Interfaces:**
- Produces:
  - `type DeepWiden<T>`：把 `as const` 的字面量型別放寬成 `string`／`number`，**保留 tuple 長度與 readonly**
  - `type SiteCopy = DeepWiden<typeof copy>`、`type FaqItems = DeepWiden<typeof faqItems>`、`type BrandFaqGroups = DeepWiden<typeof brandFaqGroups>`
  - `HomeCopy = SiteCopy['home']`、`AboutCopy = SiteCopy['about']`（取代原本 `typeof copy.home`，讓元件 props 同時接受中英）
  - `export const copyEn: SiteCopy`、`export const faqItemsEn: FaqItems`、`export const brandFaqGroupsEn: BrandFaqGroups`

- [ ] **Step 1:** 寫 `lib/copy-types.ts` 的 `DeepWiden`（字串→string、數字→number、tuple 逐項 map、物件逐鍵 map），以及上面的型別。
- [ ] **Step 2:** 寫 `lib/copy.en.ts`，key 與順序與 `copy.ts` 一一對應（含 `meta`、`a11y`、`notice`）。`meta.manifest` 照抄中文（manifest 全站一份，維持中文）；`notice.shortLink`、`notice.appFallback`、`legalPage`、`meta.privacy/terms/deleteAccount` 照抄中文（D5，型別要求存在但英文版用不到）；`about.vision.quote` 的「」改成 “ ”。站內 href **直接寫英文路徑**：`'/#line'` → `'/en#line'`、`'/about#engine'` → `'/en/about#engine'`；外部連結、mailto 不變；`footer.legal` 與 `download` 裡的法律連結維持中文路徑、label 加 " (Chinese)"（D6）。`footer.company` 依「需要你決定」第 1、2 題的答案。`business.emailSubject` 譯成英文。
- [ ] **Step 3:** 寫 `lib/faq-data.en.ts`，同樣規則（`link.href` 用 `/en/...`）。
- [ ] **Step 4:** `npm run type-check` → 0 errors。故意刪掉 `copyEn.home.hero.titleLines` 的一行再跑一次，應該報 tuple 長度錯誤，確認型別真的有在擋；改回。
- [ ] **Step 5:** 紅線掃描，以下每條都應該沒有輸出：
  ```bash
  grep -niE "proprietary|our own model|in-house model|gemini|veo|nano|return rate|reduce returns|certified|end-to-end|free for|pricing|garment maker|84%" lib/copy.en.ts lib/faq-data.en.ts
  grep -nE "href: '/(business|about|download|#)" lib/copy.en.ts lib/faq-data.en.ts
  ```
- [ ] **Step 6:** Commit：`feat(i18n): add English copy mirroring lib/copy.ts`

---

### Task 2: locale 工具與取文案的入口

**Files:**
- Create: `lib/i18n.ts`
- Create: `lib/get-copy.ts`
- Create: `components/useCopy.ts`（`'use client'`）

**Interfaces:**
- Consumes: Task 1 的 `copyEn`、`faqItemsEn`、`brandFaqGroupsEn`、型別
- Produces:
  - `lib/i18n.ts`
    - `export const LOCALES = ['zh-TW', 'en'] as const; export type Locale = (typeof LOCALES)[number];`
    - `export const LOCALIZED_PATHS = ['/', '/business', '/about', '/download'] as const`
    - `localeFromPathname(pathname: string): Locale` — `/en` 或 `/en/...` → `'en'`，其餘 `'zh-TW'`
    - `stripLocale(pathname: string): string` — `/en` → `/`、`/en/business` → `/business`，非英文路徑原樣回傳
    - `localePath(locale: Locale, href: string): string` — 只改 `LOCALIZED_PATHS` 內的站內路徑（保留 `#hash`）；`/` → `/en`、`/#line` → `/en#line`、`/business#faq` → `/en/business#faq`；外部、mailto、法律頁、`zh-TW` 一律原樣
    - `switchLocaleHref(pathname: string, target: Locale): string | null` — 目前頁沒有另一語版本時回 `null`
    - `export const HTML_LANG: Record<Locale, string> = { 'zh-TW': 'zh-TW', en: 'en' }`、`OG_LOCALE: Record<Locale, string> = { 'zh-TW': 'zh_TW', en: 'en_US' }`
  - `lib/get-copy.ts`：`getCopy(locale: Locale): SiteCopy`、`getFaq(locale: Locale): { faqItems: FaqItems; brandFaqGroups: BrandFaqGroups }`
  - `components/useCopy.ts`：`useLocale(): Locale`（由 `usePathname()` 推得）、`useCopy(): SiteCopy`

- [ ] **Step 1:** 實作 `lib/i18n.ts`。純函式，沒有 React。
- [ ] **Step 2:** 專案沒有測試框架、不加依賴，用 Node 內建 TS 執行做一次性斷言（Node ≥ 22.6 的 `--experimental-strip-types`；`lib/i18n.ts` 不能 import `@/` 路徑才跑得動）。寫在 scratchpad，不進 repo：
  ```ts
  import assert from 'node:assert/strict';
  import { localePath, stripLocale, localeFromPathname, switchLocaleHref } from '<repo>/lib/i18n.ts';
  assert.equal(localePath('en', '/'), '/en');
  assert.equal(localePath('en', '/#line'), '/en#line');
  assert.equal(localePath('en', '/business#faq'), '/en/business#faq');
  assert.equal(localePath('en', '/privacy'), '/privacy');
  assert.equal(localePath('en', 'mailto:contact@tryzeon.com'), 'mailto:contact@tryzeon.com');
  assert.equal(localePath('en', 'https://line.me/R/ti/p/@tryzeon'), 'https://line.me/R/ti/p/@tryzeon');
  assert.equal(localePath('zh-TW', '/business'), '/business');
  assert.equal(stripLocale('/en'), '/');
  assert.equal(stripLocale('/en/about'), '/about');
  assert.equal(stripLocale('/english'), '/english');           // 前綴要整段比對
  assert.equal(localeFromPathname('/en/download'), 'en');
  assert.equal(localeFromPathname('/entry'), 'zh-TW');
  assert.equal(switchLocaleHref('/en/business', 'zh-TW'), '/business');
  assert.equal(switchLocaleHref('/about', 'en'), '/en/about');
  assert.equal(switchLocaleHref('/privacy', 'en'), null);
  ```
  Run: `node --experimental-strip-types <scratchpad>/i18n.check.ts` → 無輸出、exit 0。
- [ ] **Step 3:** 實作 `getCopy` / `getFaq` / `useLocale` / `useCopy`。
- [ ] **Step 4:** 確認 `lib/section-nav.ts` 的 `samePageTarget('/en#line', '/en')` 回 `{ id: 'line' }`、`samePageTarget('/en', '/en')` 回 `'top'`（現行邏輯應已成立，加進 Step 2 的斷言檔一起跑；若不成立，修 `samePageTarget`）。
- [ ] **Step 5:** `npm run type-check` → 0 errors。Commit：`feat(i18n): add locale helpers and copy accessors`

---

### Task 3: 元件改吃 locale（中文輸出不變）

**Files（Modify）:**
- Client 元件改用 `useCopy()` 取代 `import { copy }`：`components/Navigation.tsx`、`HomePageClient.tsx`、`ChannelSync.tsx`、`EngineFlywheel.tsx`、`ExperienceShowcase.tsx`、`HeroCinema.tsx`、`LineFlow.tsx`、`ListingDemos.tsx`、`ListingStudio.tsx`、`TryOnVideo.tsx`
- 沒有 `'use client'` 的共用元件加 `locale: Locale` prop，內部 `getCopy(locale)`：`components/Footer.tsx`、`AppScreen.tsx`、`BrandBenefits.tsx`（client 呼叫端用 `useLocale()` 傳進去）
- 元件裡寫死的站內 href 改走 `localePath(locale, …)`：`Navigation.tsx` 的 `navigationItems`、`HomePageClient.tsx` CTA 的 `href="/business"`、`Navigation.tsx` logo 連結
- 掛在 root layout、`/en` 子樹之外的東西改從網址判斷語言：`components/Accessibility.tsx`（加 `'use client'`，用 `useCopy()`）、`app/error.tsx`（已是 client，改 `useCopy()`）
- `components/Notice.tsx`：加選填 `locale?: Locale`（預設 `'zh-TW'`），返回連結文字取 `getCopy(locale).notice.home`、href 取 `localePath(locale, '/')`
- `components/clauseWrap.tsx:27`：`KEEP_TOGETHER` 加上 `LINE Official Account`

**Interfaces:**
- Consumes: Task 2 的 `useCopy`、`useLocale`、`getCopy`、`localePath`、`Locale`
- Produces: `Footer({ locale }: { locale: Locale })`、`AppScreen` / `BrandBenefits` 多一個必填 `locale` prop

- [ ] **Step 1（基準線，先做）:** 在 main 上 `npm run build`，把 `.next/server/app/{index,business,about,download}.html` 抽成純文字存到 scratchpad：
  ```bash
  python3 -I -c "import re,sys,html;t=open(sys.argv[1]).read();t=re.sub(r'<(script|style)[^>]*>.*?</\1>','',t,flags=re.S);print(html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',t))))" .next/server/app/business.html > <scratchpad>/before-business.txt
  ```
  （四頁各一份。）
- [ ] **Step 2:** 依上面清單改元件。`Navigation` 的 `isCurrent` 改用 `stripLocale(pathname)` 比對。
- [ ] **Step 3:** 各 `page.tsx` 呼叫 `<Footer locale="zh-TW" />` 等，先讓中文頁 type-check 過。
- [ ] **Step 4:** `npm run type-check && npm run build`，重新抽四頁純文字，`diff before-*.txt after-*.txt` → **無差異**。
- [ ] **Step 5:** `grep -rn "from '@/lib/copy'" components app` → 只剩 `lib/get-copy.ts` 與 `lib/copy-types.ts` 會 import（`page.tsx` 的 metadata 不用 copy，不受影響）。
- [ ] **Step 6:** Commit：`refactor(i18n): read copy through locale-aware accessors`

---

### Task 4: 英文路由

**Files:**
- Create: `components/pages/HomePage.tsx`、`BusinessPage.tsx`、`AboutPage.tsx`、`DownloadPage.tsx` — 從各 `app/**/page.tsx` 搬出頁面本體（含 FAQ JSON-LD），簽名 `export function BusinessPage({ locale }: { locale: Locale })`
- Modify: `app/page.tsx`、`app/business/page.tsx`、`app/about/page.tsx`、`app/download/page.tsx` — 只剩 `metadata`、`revalidate = 3600`、`<XxxPage locale="zh-TW" />`
- Create: `app/en/layout.tsx` — 回傳 `<div lang="en">{children}</div>`；export 英文的 `metadata`（`title.template: '%s | Tryzeon'`、`title.default`、`description`、`openGraph.locale: 'en_US'`）
- Create: `app/en/page.tsx`、`app/en/business/page.tsx`、`app/en/about/page.tsx`、`app/en/download/page.tsx` — 同上的薄殼，`locale="en"`、英文 metadata
- Create: `app/en/[...rest]/page.tsx`（呼叫 `notFound()`）＋ `app/en/not-found.tsx`（同 `app/not-found.tsx`，但取 `copyEn.notice.notFound`，其 `links` 在 Task 1 已寫成 `/en`、`/en/business`、`/en/download`；`Notice` 傳 `locale="en"`）
- 英文殼的 metadata 一律 `pageMetadata({ locale: 'en', path, ...getCopy('en').meta.<page> })`，不在殼裡寫字串

**Interfaces:**
- Consumes: Task 3 的 locale-aware 元件、Task 2 的 `getFaq`
- Produces: 四個 `components/pages/*Page.tsx`；Task 6 會改這些 `page.tsx` 的 metadata

- [ ] **Step 1:** 搬頁面本體到 `components/pages/`，中文 `page.tsx` 變薄殼。`app/page.tsx` 的 FAQ JSON-LD 改用 `getFaq(locale).faqItems`，`/business` 同理用 `brandFaqGroups`。
- [ ] **Step 2:** `npm run build`，重跑 Task 3 Step 4 的中文 diff → 仍無差異。
- [ ] **Step 3:** 建 `app/en/*` 薄殼與 layout、not-found。英文 metadata 的 title / description 依 Global Constraints 用語。
- [ ] **Step 4:** `npm run type-check && npm run build`，build 輸出的路由表要列出 `/en`、`/en/business`、`/en/about`、`/en/download` 且皆為靜態（○ 或 ISR，不是 ƒ）。
- [ ] **Step 5:** 連結掃描：`npm run start -- -p 3002` 後
  ```bash
  for p in en en/business en/about en/download; do curl -s localhost:3002/$p | grep -oE 'href="/[^"]*"' ; done | sort -u
  ```
  輸出裡除了 `/privacy`、`/terms`、`/delete-account`、`/download/ios`、`/download/android`、`/_next/...`、`/opengraph-image` 之外，每條都必須以 `/en` 開頭。
- [ ] **Step 6:** `curl -s -o /dev/null -w '%{http_code}' localhost:3002/en/nope` → `404`，且頁面內容是英文。
- [ ] **Step 7:** Commit：`feat(i18n): add /en routes for the four public pages`

---

### Task 5: 導覽列的語言切換鈕

**Files:**
- Create: `components/LanguageSwitch.tsx`（`'use client'`，named export）
- Modify: `components/Navigation.tsx`（桌機：放在 CTA 左邊；手機：放在選單底部）
- Modify: `lib/copy.ts` / `lib/copy.en.ts` 的 `nav` 加 `switchLabel`（按鈕文字：中文頁顯示 `'EN'`、英文頁顯示 `'中文'`）與 `switchAria`（`'Switch to English'` / `'切換為中文'`）

**Interfaces:**
- Consumes: `switchLocaleHref`、`useLocale`、`useCopy`
- Produces: `LanguageSwitch({ className }: { className?: string })`

- [ ] **Step 1:** `LanguageSwitch` 用 `next/link`，`href = switchLocaleHref(pathname, otherLocale)`；回 `null` 時整個元件不渲染（法律頁、短連結頁不顯示）。`hrefLang` 與 `lang` 屬性設成目標語言。樣式沿用導覽列既有的連結 class 與 `focus-ring`；icon 用 lucide `Languages`。
- [ ] **Step 2:** 掛進 `Navigation`，手機選單點了要關閉選單（沿用 `handleItemClick` 的 `setIsMobileMenuOpen(false)`）。
- [ ] **Step 3:** `npm run type-check && npm run build`。
- [ ] **Step 4:** 手動驗證（headless Chrome、PORT=3002）：
  - `/business` 捲到一半點「EN」→ 落在 `/en/business` 頂端，Lenis 正常捲動（CLAUDE.md scroll 第 9 點的 stop/start/resize 有生效）
  - `/en/about` 點「中文」→ `/about`
  - `/privacy` 的導覽列沒有切換鈕
  - 鍵盤 Tab 能聚焦到切換鈕且有可見 focus ring
- [ ] **Step 5:** Commit：`feat(nav): add language switch`

---

### Task 6: SEO（hreflang、sitemap、分享圖）

**Files:**
- Modify: `lib/page-metadata.ts` — `PageMetadataInput` 加 `locale: Locale`；輸出 `alternates.languages: { 'zh-TW': path, en: localePath('en', path), 'x-default': path }`、`openGraph.locale: OG_LOCALE[locale]`、`openGraph.alternateLocale`、分享圖 url 與 alt 依 locale
- Modify: `app/page.tsx` 與 `app/en/page.tsx` 的 metadata 也補上同樣的 `alternates.languages`
- Modify: `app/_og/card.tsx` — `renderOgCard(locale: Locale = 'zh-TW')`，改取 `getCopy(locale).meta.ogCard`（英文字串在 Task 1 已寫好）
- Create: `app/en/opengraph-image.tsx`（同 `app/opengraph-image.tsx`，傳 `'en'`）
- Modify: `app/sitemap.ts` — 四個有英文版的頁面各多一筆 `/en/...`，兩筆都帶 `alternates: { languages: { 'zh-TW': …, en: … } }`
- Modify: `app/layout.tsx` — JSON-LD `WebSite.inLanguage` 改成 `['zh-TW', 'en']`（Organization 不動）

- [ ] **Step 1:** 改 `pageMetadata` 並更新所有呼叫端（type-check 會列出漏掉的）。
- [ ] **Step 2:** OG 卡片與 `app/en/opengraph-image.tsx`。
- [ ] **Step 3:** sitemap。
- [ ] **Step 4:** `npm run build && npm run start -- -p 3002`，驗證：
  ```bash
  curl -s localhost:3002/en/business | grep -oE '<link rel="alternate" hrefLang="[^"]+" href="[^"]+"'
  # 應有 zh-TW → https://tryzeon.com/business、en → https://tryzeon.com/en/business、x-default → /business
  curl -s localhost:3002/business | grep -c 'hrefLang="en"'       # → 1
  curl -s localhost:3002/sitemap.xml | grep -c '/en'              # → ≥ 4
  curl -s -o /dev/null -w '%{content_type}' localhost:3002/en/opengraph-image   # → image/png
  curl -s localhost:3002/en | grep -o '"@type":"FAQPage"'         # → 有，且內容是英文
  ```
- [ ] **Step 5:** Commit：`feat(seo): add hreflang, English sitemap entries and share card`

---

### Task 7: 文件與整體視覺驗收

**Files:**
- Modify: `CLAUDE.md` — 「The site is zh-TW only…」改為描述 `/en` 子樹與 D3/D5；路由表加英文欄；Content and SEO wiring 加「英文文案在 `lib/copy.en.ts`、`lib/faq-data.en.ts`，結構由 `SiteCopy` 型別強制一致；紅線同樣適用英文」；「Adding or removing a public page」加上要同步 `app/en/` 與 `LOCALIZED_PATHS`
- Modify: `app/sitemap.ts` 上方若有路由註解一併更新

- [ ] **Step 1:** 更新 CLAUDE.md。
- [ ] **Step 2:** `npm run type-check && npm run build` → 皆通過。
- [ ] **Step 3:** headless Chrome 截圖：`/en`、`/en/business`、`/en/about`、`/en/download` × 375 / 768 / 1024 / 1440，逐張檢查：
  - 無橫向捲動（`document.documentElement.scrollWidth <= innerWidth`）
  - Hero 標題、按鈕、四通路卡片、頁尾欄位沒有溢出或擠壓
  - 英文標題用 Playfair 900（不是 fallback 字體）
  - `SectionHeader` 英文標題正常換行（`clauseWrap` 對英文是整段一個 inline-block，長標題要確認會在字間斷行）
- [ ] **Step 4:** 中文四頁同樣四個寬度各截一張，與 main 的截圖並排比對，沒有視覺差異（切換鈕除外）。
- [ ] **Step 5:** 英文文案交給團隊審（D8）。審完才合進 main／部署。
- [ ] **Step 6:** Commit：`docs: describe the /en subtree in CLAUDE.md`
