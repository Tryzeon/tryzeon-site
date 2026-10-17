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
  items: FAQItem[];
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
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-[transform,background-color,color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen
                    ? 'bg-gradient-to-br from-[#2563EB] to-[#0891B2] text-white rotate-[135deg] shadow-[0_6px_16px_rgba(37,99,235,0.3)]'
                    : 'bg-[#F2F4F7] text-[#475467] group-hover:bg-[#101828]/10 group-hover:rotate-90'
                }`}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </button>

            {/* grid-rows 0fr→1fr：依內容實際高度展開，不受 max-height 上限影響 */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={`px-6 md:px-8 pb-6 text-[#475467] leading-relaxed text-sm md:text-base transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'translate-y-0' : '-translate-y-2'
                  }`}
                >
                  {item.answer}
                  {item.link && (
                    <div className="mt-3">
                      {/* 收合時面板只是 0fr 高，連結仍在 DOM：移出 Tab 順序，免得鍵盤焦點落在看不見的地方 */}
                      <MoreLink href={item.link.href} small tabIndex={isOpen ? undefined : -1}>
                        {item.link.label}
                      </MoreLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
