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
  // @keyframes pageEnter lives in globals.css (not styled-jsx here): a client
  // component's styled-jsx is not emitted into the SSR HTML, so on a hard load
  // the keyframe would be missing and this opacity:0 wrapper would stay blank
  // until hydration. The global stylesheet ships the keyframe on first paint.
  return (
    <div
      key={pathname}
      style={{
        animation: 'pageEnter 0.4s ease forwards',
        opacity: 0,
      }}
    >
      {children}
    </div>
  );
}
