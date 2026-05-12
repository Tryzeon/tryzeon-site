'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Mail } from "lucide-react";
import { HeroCinema } from "@/components/HeroCinema";
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
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_70%)] animate-mesh-float" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_70%)] animate-mesh-float [animation-delay:4s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(124,58,237,0.04)_0%,transparent_70%)] animate-mesh-float [animation-delay:8s]" />
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
            <ScrollZoomCard>
              <div className="group relative h-full flex flex-col rounded-3xl overflow-hidden border border-[#101828]/8 bg-white hover:border-[#2563EB]/30 hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/images/audience/b2b-fashion-store.jpg"
                    alt="Fashion Boutique Store"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 via-transparent to-[#2563EB]/0 group-hover:from-[#2563EB]/10 transition-all duration-700" />
                </div>
                <div className="p-8 md:p-12 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="block text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#2563EB] mb-4 md:mb-6">
                      01 / For Brands
                    </span>
                    <h3
                      className="font-extrabold tracking-[-0.03em] leading-[1.0] text-[#101828] mb-6 md:mb-8"
                      style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
                    >
                      實體門市、官網 SDK、<br />App 一次部署
                    </h3>
                    <p className="text-sm md:text-base text-[#475467] leading-relaxed mb-8 md:mb-10">
                      流量計價、無前期投入。AI 自動生成試穿視覺與動態影片，<br className="hidden md:block" />
                      實體門市裝置、品牌官網 embed SDK、Tryzeon App 同步上架。
                    </p>
                  </div>
                  <Link
                    href="/business"
                    className="group/cta inline-flex items-center justify-center px-7 py-3.5 bg-[#101828] text-white rounded-full font-semibold text-sm hover:bg-[#1D2939] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] self-start"
                  >
                    品牌合作方案
                    <span className="ml-2 transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </ScrollZoomCard>

            <ScrollZoomCard>
              <div className="group relative h-full flex flex-col rounded-3xl overflow-hidden border border-[#101828]/8 bg-white hover:border-[#06B6D4]/30 hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/images/audience/b2c-user-phone.jpg"
                    alt="Mobile Fashion App"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/0 via-transparent to-[#06B6D4]/0 group-hover:from-[#06B6D4]/10 transition-all duration-700" />
                </div>
                <div className="p-8 md:p-12 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="block text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase text-[#06B6D4] mb-4 md:mb-6">
                      02 / For Consumers
                    </span>
                    <h3
                      className="font-extrabold tracking-[-0.03em] leading-[1.0] text-[#101828] mb-6 md:mb-8"
                      style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
                    >
                      跨品牌試穿,<br />即時看見上身
                    </h3>
                    <p className="text-sm md:text-base text-[#475467] leading-relaxed mb-8 md:mb-10">
                      一張照片即可虛擬試穿任何服飾。<br className="hidden md:block" />
                      在家、在門市、在品牌官網都能即時試穿,購物決策更有信心。
                    </p>
                  </div>
                  <Link
                    href="/products/virtual-try-on"
                    className="group/cta inline-flex items-center justify-center px-7 py-3.5 bg-white text-[#101828] rounded-full font-semibold text-sm hover:bg-[#F2F4F7] transition-all duration-300 border border-[#101828]/15 hover:border-[#101828]/30 hover:scale-[1.03] active:scale-[0.98] self-start"
                  >
                    了解 AI 試穿
                    <span className="ml-2 transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </ScrollZoomCard>
          </div>
        </div>
      </Section>

      <FeaturesCinema />

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
