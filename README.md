# Tryzeon 官方網站

Tryzeon（創然科技有限公司）的官方網站 —— 為時尚產業而生的 AI（Vertical Fashion AI）。
網站只有繁體中文（zh-TW），讀者是品牌決策者、技術夥伴與評審。

## 技術棧

Next.js 16（App Router）· React 18 · TypeScript（strict）· Tailwind CSS 3 · Framer Motion ·
Lenis + GSAP（平滑捲動）· 原生 WebGL（首頁 Hero 的 GradientWave 背景）· Supabase（`/admin` 後台）

## 指令

```bash
npm run dev          # 開發伺服器 :3000
npm run type-check   # tsc --noEmit
npm run build        # 正式建置
```

專案沒有 linter / formatter（未安裝 eslint、prettier）。

## 網站結構

| 路徑 | 內容 |
|---|---|
| `/` | 產品總覽：定位、四通路、LINE 流程、消費者功能、共用 AI 引擎、願景、FAQ |
| `/about` | 關於我們：緣起、AI 引擎、願景（不放團隊） |
| `/business` | 品牌合作：導入流程、計費方式、合作申請 |
| `/download` | 下載 App：三步驟用法、隱私重點 |
| `/privacy`、`/terms`、`/delete-account` | 法律文件與刪除帳號說明 |
| `/get`、`/download/ios`、`/download/android` | 依裝置導向 App Store |
| `/store/*`、`/product/*` | App 深層連結的 fallback |
| `/s/[code]`、`/link-expired`、`/link-unavailable` | 門市 QR 短連結 |
| `/admin` | 內部品牌數據後台（需登入） |

## 文案與設計

- 對外文案集中在 `lib/copy.ts` 與 `lib/faq-data.ts`，修改時須遵守對外用語紅線。
- 設計系統：`design-system/tryzeon/MASTER.md`。
- 開發慣例與完整架構說明：`CLAUDE.md`。
