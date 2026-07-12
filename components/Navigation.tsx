'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { translations } from '@/lib/translations';

interface NavigationProps {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}

export function Navigation({ currentLang, setCurrentLang }: NavigationProps) {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const shouldShowWhiteBackground = isScrolled || isMobileMenuOpen;

  useEffect(() => {
    // 首次進場動畫播完後做記號，route change 重掛載不再重播 nav-enter
    const enteredTimer = setTimeout(() => {
      document.documentElement.dataset.navEntered = '1';
    }, 1100);

    let rafId = 0;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > window.innerHeight);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(enteredTimer);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const t = translations[currentLang as keyof typeof translations] || translations['zh-TW'];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (href) {
      if (href.startsWith('http')) {
        window.location.href = href;
        return;
      }
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { href: '#features', label: t.nav.product },
    { href: '#about', label: t.nav.about },
    { href: '#faq', label: t.nav.faq },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <nav
      className={`nav-enter fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 md:px-0 ${
        isScrolled ? 'top-4 py-0' : 'top-0 py-5'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto transition-all duration-300 ease-out ${
          shouldShowWhiteBackground
            ? 'rounded-full bg-white/80 backdrop-blur-2xl shadow-neo border border-[#E4E7EC]/60 px-8 py-2.5 max-w-5xl'
            : 'px-6 md:px-12 xl:px-24 bg-transparent border border-transparent'
        }`}
      >
        <div className="flex justify-between items-center h-12 md:h-14">
          <a
            href="#"
            className="text-2xl md:text-3xl font-extrabold tracking-tight transition-all duration-300 text-[#101828] hover:text-[#2563EB]"
          >
            Tryzeon
          </a>

          <div className="hidden lg:flex items-center space-x-10">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={scrollToSection}
                className="text-[13px] font-medium tracking-wide transition-colors duration-300 text-[#101828]/80 hover:text-[#2563EB]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center space-x-1 text-[11px] font-semibold tracking-wide uppercase transition-colors duration-300 text-[#101828]/70 hover:text-[#101828]"
              >
                <span>{currentLang === 'zh-TW' ? '繁中' : 'EN'}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <div
                className={`absolute top-full right-0 mt-3 w-32 bg-white/95 rounded-xl shadow-xl border border-black/5 py-1.5 overflow-hidden origin-top-right transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  showLangMenu
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <button
                  onClick={() => {
                    setCurrentLang('zh-TW');
                    setShowLangMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[12px] font-medium text-[#101828] hover:bg-[#F2F4F7] transition-colors"
                >
                  繁體中文
                </button>
                <button
                  onClick={() => {
                    setCurrentLang('en');
                    setShowLangMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 text-[12px] font-medium text-[#101828] hover:bg-[#F2F4F7] transition-colors"
                >
                  English
                </button>
              </div>
            </div>

            <a
              href="#contact"
              onClick={scrollToSection}
              className={`px-5 py-2 text-[12px] font-bold rounded-full transition-all duration-300 ${
                shouldShowWhiteBackground
                  ? 'bg-[#101828] text-white hover:bg-[#1D2939] hover:scale-105 shadow-md'
                  : 'bg-white/60 backdrop-blur-md border border-[#101828]/10 text-[#101828] hover:bg-white'
              }`}
            >
              {t.nav.getStarted}
            </a>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#101828]" />
            ) : (
              <Menu className="w-6 h-6 text-[#101828]" />
            )}
          </button>
        </div>

        <div
          className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="bg-white/95 rounded-[32px] mt-2 shadow-2xl border border-black/5">
              <div className="py-6 px-6 space-y-1">
                {navigationItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={scrollToSection}
                    className="block px-4 py-3.5 text-base font-semibold text-[#101828] hover:bg-[#F2F4F7] hover:text-[#2563EB] rounded-xl transition-all"
                  >
                    {item.label}
                  </a>
                ))}

                <div className="h-px bg-black/5 my-4 mx-4"></div>

                <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-sm font-medium text-[#667085]">Language</span>
                  <div className="flex bg-[#F2F4F7] rounded-full p-1">
                    <button
                      onClick={() => setCurrentLang('zh-TW')}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                        currentLang === 'zh-TW' ? 'bg-white shadow-sm text-[#101828]' : 'text-[#667085]'
                      }`}
                    >
                      繁中
                    </button>
                    <button
                      onClick={() => setCurrentLang('en')}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                        currentLang === 'en' ? 'bg-white shadow-sm text-[#101828]' : 'text-[#667085]'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <div className="pt-4 px-2">
                  <a
                    href="#contact"
                    onClick={scrollToSection}
                    className="block w-full py-3.5 text-center text-sm font-bold bg-[#2563EB] text-white rounded-full shadow-lg active:scale-95 transition-transform"
                  >
                    {t.nav.getStarted}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
