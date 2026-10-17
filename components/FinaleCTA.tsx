'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Magnetic } from '@/components/Magnetic';
import { SectionHeader } from '@/components/SectionHeader';
import { SilkStage } from '@/components/SilkStage';
import { trackCTA } from '@/lib/analytics';
import type { HomeCopy } from '@/lib/copy';

interface FinaleCTAProps {
  copy: HomeCopy['cta'];
}

/** 首頁收尾：首屏的絲綢在圓角舞台裡再出現一次，中間一句話＋主按鈕 */
export function FinaleCTA({ copy }: FinaleCTAProps) {
  return (
    <SilkStage id="contact">
      <SectionHeader title={copy.title} spacing="mb-10 md:mb-12" />
      <div className="flex justify-center">
        <Magnetic className="w-full md:w-auto">
          <Link href="/business" onClick={() => trackCTA('cta_business')} className="btn-primary group w-full text-base md:w-auto">
            {copy.primary}
            <ChevronRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </Magnetic>
      </div>
    </SilkStage>
  );
}
