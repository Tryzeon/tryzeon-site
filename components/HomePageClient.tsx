'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import { HeartHandshake, Mail } from "lucide-react";
import { HeroCinema } from "@/components/HeroCinema";
import { BentoFeatures } from "@/components/BentoFeatures";

const FabricFlow = dynamic(
  () => import("@/components/FabricFlow").then((m) => m.FabricFlow),
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
import { Magnetic } from "@/components/Magnetic";
import { SectionHeader } from "@/components/SectionHeader";

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
          <SectionHeader
            kicker="N°03 — For Brands & Consumers"
            title={
              <>
                一個平台，
                <span className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
                  兩端共贏
                </span>
                。
              </>
            }
            lede="品牌要導購成交，消費者要放心購買——Tryzeon 讓兩端在同一套試穿基礎建設上各取所需。"
          />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <SpotlightAudienceCard
              image="/images/audience/b2b-fashion-store.jpg"
              imageAlt="Fashion Boutique Store"
              kicker="01 / For Brands"
              accent="#2563EB"
              title={<>門市 QR、品牌官網、App<br />同一套試穿引擎</>}
              desc={<>pay-per-use、零前期投入：每 5 次試穿 NT$1，前 3 個月免費。<br className="hidden md:block" />雙平台 App 與 LINE 官方帳號已上線，門市 QR 與品牌官網嵌入導入中。</>}
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

      <FabricFlow />

      <BentoFeatures />

      {/* ============================================
          ABOUT — Centered Vision (light)
          ============================================ */}
      <Section id="about" className="relative py-24 md:py-40 bg-[#ffffff] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,transparent_60%)] blur-3xl animate-mesh-float" />
          <div className="absolute top-[10%] right-[-15%] w-[50vw] h-[50vh] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_60%)] blur-3xl animate-mesh-float [animation-delay:8s]" />
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <ScrollReveal direction="up">
            <div className="w-20 h-20 md:w-24 md:h-24 glass-card rounded-3xl flex items-center justify-center mx-auto mb-10 md:mb-14">
              <HeartHandshake className="h-10 w-10 md:h-12 md:w-12 text-[#2563EB]" />
            </div>
          </ScrollReveal>
          <SectionHeader kicker="N°06 — Core Vision" title={t.about.title} />
          <ScrollReveal direction="up" delay={0.15}>
            {/* font-semibold 明確化：Noto Serif TC 沒有 400，CJK 本來就 fallback 到
                600 在渲染；宣告出來讓 Playfair 引號也跟上同字重 */}
            <p
              className="font-serif font-semibold text-[#475467] leading-[1.7] max-w-3xl mx-auto text-balance -mt-4 md:-mt-8"
              style={{ fontSize: 'clamp(1.125rem, 1.6vw, 1.45rem)' }}
            >
              &ldquo;{t.about.desc}&rdquo;
            </p>
          </ScrollReveal>

          {/* 願景之後的承諾收尾——灰階願景敘述 → 墨色行動宣示的層級落差 */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-14 md:mt-20 flex flex-col items-center">
              <span className="block w-12 h-px bg-[#101828]/15" aria-hidden />
              <span className="mt-8 font-mono text-[10px] md:text-[11px] font-semibold tracking-[0.4em] uppercase text-[#475467]">
                Impact · Sustainability
              </span>
              {/* 每個子句包成 inline-block：瀏覽器對中文會斷在詞中間，包成不可分割的
                  區塊後只會斷在句讀處，任何寬度下都是乾淨的分行 */}
              <p
                className="cjk-punct font-serif font-semibold text-[#101828] leading-[1.7] max-w-2xl mt-6"
                style={{ fontSize: 'clamp(1.1rem, 1.45vw, 1.35rem)' }}
              >
                {t.about.impactClauses.map((clause) => (
                  <span key={clause} className="inline-block">
                    {clause}
                  </span>
                ))}
                <span className="inline-block bg-gradient-to-r from-[#2563EB] to-[#06B6D4] bg-clip-text text-transparent">
                  {t.about.impactAccent}
                </span>
              </p>
            </div>
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
          <SectionHeader
            kicker="N°07 — Support"
            title="常見問題"
            lede="關於 Tryzeon 的常見疑問，我們都在這裡為您解答。"
          />
          <ScrollReveal direction="up" delay={0.2}>
            <div className="glass-card rounded-3xl p-6 md:p-12">
              <FAQ items={faqData[currentLang as keyof typeof faqData] || faqData['zh-TW']} />
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* ============================================
          CONTACT / CTA — Light with subtle mesh
          ============================================ */}
      <Section id="contact" className="py-24 md:py-40 bg-[#ffffff] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(37,99,235,0.08)_0%,transparent_60%)] animate-mesh-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] animate-mesh-float [animation-delay:4s]" />
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <SectionHeader
            kicker="N°08 — Get Started"
            title={<>準備好讓你的時尚<br />即時上身？</>}
            lede="無論你是消費者還是品牌——加入正在重新定義時尚試穿的新世代。"
          />
          <ScrollReveal direction="up" delay={0.1}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <Magnetic className="w-full md:w-auto">
                <AppleButton
                  variant="secondary"
                  size="lg"
                  className="!bg-[#101828] !text-white hover:!bg-[#1D2939] w-full md:w-auto shadow-lg"
                  onClick={() => { trackCTA.contactEmail(); window.location.href = `mailto:${t.contact.email}`; }}
                >
                  <Mail className="h-5 w-5 md:h-6 md:w-6 mr-3" />
                  {t.contact.email}
                </AppleButton>
              </Magnetic>

              <Magnetic className="w-full md:w-auto">
                <AppleButton
                  variant="ghost"
                  size="lg"
                  className="!text-[#101828] border border-[#101828]/15 hover:!bg-[#F2F4F7] hover:border-[#101828]/30 w-full md:w-auto"
                  onClick={() => { trackCTA.exploreFeatures(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  了解五大核心技術
                </AppleButton>
              </Magnetic>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      <Footer t={t} />
    </div>
  );
}
