'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      style={{
        animation: 'pageEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        opacity: 0,
      }}
    >
      <style jsx global>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {children}
    </div>
  );
}
