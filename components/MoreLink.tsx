import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface MoreLinkProps {
  href: string;
  children: ReactNode;
  /** 較小的版本（並排的多個連結用） */
  small?: boolean;
  /** 放在收合內容裡時，收起來要傳 -1 移出 Tab 順序 */
  tabIndex?: number;
}

/** 藍色文字連結 + 右箭頭，區塊結尾的「看更多」 */
export function MoreLink({ href, children, small = false, tabIndex }: MoreLinkProps) {
  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className={`group inline-flex items-center gap-1 rounded-full font-medium text-[#1D4ED8] hover:text-[#2563EB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-4 ${
        small ? 'text-base' : 'text-base md:text-lg'
      }`}
    >
      {children}
      <ChevronRight
        className={`${small ? 'h-4 w-4' : 'h-5 w-5'} transition-transform duration-300 group-hover:translate-x-0.5`}
        aria-hidden
      />
    </Link>
  );
}
