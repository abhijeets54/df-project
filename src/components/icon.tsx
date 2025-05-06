"use client";

import React from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
  className?: string;
  size?: number | string;
  [key: string]: any;
}

/**
 * Icon component that wraps react-icons to ensure consistent sizing
 * and prevent the "flash of unstyled content"
 */
export const Icon: React.FC<IconProps> = ({ icon: IconComponent, className = '', size, ...props }) => {
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
