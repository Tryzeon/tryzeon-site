import { LogIn } from 'lucide-react';

import { signInWithGoogle } from '@/app/admin/actions';

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-neo p-8">
        <p className="font-mono text-xs tracking-[0.2em] text-neo-blue">Dashboard</p>
        <h1 className="mt-3 font-serif font-black text-3xl text-neo-ink cjk-punct">
          後台登入
        </h1>
        <p className="mt-2 text-sm text-neo-steel">此頁面僅供 Tryzeon 團隊成員使用。</p>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            登入失敗，請再試一次。
          </p>
        )}

        <form action={signInWithGoogle} className="mt-8">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-neo-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-neo-blue-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neo-cyan focus-visible:ring-offset-2"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            使用 Google 登入
          </button>
        </form>
      </div>
    </main>
  );
}
