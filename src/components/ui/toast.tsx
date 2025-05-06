'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import { Icon } from './icon';
import { useToast } from '@/lib/hooks/use-toast';
import { MotionWrapper } from './motion-wrapper';

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'forensic';
  duration?: number; // in ms, default 5000ms (5s)
  onClose: (id: string) => void;
  className?: string;
}

export const Toast = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose,
  className,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - (100 / (duration / 100)), 0));
    }, 100);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration]);
  
  const handleAnimationComplete = () => {
    if (!isVisible) {
      onClose(id);
    }
  };
  
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return FiCheckCircle;
      case 'error':
        return FiAlertCircle;
      case 'warning':
        return FiAlertTriangle;
      case 'info':
      case 'forensic':
        return FiInfo;
      default:
        return null;
    }
  };
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-l-forensic-success bg-white';
      case 'error':
        return 'border-l-forensic-error bg-white';
      case 'warning':
        return 'border-l-forensic-warning bg-white';
      case 'info':
        return 'border-l-blue-500 bg-white';
      case 'forensic':
        return 'border-l-forensic bg-white';
      default:
        return 'bg-white';
    }
  };
  
  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-forensic-success';
      case 'error':
        return 'text-forensic-error';
      case 'warning':
        return 'text-forensic-warning';
      case 'info':
        return 'text-blue-500';
      case 'forensic':
        return 'text-forensic';
      default:
        return 'text-gray-500';
    }
  };
  
  const IconComponent = getIcon();

  return (
    <MotionWrapper>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'relative rounded-md shadow-md border-l-4',
            'max-w-sm w-full pointer-events-auto overflow-hidden',
            getVariantClasses(),
            className
          )}
          role="alert"
          onAnimationComplete={handleAnimationComplete}
        >
          <div className="p-4 pr-8">
            <div className="flex items-start">
              {IconComponent && (
                <div className={cn("flex-shrink-0 mr-3 mt-0.5", getIconColor())}>
                  <Icon icon={IconComponent} size={20} />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                {description && (
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-forensic focus:ring-opacity-50"
            onClick={() => setIsVisible(false)}
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <Icon icon={FiX} size={16} />
          </button>
          
          {/* Progress bar */}
          <div className="h-1 w-full bg-gray-100">
            <motion.div
              className={cn(
                "h-full",
                variant === 'success' ? 'bg-forensic-success' :
                variant === 'error' ? 'bg-forensic-error' :
                variant === 'warning' ? 'bg-forensic-warning' :
                variant === 'info' ? 'bg-blue-500' :
                variant === 'forensic' ? 'bg-forensic' : 'bg-gray-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </MotionWrapper>
  );
};

// Toast container to manage multiple toasts
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();
  
  if (toasts.length === 0) return null;
  
  return (
    <div
      className="fixed bottom-0 right-0 z-50 p-4 sm:p-6 max-h-screen overflow-hidden pointer-events-none"
      aria-live="polite"
      style={{ position: 'fixed', bottom: '0', right: '0', width: 'auto', height: 'auto' }}
    >
      <div className="flex flex-col items-end gap-2">
        <MotionWrapper>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout={false}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto transform-gpu max-w-sm w-full"
            >
              <Toast
                id={toast.id}
                title={toast.title}
                description={toast.description}
                variant={toast.variant}
                duration={toast.duration}
                onClose={removeToast}
              />
            </motion.div>
          ))}
        </MotionWrapper>
      </div>
    </div>
  );
}; 