'use client';

import { createContext, useCallback, useContext, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { DashboardBodySkeleton } from './DashboardSkeleton';

interface PeriodTransition {
  pending: boolean;
  navigate: (href: string) => void;
}

const PeriodTransitionContext = createContext<PeriodTransition>({
  pending: false,
  navigate: () => undefined,
});

interface ChildrenProps {
  children: ReactNode;
}

/**
 * 換期間只改 search param。React 在 transition 期間會把舊畫面留到新畫面整個到齊，
 * 伺服器串流出來的骨架根本不會被畫出來，所以等待狀態改由這個 client 端的
 * pending 旗標驅動：選單立刻顯示新值，內容區立刻換成骨架。
 */
export function PeriodTransitionProvider({ children }: ChildrenProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const navigate = useCallback(
    (href: string) => startTransition(() => router.push(href)),
    [router],
  );

  return (
    <PeriodTransitionContext.Provider value={{ pending, navigate }}>
      {children}
    </PeriodTransitionContext.Provider>
  );
}

export function usePeriodTransition(): PeriodTransition {
  return useContext(PeriodTransitionContext);
}

export function PendingBody({ children }: ChildrenProps) {
  const { pending } = usePeriodTransition();
  return pending ? <DashboardBodySkeleton /> : <>{children}</>;
}
