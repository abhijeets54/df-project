'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FORENSIC_PAGE_TRANSITION } from '@/lib/utils/animations';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <div className={className}>
      <motion.div
        {...FORENSIC_PAGE_TRANSITION}
        layoutId={undefined}
        layout={false}
      >
        {children}
      </motion.div>
    </div>
  );
}; 