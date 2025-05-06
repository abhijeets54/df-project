import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiAlertTriangle, FiClock, FiSearch, FiShield } from 'react-icons/fi';
import { Icon } from './icon';
import { Badge } from './badge';

type FileStatusType = 'verified' | 'tampered' | 'suspicious' | 'processing' | 'analyzing' | 'secure' | 'unknown';

interface FileStatusBadgeProps {
  status: FileStatusType;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

export const FileStatusBadge = ({
  status,
  size = 'md',
  animate = true,
  className,
}: FileStatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: FiCheck,
          label: 'Verified',
          variant: 'success' as const,
          animation: animate ? 'pulse' as const : 'none' as const,
        };
      case 'tampered':
        return {
          icon: FiX,
          label: 'Tampered',
          variant: 'destructive' as const,
          animation: animate ? 'glitch' as const : 'none' as const,
        };
      case 'suspicious':
        return {
          icon: FiAlertTriangle,
          label: 'Suspicious',
          variant: 'warning' as const,
          animation: animate ? 'pulse' as const : 'none' as const,
        };
      case 'processing':
        return {
          icon: FiClock,
          label: 'Processing',
          variant: 'secondary' as const,
          animation: animate ? 'pulse' as const : 'none' as const,
        };
      case 'analyzing':
        return {
          icon: FiSearch,
          label: 'Analyzing',
          variant: 'forensic' as const,
          animation: animate ? 'pulse' as const : 'none' as const,
        };
      case 'secure':
        return {
          icon: FiShield,
          label: 'Secure',
          variant: 'success' as const,
          animation: animate ? 'none' as const : 'none' as const,
        };
      case 'unknown':
      default:
        return {
          icon: FiAlertTriangle,
          label: 'Unknown',
          variant: 'secondary' as const,
          animation: 'none' as const,
        };
    }
  };

  const { icon, label, variant, animation } = getStatusConfig();

  // For "analyzing" status, show a custom animated badge
  if (status === 'analyzing' && animate) {
    return (
      <div className={cn("inline-flex items-center", className)}>
        <span className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
          "bg-forensic text-white"
        )}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          {label}
          <Icon icon={icon} size={14} className="ml-1" />
        </span>
      </div>
    );
  }

  if (status === 'processing' && animate) {
    return (
      <div className={cn("inline-flex items-center", className)}>
        <motion.span 
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
            "bg-secondary text-secondary-foreground"
          )}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.span 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Icon icon={icon} size={14} />
          </motion.span>
          {label}
        </motion.span>
      </div>
    );
  }

  return (
    <Badge
      variant={variant}
      animation={animation}
      size={size}
      className={cn("gap-1", className)}
    >
      <Icon icon={icon} size={size === 'lg' ? 16 : 14} className="mr-0.5" />
      {label}
    </Badge>
  );
}; 