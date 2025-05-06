'use client';

import React from 'react';
import Head from 'next/head';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { ForensicBackground } from './ui/forensic-background';
import { PageTransition } from './ui/page-transition';
import { STAGGER_CHILDREN, STAGGER_ITEM } from '@/lib/utils/animations';

interface AppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  className?: string;
  backgroundVariant?: 'none' | 'grid' | 'scan' | 'pulse' | 'data';
}

export const AppShell = ({
  children,
  pageTitle,
  pageDescription,
  className,
  backgroundVariant = 'none'
}: AppShellProps) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-medium text-gray-900">
                {pageTitle || 'Digital Evidence Metadata Viewer'}
              </h1>
              {pageDescription && (
                <p className="text-sm text-gray-500 mt-1">
                  {pageDescription}
                </p>
              )}
            </div>
            
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto relative">
          {/* Background variant */}
          {backgroundVariant !== 'none' && (
            <ForensicBackground variant={backgroundVariant} className="absolute inset-0" animate={false} />
          )}
          
          {/* Page content */}
          <PageTransition>
            <div className={cn("relative z-10 px-4 sm:px-6 py-6", className)}>
              {children}
            </div>
          </PageTransition>
          
          {/* Static footer instead of animated one */}
          <div className="relative h-1 bg-gradient-to-r from-forensic-accent/0 via-forensic/30 to-forensic-accent/0 mt-auto"></div>
        </main>
      </div>
    </div>
  );
}; 