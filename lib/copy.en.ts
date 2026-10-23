// lib/copy.ts 的英文版（/en）。結構與陣列長度由 SiteCopy 強制與中文版一致，紅線同樣適用。
// 破折號前用 \u00a0（不斷行空白），窄螢幕不會讓一行以「—」開頭。
// 站內連結直接寫 /en 路徑；只有中文版的頁面（法律頁、短連結、App fallback）沿用中文物件，
// 英文頁上的法律連結直接連到中文頁。
import { copy, type SiteCopy } from '@/lib/copy';

const CONTACT_EMAIL = 'contact@tryzeon.com';
const LINE_OA_ID = '@tryzeon';
const LINE_OA_URL = 'https://line.me/R/ti/p/@tryzeon';
const ENGINE_TITLE = 'Every try-on makes recommendations sharper.';

export const copyEn: SiteCopy = {
  images: {
    tryonHero: 'Tryzeon App try-on result: wearing a cobalt satin tie-front shirt dress (AI-generated model)',
    tryonOutfit: 'Tryzeon App full-outfit try-on: navy blazer, white shirt and ivory wide-leg trousers (AI-generated model)',
    tryonTweed: 'Tryzeon App full-outfit try-on: blue tweed cropped jacket and ivory wide-leg trousers (AI-generated model)',
    tryonCurvy: 'Tryzeon App try-on result: a curvy figure wearing the same cobalt dress (AI-generated model)',
    fitGreen: 'Tryzeon App product page: recommended size M based on body shape; height, shoulder, bust, waist and hip all fit',
    fitCurvy: 'Tryzeon App product page: recommended size XL for a curvy figure; height, shoulder, bust, waist and hip all fit',
    agentCommute: 'Tryzeon App styling advisor: a full outfit of demo-store products for “a sharp look for meeting clients”',
    agentWardrobe: 'Tryzeon App styling advisor: a denim jacket from the wardrobe paired with the demo store’s striped knit and wide-leg trousers',
    aiTagBefore: 'Tryzeon brand backend: product photo uploaded, AI analyzing',
    aiTagAfterTags: 'Tryzeon brand backend: AI auto-tags style, season, material and fit',
    voiceSizeShirt: 'Tryzeon brand backend: size details page with a microphone at the top right for voice entry; four sizes of a white shirt filled in',
    dashboardRanking: 'Tryzeon brand backend: top products ranked by try-on count (demo store data)',
    line1Ask: 'Tryzeon LINE Official Account: typing “Put together a weekend outfit for me” in the chat',
    line2Recommend: 'Tryzeon LINE Official Account: AI-recommended outfit cards, each with a button to try on the whole outfit',
    line3FittingRoom: 'Fitting room inside LINE: browsing the demo store’s products',
    line4Result: 'Full-outfit try-on result in the LINE chat: knit cardigan, white shirt and linen wide-leg trousers, with each item listed below (AI-generated model)',
    line5Product: 'Product page inside LINE: start a try-on or go to purchase',
    storePage: 'Demo store page in the Tryzeon App: listed products appear in the app',
    lineChatEntry: 'Chat and menu of the Tryzeon LINE Official Account',
    embedMobile: 'Mockup of the brand-site embed: opening Tryzeon virtual try-on on a mobile product page',
    embedDesktop: 'Mockup of the brand-site embed: Tryzeon virtual try-on on a product page, showing the result and recommended size',
    storeQr: 'Mockup of the in-store QR code: an acrylic stand in the store, scan to try on (AI-generated scene)',
    modelA: 'Full-body photo used for try-on (AI-generated model)',
    productHero: 'Demo product: flat lay of a cobalt satin tie-front shirt dress',
    productTweed: 'Demo product: flat lay of a blue tweed cropped jacket',
  },
  videos: {
    street: 'Tryzeon App try-on video: walking and turning on the street in a cobalt dress (AI-generated model)',
    office: 'Tryzeon App try-on video: walking through an office in a blazer and wide-leg trousers (AI-generated model)',
  },
  meta: {
    site: {
      title: 'Tryzeon - The AI built for fashion',
      description: 'Tryzeon is a Vertical Fashion AI built for the fashion industry. Brands list once and their products go live on the Tryzeon App, LINE Official Account, brand website and in-store QR codes; shoppers decide what to wear with AI virtual try-on, try-on videos and the AI Fashion Agent.',
      keywords: [
        'AI virtual try-on', 'virtual fitting', 'fashion tech', 'Tryzeon',
        'AI try-on technology', 'e-commerce solution', 'apparel tech',
        'OOTD recommendations', 'fashion AI', 'try-on video',
        'virtual try-on', 'AI styling', 'AI fashion',
        'Vertical Fashion AI', 'fashion AI ecosystem', 'AI outfit recommendations',
      ],
      shareDescription: 'A fashion AI ecosystem connecting shoppers and fashion brands\u00a0— list once, live on four channels.',
      orgDescription: 'A Vertical Fashion AI built for the fashion industry: a fashion AI ecosystem connecting shoppers and fashion brands.',
    },
    ogCard: {
      alt: 'Tryzeon\u00a0— The AI built for fashion',
      kicker: 'VERTICAL FASHION AI',
      title: 'The AI built for fashion',
      sub: 'A fashion AI ecosystem connecting shoppers and fashion brands',
    },
    // manifest 全站只有一份（中文）
    manifest: copy.meta.manifest,
    home: {
      title: 'Tryzeon - AI Virtual Try-On & Styling | The AI built for fashion',
    },
    business: {
      title: 'For Brands\u00a0— List once, live on four channels',
      description: 'Tryzeon connects the Tryzeon App, LINE Official Account, brand website and in-store QR codes for fashion brands, with AI virtual try-on and styling recommendations.',
      shareTitle: 'For Brands\u00a0— Tryzeon',
      shareDescription: 'List once, live on four channels. AI virtual try-on and styling recommendations, connected to your brand.',
    },
    about: {
      title: 'About Us\u00a0— Tryzeon Ltd.',
      description: 'Tryzeon Ltd. is an AI startup focused on the fashion industry, building a fashion AI ecosystem that connects shoppers and fashion brands.',
      shareTitle: 'About Tryzeon',
      shareDescription: 'The AI built for fashion\u00a0— connecting shoppers and fashion brands.',
    },
    download: {
      title: 'Download the App\u00a0— iOS and Android',
      description: 'Download the Tryzeon App for free: upload one full-body photo, pick partner-brand products likely to fit you in the fitting room, and see the try-on result in about 15–20 seconds.',
      shareTitle: 'Download the Tryzeon App',
      shareDescription: 'One full-body photo is all it takes to see yourself wearing it. Free on iOS and Android.',
    },
    // 只有中文版的頁面
    privacy: copy.meta.privacy,
    terms: copy.meta.terms,
    deleteAccount: copy.meta.deleteAccount,
  },
  a11y: {
    skipToContent: 'Skip to main content',
  },
  nav: {
    product: 'Product',
    business: 'For Brands',
    about: 'About',
    cta: 'Book a consultation',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    switchLabel: '中文',
    switchAria: '切換為中文',
  },
  home: {
    hero: {
      titleLines: ['AI built', 'for fashion.'],
      sub: 'Tryzeon brings AI virtual try-on and styling recommendations to fashion brands.',
      service: 'Your customers can try on your products in the Tryzeon App, on your LINE Official Account, on your website and in your stores\u00a0— and you see the try-on rate of every product.',
      ctaPrimary: 'Book a consultation',
      ctaSecondary: 'Download the App',
    },
    brands: {
      title: 'List once, live on four channels.',
      lede: 'Tryzeon connects your LINE Official Account, website and stores to one system\u00a0— customers try on wherever they shop.',
      status: 'Live',
      channels: [
        { name: 'Tryzeon App', desc: 'Your products appear in the Tryzeon App, reaching shoppers who are looking for outfits.' },
        { name: 'LINE Official Account', desc: 'Your existing LINE friends try on right in the chat, without downloading an app.' },
        { name: 'Brand website embed', desc: 'Try-on right on the product page, so customers never leave your site.' },
        { name: 'In-store QR code', desc: 'Customers scan in store to try on, without waiting for a fitting room.' },
      ],
      link: 'Learn about brand partnerships',
    },
    line: {
      title: 'From one sentence to a try-on, right in the chat.',
      lede: 'Shoppers add the brand’s LINE Official Account and, without downloading an app, go from conversation to recommendation, selection, try-on and purchase in the chat.',
      steps: [
        { title: 'Say what you need', quote: '“Put together a weekend outfit for me”', desc: 'Describe the style you want, as if chatting.' },
        { title: 'Get a full outfit', quote: '', desc: 'The AI Fashion Agent builds a complete outfit, and every piece is a real, listed product ready to buy.' },
        { title: 'Try on the whole outfit', quote: '', desc: 'Tap “Try on outfit” and, from one full-body photo, see it on you in the chat in about 15–20 seconds.' },
        { title: 'Go to purchase', quote: '', desc: 'Tap any item in the try-on result and go straight to purchase.' },
      ],
      browse: {
        title: 'Prefer to browse on your own?',
        desc: 'Open the fitting room inside LINE to browse the brand’s products, try on single items, or ask the AI advisor how to style them.',
      },
      link: 'Learn about brand partnerships',
      tryIt: {
        title: 'Try it yourself',
        desc: `Add Tryzeon’s LINE Official Account ${LINE_OA_ID} and walk through this flow in the chat.`,
        cta: `Add ${LINE_OA_ID}`,
        qrCaption: 'Scan with your phone to add',
        qrAlt: `QR code to add Tryzeon’s LINE Official Account ${LINE_OA_ID}`,
      },
    },
    experience: {
      title: 'Your customers see it on before they buy.',
      lede: 'One full-body photo shows them wearing your products, so outfit decisions no longer rely on imagination.',
      items: [
        { title: 'AI virtual try-on', metric: 'About 15–20 sec', desc: 'Customers upload one full-body photo and see themselves in your products\u00a0— no 3D modeling needed.' },
        { title: 'Try-on video', metric: 'About 1 min', desc: 'A third-person view of themselves walking and turning in the outfit; street, office, party and other scenes can all be generated.' },
        { title: 'Virtual fitting room', metric: '', desc: 'A body-fit algorithm developed by our team compares bust, waist and hip with garment sizes and labels the fit: green “Great fit”, yellow “Worth a look”, red “Not a fit”.' },
        { title: 'AI Fashion Agent', metric: '', desc: 'Recommends outfits by gender, age and style preference, and every piece is a real, listed product ready to buy; shoes, accessories and clothes from the customer’s cloud wardrobe can all be styled in.' },
      ],
      link: 'Download the App',
    },
    engine: {
      title: ENGINE_TITLE,
      link: 'Explore the AI engine',
    },
    faq: {
      title: 'FAQ',
      lede: 'New to Tryzeon? Start with these questions.',
    },
    cta: {
      title: 'Connect your brand to fashion AI.',
      primary: 'Learn about brand partnerships',
    },
  },
  business: {
    applyUrl: copy.business.applyUrl,
    emailSubject: 'Tryzeon brand partnership inquiry',
    hero: {
      title: 'Bring AI try-on to your brand.',
      lede: 'List once, and your products go live on the Tryzeon App, LINE Official Account, your website and in-store QR codes.',
      ctaPrimary: 'Book a consultation',
      ctaSecondary: 'Email us',
    },
    steps: {
      title: 'Onboard in three steps.',
      items: [
        { title: 'Book a consultation', desc: 'Fill in the form and we’ll contact you within 3 business days to schedule an onboarding consultation.' },
        { title: 'List your products', desc: 'Bulk upload via Excel, voice entry or photo upload, with AI tagging; our team helps with your first batch.' },
        {
          title: 'Go live on four channels',
          desc: 'Products sync to the Tryzeon App, LINE Official Account, your website and in-store QR codes.',
          link: { label: 'See the actual LINE flow', href: '/en#line' },
        },
      ],
    },
    listing: {
      label: 'Three ways to list',
      items: [
        { title: 'Excel bulk upload', desc: 'Import your existing product sheet as is.' },
        { title: 'Photo upload', desc: 'AI auto-tags season, style, fit and target customers.' },
        { title: 'Voice entry', desc: 'Say the product details to create the listing.' },
      ],
      demo: {
        excel: {
          file: 'products.xlsx',
          columns: ['Product', 'Category', 'Price'],
          rows: [
            ['Blue tweed cropped jacket', 'Outerwear', '2,280'],
            ['Cobalt satin tie-front shirt dress', 'Dresses', '1,880'],
            ['Navy double-breasted blazer', 'Outerwear', '2,680'],
            ['Misty blue satin slip dress', 'Dresses', '1,580'],
          ],
          busy: 'Importing…',
          done: 'Import complete\u00a0— products are live',
        },
        photo: {
          busy: 'AI analyzing…',
          done: 'AI tagging complete',
          tags: ['Outerwear', 'Womenswear', 'Elegant', 'Vintage', 'Business', 'Spring · Fall · Winter', 'Blend', 'Non-stretch', 'Regular fit', 'Midweight'],
          tagsLabel: 'AI tags',
        },
        voice: {
          busy: 'Listening',
          done: 'Size chart filled in',
          transcript: '“Size S: shoulder 38, chest 100, sleeve 54, length 68; size M: shoulder 39.5, chest 104…”',
          replay: 'Replay the voice entry',
          hint: 'Tap the mic to hear it again',
        },
      },
    },
    features: {
      title: 'What your brand gets once connected.',
      items: [
        { title: 'Customers see it on first', desc: 'Customers upload one full-body photo and see your product on them in about 15–20 seconds; to see it walk and turn, they can generate a try-on video of about 1 minute.' },
        { title: 'Single items become outfits', desc: 'AI recommends pairings from your listed products based on the top, bottom and overall style in the customer’s outfit photo; clothes, hats, sunglasses, shoes and other fashion items all work.' },
        { title: 'Know what to restock', desc: 'Your brand backend shows the try-on rate of every product. Impressions tell you what customers looked at; the try-on rate tells you what they actually want\u00a0— a firmer basis for buying and restocking.' },
        { title: 'Try-on videos are content', desc: 'Try-on videos can be used directly as Instagram marketing content, so new arrivals don’t need a model and studio shoot every time.' },
      ],
      fitNotes: ['Recommended size M', 'Recommended size XL'],
    },
    fit: {
      title: 'Built for brands like these.',
      items: [
        { title: 'Fashion brands', desc: 'You have your own designs and style, and want more customers to see the fit before they order.' },
        { title: 'Brands with their own channels', desc: 'You run a LINE Official Account, a brand website or physical stores, and want try-on on all of them.' },
        { title: 'Brands that buy by data', desc: 'You want to know which products customers really want to try on, so restocking and buying have a basis.' },
      ],
    },
    faq: {
      title: 'Brand FAQ',
    },
    cta: {
      title: 'Ready to connect to fashion AI?',
    },
  },
  about: {
    hero: {
      title: 'An AI of its own, for the fashion industry.',
      lede: 'Tryzeon Ltd. is an AI startup focused on the fashion industry.',
      cta: 'See how the product works',
    },
    engine: {
      title: ENGINE_TITLE,
      lede: 'Try-on, recommendation and browsing data from every channel keeps flowing back to refine Tryzeon’s AI engine; the recommendations your customers get keep getting closer to what they like.',
      nodes: ['Channels', 'Real data', 'Engine tuning', 'Precise picks'],
    },
    origin: {
      title: 'Outfit decisions bounce between online and offline.',
      body: 'Online, shoppers can’t see how clothes look on them; in store, the experience doesn’t come home with them. Meanwhile, many fashion brands in Taiwan have distinctive designs but lack marketing tools and data, so buying and production run on experience alone. Tryzeon starts here: connecting a brand’s LINE Official Account, website and stores to one system.',
    },
    vision: {
      title: 'Try-on is just the starting point.',
      quote: '“Starting from fashion brands, we use real data and Vertical Fashion AI to vertically integrate the fashion industry\u00a0— helping brands understand their customers, and helping shoppers find what suits them faster.”',
    },
    cta: 'For Brands',
  },
  download: {
    title: 'Stop imagining. See it on before you buy.',
    lede: 'One full-body photo is all it takes to see yourself wearing it. Free on iOS and Android.',
    qr: {
      caption: 'Scan with your phone to download Tryzeon',
      alt: 'QR code to download Tryzeon',
    },
    lineOa: {
      text: 'Rather not download an app? Add our LINE Official Account to try on there.',
      cta: `Add ${LINE_OA_ID}`,
      qrCaption: 'Scan with your phone to add our LINE Official Account',
      qrAlt: `QR code to add Tryzeon’s LINE Official Account ${LINE_OA_ID}`,
    },
    steps: {
      title: 'Start trying on in three steps.',
      items: [
        { title: 'Upload one full-body photo', desc: 'AI detects your body shape and pose automatically\u00a0— no multi-angle shots needed.' },
        { title: 'Pick from the fitting room', desc: 'A body-fit algorithm developed by our team compares your shape with garment sizes and puts partner-brand products likely to fit you first.' },
        { title: 'See it on you', desc: 'A static try-on takes about 15–20 seconds; to see yourself walk and turn, generate a try-on video in about 1 minute.' },
      ],
    },
    privacy: {
      title: 'Your photos, your control.',
      items: [
        { title: 'Encrypted in transit', desc: 'Data is encrypted with SSL/TLS in transit.' },
        { title: 'Access control', desc: 'Database access is controlled with RLS (row-level security) and JWT authentication; our security practices are benchmarked against ISO 27001.' },
        { title: 'Delete anytime', desc: 'You can delete your photos and account data at any time.' },
      ],
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'How to delete your account', href: '/delete-account' },
      ],
    },
  },
  // 只有中文版的頁面
  deleteAccount: copy.deleteAccount,
  legalPage: copy.legalPage,
  notice: {
    home: 'Back to the website',
    notFound: {
      metaTitle: 'Page not found',
      title: 'This page could not be found',
      lede: 'The URL may be mistyped, or the page has been removed.',
      links: [
        { label: 'Home', href: '/en' },
        { label: 'For Brands', href: '/en/business' },
        { label: 'Get the App', href: '/en/download' },
      ],
    },
    error: {
      title: 'Something went wrong',
      lede: `Please reload the page. If the problem persists, go back to the homepage or email ${CONTACT_EMAIL}.`,
      retry: 'Reload',
    },
    // 掃店家 QR 與 App fallback 的畫面只有中文版
    shortLink: copy.notice.shortLink,
    appFallback: copy.notice.appFallback,
  },
  contact: copy.contact,
  footer: {
    tagline: 'The AI built for fashion. We connect shoppers and fashion brands to build a fashion AI ecosystem.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Brand listing & four channels', href: '/en#brands' },
          { label: 'LINE try-on flow', href: '/en#line' },
          { label: 'AI try-on & styling', href: '/en#experience' },
          { label: 'Shared AI engine', href: '/en/about#engine' },
          { label: `LINE Official Account ${LINE_OA_ID}`, href: LINE_OA_URL },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/en/about' },
          { label: 'Vision', href: '/en/about#vision' },
          { label: 'For Brands', href: '/en/business' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Brand FAQ', href: '/en/business#faq' },
          { label: 'Download the App', href: '/en/download' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
          { label: 'Instagram', href: 'https://www.instagram.com/tryzeon' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/company/tryzeon' },
        ],
      },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Delete Account', href: '/delete-account' },
    ],
    copyright: '© {year} Tryzeon Ltd. All rights reserved.',
    company: 'Tax ID 82970406 | 2F.-1, No. 17, Nanke 3rd Rd., Xinshi Dist., Tainan City, Taiwan (ROC)',
  },
};
