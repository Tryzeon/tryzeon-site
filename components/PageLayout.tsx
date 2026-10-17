import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

/** 法務／帳號類子頁的外框：導覽列 + 回首頁連結 + 內容 + 頁尾 */
export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-night">
      <Navigation />

      <div className="relative">
        <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-lilac/[0.07] to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 pt-32 md:pt-40 pb-24 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-dim hover:text-pearl transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            回到首頁
          </Link>

          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
