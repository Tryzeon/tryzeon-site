'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Magnetic } from '@/components/Magnetic';
import { Notice } from '@/components/Notice';
import { copy } from '@/lib/copy';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Notice
      emblem={<AlertTriangle className="h-9 w-9 text-[#2563EB]" strokeWidth={1.4} />}
      title={copy.notice.error.title}
      lede={copy.notice.error.lede}
    >
      <Magnetic className="inline-block">
        <button
          type="button"
          onClick={reset}
          className="btn-primary gap-2 px-8 py-3.5"
        >
          <RefreshCw className="h-5 w-5" aria-hidden />
          {copy.notice.error.retry}
        </button>
      </Magnetic>

      {process.env.NODE_ENV === 'development' && (
        <p className="mt-8 break-all rounded-2xl border border-[#101828]/10 bg-white/60 p-4 text-left font-mono text-xs leading-relaxed text-[#475467]">
          {error.message}
          {error.digest && <span className="mt-2 block">digest: {error.digest}</span>}
        </p>
      )}
    </Notice>
  );
}
