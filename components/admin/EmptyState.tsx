import { Inbox } from 'lucide-react';


export function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/60 bg-white/70 px-6 py-16 text-center shadow-neo backdrop-blur-xl">
      <Inbox className="h-8 w-8 text-neo-mist" aria-hidden="true" />
      <p className="text-sm text-neo-steel">此期間尚無資料</p>
    </div>
  );
}
