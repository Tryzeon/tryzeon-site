'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';

const appleSpring = { type: 'spring', stiffness: 400, damping: 30 } as const;
const appleEaseStandard = [0.25, 0.1, 0.25, 1.0] as const;

interface AppleButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

    const variantStyles = {
      primary: 'bg-[#0066CC] text-white hover:bg-[#0055AA] focus-visible:ring-[#0066CC]',
      secondary: 'bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED] focus-visible:ring-[#86868B]',
      ghost: 'bg-transparent text-[#0066CC] hover:bg-[#0066CC]/10 focus-visible:ring-[#0066CC]',
      link: 'bg-transparent text-[#0066CC] underline-offset-4 hover:underline focus-visible:ring-[#0066CC]',
    };

    const sizeStyles = {
      sm: 'h-9 px-4 text-sm rounded-full',
      md: 'h-11 px-6 text-base rounded-full',
      lg: 'h-14 px-8 text-lg rounded-full',
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={appleSpring}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
AppleButton.displayName = 'AppleButton';

interface AppleLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
  showArrow?: boolean;
  external?: boolean;
  onClick?: () => void;
}

export function AppleLink({
  children,
  href = '#',
  className = '',
  showArrow = true,
  external = false,
  onClick,
}: AppleLinkProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center gap-1 text-[#0066CC] font-medium cursor-pointer group ${className}`}
      whileHover="hover"
      initial="initial"
    >
      <span className="relative">
        {children}
        <motion.span
          className="absolute bottom-0 left-0 h-[1px] bg-[#0066CC] origin-left"
          initial={{ scaleX: 0 }}
          variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.3, ease: appleEaseStandard }}
        />
      </span>
      {showArrow && (
        <motion.span
          className="inline-block"
          variants={{ initial: { x: 0 }, hover: { x: 4 } }}
          transition={{ duration: 0.2, ease: appleEaseStandard }}
        >
          →
        </motion.span>
      )}
    </motion.a>
  );
}
