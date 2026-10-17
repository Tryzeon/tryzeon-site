'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { copy } from '@/lib/copy';
import { scrollWithinPage } from '@/components/SiteLink';

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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
        setIsScrolled(window.scrollY > 24);
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

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMobileMenuOpen]);

  // 點到目前這一頁（含首頁的「/#id」）就地平滑捲動；其他情況交給 Link 做站內導覽
  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    scrollWithinPage(e, href, pathname);
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { href: '/', label: copy.nav.product },
    { href: '/business', label: copy.nav.business },
    { href: '/about', label: copy.nav.about },
  ];

  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : href === pathname);

  // 目前頁與其他項的樣式互斥傳入：同一個屬性的兩個 utility 同時存在時，勝負取決於 CSS 輸出順序，不是 class 順序
  const renderItem = (
    item: (typeof navigationItems)[number],
    className: string,
    idleClass: string,
    currentClass: string,
  ) => {
    const current = isCurrent(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={(e) => handleItemClick(e, item.href)}
        aria-current={current ? 'page' : undefined}
        className={`${className} ${current ? currentClass : idleClass}`}
      >
        {item.label}
      </Link>
    );
  };

  const CURRENT = 'text-pearl underline underline-offset-8 decoration-lilac/60';

  return (
    <nav
      className={`nav-enter fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] px-4 md:px-0 ${
        isScrolled ? 'top-4 py-0' : 'top-0 py-5'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto transition-all duration-300 ease-out ${
          shouldShowWhiteBackground
            ? 'rounded-full bg-night/70 backdrop-blur-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.06)] border border-white/10 px-8 py-2.5 max-w-5xl'
            : 'px-6 md:px-12 xl:px-24 bg-transparent border border-transparent'
        }`}
      >
        <div className="flex justify-between items-center h-12 md:h-14">
          <Link
            href="/"
            onClick={(e) => handleItemClick(e, '/')}
            className="focus-ring inline-flex items-center gap-2 text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300 text-pearl hover:text-lilac rounded-md"
          >
            {/* 標誌是裝飾，連結名稱由旁邊的「Tryzeon」提供 */}
            <Image
              src="/images/logo/tryzeon_logomark.png"
              alt=""
              width={843}
              height={661}
              priority
              sizes="41px"
              className="h-7 w-auto md:h-8"
            />
            Tryzeon
          </Link>

          <div className="hidden lg:flex items-center space-x-9">
            {navigationItems.map((item) =>
              renderItem(
                item,
                `text-[13px] font-medium tracking-wide transition-colors duration-300 hover:text-pearl rounded-md focus-ring`,
                'text-pearl/70',
                CURRENT,
              ),
            )}
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link
              href="/business"
              onClick={(e) => handleItemClick(e, '/business')}
              className={`focus-ring px-5 py-2 text-[12px] font-semibold rounded-full transition-colors duration-300 ${
                shouldShowWhiteBackground
                  ? 'bg-pearl text-night hover:shadow-[0_0_30px_-4px_rgba(185,167,255,0.7)]'
                  : 'bg-white/[0.06] backdrop-blur-md border border-white/15 text-pearl hover:bg-white/[0.12]'
              }`}
            >
              {copy.nav.cta}
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="focus-ring lg:hidden p-2 -mr-2 transition-colors rounded-md"
            aria-label={isMobileMenuOpen ? copy.nav.menuClose : copy.nav.menuOpen}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-pearl" />
            ) : (
              <Menu className="w-6 h-6 text-pearl" />
            )}
          </button>
        </div>

        {/* 收合時 invisible：連結不留在 Tab 順序裡（opacity 0 仍可被聚焦）；visibility 隨 transition 在收合結束才切換 */}
        <div
          id="mobile-menu"
          className={`lg:hidden grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isMobileMenuOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden min-h-0">
            <div className="bg-night-2/95 backdrop-blur-2xl rounded-[32px] mt-2 shadow-2xl border border-white/10">
              <div className="py-6 px-6 space-y-1">
                {navigationItems.map((item) =>
                  renderItem(
                    item,
                    `block px-4 py-3.5 text-base font-semibold text-pearl hover:bg-white/[0.06] hover:text-lilac rounded-xl transition-colors focus-ring`,
                    '',
                    'underline underline-offset-8 decoration-lilac/60',
                  ),
                )}

                <div className="h-px bg-white/10 my-4 mx-4"></div>

                <div className="pt-4 px-2">
                  <Link
                    href="/business"
                    onClick={(e) => handleItemClick(e, '/business')}
                    className="focus-ring block w-full py-3.5 text-center text-sm font-bold bg-pearl text-night rounded-full shadow-lg active:scale-95 transition-transform"
                  >
                    {copy.nav.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
