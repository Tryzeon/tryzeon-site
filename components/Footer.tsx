import { SiteLink } from '@/components/SiteLink';
import { copy } from '@/lib/copy';

const LINK =
  'rounded-sm text-sm font-medium text-haze transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060A]';

export function Footer() {
  const { footer } = copy;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#05060A] text-pearl">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lilac/60 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[60vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(185,167,255,0.12),transparent)] blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1360px] px-6 pb-12 pt-20 md:px-12 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-4 lg:col-span-2 lg:pr-12">
            <p className="mb-4 font-serif text-2xl font-black tracking-tight">Tryzeon</p>
            <p className="mb-8 font-medium leading-relaxed text-haze">{footer.tagline}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="col-span-1">
              <h2 className="mb-6 text-xs font-semibold tracking-[0.1em] text-dim">{column.title}</h2>
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

      {/* 巨大字標：游標經過的地方被照亮（--mx/--my 由 PointerFx 寫入） */}
      <div className="relative select-none px-4" aria-hidden>
        <p data-spot className="mb-0 bg-[radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,40%),rgba(214,204,255,0.85),transparent_55%),linear-gradient(180deg,rgba(241,240,247,0.16),rgba(241,240,247,0.02)_85%)] bg-clip-text text-center font-serif font-black leading-[0.82] tracking-[-0.04em] text-transparent text-[24vw]">
          Tryzeon
        </p>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1360px] flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-dim md:flex-row md:px-12">
          <div className="text-center md:text-left">
            <p className="mb-0">{footer.copyright.replace('{year}', String(year))}</p>
            <p className="mb-0 mt-1">{footer.company}</p>
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footer.legal.map((link) => (
              <li key={link.href}>
                <SiteLink
                  href={link.href}
                  className="rounded-sm transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lilac"
                >
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
