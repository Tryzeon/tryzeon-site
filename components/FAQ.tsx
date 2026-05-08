'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  items: FAQItem[];
  initiallyVisible?: number;
}

export function FAQ({ items, initiallyVisible = 4 }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const hasMore = items.length > initiallyVisible;

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {items.map((item, index) => {
        const isHidden = !showAll && index >= initiallyVisible;
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className={`group bg-white/[0.04] hover:bg-white/[0.07] rounded-2xl border border-white/[0.08] hover:border-white/[0.18] overflow-hidden transition-all duration-300 ${
              isHidden ? 'hidden' : ''
            } ${isOpen ? 'bg-white/[0.07] border-white/[0.18]' : ''}`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left"
              aria-expanded={isOpen}
            >
              <span className="font-semibold text-white text-base md:text-lg pr-8">
                {item.question}
              </span>
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isOpen
                    ? 'bg-[#60A5FA] text-white rotate-45'
                    : 'bg-white/[0.08] text-white/60 group-hover:bg-white/[0.12]'
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
              <div className="px-6 md:px-8 pb-6 text-white/70 leading-relaxed text-sm md:text-base">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/[0.06] backdrop-blur-xl text-white rounded-full font-semibold text-sm hover:bg-white/[0.12] transition-all duration-300 border border-white/[0.12] hover:border-white/30 hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>{showAll ? '顯示較少' : `顯示其餘 ${items.length - initiallyVisible} 題`}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
