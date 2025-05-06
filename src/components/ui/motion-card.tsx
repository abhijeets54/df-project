'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CARD_HOVER_ANIMATION } from '@/lib/utils/animations';

interface MotionCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'forensic' | 'grid' | 'scan' | 'pulse';
  onClick?: () => void;
  interactive?: boolean;
}

export const MotionCard = ({
  children,
  className,
  variant = 'default',
  onClick,
  interactive = true,
}: MotionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'forensic':
        return "bg-white border-l-4 border-l-forensic border-t border-r border-b border-gray-200 relative overflow-hidden";
      case 'grid':
        return "bg-white bg-grid-pattern bg-grid border border-gray-200 relative overflow-hidden";
      case 'scan':
        return "bg-white border border-gray-200 relative overflow-hidden";
      case 'pulse':
        return "bg-white border border-gray-200 relative overflow-hidden";
      case 'default':
      default:
        return "bg-white border border-gray-200";
    }
  };

  return (
    <motion.div
      className={cn(
        "rounded-lg shadow-sm p-4",
        getVariantClasses(),
        interactive && "transition-shadow hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={interactive ? onClick : undefined}
      onMouseEnter={interactive ? () => setIsHovered(true) : undefined}
      onMouseLeave={interactive ? () => setIsHovered(false) : undefined}
      initial="rest"
      animate={isHovered && interactive ? "hover" : "rest"}
      variants={interactive ? CARD_HOVER_ANIMATION : undefined}
      whileTap={interactive ? { scale: 0.98 } : undefined}
    >
      {variant === 'scan' && interactive && isHovered && (
        <motion.div 
          className="absolute inset-0 bg-forensic-accent opacity-10 z-0"
          initial={{ top: '0%', height: '5%' }}
          animate={{ top: ['0%', '95%'] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            repeatType: 'reverse', 
            ease: "easeInOut"
          }}
        />
      )}
      
      {variant === 'pulse' && (
        <motion.div
          className="absolute inset-0 rounded-lg border border-forensic z-0"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ 
            opacity: [0, 0.5, 0], 
            scale: [0.95, 1.02, 0.95]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
        />
      )}

      {variant === 'forensic' && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-forensic-accent rounded-bl-lg" />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}; 