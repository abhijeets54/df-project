'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FiHardDrive, FiLoader, FiSearch, FiShield } from 'react-icons/fi';
import { Icon } from '@/components/ui/icon';

export interface LoaderProps {
  variant?: 'spinner' | 'forensic' | 'scan' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loader = ({ 
  variant = 'spinner', 
  size = 'md', 
  text, 
  className 
}: LoaderProps) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'forensic':
        return (
          <div className="relative flex items-center justify-center">
            <div className={cn("animate-pulse text-forensic", sizeMap[size])}>
              <Icon icon={FiHardDrive} size={size === 'lg' ? 40 : size === 'md' ? 24 : 16} />
            </div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <div className={cn("animate-spin text-forensic-accent opacity-90", sizeMap[size])}>
                <Icon icon={FiSearch} size={size === 'lg' ? 20 : size === 'md' ? 12 : 8} />
              </div>
            </div>
          </div>
        );
        
      case 'scan':
        return (
          <div className="relative flex items-center justify-center">
            <div className={cn("text-forensic", sizeMap[size])}>
              <Icon icon={FiShield} size={size === 'lg' ? 40 : size === 'md' ? 24 : 16} />
            </div>
            <div className="absolute inset-0">
              <div className="w-full bg-forensic-accent opacity-30 absolute bottom-0 left-0 right-0 animate-scan-up"></div>
            </div>
          </div>
        );
        
      case 'pulse':
        return (
          <div className="flex items-center justify-center space-x-1">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={cn(
                  "bg-forensic rounded-full animate-pulse",
                  size === 'lg' ? 'h-3 w-3' : size === 'md' ? 'h-2 w-2' : 'h-1 w-1',
                )}
                style={{ animationDelay: `${idx * 0.15}s` }}
              />
            ))}
          </div>
        );
        
      case 'spinner':
      default:
        return (
          <div className={cn("animate-spin text-forensic", sizeMap[size])}>
            <Icon icon={FiLoader} size={size === 'lg' ? 40 : size === 'md' ? 24 : 16} />
          </div>
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {renderLoader()}
      {text && (
        <div className={cn(
          "mt-2 text-forensic-dark font-medium",
          size === 'lg' ? 'text-sm' : 'text-xs'
        )}>
          {text}
        </div>
      )}
    </div>
  );
}; 