import { ShieldOff } from 'lucide-react';


export function AccessDenied() {
  return (
    <div className="mx-auto max-w-sm rounded-3xl border border-white/60 bg-white/70 p-8 text-center shadow-neo backdrop-blur-xl">
      <ShieldOff className="mx-auto h-8 w-8 text-neo-mist" aria-hidden="true" />
      <h1 className="mt-4 font-serif text-2xl font-black text-neo-ink cjk-punct">
        此帳號沒有存取權限
      </h1>
      <p className="mt-2 text-sm text-neo-steel">請聯絡團隊管理員將你的帳號加入白名單。</p>
    </div>
  );
}
