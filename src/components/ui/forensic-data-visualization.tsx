'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DataBlock {
  value: number; // 0 to 100 for percentage height
  color?: string; 
  highlighted?: boolean;
  tampered?: boolean;
}

interface ForensicDataVisualizationProps {
  data: DataBlock[];
  height?: number;
  className?: string;
  showAnimation?: boolean;
  variant?: 'bytes' | 'segments' | 'timeline' | 'hex';
}

export const ForensicDataVisualization = ({
  data,
  height = 60,
  className,
  showAnimation = true,
  variant = 'bytes',
}: ForensicDataVisualizationProps) => {
  // Normalize data if needed
  const normalizedData = data.length > 0 
    ? data 
    : Array(40).fill(null).map(() => ({ 
        value: Math.floor(Math.random() * 100),
        highlighted: Math.random() > 0.9,
        tampered: Math.random() > 0.95,
        color: undefined
      }));

  const renderBytes = () => (
    <div 
      className={cn(
        "flex items-end w-full gap-px overflow-hidden rounded-md",
        className
      )}
      style={{ height: `${height}px` }}
    >
      {normalizedData.map((block, idx) => {
        const blockHeight = `${Math.max(10, block.value)}%`;
        const blockColor = block.tampered 
          ? 'bg-forensic-error' 
          : block.highlighted 
            ? 'bg-forensic-accent' 
            : block.color || 'bg-forensic';
        
        const opacityClass = block.tampered
          ? 'opacity-90'
          : block.highlighted
            ? 'opacity-80'
            : 'opacity-60';
            
        return (
          <motion.div
            key={idx}
            className={cn("rounded-sm", blockColor, opacityClass)}
            style={{ height: blockHeight, width: `${100 / normalizedData.length}%` }}
            initial={showAnimation ? { height: 0 } : { height: blockHeight }}
            animate={{ height: blockHeight }}
            transition={{ 
              duration: 0.5, 
              delay: showAnimation ? idx * 0.01 : 0,
              ease: "easeOut"
            }}
          >
            {block.tampered && (
              <motion.div 
                className="w-full h-full bg-red-300 opacity-30"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
  
  const renderSegments = () => (
    <div 
      className={cn(
        "flex w-full overflow-hidden rounded-md border border-gray-200",
        className
      )}
      style={{ height: `${height}px` }}
    >
      {normalizedData.map((block, idx) => {
        const segmentWidth = `${(block.value / Math.max(...normalizedData.map(b => b.value))) * 100}%`;
        const segmentColor = block.tampered 
          ? 'bg-forensic-error/20 border-forensic-error/40' 
          : block.highlighted 
            ? 'bg-forensic-accent/20 border-forensic-accent/40' 
            : block.color || 'bg-forensic/10 border-forensic/30';
            
        return (
          <motion.div
            key={idx}
            className={cn(
              "h-full border-r last:border-r-0", 
              segmentColor
            )}
            style={{ width: segmentWidth }}
            initial={showAnimation ? { width: 0 } : { width: segmentWidth }}
            animate={{ width: segmentWidth }}
            transition={{ 
              duration: 0.5, 
              delay: showAnimation ? idx * 0.1 : 0,
              ease: "easeOut"
            }}
          >
            {block.tampered && (
              <motion.div 
                className="w-full h-full bg-forensic-error/10"
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
  
  const renderTimeline = () => (
    <div 
      className={cn(
        "relative w-full overflow-hidden rounded-md border border-gray-200",
        className
      )}
      style={{ height: `${height}px` }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="relative h-full flex items-center">
        {normalizedData.map((block, idx) => {
          const left = `${(idx / normalizedData.length) * 100}%`;
          const eventSize = block.highlighted ? 'h-5 w-5' : 'h-3 w-3';
          const eventColor = block.tampered 
            ? 'bg-forensic-error border-forensic-error' 
            : block.highlighted 
              ? 'bg-forensic-accent border-forensic-accent' 
              : 'bg-forensic border-forensic';
              
          return (
            <React.Fragment key={idx}>
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2"
                style={{ left }}
                initial={showAnimation ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: showAnimation ? idx * 0.05 : 0,
                  ease: "backOut"
                }}
              >
                <motion.div 
                  className={cn(
                    "rounded-full border-2", 
                    eventSize,
                    eventColor
                  )}
                  animate={block.tampered || block.highlighted ? {
                    scale: [1, 1.2, 1]
                  } : undefined}
                  transition={block.tampered || block.highlighted ? { 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : undefined}
                />
              </motion.div>
              
              {idx < normalizedData.length - 1 && (
                <motion.div
                  className="absolute top-1/2 h-px bg-gray-300"
                  style={{ 
                    left, 
                    width: `${100 / normalizedData.length}%`
                  }}
                  initial={showAnimation ? { scaleX: 0 } : { scaleX: 1 }}
                  animate={{ scaleX: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: showAnimation ? idx * 0.05 + 0.1 : 0 
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
  
  const renderHex = () => (
    <div 
      className={cn(
        "flex flex-wrap w-full overflow-hidden rounded-md bg-gray-50 p-1 font-mono text-[8px]",
        className
      )}
      style={{ height: `${height}px` }}
    >
      {normalizedData.map((block, idx) => {
        const isHighlighted = block.highlighted;
        const isTampered = block.tampered;
        
        // Generate a hex-like value based on the block value
        const hexValue = ((block.value * 2.55) | 0).toString(16).padStart(2, '0');
        
        return (
          <motion.div
            key={idx}
            className={cn(
              "w-5 h-5 m-0.5 flex items-center justify-center rounded-sm",
              isHighlighted ? "bg-forensic-accent/20 text-forensic-dark" : 
              isTampered ? "bg-forensic-error/20 text-forensic-error" : 
              "bg-white text-gray-500 border border-gray-200"
            )}
            initial={showAnimation ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.2, 
              delay: showAnimation ? idx * 0.01 : 0 
            }}
          >
            {hexValue}
          </motion.div>
        );
      })}
    </div>
  );
  
  switch (variant) {
    case 'segments':
      return renderSegments();
    case 'timeline':
      return renderTimeline();
    case 'hex':
      return renderHex();
    case 'bytes':
    default:
      return renderBytes();
  }
}; 