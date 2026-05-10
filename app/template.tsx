'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  const pathname = usePathname();

  // NOTE: Do NOT use transform in this template wrapper's animation.
  // Any transform value (even identity) creates a containing block that
  // traps position:fixed descendants — breaks GSAP ScrollTrigger pin
  // across the entire site. Use opacity-only fade for page transitions.
  return (
    <div
      key={pathname}
      style={{
        animation: 'pageEnter 0.4s ease forwards',
        opacity: 0,
      }}
    >
      <style jsx global>{`
        @keyframes pageEnter {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      {children}
    </div>
  );
}
