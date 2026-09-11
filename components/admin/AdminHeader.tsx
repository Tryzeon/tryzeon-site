import Link from 'next/link';
import { LogOut } from 'lucide-react';

import { signOut } from '@/app/admin/actions';

interface AdminHeaderProps {
  email: string;
}

export function AdminHeader({ email }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/admin"
          className="flex items-baseline gap-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan"
        >
          <span className="font-display text-lg font-black tracking-tight text-neo-ink">Tryzeon</span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-neo-blue">Dashboard</span>
        </Link>
        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden truncate text-sm text-neo-steel sm:block">{email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-neo-smoke bg-white/80 px-4 py-2 text-sm font-medium text-neo-ink transition-colors hover:border-neo-blue hover:text-neo-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              登出
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
