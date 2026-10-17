'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUpItem, inView, staggerList } from '@/lib/motion';

interface RevealListProps {
  children: ReactNode;
  as?: 'ul' | 'ol';
  className?: string;
}

/**
 * 捲到才依序進場的清單容器（staggerList）。子項用 RevealItem，
 * 內容可以是 server 端渲染好的節點（變體經由 React context 傳到子項）。
 */
export function RevealList({ children, as = 'ul', className = '' }: RevealListProps) {
  const Tag = as === 'ol' ? motion.ol : motion.ul;
  return (
    <Tag {...inView} variants={staggerList} className={className}>
      {children}
    </Tag>
  );
}

interface RevealItemProps {
  children: ReactNode;
  className?: string;
}

/** RevealList 的子項：淡入上移（fadeUpItem）。版位 class（grid span）放這裡 */
export function RevealItem({ children, className = '' }: RevealItemProps) {
  return (
    <motion.li variants={fadeUpItem} className={className}>
      {children}
    </motion.li>
  );
}
