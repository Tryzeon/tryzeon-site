import { SiteLink } from '@/components/SiteLink';
import { copy } from '@/lib/copy';

const LINK =
  'rounded-sm text-sm font-medium text-white/70 transition-colors hover:text-[#60A5FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D1D1F]';

// 全站唯一的深色區塊（MASTER.md）
export function Footer() {
  const { footer } = copy;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1D1D1F] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pr-12">
            <p className="text-2xl font-bold mb-4 tracking-tight">Tryzeon</p>
            <p className="text-white/60 mb-8 font-medium leading-relaxed">{footer.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="col-span-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-[#98A2B3] mb-6">{column.title}</h2>
              <ul className="space-y-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('mailto:') ? (
                      <a href={link.href} className={LINK}>
                        {link.label}
                      </a>
                    ) : link.href.startsWith('https://') ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                        {link.label}
                      </a>
                    ) : (
                      <SiteLink href={link.href} className={LINK}>
                        {link.label}
                      </SiteLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#161617]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#98A2B3]">
          <div className="text-center md:text-left">
            <p>{footer.copyright.replace('{year}', String(year))}</p>
            <p className="mt-1">{footer.company}</p>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footer.legal.map((link) => (
              <li key={link.href}>
                <SiteLink href={link.href} className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]">
                  {link.label}
                </SiteLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
