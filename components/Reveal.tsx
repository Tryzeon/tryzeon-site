'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cardRise, inView, staggerList } from '@/lib/motion';

interface RevealListProps {
  children: ReactNode;
  className?: string;
  as?: 'ul' | 'ol';
}

/** server 頁面用的進場清單：子項（RevealItem）依序從後仰的角度立起來 */
export function RevealList({ children, className = '', as = 'ul' }: RevealListProps) {
  const List = as === 'ol' ? motion.ol : motion.ul;
  return (
    <List variants={staggerList} {...inView} className={className}>
      {children}
    </List>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
}

export function RevealItem({ children, className = '' }: RevealItemProps) {
  return (
    <motion.li variants={cardRise} className={className}>
      {children}
    </motion.li>
  );
}
