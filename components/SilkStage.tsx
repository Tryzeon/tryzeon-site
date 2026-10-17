import type { ReactNode } from 'react';
import { SilkBackdrop } from '@/components/SilkBackdrop';

interface SilkStageProps {
  children: ReactNode;
  id?: string;
}

/** 收尾的圓角舞台：絲綢（偏薰衣草色）在裡面流動，中間放一句話與按鈕 */
export function SilkStage({ children, id }: SilkStageProps) {
  return (
    <section id={id} className="relative bg-[#FAFAFA] px-3 pb-3 pt-10 md:px-6 md:pb-6 md:pt-16">
      <div className="relative isolate flex min-h-[72svh] items-center justify-center overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_40px_120px_-40px_rgba(91,69,214,0.35)] md:rounded-[3rem]">
        <SilkBackdrop tone="iris" />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_50%,rgba(250,250,252,0.85)_0%,rgba(250,250,252,0.35)_60%,rgba(250,250,252,0)_100%)]"
          aria-hidden
        />
        <div className="relative z-10 w-full px-6 py-24 text-center">{children}</div>
      </div>
    </section>
  );
}
