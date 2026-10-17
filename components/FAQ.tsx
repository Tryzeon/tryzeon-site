'use client';

import { useId, useState } from 'react';
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

/**
 * 編輯式的問答清單：細線分隔，展開時答案以 grid-rows 平滑長出，
 * 收合時整塊 invisible（連結不留在 Tab 順序裡、螢幕閱讀器也不會讀到）。
 */
export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="mx-auto max-w-3xl border-t border-[#101828]/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <div key={index} className="group relative border-b border-[#101828]/10">
            {/* 展開或滑過時，左側長出一條珠光線 */}
            <span
              className={`pointer-events-none absolute -left-px top-0 w-[2px] bg-gradient-to-b from-[#7C6AE6] to-[#22D3EE] transition-[height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'h-full' : 'h-0 group-hover:h-full'
              }`}
              aria-hidden
            />
            <button
              id={buttonId}
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="focus-ring flex w-full items-center justify-between gap-6 rounded-sm py-6 pl-5 pr-1 text-left md:py-7 md:pl-7"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span
                className={`text-base font-semibold transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:text-lg ${
                  isOpen ? 'text-[#101828]' : 'text-[#344054] group-hover:translate-x-1 group-hover:text-[#101828]'
                }`}
              >
                {item.question}
              </span>
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen
                    ? 'rotate-45 border-[#101828] bg-[#101828] text-white'
                    : 'border-[#101828]/15 bg-white/70 text-[#475467] group-hover:border-[#101828]/30'
                }`}
                aria-hidden
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows,opacity,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'visible grid-rows-[1fr] opacity-100' : 'invisible grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-7 pl-5 pr-12 text-sm leading-relaxed text-[#475467] md:pl-7 md:text-base">
                  {item.answer}
                  {item.link && (
                    <div className="mt-3">
                      <MoreLink href={item.link.href} small>
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
