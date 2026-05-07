'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { translations } from '@/lib/translations';

interface PageLayoutProps {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
  showBackButton?: boolean;
  children: React.ReactNode;
}

export function PageLayout({
  currentLang,
  setCurrentLang,
  showBackButton = false,
  children,
}: PageLayoutProps) {
  const t = translations[currentLang as keyof typeof translations] || translations['zh-TW'];

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-[#2563EB]/15 selection:text-[#101828]">
      <Navigation currentLang={currentLang} setCurrentLang={setCurrentLang} />

      <div className="relative">
        <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-[#F2F4F7] to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-24 relative z-10">
          {showBackButton && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#667085] hover:text-[#101828] transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {currentLang === 'en' ? 'Back to home' : '回到首頁'}
            </Link>
          )}

          {children}
        </div>
      </div>

      <Footer t={t} />
    </div>
  );
}
