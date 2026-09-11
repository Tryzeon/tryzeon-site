import type { ReactNode } from 'react';
import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: '品牌成效儀表板',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="min-h-screen gradient-mesh-bg text-neo-ink">{children}</div>;
}
