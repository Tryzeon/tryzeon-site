import type { Metadata } from 'next';
import { AlertCircle } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { clauseWrap } from '@/components/clauseWrap';
import { copy } from '@/lib/copy';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/delete-account',
  title: '刪除帳號',
  description: '了解如何在 Tryzeon App 中刪除您的帳號與個人資料。',
});

export const revalidate = 3600;

const CARD = 'glass-panel p-7 md:p-10';

export default function DeleteAccountPage() {
  const { deleteAccount } = copy;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 md:mb-16">
          <p className="mb-6 font-mono text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.4em] text-haze">
            {deleteAccount.kicker}
          </p>
          <h1
            className="cjk-punct mb-6 font-serif font-black tracking-[-0.02em] leading-[1.12] text-pearl"
            style={{ fontSize: 'clamp(2.25rem, 1.6rem + 2.8vw, 3.5rem)' }}
          >
            {clauseWrap(deleteAccount.title)}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-haze">{deleteAccount.lede}</p>
        </header>

        <section className={`${CARD} mb-6`}>
          <h2 className="mb-8 text-xl font-semibold text-pearl">{deleteAccount.stepsTitle}</h2>
          <ol className="space-y-8">
            {deleteAccount.steps.map((step, i) => (
              <li key={step.title} className="flex items-start gap-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-lilac/25 bg-gradient-to-br from-lilac/25 to-aqua/10 font-mono text-sm font-semibold text-lilac">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="mb-1.5 font-semibold text-pearl">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-haze">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="flex gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-7">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-pearl" aria-hidden />
          <div>
            <h2 className="mb-2 text-sm font-semibold text-pearl">{deleteAccount.warningTitle}</h2>
            <p className="text-sm leading-relaxed text-haze">{deleteAccount.warning}</p>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
}
