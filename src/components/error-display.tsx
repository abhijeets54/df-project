"use client";

import React from 'react';
import { useForensicStore } from '@/lib/hooks/use-forensic-store';
import { FiAlertTriangle } from 'react-icons/fi';
import { Icon } from './icon';

export const ErrorDisplay: React.FC = () => {
  const { error } = useForensicStore();
  
  if (!error) return null;
  
  return (
    <div className="p-4 mb-4 border border-red-300 rounded-md bg-red-50 text-red-800">
      <div className="flex items-center">
        <Icon icon={FiAlertTriangle} className="text-red-600 mr-2" size={20} />
        <span className="font-medium">Error:</span>
        <span className="ml-2">{error}</span>
      </div>
    </div>
  );
};
