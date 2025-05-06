import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0 to 100
  variant?: 'default' | 'forensic' | 'scan' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  label?: string;
  className?: string;
  animate?: boolean;
}

export const ProgressBar = ({
  progress,
  variant = 'default',
  size = 'md',
  showPercentage = false,
  label,
  className,
  animate = true,
}: ProgressBarProps) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Size variations
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  // Variant styles
  const getVariantClasses = (isBackground = false) => {
    if (isBackground) {
      return 'bg-gray-100';
    }
    
    switch (variant) {
      case 'forensic':
        return 'bg-gradient-to-r from-forensic to-forensic-accent';
      case 'scan':
        return 'bg-forensic-accent relative overflow-hidden';
      case 'pulse':
        return 'bg-forensic relative';
      case 'default':
      default:
        return 'bg-forensic';
    }
  };
  
  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1 text-xs font-medium">
          {label && <span>{label}</span>}
          {showPercentage && <span>{clampedProgress.toFixed(0)}%</span>}
        </div>
      )}
      
      <div className={cn("w-full rounded-full overflow-hidden", sizeClasses[size], getVariantClasses(true))}>
        <motion.div
          className={cn("rounded-full", getVariantClasses())}
          initial={animate ? { width: 0 } : { width: `${clampedProgress}%` }}
          animate={{ width: `${clampedProgress}%` }}
          transition={animate ? { duration: 0.5, ease: "easeOut" } : undefined}
        >
          {variant === 'scan' && (
            <motion.div
              className="absolute top-0 h-full w-full opacity-60 bg-white"
              initial={{ left: '-100%' }}
              animate={{ left: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear",
              }}
            />
          )}
          
          {variant === 'pulse' && (
            <motion.div
              className="h-full w-full"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}; 