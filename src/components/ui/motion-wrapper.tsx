'use client';

import React from 'react';
import { AnimatePresence } from 'framer-motion';

interface MotionWrapperProps {
  children: React.ReactNode;
  mode?: "sync" | "wait" | "popLayout";
  reduceMotion?: boolean;
}

export const MotionWrapper = ({ 
  children, 
  mode = "wait", 
  reduceMotion = false 
}: MotionWrapperProps) => {
  return (
    <div className="relative overflow-hidden">
      <AnimatePresence 
        mode={mode}
        // Use exitBeforeEnter to prevent layout shifts
        presenceAffectsLayout={false}
      >
        {children}
      </AnimatePresence>
    </div>
  );
}; 