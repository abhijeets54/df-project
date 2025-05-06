'use client';

import React from 'react';
import { IconBaseProps } from 'react-icons';

interface IconProps extends IconBaseProps {
  icon: React.ElementType;
  className?: string;
}

/**
 * Icon component that wraps react-icons to ensure consistent sizing and behavior
 * Prevents the "flash of unstyled content" where icons appear large initially
 */
export const Icon: React.FC<IconProps> = ({ 
  icon: IconComponent, 
  className = '', 
  size,
  ...props 
}) => {
  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ lineHeight: 0 }}>
      <IconComponent 
        size={size} 
        className="react-icon" 
        style={{ 
          display: 'inline-block',
          verticalAlign: 'middle',
          height: size || '1em',
          width: size || '1em'
        }}
        {...props} 
      />
    </span>
  );
};
