'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BentoCardProps {
  title: string;
  description: string;
  graphic?: ReactNode;
  icon?: ReactNode;
  className?: string;
  dark?: boolean;
}

export function BentoCard({
  title,
  description,
  graphic,
  icon,
  className = '',
  dark = false,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-between h-full group
        transition-all duration-400 will-change-transform
        hover:scale-[1.02]
        ${
          dark
            ? 'bg-[#0A0A0B] text-white shadow-neo-lg border border-white/[0.06] hover:shadow-glow-blue hover:border-white/[0.1]'
            : 'bg-white text-[#101828] shadow-neo border border-[#E4E7EC] hover:shadow-neo-lg hover:border-[#2563EB]/15'
        }
        ${className}
      `}
    >
      <div className="z-10 relative flex flex-col h-full pointer-events-none">
        <div className="mb-auto">
          {icon && (
            <div
              className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl
                transition-all duration-400 group-hover:scale-110 group-hover:-rotate-3
                ${
                  dark
                    ? 'bg-[#2563EB]/15 text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white'
                    : 'bg-gradient-to-br from-[#2563EB]/8 to-[#06B6D4]/8 text-[#2563EB] group-hover:bg-[#2563EB] group-hover:from-[#2563EB] group-hover:to-[#2563EB] group-hover:text-white'
                }
              `}
            >
              {icon}
            </div>
          )}
          <h3
            className={`
              text-2xl md:text-3xl font-bold mb-4 tracking-tight
              ${dark ? 'text-white' : 'text-[#101828]'}
            `}
          >
            {title}
          </h3>
          <p
            className={`
              text-[15px] md:text-[17px] font-medium leading-relaxed max-w-[90%]
              ${dark ? 'text-white/55 group-hover:text-white/75' : 'text-[#667085] group-hover:text-[#344054]'}
              transition-colors duration-300
            `}
          >
            {description}
          </p>
        </div>
      </div>

      {graphic && (
        <div className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-105">
          {graphic}
        </div>
      )}

      <div
        className={`
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none
          ${
            dark
              ? 'bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.12),rgba(6,182,212,0.06),transparent_70%)]'
              : 'bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.06),rgba(6,182,212,0.03),transparent_70%)]'
          }
        `}
      />
    </motion.div>
  );
}
