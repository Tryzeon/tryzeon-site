'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    // 首次載入交給 load 編排（template fade + hero beat-sheet），進度條只在
    // client-side 路由切換時出現。用 pathname 比對而不是 first-mount flag，
    // StrictMode 的雙重 effect 才不會誤觸
    if (prevPathname.current === null || prevPathname.current === pathname) {
      prevPathname.current = pathname;
      return;
    }
    prevPathname.current = pathname;

    setProgress(0);

    const timers = [
      setTimeout(() => setProgress(30), 50),
      setTimeout(() => setProgress(60), 100),
      setTimeout(() => setProgress(90), 150),
      setTimeout(() => setProgress(100), 300)
    ];

    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  if (progress === 0 || progress === 100) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-px">
      <div
        className="h-full bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#06B6D4] transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
