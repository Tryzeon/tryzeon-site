// 全站對外文案的單一來源（zh-TW），依 docs/superpowers/specs/2026-10-13-site-content-spec.md。
// 網站不做多語系；元件從這裡取字串，不在 JSX 裡硬寫。規格書沒寫的對外文字不放進來。
const CONTACT_EMAIL = 'contact@tryzeon.com';
// Tryzeon 自己的 LINE 官方帳號：消費者加入就能試穿各合作品牌的商品；沒有真人回覆合作詢問
const LINE_OA_ID = '@tryzeon';
const LINE_OA_URL = 'https://line.me/R/ti/p/@tryzeon';
// 首頁只留這一句，完整的 AI 引擎（說明＋飛輪）在 /about
const ENGINE_TITLE = '每一次試穿，都讓推薦更準。';

export const copy = {
  // 實機圖的 alt；key 對應 lib/app-images.ts 的 APP_IMAGES。人像皆為 AI 生成，圖下不加說明，在 alt 註明
  images: {
    tryonHero: 'Tryzeon App 試穿結果：穿上鈷藍緞面綁帶襯衫洋裝（AI 生成的示意人像）',
    tryonOutfit: 'Tryzeon App 整套試穿：海軍藍西裝外套、白襯衫與象牙白寬褲（AI 生成的示意人像）',
    tryonTweed: 'Tryzeon App 整套試穿：藍色粗花呢短外套與象牙白寬褲（AI 生成的示意人像）',
    tryonCurvy: 'Tryzeon App 試穿結果：曲線身形穿上同一件鈷藍洋裝（AI 生成的示意人像）',
    fitGreen: 'Tryzeon App 商品頁：依身形判斷建議尺寸 M，身高、肩寬、胸圍、腰圍、臀圍皆符合',
    fitCurvy: 'Tryzeon App 商品頁：曲線身形的建議尺寸為 XL，身高、肩寬、胸圍、腰圍、臀圍皆符合',
    agentCommute: 'Tryzeon App 穿搭顧問：依「見客戶的俐落穿搭」推薦整套示範店商品',
    agentWardrobe: 'Tryzeon App 穿搭顧問：以衣櫃裡的牛仔外套，搭配示範店的條紋針織與寬褲',
    aiTagBefore: 'Tryzeon 品牌後台：上傳商品照片，AI 分析中',
    aiTagAfterTags: 'Tryzeon 品牌後台：AI 自動標註風格、季節、材質與版型',
    voiceSizeShirt: 'Tryzeon 品牌後台：尺寸資訊頁，右上角的麥克風可語音建檔；白襯衫的四個尺寸已填好',
    dashboardRanking: 'Tryzeon 品牌後台：依試穿次數排列的熱門商品（示範店數據）',
    line1Ask: 'Tryzeon LINE 官方帳號：在聊天室輸入「幫我配一套週末穿搭」',
    line2Recommend: 'Tryzeon LINE 官方帳號：AI 推薦的整套穿搭卡片，卡片上可以直接試穿整套',
    line3FittingRoom: 'LINE 裡的試衣間：瀏覽示範店的商品',
    line4Result: 'LINE 聊天室裡的整套試穿結果：針織開衫、白襯衫與亞麻寬褲，下方列出每件單品（AI 生成的示意人像）',
    line5Product: 'LINE 裡的商品頁：開始試穿或前往購買',
    storePage: 'Tryzeon App 裡的示範店頁面：上架的商品同步出現在 App',
    lineChatEntry: 'Tryzeon LINE 官方帳號的聊天室與選單',
    embedMobile: '品牌官網嵌入的示意畫面：在手機版商品頁開啟 Tryzeon 虛擬試穿',
    embedDesktop: '品牌官網嵌入的示意畫面：在商品頁開啟 Tryzeon 虛擬試穿，看見試穿結果與建議尺寸',
    storeQr: '門市 QR Code 的示意畫面：店內的壓克力立牌，掃碼就能試穿（AI 生成的示意場景）',
    modelA: '試穿用的全身照（AI 生成的示意人像）',
    productHero: '示範商品：鈷藍緞面綁帶襯衫洋裝平拍圖',
    productTweed: '示範商品：藍色粗花呢短外套平拍圖',
  },
  // 動態試穿影片的 aria-label；key 對應 lib/app-images.ts 的 TRYON_VIDEOS
  videos: {
    street: 'Tryzeon App 動態試穿影片：穿著鈷藍洋裝在街頭走動、轉身（AI 生成的示意人像）',
    office: 'Tryzeon App 動態試穿影片：穿著西裝外套與寬褲在辦公室走動（AI 生成的示意人像）',
  },
  nav: {
    product: '產品',
    business: '品牌合作',
    about: '關於我們',
    cta: '預約導入諮詢',
    menuOpen: '開啟選單',
    menuClose: '關閉選單',
  },
  home: {
    hero: {
      titleLines: ['為時尚產業', '而生的 AI。'],
      sub: 'Tryzeon 為中小服飾品牌提供 AI 虛擬試穿與穿搭推薦。',
      service: '顧客在 Tryzeon App、LINE 官方帳號、品牌官網與門市都能試穿你的商品；每件商品的試穿率，你都看得到。',
      ctaPrimary: '預約導入諮詢',
      ctaSecondary: '下載 App',
    },
    // 四個通路寫品牌拿到什麼（讀者是品牌），不寫消費者怎麼用
    brands: {
      title: '上架一次，四個通路同步。',
      lede: 'Tryzeon 把你的 LINE 官方帳號、官網與門市接上同一套系統——顧客在哪裡逛，就在哪裡試穿。',
      status: '上線',
      channels: [
        { name: 'Tryzeon App', desc: '你的商品出現在 Tryzeon App，觸及正在找穿搭的消費者。' },
        { name: 'LINE 官方帳號', desc: '既有的 LINE 好友不用下載 App，在聊天室就能試穿。' },
        { name: '品牌官網嵌入', desc: '商品頁直接試穿，顧客不必離開你的官網。' },
        { name: '門市 QR Code', desc: '顧客在門市掃碼就能試穿，不必等試衣間。' },
      ],
      link: '了解品牌合作',
    },
    line: {
      title: '在聊天室裡，從一句話走到試穿。',
      lede: '消費者加入品牌的 LINE 官方帳號，不必另外下載 App，就能在聊天室完成對話、推薦、選品、試穿與導購。',
      // 聊天室裡的主流程；順序對應 LineFlow 的 STEP_SCREENS
      steps: [
        { title: '說出需求', quote: '「幫我配一套週末穿搭」', desc: '用聊天的方式描述想要的風格。' },
        { title: '推薦整套穿搭', quote: '', desc: 'AI Fashion Agent 搭好整套，每一件都是真實上架、可直接購買的商品。' },
        { title: '一鍵試穿整套', quote: '', desc: '點「試穿整套」，以一張全身照，約 15–20 秒就在聊天室看見上身。' },
        { title: '前往購買', quote: '', desc: '從試穿結果點進單品，喜歡就直接前往購買。' },
      ],
      // 和聊天平行的另一條路：LINE 裡的試衣間（LIFF）
      browse: {
        title: '不想聊天，也能自己逛',
        desc: '在 LINE 裡開啟試衣間，瀏覽品牌商品、挑單件試穿，或問 AI 顧問怎麼搭。',
      },
      link: '了解品牌合作',
      tryIt: {
        title: '親自試試',
        desc: `加入 Tryzeon 的 LINE 官方帳號 ${LINE_OA_ID}，在聊天室走一遍這個流程。`,
        cta: `加入 ${LINE_OA_ID}`,
        qrCaption: '用手機掃描加入',
        qrAlt: `加入 Tryzeon LINE 官方帳號 ${LINE_OA_ID} 的 QR Code`,
      },
    },
    // 寫給品牌看：你的顧客會得到的體驗；順序對應 ExperienceShowcase 的 SCREENS
    experience: {
      title: '你的顧客，買之前就看見上身。',
      lede: '一張全身照，就能看見自己穿上你的商品——讓穿搭決策不再靠想像。',
      items: [
        { title: 'AI 虛擬試穿', metric: '約 15–20 秒', desc: '顧客上傳一張全身照，就能看見自己穿上你的商品，不需要 3D 建模。' },
        { title: '動態試穿影片', metric: '約 1 分鐘', desc: '以第三人稱看自己穿上後走動、轉身；街頭、辦公室、派對等場景都能生成。' },
        { title: '虛擬試衣間', metric: '', desc: '自研身形合身演算法比對胸、腰、臀與服飾尺碼，以綠燈「極適合」、黃燈「待考慮」、紅燈「不適合」標示合身程度。' },
        { title: 'AI Fashion Agent', metric: '', desc: '依性別、年齡與風格偏好推薦穿搭，每一件都是真實上架、可直接購買的商品；鞋子與配件，以及顧客雲端衣櫃裡的衣服，都能一起搭配。' },
      ],
      link: '下載 App',
    },
    engine: {
      title: ENGINE_TITLE,
      link: '了解 AI 引擎',
    },
    faq: {
      title: '常見問題',
      lede: '第一次認識 Tryzeon？從這幾個問題開始。',
    },
    cta: {
      title: '讓你的品牌，接上時尚 AI。',
      primary: '了解品牌合作',
    },
  },
  business: {
    applyUrl: 'https://forms.gle/dZinwijRZWZVmNvM9',
    emailSubject: 'Tryzeon 品牌合作詢問',
    hero: {
      title: '把 AI 試穿，接上你的品牌。',
      lede: '上架一次，商品就同步到 Tryzeon App、LINE 官方帳號、品牌官網與門市 QR Code。',
      ctaPrimary: '預約導入諮詢',
      ctaSecondary: '來信洽談',
    },
    steps: {
      title: '三個步驟，完成導入。',
      items: [
        { title: '預約導入諮詢', desc: '填寫表單，我們會在 3 個工作天內與你聯絡，安排導入諮詢。' },
        { title: '上架商品', desc: 'Excel 批次上傳、語音建檔或拍照上傳，AI 自動標註；首批商品由專人協助。' },
        {
          title: '四通路上線',
          desc: '商品同步到 Tryzeon App、LINE 官方帳號、品牌官網與門市 QR Code。',
          link: { label: '看 LINE 上的實際流程', href: '/#line' },
        },
      ],
    },
    // 品牌端的上架操作只在這頁說明（首頁只講四通路）；順序對應 LISTING_ICONS
    listing: {
      label: '三種上架方式',
      items: [
        { title: 'Excel 批次上傳', desc: '既有的商品表直接匯入。' },
        { title: '拍照上傳', desc: 'AI 自動標註季節、風格、版型與適合族群。' },
        { title: '語音建檔', desc: '說出商品資訊，就能完成建檔。' },
      ],
      // 上架示範（ListingStudio）的字串，順序與 items 相同。
      // excel.rows 是示範店真的上架的商品（store-page 截圖的前四件）；photo.tags 是 AI 對 14 號外套的實際標註結果，
      // 與 ai-tag-after-tags 截圖一致；voice.transcript 摘自 voice-size-result 那次錄音的唸稿
      demo: {
        excel: {
          file: '商品表.xlsx',
          columns: ['商品名稱', '分類', '售價'],
          rows: [
            ['藍色粗花呢短外套', '外套', '2,280'],
            ['鈷藍緞面綁帶襯衫洋裝', '連身', '1,880'],
            ['海軍藍雙排扣西裝外套', '外套', '2,680'],
            ['霧藍緞面細肩帶洋裝', '連身', '1,580'],
          ],
          busy: '匯入中…',
          done: '匯入完成，商品已上架',
        },
        photo: {
          busy: 'AI 分析中…',
          done: 'AI 標註完成',
          tags: ['外套', '女裝', '優雅風', '復古風', '商務風', '春・秋・冬', '混紡', '無彈性', '常規版型', '中厚'],
          tagsLabel: 'AI 標註結果',
        },
        voice: {
          busy: '聆聽中',
          done: '已填入尺寸表',
          transcript: '「S 號肩寬 38、胸圍 100、袖長 54、衣長 68；M 號肩寬 39.5、胸圍 104……」',
          replay: '再聽一次語音建檔',
          hint: '點麥克風，再聽一次',
        },
      },
    },
    // 品牌拿到的效益；網站不寫費用與優惠。順序對應 FEATURE_ICONS
    features: {
      title: '接上之後，你的品牌拿到這些。',
      items: [
        { title: '顧客先看見上身', desc: '顧客上傳一張全身照，約 15–20 秒看見你的商品穿上身；想看走動、轉身，還能生成約 1 分鐘的動態試穿影片。' },
        { title: '單品搭成整套', desc: 'AI 依顧客穿搭照的上身、下身與整體風格，從你上架的商品中推薦搭配；衣服、帽子、墨鏡、鞋子等時尚商品皆可通用。' },
        { title: '知道該補什麼貨', desc: '品牌後台看得到每件商品的試穿率。曝光告訴你顧客看了什麼，試穿率告訴你他們真正想要什麼，進貨與補貨更有依據。' },
        { title: '試穿影片就是素材', desc: '動態試穿影片可以直接當 IG 的行銷素材，新品上架不必每次都安排模特兒與棚拍。' },
      ],
      // 「顧客先看見上身」兩張試穿結果下的圖說，順序對應同一件洋裝的兩種身形
      fitNotes: ['建議尺寸 M', '建議尺寸 XL'],
    },
    // 適合導入的品牌；順序對應 FIT_ICONS
    fit: {
      title: '適合這樣的品牌。',
      items: [
        { title: '中小服飾品牌', desc: '有自己的設計與風格，想讓更多顧客在下單前看見上身效果。' },
        { title: '已經有自己的通路', desc: '經營 LINE 官方帳號、品牌官網或實體門市，想讓這些通路都能試穿。' },
        { title: '想用數據決定進貨', desc: '想知道顧客真正想試穿哪些商品，讓補貨與進貨有依據。' },
      ],
    },
    faq: {
      title: '品牌常見問題',
    },
    cta: {
      title: '準備好接上時尚 AI 了嗎？',
    },
  },
  about: {
    hero: {
      title: '為時尚產業，打造自己的 AI。',
      lede: 'Tryzeon（創然科技有限公司）是一家專注時尚產業的 AI 新創。',
      cta: '看產品怎麼運作',
    },
    // 頁尾「共用 AI 引擎」與首頁 AI 引擎那一句都連到這裡；nodes 順序即飛輪的循環順序
    engine: {
      title: ENGINE_TITLE,
      lede: '各通路的試穿、推薦與瀏覽數據持續回流，逐步優化 Tryzeon 的 AI 引擎；你的顧客拿到的推薦，會越來越貼近他們的喜好。',
      nodes: ['通路整合', '真實數據', '引擎優化', '精準推薦'],
    },
    origin: {
      title: '穿搭的決定，常在線上與線下之間來回。',
      body: '消費者在線上看不到衣服穿上身的樣子，門市的體驗又帶不回家。另一邊，台灣許多中小型服飾品牌的設計很有特色，卻缺少行銷工具與數據能力，進貨與生產只能憑經驗判斷。Tryzeon 從這裡出發：把品牌的 LINE 官方帳號、官網與門市接上同一套系統。',
    },
    vision: {
      title: '試穿只是切入點。',
      quote: '從中小型時尚品牌出發，用真實數據與 Vertical Fashion AI 垂直整合時尚產業——讓品牌更懂顧客，也讓消費者更快找到適合自己的穿搭。',
    },
    cta: '品牌合作',
  },
  download: {
    title: '別再憑空想像，買之前先看見上身的樣子。',
    lede: '一張全身照，就能看見自己穿上的樣子。iOS 與 Android 免費下載。',
    qr: {
      caption: '用手機掃描，下載 Tryzeon',
      alt: '下載 Tryzeon 的 QR Code',
    },
    lineOa: {
      text: '不想下載 App？加入 LINE 官方帳號也能試穿。',
      cta: `加入 ${LINE_OA_ID}`,
      qrCaption: '用手機掃描，加入 LINE 官方帳號',
      qrAlt: `加入 Tryzeon LINE 官方帳號 ${LINE_OA_ID} 的 QR Code`,
    },
    steps: {
      title: '三個步驟，開始試穿。',
      items: [
        { title: '上傳一張全身照', desc: 'AI 自動辨識身形與姿勢，不需要多角度拍攝。' },
        { title: '從試衣間挑選', desc: '自研身形合身演算法比對身形與尺碼，優先篩選可能合身的合作品牌商品。' },
        { title: '看見上身的樣子', desc: '靜態試穿約 15–20 秒；想看走動、轉身，再生成動態影片，約 1 分鐘完成。' },
      ],
    },
    privacy: {
      title: '你的照片，由你掌控。',
      items: [
        { title: '傳輸加密', desc: '資料在傳輸過程以 SSL/TLS 加密。' },
        { title: '存取控管', desc: '資料庫以 RLS（列級安全）與 JWT 驗證控管存取，安全規範對標 ISO 27001。' },
        { title: '隨時刪除', desc: '你可以隨時刪除自己的照片與帳號資料。' },
      ],
      links: [
        { label: '隱私權政策', href: '/privacy' },
        { label: '如何刪除帳號', href: '/delete-account' },
      ],
    },
  },
  deleteAccount: {
    kicker: 'Account',
    title: '刪除你的 Tryzeon 帳號',
    lede: '你可以隨時透過 App 內建的功能，完全刪除帳號與個人資料。',
    stepsTitle: '如何在 App 中刪除帳號',
    steps: [
      { title: '前往設定', desc: '開啟 Tryzeon App，在首頁或個人檔案頁面中進入「設定」(Settings)。' },
      { title: '選擇刪除帳號', desc: '在設定選單中，點擊「刪除帳號」(Delete Account)。' },
      { title: '確認刪除', desc: '依照畫面提示確認操作。確認後，帳號會被永久刪除。' },
    ],
    warningTitle: '刪除後無法復原',
    warning:
      '帳號刪除後，你在 Tryzeon 上的所有資訊（包含虛擬試穿紀錄、個人設定與店家互動紀錄）都會被永久刪除。日後若要再使用，需要重新註冊帳號。',
  },
  contact: {
    email: CONTACT_EMAIL,
    lineOa: { id: LINE_OA_ID, url: LINE_OA_URL },
  },
  footer: {
    tagline: '為時尚產業而生的 AI。我們連結消費者與時尚品牌，打造時尚 AI 生態系。',
    columns: [
      {
        title: '產品',
        links: [
          { label: '品牌上架與四通路', href: '/#brands' },
          { label: 'LINE 試穿流程', href: '/#line' },
          { label: 'AI 試穿與穿搭推薦', href: '/#experience' },
          { label: '共用 AI 引擎', href: '/about#engine' },
          { label: `LINE 官方帳號 ${LINE_OA_ID}`, href: LINE_OA_URL },
        ],
      },
      {
        title: '公司',
        links: [
          { label: '關於我們', href: '/about' },
          { label: '願景', href: '/about#vision' },
          { label: '品牌合作', href: '/business' },
        ],
      },
      {
        title: '資源',
        links: [
          { label: '品牌常見問題', href: '/business#faq' },
          { label: '下載 App', href: '/download' },
        ],
      },
      {
        title: '聯絡',
        links: [
          { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
          { label: 'Instagram', href: 'https://www.instagram.com/tryzeon' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tryzeon' },
        ],
      },
    ],
    legal: [
      { label: '隱私權政策', href: '/privacy' },
      { label: '服務條款', href: '/terms' },
      { label: '刪除帳號', href: '/delete-account' },
    ],
    copyright: '© {year} 創然科技有限公司 Tryzeon. All rights reserved.',
    // 經濟部商工登記資料（南科管理局核准設立）
    company: '統一編號 82970406｜南部科學園區臺南市新市區南科三路17號2樓之1A163室',
  },
} as const;

/** 首頁各 section 的文案切片型別 */
export type HomeCopy = typeof copy.home;
/** /about 各 section 的文案切片型別 */
export type AboutCopy = typeof copy.about;
