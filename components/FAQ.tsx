'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';

interface FAQItem {
  question: string;
  answer: string;
  /** 答案之後的下一步（例：首頁的分流題連到 /business、/download） */
  link?: { label: string; href: string };
}

interface FAQProps {
  items: readonly FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`group bg-white hover:bg-[#F9FAFB] rounded-2xl border border-[#101828]/8 hover:border-[#101828]/15 overflow-hidden transition-all duration-300 ${
              isOpen ? 'bg-[#F9FAFB] border-[#101828]/15 shadow-sm' : ''
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-[#101828] text-base md:text-lg pr-8">
                {item.question}
              </span>
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#2563EB] text-white rotate-45'
                    : 'bg-[#F2F4F7] text-[#475467] group-hover:bg-[#101828]/10'
                }`}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 md:px-8 pb-6 text-[#475467] leading-relaxed text-sm md:text-base">
                {item.answer}
                {item.link && (
                  <div className="mt-3">
                    {/* 收合時面板只是 max-h-0，連結仍在 DOM：移出 Tab 順序，免得鍵盤焦點落在看不見的地方 */}
                    <MoreLink href={item.link.href} small tabIndex={isOpen ? undefined : -1}>
                      {item.link.label}
                    </MoreLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
