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
            className={`group bg-white hover:bg-[#F9FAFB] rounded-2xl border border-[#101828]/8 hover:border-[#101828]/15 overflow-hidden transition-all duration-300 ${
              isHidden ? 'hidden' : ''
            } ${isOpen ? 'bg-[#F9FAFB] border-[#101828]/15 shadow-sm' : ''}`}
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
              </div>
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#101828] rounded-full font-semibold text-sm hover:bg-[#F2F4F7] transition-all duration-300 border border-[#101828]/15 hover:border-[#101828]/30 hover:scale-[1.03] active:scale-[0.98] shadow-sm"
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
