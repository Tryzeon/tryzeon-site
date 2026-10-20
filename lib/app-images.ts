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
