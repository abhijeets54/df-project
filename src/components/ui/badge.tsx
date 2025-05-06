import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'forensic';
  animation?: 'none' | 'pulse' | 'glitch';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge = ({
  children,
  variant = 'default',
  animation = 'none',
  size = 'md',
  className,
}: BadgeProps) => {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    success: 'bg-forensic-success text-white',
    warning: 'bg-forensic-warning text-white',
    forensic: 'bg-forensic text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const animationVariants = {
    pulse: {
      animate: { opacity: [0.8, 1, 0.8] },
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    glitch: {
      animate: { x: [0, -1, 1, -1, 0] },
      transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" }
    },
    none: {}
  };

  const badgeContent = (
    <span className="relative z-10 flex items-center">
      {children}
    </span>
  );

  if (animation !== 'none') {
    return (
      <motion.span
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        animate={animationVariants[animation].animate}
        transition={animationVariants[animation].transition}
      >
        {variant === 'forensic' && animation === 'pulse' && (
          <span className="absolute inset-0 rounded-full bg-forensic-accent opacity-30 animate-pulse"></span>
        )}
        {badgeContent}
      </motion.span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {badgeContent}
    </span>
  );
}; 