'use client';

/**
 * SpotlightAudienceCard — Tryzeon two-sided audience card.
 *
 * Adapted from 21st.dev "Spotlight Card" (cursor-following radial gradient
 * spotlight, similarity 0.456) + "Elite Plan Card" (framer-motion hover
 * scale + image header + content layout) inspirations.
 *
 * Composition:
 *   <SpotlightAudienceCard image kicker title desc href ctaLabel accent />
 *
 * Effects:
 *   - mouse-follow radial spotlight (accent-coloured)
 *   - subtle hover lift + shadow expansion (framer-motion spring)
 *   - image zoom on hover
 *   - light editorial-tech aesthetic, no AI purple slop
 */

import { useRef, useState, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface SpotlightAudienceCardProps {
  image: string;
  imageAlt: string;
  kicker: string;
  title: React.ReactNode;
  desc: React.ReactNode;
  href: string;
  ctaLabel: string;
  /** Accent hex without alpha, e.g. '#2563EB' */
  accent: string;
  /** Variant: dark CTA button or outlined ghost */
  ctaVariant?: 'primary' | 'ghost';
}

export function SpotlightAudienceCard({
  image,
  imageAlt,
  kicker,
  title,
  desc,
  href,
  ctaLabel,
  accent,
  ctaVariant = 'primary',
}: SpotlightAudienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [spotlightOpacity, setSpotlightOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Accent + 18% alpha for spotlight gradient stop
  const spotlightColor = `${accent}30`;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setSpotlightOpacity(1)}
      onMouseLeave={() => setSpotlightOpacity(0)}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      className="group relative h-full flex flex-col rounded-3xl overflow-hidden border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(16,24,40,0.05)] hover:shadow-[0_30px_80px_rgba(37,99,235,0.10)] transition-shadow duration-500"
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
        style={{
          opacity: spotlightOpacity,
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 45%)`,
        }}
      />

      {/* Image header with zoom-on-hover */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Subtle bottom fade for image → content transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 flex flex-col flex-1 justify-between">
        <div>
          <span
            className="block text-[10px] md:text-[11px] font-mono font-semibold tracking-[0.4em] uppercase mb-4 md:mb-6"
            style={{ color: accent }}
          >
            {kicker}
          </span>
          <h3
            className="font-extrabold tracking-[-0.03em] leading-[1.0] text-[#101828] mb-6 md:mb-8"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 3rem)' }}
          >
            {title}
          </h3>
          <p className="text-sm md:text-base text-[#475467] leading-relaxed mb-8 md:mb-10">
            {desc}
          </p>
        </div>

        {/* CTA */}
        <Link
          href={href}
          className={`group/cta inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] self-start ${
            ctaVariant === 'primary'
              ? 'bg-[#101828] text-white hover:bg-[#1D2939]'
              : 'bg-white text-[#101828] border border-[#101828]/15 hover:border-[#101828]/30 hover:bg-[#F2F4F7]'
          }`}
        >
          {ctaLabel}
          <span className="ml-2 transition-transform duration-300 group-hover/cta:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </motion.div>
  );
}
