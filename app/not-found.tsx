import type { Metadata } from 'next';
import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { Magnetic } from '@/components/Magnetic';
import { Notice } from '@/components/Notice';
import { copy } from '@/lib/copy';

const { notFound } = copy.notice;

export const metadata: Metadata = {
  title: notFound.metaTitle,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Notice
      emblem={<SearchX className="h-9 w-9 text-[#2563EB]" strokeWidth={1.4} />}
      title={notFound.title}
      lede={notFound.lede}
      homeLink={false}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {notFound.links.map((link, i) => (
          <Magnetic key={link.href} className="flex flex-col">
            <Link
              href={link.href}
              className={`px-7 py-3.5 ${
                i === 0
                  ? 'btn-primary'
                  : 'focus-ring inline-flex items-center justify-center rounded-full border border-[#101828]/15 bg-white/70 font-semibold text-[#101828] transition-colors duration-300 hover:bg-white'
              }`}
            >
              {link.label}
            </Link>
          </Magnetic>
        ))}
      </div>
    </Notice>
  );
}
