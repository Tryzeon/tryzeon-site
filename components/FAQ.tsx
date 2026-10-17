'use client';

import { useId, useState, type MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, type Variants } from 'framer-motion';
import { Plus } from 'lucide-react';
import { MoreLink } from '@/components/MoreLink';
import { EASE } from '@/lib/motion';

interface FAQItem {
  question: string;
  answer: string;
  /** 答案之後的下一步（例：首頁的分流題連到 /business、/download） */
  link?: { label: string; href: string };
}

interface FAQProps {
  items: FAQItem[];
}

// 真實高度動畫（0 ↔ auto）。答案一直留在 DOM 裡：FAQ 是 SEO 內容，要跟著 SSR HTML 出去
const answer: Variants = {
  hidden: { height: 0, opacity: 0, transition: { height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.2 } } },
  show: { height: 'auto', opacity: 1, transition: { height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.35, delay: 0.1 } } },
};

// 「+」轉 45° 成「×」
const plusIcon: Variants = {
  hidden: { rotate: 0, transition: { duration: 0.45, ease: EASE } },
  show: { rotate: 45, transition: { duration: 0.45, ease: EASE } },
};

export function FAQ({ items }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const uid = useId();

  // 面板聚光：跟著游標的淡藍 radial-gradient
  const mx = useMotionValue(-1000);
  const my = useMotionValue(-1000);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${mx}px ${my}px, rgba(37,99,235,0.07), transparent 40%)`;

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="group/faq relative mx-auto max-w-3xl" onMouseMove={handleMove}>
      {/* 往外撐到外層玻璃面板的 padding 邊（首頁 p-2 / md:p-4） */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-2 rounded-3xl opacity-0 transition-opacity duration-500 group-hover/faq:opacity-100 md:-inset-4"
        style={{ background: spotlight }}
      />

      <div className="relative divide-y divide-[#101828]/[0.08]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${uid}-q-${index}`;
          const panelId = `${uid}-a-${index}`;
          return (
            <div key={index} className="group">
              <button
                id={buttonId}
                onClick={() => toggleItem(index)}
                className="focus-ring flex w-full items-center justify-between gap-6 rounded-2xl px-4 py-5 text-left md:px-6 md:py-6"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="text-base font-semibold text-[#101828] md:text-lg">{item.question}</span>
                <motion.span
                  variants={plusIcon}
                  initial="hidden"
                  animate={isOpen ? 'show' : 'hidden'}
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    isOpen ? 'bg-[#2563EB] text-white' : 'bg-[#F2F4F7] text-[#475467] group-hover:bg-[#101828]/10'
                  }`}
                  aria-hidden
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                </motion.span>
              </button>

              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                variants={answer}
                initial="hidden"
                animate={isOpen ? 'show' : 'hidden'}
                className="overflow-hidden"
              >
                <div className="px-4 pb-6 text-sm leading-relaxed text-[#475467] md:px-6 md:text-base">
                  {item.answer}
                  {item.link && (
                    <div className="mt-3">
                      {/* 收合時答案仍在 DOM：移出 Tab 順序，免得鍵盤焦點落在看不見的地方 */}
                      <MoreLink href={item.link.href} small tabIndex={isOpen ? undefined : -1}>
                        {item.link.label}
                      </MoreLink>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
