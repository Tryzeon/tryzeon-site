// 實機素材的單一來源：路徑與輸出尺寸。alt 文字在 lib/copy.ts 的 copy.images（同一組 key）。
// 截圖來自 tryzeon-demo-kit-v2（iOS 模擬器實機畫面，未修圖）；人像為 AI 生成，商品為示範店的示範商品。
export const APP_IMAGES = {
  tryonHero: { src: '/images/app/tryon-hero.webp', width: 900, height: 1957 },
  tryonOutfit: { src: '/images/app/tryon-outfit.webp', width: 900, height: 1957 },
  tryonTweed: { src: '/images/app/tryon-tweed.webp', width: 900, height: 1957 },
  fitGreen: { src: '/images/app/fit-green.webp', width: 900, height: 1957 },
  wardrobeGrid: { src: '/images/app/wardrobe-grid.webp', width: 900, height: 1957 },
  agentCommute: { src: '/images/app/agent-commute.webp', width: 900, height: 1957 },
  aiTagBefore: { src: '/images/app/ai-tag-before.webp', width: 900, height: 1957 },
  aiTagAfterTags: { src: '/images/app/ai-tag-after-tags.webp', width: 900, height: 1957 },
  voiceSizeShirt: { src: '/images/app/voice-size-result-shirt.webp', width: 900, height: 1957 },
  // LINE 截圖是 iPhone 實機（1179×2556），比例和 App 截圖差不到 0.3%，PhoneFrame 以 object-cover 填滿
  line1Ask: { src: '/images/app/line-1-ask.webp', width: 900, height: 1951 },
  line2Recommend: { src: '/images/app/line-2-recommend.webp', width: 900, height: 1951 },
  line3FittingRoom: { src: '/images/app/line-3-fitting-room.webp', width: 900, height: 1951 },
  line4Result: { src: '/images/app/line-4-result.webp', width: 900, height: 1951 },
  line5Product: { src: '/images/app/line-5-product.webp', width: 900, height: 1951 },
  // 四通路：App 與 LINE 是實機截圖；官網嵌入與門市 QR 是示意圖（示範官網頁面以瀏覽器渲染、門市場景為 AI 生成再貼上真實印刷稿）
  storePage: { src: '/images/app/store-page.webp', width: 900, height: 1957 },
  lineChatEntry: { src: '/images/app/line-chat-entry.webp', width: 900, height: 1951 },
  embedMobile: { src: '/images/app/embed-mobile.webp', width: 900, height: 1957 },
  storeQr: { src: '/images/app/store-qr.webp', width: 720, height: 1290 },
  modelA: { src: '/images/app/model-a.webp', width: 640, height: 954 },
  productHero: { src: '/images/app/product-cobalt-dress.webp', width: 480, height: 480 },
} as const;

export type AppImageName = keyof typeof APP_IMAGES;

// 動態試穿影片：App 生成的原檔（不是螢幕錄影），poster 取自同一支影片的第一格，播放前後畫面接得上。
// aria-label 在 copy.videos 的同名 key。
export const TRYON_VIDEOS = {
  street: { src: '/images/app/tryon-video.mp4', poster: '/images/app/tryon-video-poster.webp' },
} as const;

export type TryOnVideoName = keyof typeof TRYON_VIDEOS;

export const GET_QR_SRC = '/images/get-qr.svg';
// 加入 Tryzeon LINE 官方帳號（https://line.me/R/ti/p/@tryzeon）
export const LINE_OA_QR_SRC = '/images/line-oa-qr.svg';
