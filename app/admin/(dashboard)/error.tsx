'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';


interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('admin dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/60 bg-white/70 px-6 py-16 text-center shadow-neo backdrop-blur-xl">
      <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      <h2 className="font-serif text-xl font-black text-neo-ink cjk-punct">載入失敗</h2>
      <p className="max-w-md break-all font-mono text-xs text-neo-steel">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-full bg-neo-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neo-blue-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan focus-visible:ring-offset-2"
      >
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        重試
      </button>
    </div>
  );
}
