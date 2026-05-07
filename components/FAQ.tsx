'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto space-y-4">
      {items.map((item, index) => {
        const isHidden = !showAll && index >= initiallyVisible;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md ${
              isHidden ? 'hidden' : ''
            }`}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 pr-8">{item.question}</span>
              <div
                className={`flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 text-gray-600 leading-relaxed">{item.answer}</div>
            </div>
          </div>
        );
      })}

      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <span>{showAll ? '顯示較少' : '顯示更多'}</span>
            <div className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}>
              <ChevronDown className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
