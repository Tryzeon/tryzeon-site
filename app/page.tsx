'use client';

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Sparkles, HeartHandshake, Store, Video, Shirt, TrendingUp, Mail } from "lucide-react";
import { FullBleedCarousel } from "@/components/FullBleedCarousel";
import { Navigation } from "@/components/Navigation";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { translations } from "@/lib/translations";
import { faqData } from "@/lib/faq-data";
import { heroSlides } from "@/lib/hero-slides";
import { trackCTA } from "@/lib/analytics";
import { AppleButton, AppleLink } from "@/components/MicroInteractions";

// Dynamic imports for below-fold components (code splitting)
const ParallaxText = dynamic(() => import("@/components/ScrollLinkedAnimations").then(mod => ({ default: mod.ParallaxText })), { ssr: false });
const ScrollZoomCard = dynamic(() => import("@/components/ScrollLinkedAnimations").then(mod => ({ default: mod.ScrollZoomCard })), { ssr: false });
const Scroll3D = dynamic(() => import("@/components/ScrollLinkedAnimations").then(mod => ({ default: mod.Scroll3D })), { ssr: false });
const ScrollCounter = dynamic(() => import("@/components/ScrollLinkedAnimations").then(mod => ({ default: mod.ScrollCounter })), { ssr: false });
const BentoCard = dynamic(() => import("@/components/BentoGrid").then(mod => ({ default: mod.BentoCard })), { ssr: false });
const PartnerMarquee = dynamic(() => import("@/components/PartnerMarquee").then(mod => ({ default: mod.PartnerMarquee })), { ssr: false });
const FAQ = dynamic(() => import("@/components/FAQ").then(mod => ({ default: mod.FAQ })), { ssr: false });

