'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Mail } from "lucide-react";
import { HeroCinema } from "@/components/HeroCinema";
import { StatsCinema } from "@/components/StatsCinema";
import { FeaturesCinema } from "@/components/FeaturesCinema";
import { Navigation } from "@/components/Navigation";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ParallaxText, ScrollZoomCard } from "@/components/ScrollLinkedAnimations";
import { FAQ } from "@/components/FAQ";
import { translations } from "@/lib/translations";
import { faqData } from "@/lib/faq-data";
import { trackCTA } from "@/lib/analytics";
import { AppleButton, AppleLink } from "@/components/MicroInteractions";

export default function HomePageClient() {
  const [currentLang, setCurrentLang] = useState('zh-TW');
  const t = translations[currentLang as keyof typeof translations] || translations['zh-TW'];

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] relative selection:bg-[#2563EB]/15 selection:text-[#101828]">
      <Navigation currentLang={currentLang} setCurrentLang={setCurrentLang} />

      <header className="relative">
        <HeroCinema />
      </header>

      {/* ============================================
          BRAND STATEMENT — White Mesh Section
          ============================================ */}
      <Section id="statement" className="py-28 md:py-56 bg-[#ffffff] relative overflow-hidden">
        {/* Animated mesh gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)] animate-mesh-float" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] animate-mesh-float [animation-delay:4s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,58,237,0.04)_0%,transparent_70%)] animate-mesh-float [animation-delay:8s]" />
          {/* Subtle dot grid overlay */}
          <div className="absolute inset-0 dot-grid" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-left relative z-10">
          <ParallaxText>
            <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-extrabold text-[#101828] leading-[0.85] tracking-tighter mb-8 md:mb-16 flex flex-col uppercase">
              <span className="z-10 relative">Digital</span>
              <span className="text-outline md:ml-24 xl:ml-48">Fashion</span>
              <span className="text-gradient-blue md:ml-12 xl:ml-24">Evolution</span>
            </h2>
          </ParallaxText>
          <ScrollReveal direction="up" delay={0.2} className="md:w-1/2 md:ml-auto">
            <p className="text-lg md:text-2xl text-[#475467] font-medium leading-relaxed max-w-3xl mx-auto mb-10 md:mb-16 text-balance">
              從試穿開始，重新定義你的時尚新生活。<br />整合線上與線下，打造時尚產業的 AI 基礎建設。
            </p>
            <div className="flex justify-center">
              <AppleLink
                href="#contact"
                className="text-lg md:text-xl !text-[#60A5FA] hover:!text-[#93C5FD]"
              >
                立即開始
              </AppleLink>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <StatsCinema />

      {/* ============================================
          TARGET AUDIENCE — Asymmetric Feature Cards
          ============================================ */}
      <Section id="audience" className="py-24 md:py-48 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" className="text-center mb-16 md:mb-24">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-4 md:mb-6 bg-[#2563EB]/8 px-4 py-1.5 rounded-full">Tailored Solutions</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#101828] tracking-tight">為誰而設計</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* B2B */}
            <ScrollZoomCard>
              <div className="group relative bg-white rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between overflow-hidden border border-[#E4E7EC] hover:border-[#2563EB]/20 shadow-neo hover:shadow-neo-lg transition-all duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(circle,rgba(37,99,235,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 max-w-md">
                  <span className="text-[#98A2B3] text-xs md:text-sm font-mono font-medium uppercase tracking-widest mb-4 block">01 / Brand Solutions</span>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#101828] mb-6 md:mb-8 leading-tight">低成本提升視覺<br />吸引力與轉換率</h3>
                  <Link
                    href="/business"
                    className="inline-flex items-center justify-center h-11 px-6 text-base font-medium rounded-full bg-[#0066CC] text-white hover:bg-[#0055AA] transition-colors"
                  >
                    品牌合作方案
                  </Link>
                </div>
                <div className="mt-8 md:mt-10 relative aspect-[16/9] rounded-2xl overflow-hidden shadow-neo-md transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src="/images/audience/b2b-fashion-store.jpg"
                    alt="Fashion Boutique Store"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </ScrollZoomCard>

            {/* B2C */}
            <ScrollZoomCard>
              <div className="group relative bg-white rounded-3xl p-8 md:p-12 h-full flex flex-col justify-between overflow-hidden border border-[#E4E7EC] hover:border-[#06B6D4]/20 shadow-neo hover:shadow-neo-lg transition-all duration-500">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(circle,rgba(6,182,212,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 max-w-md">
                  <span className="text-[#98A2B3] text-xs md:text-sm font-mono font-medium uppercase tracking-widest mb-4 block">02 / Personal Experience</span>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#101828] mb-6 md:mb-8 leading-tight">告別試穿煩惱<br />遇見最美的自己</h3>
                  <Link
                    href="/products/virtual-try-on"
                    className="inline-flex items-center justify-center h-11 px-6 text-base font-medium rounded-full bg-[#101828] text-white hover:bg-[#1D2939] transition-colors"
                  >
                    了解 AI 試穿
                  </Link>
                </div>
                <div className="mt-8 md:mt-10 relative aspect-[16/9] rounded-2xl overflow-hidden shadow-neo-md transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src="/images/audience/b2c-user-phone.jpg"
                    alt="Mobile Fashion App"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </ScrollZoomCard>
          </div>
        </div>
      </Section>

      <FeaturesCinema />

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
