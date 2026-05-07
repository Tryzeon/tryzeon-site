'use client';

import { useState, ReactNode } from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { translations } from '@/lib/translations';

export default function ProductsPageClient({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState('zh-TW');
  const t = translations[currentLang as keyof typeof translations] || translations['zh-TW'];

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-[#2563EB]/15 selection:text-[#101828]">
      <Navigation currentLang={currentLang} setCurrentLang={setCurrentLang} />
      {children}
      <Footer t={t} />
    </div>
  );
}
