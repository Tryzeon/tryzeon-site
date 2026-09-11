import type { ReactNode } from 'react';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { PeriodTransitionProvider } from '@/components/admin/PeriodTransition';
import { requireSession } from '@/lib/admin-analytics/session';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const { email } = await requireSession();

  return (
    <>
      <AdminHeader email={email} />
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <PeriodTransitionProvider>{children}</PeriodTransitionProvider>
      </main>
    </>
  );
}
