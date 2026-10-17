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

/** 薰衣草色文字連結 + 右箭頭，滑過時底線由左往右畫出 */
export function MoreLink({ href, children, small = false, tabIndex }: MoreLinkProps) {
  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      className={`group relative inline-flex items-center gap-1 rounded-full font-medium text-lilac transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-4 focus-visible:ring-offset-night ${
        small ? 'text-base' : 'text-base md:text-lg'
      }`}
    >
      <span className="relative">
        {children}
        <span
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-lilac to-aqua transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
          aria-hidden
        />
      </span>
      <ChevronRight
        className={`${small ? 'h-4 w-4' : 'h-5 w-5'} transition-transform duration-300 group-hover:translate-x-0.5`}
        aria-hidden
      />
    </Link>
  );
}
