'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiHardDrive, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useForensicStore } from '@/lib/hooks/use-forensic-store';
import { Icon } from './icon';
import { ErrorDisplay } from './error-display';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader } from './ui/loader';

interface FileDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // In bytes
  acceptedFileTypes?: string[];
  isLoading?: boolean;
}

export const FileDropzone = ({
  onFilesAccepted,
  maxFiles = 1,
  maxSize = 100 * 1024 * 1024, // 100MB default
  acceptedFileTypes,
  isLoading = false
}: FileDropzoneProps) => {
  const [fileError, setFileError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Clear any previous errors
    setFileError(null);
    
    // Handle rejected files (too large, wrong type, etc.)
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0]?.errors[0];
      if (error) {
        setFileError(error.message);
        return;
      }
    }
    
    // If we have accepted files, call the callback
    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
  }, [onFilesAccepted]);

  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    acceptedFiles
  } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedFileTypes ? 
      Object.fromEntries(acceptedFileTypes.map(type => [type, []])) : 
      undefined,
    disabled: isLoading
  });
  
  // Separate dropzone props and motion props
  const dropzoneProps = getRootProps();
  
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        {...dropzoneProps}
        className={cn(
          "border-2 border-dashed rounded-lg transition-all",
          "flex flex-col items-center justify-center",
          "min-h-[200px] sm:min-h-[250px] text-center relative overflow-hidden",
          isDragActive ? "border-forensic bg-blue-50" : "border-gray-300 hover:border-forensic hover:bg-gray-50",
          isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          fileError ? "border-red-300" : ""
        )}
        aria-label="File upload dropzone"
        role="button"
        tabIndex={isLoading ? -1 : 0}
        aria-disabled={isLoading}
      >
        <input {...getInputProps()} aria-label="File input" disabled={isLoading} />
        
        {/* Motion wrapper for hover and tap effects */}
        <motion.div 
          className="absolute inset-0 z-0"
          whileHover={!isLoading ? { scale: 1.01, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" } : undefined}
          whileTap={!isLoading ? { scale: 0.99 } : undefined}
        />
        
        {/* Background animation for drag active state */}
        {isDragActive && (
          <motion.div 
            className="absolute inset-0 z-0 bg-gradient-to-br from-forensic-accent/5 to-forensic/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute inset-0 bg-grid-pattern opacity-20"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
        
        {/* Scan line animation */}
        {isDragActive && (
          <motion.div
            className="absolute left-0 right-0 h-1 bg-forensic-accent/20 z-0"
            initial={{ top: 0 }}
            animate={{ top: ['0%', '100%'] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: 'reverse', 
              ease: "easeInOut" 
            }}
          />
        )}
        
        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 relative z-10 p-4 sm:p-6">
          {acceptedFiles.length === 0 ? (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
              <Icon 
                  icon={isDragActive ? FiHardDrive : FiUpload}
                className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12",
                  isDragActive ? "text-forensic" : "text-gray-400"
                )} 
                aria-hidden="true"
              />
              </motion.div>
              
              <motion.div 
                className="text-base sm:text-lg md:text-xl font-medium text-gray-800"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {isDragActive ? "Drop file to analyze" : "Upload file for forensic analysis"}
              </motion.div>
              
              <motion.div 
                className="text-sm text-gray-500 max-w-md"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                or <span className="text-forensic font-medium">click to browse</span>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center text-xs text-gray-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {maxFiles > 1 && (
                  <span>
                    Upload up to {maxFiles} files
                  </span>
                )}
                {maxSize && (
                  <span>
                    Max size: {Math.round(maxSize / (1024 * 1024))}MB per file
                  </span>
                )}
                {acceptedFileTypes && (
                  <span className="text-center">
                    Accepted types: {acceptedFileTypes.join(', ')}
                  </span>
                )}
              </motion.div>
            </>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader variant="forensic" size="lg" text="Processing file..." />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Icon icon={FiCheckCircle} className="w-12 h-12 text-forensic-success" aria-hidden="true" />
              </motion.div>
              
              <motion.div 
                className="text-sm text-gray-600"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {acceptedFiles.length} file{acceptedFiles.length > 1 ? 's' : ''} selected
              </motion.div>
              
              <motion.div 
                className="flex flex-wrap justify-center gap-2 mt-2 max-w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {acceptedFiles.map((file, idx) => (
                  <motion.div 
                    key={`${file.name}-${idx}`}
                    className="flex items-center bg-forensic/10 rounded-full px-3 py-1.5 text-xs sm:text-sm text-forensic-dark"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 + (idx * 0.05) }}
                  >
                    <Icon icon={FiFile} className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-forensic" aria-hidden="true" />
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{file.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>
      
      {fileError && (
        <motion.div 
          className="mt-2 text-sm text-red-500 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon icon={FiAlertCircle} className="w-4 h-4 mr-1" aria-hidden="true" />
          <span>Error: {fileError}</span>
        </motion.div>
      )}
    </motion.div>
  );
}; 