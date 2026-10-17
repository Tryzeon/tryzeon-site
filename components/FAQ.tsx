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

/** 細線分隔的手風琴：展開時高度以 grid-rows 0fr→1fr 平滑撐開，左側亮起一道光 */
export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();

  return (
    <div className="border-t border-white/10">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question} className="group relative border-b border-white/10">
            <span
              className={`absolute -left-px bottom-4 top-4 w-[2px] origin-top rounded-full bg-gradient-to-b from-lilac to-aqua transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'scale-y-100' : 'scale-y-0'
              }`}
              aria-hidden
            />
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="focus-ring flex w-full items-center justify-between gap-6 rounded-lg py-6 pl-5 pr-1 text-left md:py-7 md:pl-6"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span
                className={`text-base font-semibold transition-colors duration-300 md:text-lg ${
                  isOpen ? 'text-pearl' : 'text-pearl/85 group-hover:text-pearl'
                }`}
              >
                {item.question}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isOpen
                    ? 'rotate-45 border-lilac/50 bg-lilac/15 text-pearl'
                    : 'border-white/15 text-haze group-hover:border-white/30 group-hover:text-pearl'
                }`}
                aria-hidden
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </span>
            </button>

            <div
              id={panelId}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-7 pl-5 pr-12 text-sm leading-relaxed text-haze md:pl-6 md:text-base">
                  {item.answer}
                  {item.link && (
                    <div className="mt-4">
                      {/* 收合時連結仍在 DOM：移出 Tab 順序，免得鍵盤焦點落在看不見的地方 */}
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
