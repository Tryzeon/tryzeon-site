import { MoreLink } from '@/components/MoreLink';
import { keepRanges } from '@/components/clauseWrap';

interface Step {
  title: string;
  desc: string;
  link?: { label: string; href: string };
}

interface StepsPanelProps {
  items: readonly Step[];
}

/**
 * 三步驟：一整塊玻璃切成三欄，每欄一個藍青漸層的宋體大數字。
 * 桌機（lg）才分三欄，平板與手機直排（768 分三欄太擠，連結會斷字）。
 * /business「三個步驟，完成導入」與 /download「三個步驟，開始試穿」共用。
 */
export function StepsPanel({ items }: StepsPanelProps) {
  return (
    <ol className="glass-panel relative grid overflow-hidden lg:grid-cols-3">
      {items.map((step, i) => (
        <li
          key={step.title}
          className="relative flex flex-col border-[#101828]/10 p-8 md:p-10 [&:not(:first-child)]:border-t lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0"
        >
          <span className="bg-gradient-to-br from-[#2563EB] to-[#06B6D4] bg-clip-text font-serif text-5xl font-black leading-none text-transparent md:text-6xl" aria-hidden>
            0{i + 1}
          </span>
          <h3 className="mt-8 text-lg md:text-xl font-semibold text-[#101828]">{step.title}</h3>
          <p className="mb-0 mt-2 text-balance text-sm md:text-base leading-relaxed text-[#475467]">{keepRanges(step.desc)}</p>
          {step.link && (
            <div className="mt-auto pt-6">
              <MoreLink href={step.link.href} small>
                {step.link.label}
              </MoreLink>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
