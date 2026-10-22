import { copy } from '@/lib/copy';

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[#101828] focus:text-white focus:rounded-full focus:font-semibold focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:ring-offset-2"
    >
      {copy.a11y.skipToContent}
    </a>
  );
}
