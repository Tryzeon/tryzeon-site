import type { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { clauseWrap } from '@/components/clauseWrap';
import { copy } from '@/lib/copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/delete-account',
  ...copy.meta.deleteAccount,
});

export const revalidate = 3600;

const CARD = 'glass-panel p-7 md:p-10';

export default function DeleteAccountPage() {
  const { deleteAccount } = copy;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 md:mb-16">
          <p className="mb-6 font-mono text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.4em] text-[#475467]">
            {deleteAccount.kicker}
          </p>
          <h1
            className="cjk-punct mb-6 font-serif font-black tracking-[-0.02em] leading-[1.12] text-[#101828]"
            style={{ fontSize: 'clamp(2.25rem, 1.6rem + 2.8vw, 3.5rem)' }}
          >
            {clauseWrap(deleteAccount.title)}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[#475467]">{deleteAccount.lede}</p>
        </header>

        <section className={`${CARD} mb-6`}>
          <h2 className="mb-8 text-xl font-semibold text-[#101828]">{deleteAccount.stepsTitle}</h2>
          <ol className="space-y-8">
            {deleteAccount.steps.map((step, i) => (
              <li key={step.title} className="flex items-start gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/10 to-[#06B6D4]/10 font-mono text-sm font-semibold text-[#1D4ED8]">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="mb-1.5 font-semibold text-[#101828]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#475467]">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="flex gap-4 rounded-3xl border border-[#101828]/10 bg-white/60 p-6 md:p-7">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#101828]" aria-hidden />
          <div>
            <h2 className="mb-2 text-sm font-semibold text-[#101828]">{deleteAccount.warningTitle}</h2>
            <p className="text-sm leading-relaxed text-[#475467]">{deleteAccount.warning}</p>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
