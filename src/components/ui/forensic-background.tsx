'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ForensicBackgroundProps {
  variant?: 'grid' | 'scan' | 'pulse' | 'data' | 'minimal';
  className?: string;
  animate?: boolean;
  children?: React.ReactNode;
}

export const ForensicBackground = ({
  variant = 'grid',
  className,
  animate = true,
  children,
}: ForensicBackgroundProps) => {
  const renderBackground = () => {
    switch (variant) {
      case 'grid':
        return (
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-25 pointer-events-none" />
        );
        
      case 'scan':
        return (
          <>
            <div className="absolute inset-0 bg-blue-50/30 pointer-events-none" />
            {animate && (
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-forensic-accent/30"
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: 'linear',
                  }}
                />
              </motion.div>
            )}
          </>
        );
        
      case 'pulse':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white pointer-events-none" />
            {animate && (
              <motion.div 
                className="absolute inset-0 bg-grid-overlay bg-grid opacity-20 pointer-events-none"
                animate={{ 
                  opacity: [0.1, 0.2, 0.1], 
                  scale: [1, 1.05, 1] 
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
              />
            )}
          </>
        );
        
      case 'data':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-forensic-dark/5 to-white pointer-events-none" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {animate && Array.from({ length: 8 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className="absolute h-px bg-forensic-accent/40 overflow-hidden" 
                  style={{ 
                    top: `${Math.floor(Math.random() * 100)}%`,
                    width: `${20 + Math.floor(Math.random() * 50)}%`,
                    left: `${Math.floor(Math.random() * 30)}%`,
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ 
                    duration: 2 + Math.random() * 6, 
                    repeat: Infinity, 
                    ease: 'linear',
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </>
        );
        
      case 'minimal':
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-white pointer-events-none" />
        );
    }
  };

  return (
    <div className={cn("relative h-full w-full", className)}>
      {renderBackground()}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}; 