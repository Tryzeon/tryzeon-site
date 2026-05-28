'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import { HeartHandshake, Mail } from "lucide-react";
import { HeroCinema } from "@/components/HeroCinema";
import { BentoFeatures } from "@/components/BentoFeatures";

const SpatialChannels = dynamic(
  () => import("@/components/SpatialChannels").then((m) => m.SpatialChannels),
  { ssr: false },
);
import { Navigation } from "@/components/Navigation";
import { Section } from "@/components/Section";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ScrollManifesto } from "@/components/ScrollManifesto";
import { SpotlightAudienceCard } from "@/components/SpotlightAudienceCard";
import { FAQ } from "@/components/FAQ";
import { translations } from "@/lib/translations";
import { faqData } from "@/lib/faq-data";
import { trackCTA } from "@/lib/analytics";
import { AppleButton } from "@/components/MicroInteractions";

export default function HomePageClient() {
  const [currentLang, setCurrentLang] = useState('zh-TW');
  const t = translations[currentLang as keyof typeof translations] || translations['zh-TW'];

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] relative selection:bg-[#2563EB]/15 selection:text-[#101828]">
      <Navigation currentLang={currentLang} setCurrentLang={setCurrentLang} />

      <header className="relative">
        <HeroCinema />
      </header>

      <ScrollManifesto />

      {/* ============================================
          TARGET AUDIENCE — Light cards w/ image hero
          ============================================ */}
      <Section id="audience" className="relative py-24 md:py-40 bg-[#FAFAFA] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vh] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_60%)] blur-3xl animate-mesh-float" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vh] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_60%)] blur-3xl animate-mesh-float [animation-delay:6s]" />
          <div className="absolute inset-0 dot-grid opacity-50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" className="text-center mb-16 md:mb-24">
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#475467] mb-6">
              <span className="block w-6 h-px bg-[#101828]/30" />
              For Brands & Consumers
              <span className="block w-6 h-px bg-[#101828]/30" />
            </span>
            <h2
              className="font-extrabold tracking-[-0.04em] leading-[0.95] text-[#101828]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
            >
              一個平台，<br />
              <span className="bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#2563EB] bg-clip-text text-transparent">
                兩端共贏
              </span>
              。
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <SpotlightAudienceCard
              image="/images/audience/b2b-fashion-store.jpg"
              imageAlt="Fashion Boutique Store"
              kicker="01 / For Brands"
              accent="#2563EB"
              title={<>實體門市、官網 SDK、<br />App 一次部署</>}
              desc={<>流量計價、無前期投入。AI 自動生成試穿視覺與動態影片，<br className="hidden md:block" />實體門市裝置、品牌官網 embed SDK、Tryzeon App 同步上架。</>}
              href="/business"
              ctaLabel="品牌合作方案"
              ctaVariant="primary"
            />

            <SpotlightAudienceCard
              image="/images/audience/b2c-user-phone.jpg"
              imageAlt="Mobile Fashion App"
              kicker="02 / For Consumers"
              accent="#06B6D4"
              title={<>跨品牌試穿，<br />即時看見上身</>}
              desc={<>一張照片即可虛擬試穿任何服飾。<br className="hidden md:block" />在家、在門市、在品牌官網都能即時試穿，購物決策更有信心。</>}
              href="/products/virtual-try-on"
              ctaLabel="了解 AI 試穿"
              ctaVariant="ghost"
            />
          </div>
        </div>
      </Section>

      <SpatialChannels />

      <BentoFeatures />

      {/* ============================================
          ABOUT — Centered Vision (light)
          ============================================ */}
      <Section id="about" className="relative py-32 md:py-56 bg-[#ffffff] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_60%)] blur-3xl animate-mesh-float" />
          <div className="absolute top-[10%] right-[-15%] w-[50vw] h-[50vh] bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,transparent_60%)] blur-3xl animate-mesh-float [animation-delay:8s]" />
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#F2F4F7] rounded-3xl flex items-center justify-center mx-auto mb-10 md:mb-14 border border-[#101828]/8">
              <HeartHandshake className="h-10 w-10 md:h-12 md:w-12 text-[#2563EB]" />
            </div>
            <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#475467] mb-6 md:mb-8">
              <span className="block w-6 h-px bg-[#101828]/30" />
              Core Vision
              <span className="block w-6 h-px bg-[#101828]/30" />
            </span>
            <h3
              className="font-extrabold tracking-[-0.04em] leading-[1.0] text-[#101828] mb-10 md:mb-14"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}
            >
              {t.about.title}
            </h3>
            <p
              className="text-[#475467] font-medium leading-relaxed max-w-3xl mx-auto text-balance"
              style={{ fontSize: 'clamp(1.125rem, 1.6vw, 1.5rem)' }}
            >
              &ldquo;{t.about.desc}&rdquo;
            </p>
          </ScrollReveal>
        </div>
      </Section>

      {/* ============================================
          FAQ — Light glass container
          ============================================ */}
      <Section id="faq" className="relative py-24 md:py-40 bg-[#FAFAFA] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-[-10%] right-[-15%] w-[55vw] h-[55vh] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_60%)] blur-3xl animate-mesh-float" />
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16 md:mb-24">
              <span className="inline-flex items-center gap-3 text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#475467] mb-6">
                <span className="block w-6 h-px bg-[#101828]/30" />
                Support
                <span className="block w-6 h-px bg-[#101828]/30" />
              </span>
              <h3
                className="font-extrabold tracking-[-0.04em] leading-[1.0] text-[#101828] mb-6 md:mb-10"
                style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)' }}
              >
                常見問題
              </h3>
              <p className="text-[#475467] font-medium text-lg lg:text-xl">
                關於 Tryzeon 的常見疑問,我們都在這裡為您解答
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="bg-white rounded-3xl p-6 md:p-12 border border-[#101828]/8 shadow-lg">
              <FAQ items={faqData[currentLang as keyof typeof faqData] || faqData['zh-TW']} />
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ============================================
          CONTACT / CTA — Light with subtle mesh
          ============================================ */}
      <Section id="contact" className="py-28 md:py-56 bg-[#ffffff] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] animate-mesh-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] animate-mesh-float [animation-delay:4s]" />
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal direction="up">
            <span className="inline-block text-xs md:text-sm font-mono font-semibold uppercase tracking-[0.3em] text-[#2563EB] mb-6 md:mb-8 bg-[#2563EB]/10 px-4 py-1.5 rounded-full">
              Get Started
            </span>
            <h3 className="text-4xl md:text-7xl lg:text-8xl font-extrabold text-[#101828] mb-6 md:mb-8 tracking-tight leading-tight">
              準備好讓你的時尚<br />即時上身?
            </h3>
            <p className="text-lg md:text-2xl text-[#475467] font-medium mb-12 md:mb-16 leading-relaxed max-w-2xl mx-auto text-balance">
              無論你是消費者還是品牌——加入正在重新定義時尚試穿的新世代。
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <AppleButton
                variant="secondary"
                size="lg"
                className="!bg-[#101828] !text-white hover:!bg-[#1D2939] w-full md:w-auto shadow-lg"
                onClick={() => { trackCTA.contactEmail(); window.location.href = `mailto:${t.contact.email}`; }}
              >
                <Mail className="h-5 w-5 md:h-6 md:w-6 mr-3" />
                {t.contact.email}
              </AppleButton>

              <AppleButton
                variant="ghost"
                size="lg"
                className="!text-[#101828] border border-[#101828]/15 hover:!bg-[#F2F4F7] hover:border-[#101828]/30 w-full md:w-auto"
                onClick={() => { trackCTA.exploreFeatures(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
              >
                了解五大核心技術
              </AppleButton>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Footer t={t} />
    </div>
  );
}
