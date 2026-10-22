'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import { useCopy, useLocale } from '@/components/useCopy';
import { HTML_LANG, switchLocaleHref } from '@/lib/i18n';

interface LanguageSwitchProps {
  /** 含 display（inline-flex / flex）；不在這裡寫死，避免兩個 display utility 互相蓋 */
  className?: string;
  onClick?: () => void;
}

/**
 * 切到同一頁的另一個語言。目前頁沒有另一個語言的版本（法律頁、短連結…）就不顯示。
 * 文字與 aria-label 用目標語言寫，所以連結本身標上目標語言的 lang。
 */
export function LanguageSwitch({ className = '', onClick }: LanguageSwitchProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const { nav } = useCopy();
  const target = locale === 'en' ? 'zh-TW' : 'en';
  const href = switchLocaleHref(pathname, target);
  if (!href) return null;

  return (
    <Link
      href={href}
      hrefLang={HTML_LANG[target]}
      lang={HTML_LANG[target]}
      aria-label={nav.switchAria}
      onClick={onClick}
      className={`focus-ring items-center gap-1.5 rounded-md transition-colors duration-300 ${className}`}
    >
      <Languages className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      {nav.switchLabel}
    </Link>
  );
}
