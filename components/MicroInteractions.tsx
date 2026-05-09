'use client';

import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

interface AppleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]';

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
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
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
    <a
      href={href}
      onClick={onClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group inline-flex items-center gap-1 text-[#0066CC] font-medium cursor-pointer ${className}`}
    >
      <span className="relative">
        {children}
        <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#0066CC] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
      </span>
      {showArrow && (
        <span className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:translate-x-1">
          →
        </span>
      )}
    </a>
  );
}