export default function TryzeonLanding() {
  const [currentLang, setCurrentLang] = useState('zh-TW');
  const t = translations[currentLang as keyof typeof translations] || translations['zh-TW'];

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] relative overflow-hidden selection:bg-[#2563EB]/15 selection:text-[#101828]">
      <Navigation currentLang={currentLang} setCurrentLang={setCurrentLang} />

      <header className="relative">
        <FullBleedCarousel slides={heroSlides} auto={true} interval={6000} />
      </header>

      {/* ============================================
          BRAND STATEMENT — Dark Mesh Section
          ============================================ */}
      <Section id="statement" className="py-28 md:py-56 bg-[#0A0A0B] relative overflow-hidden">
        {/* Animated mesh gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_70%)] animate-mesh-float" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] animate-mesh-float [animation-delay:4s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,58,237,0.06)_0%,transparent_70%)] animate-mesh-float [animation-delay:8s]" />
          {/* Subtle dot grid overlay */}
          <div className="absolute inset-0 dot-grid-dark" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-left relative z-10">
          <ParallaxText>
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-extrabold text-white leading-[0.85] tracking-tighter mb-8 md:mb-16 flex flex-col uppercase">
              <span className="z-10 relative">Digital</span>
              <span className="text-outline-dark md:ml-24 xl:ml-48">Fashion</span>
              <span className="text-gradient-blue md:ml-12 xl:ml-24">Evolution</span>
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" delay={0.2} className="md:w-1/2 md:ml-auto">
            <p className="text-lg md:text-2xl text-[#98A2B3] font-medium leading-relaxed max-w-3xl mx-auto mb-10 md:mb-16 text-balance">
              從試穿開始，重新定義你的時尚新生活。<br />整合線上與線下，打造時尚產業的 AI 基礎建設。
            </p>
            <div className="flex justify-center">
              <AppleLink
                href="/experience"
                className="text-lg md:text-xl !text-[#60A5FA] hover:!text-[#93C5FD]"
              >
                立即體驗
              </AppleLink>
            </div>
          </ScrollReveal>

        </div>

        {/* Removed foggy gradient overlay for cleaner look */}
      </Section>



      {/* ============================================
          MARKET STATS — Glass Cards on Light Mesh
          ============================================ */}
      <Section id="stats" className="py-24 md:py-48 gradient-mesh-bg relative">
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center mb-16 md:mb-24">
              <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.3em] text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">Market Validation</span>
              <h2 className="text-3xl md:text-6xl font-extrabold text-[#101828] tracking-tight">數據證實價值</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              { val: 84, suffix: "%", label: "AR Interest", desc: "消費者對 AR 試用功能表現出強烈興趣" },
              { val: 71, suffix: "%", label: "Frequency", desc: "支持試穿功能會顯著增加選購頻率" },
              { val: 30, suffix: "%", label: "Conversion", desc: "有效提升電商轉換率與銷售效果" },
              { val: 25, suffix: "%", label: "Return Rate", desc: "有效降低退貨率，優化營運成本" }
            ].map((stat, i) => (
              <Scroll3D key={i}>
                <div className="glass-card rounded-[2rem] p-8 md:p-10 h-full text-center shadow-neo-xl border border-white/40">
                  <div className="text-5xl md:text-7xl font-extrabold text-[#101828] mb-4 md:mb-5 tracking-tighter font-data">
                    <ScrollCounter target={stat.val} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs md:text-sm font-mono font-bold uppercase tracking-[0.15em] text-[#2563EB] mb-3 md:mb-4">{stat.label}</div>
                  <p className="text-[#667085] text-sm md:text-base leading-relaxed font-medium">{stat.desc}</p>
                </div>
              </Scroll3D>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================
          TARGET AUDIENCE — Asymmetric Feature Cards
          ============================================ */}
      <Section id="audience" className="py-24 md:py-48 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" className="text-center mb-16 md:mb-24">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">Tailored Solutions</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#101828] tracking-tight">為誰而設計</h2>
          </ScrollReveal>

          <div className="flex flex-col gap-16 md:gap-32 mt-20">
            {/* B2B - Staggered Left */}
            <div className="md:w-10/12 xl:w-8/12">
              <ScrollZoomCard>
                <div className="group relative bg-[#0A0A0B] rounded-[2.5rem] p-8 md:p-16 h-full flex flex-col justify-between overflow-hidden border border-white/10 hover:border-[#2563EB]/40 shadow-neo-xl transition-all duration-700">
                  {/* Blue gradient accent on hover */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(37,99,235,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative z-10 max-w-lg">
                    <span className="text-[#98A2B3] text-xs md:text-sm font-mono font-medium uppercase tracking-widest mb-6 block border-b border-white/10 pb-4">01 // Brand Ecosystem</span>
                    <h3 className="text-3xl md:text-6xl font-extrabold text-white mb-6 md:mb-10 leading-tight tracking-tight">低成本提升視覺<br /><span className="text-outline-dark">吸引力與轉換率</span></h3>
                    <AppleButton
                      variant="primary"
                      size="lg"
                      className="!bg-[#2563EB] hover:!bg-[#1D4ED8]"
                      onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScu_hKsOTUVcuB0R3sKnRh9cAbn7zchO7W8izdgG1N9-WC9AQ/viewform?usp=header', '_blank')}
                    >
                      品牌合作申請
                    </AppleButton>
                  </div>
                  <div className="mt-12 md:mt-16 relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1">
                    <Image
                      src="/images/audience/b2b-fashion-store.jpg"
                      alt="Fashion Boutique Store"
                      fill
                      className="object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                </div>
              </ScrollZoomCard>
            </div>

            {/* B2C - Staggered Right */}
            <div className="md:w-10/12 xl:w-8/12 md:self-end">
              <ScrollZoomCard>
                <div className="group relative bg-white rounded-[2.5rem] p-8 md:p-16 h-full flex flex-col justify-between overflow-hidden border border-[#E4E7EC] hover:border-[#06B6D4]/40 shadow-neo hover:shadow-neo-xl transition-all duration-700">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(6,182,212,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative z-10 max-w-lg">
                    <span className="text-[#98A2B3] text-xs md:text-sm font-mono font-medium uppercase tracking-widest mb-6 block border-b border-black/10 pb-4">02 // Personal Utility</span>
                    <h3 className="text-3xl md:text-6xl font-extrabold text-[#101828] mb-6 md:mb-10 leading-tight tracking-tight">告別試穿煩惱<br /><span className="text-outline">遇見最美的自己</span></h3>
                    <AppleButton
                      variant="secondary"
                      size="lg"
                      className="!bg-[#101828] !text-white hover:!bg-[#1D2939]"
                      onClick={() => window.location.href = '/join'}
                    >
                      加入試用行列
                    </AppleButton>
                  </div>
                  <div className="mt-12 md:mt-16 relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1">
                    <Image
                      src="/images/audience/b2c-user-phone.jpg"
                      alt="Mobile Fashion App"
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                </div>
              </ScrollZoomCard>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================
          FEATURES — Bento Grid with Glassmorphism
          ============================================ */}
      <Section id="features" className="py-24 md:py-48 bg-[#F2F4F7] relative">
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up" className="text-left mb-16 md:mb-32 md:w-3/4">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.3em] text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">Core Infrastructure</span>
            <h2 className="text-5xl md:text-8xl font-extrabold text-[#101828] tracking-tighter mix-blend-multiply">
              五大核心技術<br />
              <span className="text-outline">引領數位革命</span>
            </h2>
          </ScrollReveal>

          {/* Staggered Avant-Garde Layout for Features */}
          <div className="flex flex-col gap-8 md:gap-16">
            {/* Row 1: 60 / 40 Split */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-7/12">
                <BentoCard
                  title={t.features.aiTryOn.title}
                  description={t.features.aiTryOn.desc}
                  icon={<Sparkles />}
                />
              </div>
              <div className="w-full md:w-5/12">
                <BentoCard
                  title={t.features.videoGeneration.title}
                  description={t.features.videoGeneration.desc}
                  icon={<Video />}
                />
              </div>
            </div>

            {/* Row 2: 40 / 60 Split, Reversed */}
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-5/12">
                <BentoCard
                  title={t.features.aiRecommendation.title}
                  description={t.features.aiRecommendation.desc}
                  icon={<Shirt />}
                />
              </div>
              <div className="w-full md:w-7/12">
                <BentoCard
                  title={t.features.dataAnalytics.title}
                  description={t.features.dataAnalytics.desc}
                  icon={<TrendingUp />}
                />
              </div>
            </div>

            {/* Row 3: Full Width Highlight */}
            <div className="w-full">
              <BentoCard
                title={t.features.tryOnRoom.title}
                description={t.features.tryOnRoom.desc}
                icon={<Store />}
              />
            </div>
          </div>

          {/* AI Try-On Demo Video Section */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-24 md:mt-32 max-w-5xl mx-auto">
              <div className="text-center mb-8 md:mb-12">
                <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-3 md:mb-4 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">Live Demo</span>
                <h3 className="text-3xl md:text-4xl font-bold text-[#101828] tracking-tight">AI 虛擬試穿效果展示</h3>
              </div>

              <div className="relative group">
                <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-[#0A0A0B] shadow-neo-xl border border-white/10">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/images/video-poster.jpg"
                  >
                    <source src="/videos/ai-tryon-demo.mp4" type="video/mp4" />
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#2563EB]/20 to-[#0A0A0B]">
                      <div className="text-center text-white">
                        <Video className="h-12 w-12 md:h-16 md:w-16 mx-auto mb-4 opacity-60" />
                        <p className="text-base md:text-lg font-medium opacity-80">AI 試穿效果 Demo</p>
                      </div>
                    </div>
                  </video>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-neo-lg cursor-pointer hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] md:border-t-[12px] border-t-transparent border-l-[16px] md:border-l-[20px] border-l-[#101828] border-b-[10px] md:border-b-[12px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>

                {/* Video glow effect */}
                <div className="absolute -inset-4 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.08),transparent_70%)] rounded-3xl" />

                <p className="text-center text-[#667085] text-sm mt-6 font-medium">
                  上傳一張照片，即可生成虛擬試穿效果
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="text-center mt-16 md:mt-24">
              <AppleButton
                variant="secondary"
                size="lg"
                className="!bg-[#101828] !text-white hover:!bg-[#1D2939] shadow-neo-lg"
                onClick={() => window.location.href = '/products'}
              >
                查看完整產品介紹
              </AppleButton>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ============================================
          ABOUT — Centered Vision with Blue Accent
          ============================================ */}
      <Section id="about" className="py-24 md:py-48 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 md:mb-12 border border-[#2563EB]/10">
              <HeartHandshake className="h-10 w-10 md:h-12 md:w-12 text-[#2563EB]" />
            </div>
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-widest text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">Core Vision</span>
            <h3 className="text-3xl md:text-6xl font-extrabold text-[#101828] mb-8 md:mb-12">{t.about.title}</h3>
            <p className="text-xl md:text-3xl text-[#667085] font-medium leading-relaxed max-w-3xl mx-auto text-balance">
              &ldquo;{t.about.desc}&rdquo;
            </p>
          </ScrollReveal>
        </div>
      </Section>

      {/* Partner Logos Section */}
      {false && (
        <Section id="partners" className="py-24 md:py-48 bg-[#F2F4F7]">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal direction="up">
              <div className="text-center mb-16 md:mb-24">
                <span className="text-xs md:text-sm font-mono font-semibold uppercase tracking-widest text-[#667085] mb-4 md:mb-6 block">Our Partners</span>
                <h3 className="text-3xl md:text-5xl font-bold text-[#101828] mb-6 md:mb-8">{t.partners.title}</h3>
                <p className="text-[#667085] font-medium uppercase tracking-widest text-xs md:text-sm">{t.partners.desc}</p>
              </div>
              <div className="bg-white rounded-3xl p-2 overflow-hidden border border-[#E4E7EC]">
                <PartnerMarquee />
              </div>
            </ScrollReveal>
          </div>
        </Section>
      )}

      {/* ============================================
          FAQ — Clean Glass Container
          ============================================ */}
      <Section id="faq" className="py-24 md:py-48 bg-[#F2F4F7] relative">
        <div className="absolute inset-0 dot-grid pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <ScrollReveal direction="up">
            <div className="text-center mb-16 md:mb-24">
              <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-widest text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">Support</span>
              <h3 className="text-3xl md:text-6xl font-extrabold text-[#101828] mb-6 md:mb-10">常見問題</h3>
              <p className="text-[#667085] font-medium text-lg lg:text-xl">
                關於 Tryzeon 的常見疑問，我們都在這裡為您解答
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white rounded-3xl p-8 md:p-16 shadow-neo border border-[#E4E7EC]">
              <FAQ items={faqData[currentLang as keyof typeof faqData] || faqData['zh-TW']} />
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ============================================
          CONTACT / CTA — Dark Mesh with Blue Glow
          ============================================ */}
      <Section id="contact" className="py-28 md:py-56 bg-[#0A0A0B] relative overflow-hidden">
        {/* Animated background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_60%)] animate-mesh-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.1)_0%,transparent_60%)] animate-mesh-float [animation-delay:4s]" />
          <div className="absolute inset-0 dot-grid-dark" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal direction="up">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.3em] text-[#60A5FA] mb-6 md:mb-8 bg-[#2563EB]/10 px-4 py-1.5 rounded-full">Get Started</span>
            <h3 className="text-4xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 md:mb-8 tracking-tight leading-tight">
              Ready to transform<br />your fashion business?
            </h3>
            <p className="text-lg md:text-2xl text-[#98A2B3] font-medium mb-12 md:mb-16 leading-relaxed max-w-2xl mx-auto text-balance">
              Join the revolution of AI-powered fashion retail. Experience higher conversion rates and lower returns today.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <AppleButton
                variant="secondary"
                size="lg"
                className="!bg-white !text-[#101828] hover:!bg-[#F2F4F7] w-full md:w-auto shadow-neo-lg"
                onClick={() => { trackCTA.contactEmail(); window.location.href = `mailto:${t.contact.email}`; }}
              >
                <Mail className="h-5 w-5 md:h-6 md:w-6 mr-3" />
                {t.contact.email}
              </AppleButton>

              <AppleButton
                variant="ghost"
                size="lg"
                className="!text-white border border-white/15 hover:!bg-white/10 hover:border-white/25 w-full md:w-auto backdrop-blur-sm"
                onClick={() => { trackCTA.exploreFeatures(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                Explore Features
              </AppleButton>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Footer t={t} />
    </div>
  );
}
