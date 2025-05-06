'use client';

import { FileAnalysis } from "../lib/types";
import { formatBytes, formatDate, copyToClipboard } from "../lib/utils";
import { useState } from "react";
import { FiCopy, FiCheck, FiAlertTriangle, FiCheck as FiCheckIcon, FiFileText } from "react-icons/fi";
import { Icon } from "./ui/icon";
import { motion } from "framer-motion";
import { MotionCard } from "./ui/motion-card";
import { FileStatusBadge } from "./ui/file-status-badge";
import { ForensicDataVisualization } from "./ui/forensic-data-visualization";
import { STAGGER_CHILDREN, STAGGER_ITEM } from "@/lib/utils/animations";

interface MetadataDisplayProps {
  analysis: FileAnalysis;
}

interface MetadataCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'forensic' | 'grid' | 'scan' | 'pulse';
  delay?: number;
}

const MetadataCard = ({ 
  title, 
  children, 
  icon, 
  variant = 'default',
  delay = 0 
}: MetadataCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <MotionCard variant={variant} className="overflow-hidden">
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-forensic">{icon}</span>}
      <h3 className="font-medium text-gray-700">{title}</h3>
        </div>
    </div>
    <div className="p-3 sm:p-4">{children}</div>
    </MotionCard>
  </motion.div>
);

export const MetadataDisplay = ({ analysis }: MetadataDisplayProps) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopyHash = async (hash: string, type: string) => {
    const success = await copyToClipboard(hash);
    if (success) {
      setCopiedHash(type);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  // Create data array for hash visualization
  const createHashVisualization = (hash: string) => {
    if (!hash) return [];
    
    return Array.from(hash).map((char, idx) => {
      const value = parseInt(char, 16) || 1;
      return {
        value: (value * 6) + 10, // Scale to make it visible
        highlighted: idx % 8 === 0,
        tampered: false
      };
    });
  };

  const md5Data = createHashVisualization(analysis.hash.md5);
  const sha256Data = createHashVisualization(analysis.hash.sha256);

  return (
    <motion.div 
      className="space-y-4 sm:space-y-6"
      variants={STAGGER_CHILDREN}
      initial="initial"
      animate="animate"
    >
      {/* File Information Card */}
      <MetadataCard 
        title="File Information" 
        icon={<Icon icon={FiFileText} className="w-4 h-4" />}
        variant="forensic"
        delay={0.1}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Filename</div>
            <div className="text-sm sm:text-base text-gray-900 break-words">{analysis.file.name}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">File Size</div>
            <div className="text-sm sm:text-base text-gray-900">{formatBytes(analysis.file.size)}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">File Type</div>
            <div className="text-sm sm:text-base text-gray-900">{analysis.file.type || "Unknown"}</div>
          </div>
          <div>
            <div className="text-xs sm:text-sm font-medium text-gray-500">Last Modified</div>
            <div className="text-sm sm:text-base text-gray-900">
              {formatDate(new Date(analysis.file.lastModified))}
            </div>
          </div>
        </div>
      </MetadataCard>

      {/* File Signature Check */}
      <MetadataCard 
        title="File Integrity" 
        variant={analysis.fileSignatureMatch ? "default" : "pulse"}
        delay={0.2}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {analysis.fileSignatureMatch ? (
              <FileStatusBadge status="verified" />
            ) : (
              <FileStatusBadge status="suspicious" animate={true} />
            )}
          </div>
          <div className="ml-3">
            <div className="text-xs sm:text-sm font-medium text-gray-900">
              File Signature Check
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {analysis.fileSignatureMatch
                ? "File signature matches the declared file type"
                : "File signature does not match the declared file type"}
            </div>
          </div>
        </div>
      </MetadataCard>

      {/* File Hashes Card */}
      <MetadataCard 
        title="Cryptographic Hashes" 
        variant="scan"
        delay={0.3}
      >
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700">MD5</span>
              <button
                className="flex items-center text-xs text-forensic hover:text-forensic-accent transition-colors focus:outline-none focus:ring-2 focus:ring-forensic focus:ring-opacity-50 rounded px-1.5 py-0.5"
                onClick={() => handleCopyHash(analysis.hash.md5, "md5")}
                aria-label="Copy MD5 hash"
                aria-pressed={copiedHash === "md5"}
              >
                {copiedHash === "md5" ? (
                  <>
                    <Icon icon={FiCheck} className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Icon icon={FiCopy} className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <ForensicDataVisualization data={md5Data} height={30} variant="bytes" />
            <div className="text-xs font-mono bg-gray-50 p-2 mt-2 rounded border border-gray-200 overflow-x-auto">
              {analysis.hash.md5}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs sm:text-sm font-medium text-gray-700">SHA-256</span>
              <button
                className="flex items-center text-xs text-forensic hover:text-forensic-accent transition-colors focus:outline-none focus:ring-2 focus:ring-forensic focus:ring-opacity-50 rounded px-1.5 py-0.5"
                onClick={() => handleCopyHash(analysis.hash.sha256, "sha256")}
                aria-label="Copy SHA-256 hash"
                aria-pressed={copiedHash === "sha256"}
              >
                {copiedHash === "sha256" ? (
                  <>
                    <Icon icon={FiCheck} className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Icon icon={FiCopy} className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <ForensicDataVisualization data={sha256Data} height={30} variant="bytes" />
            <div className="text-xs font-mono bg-gray-50 p-2 mt-2 rounded border border-gray-200 overflow-x-auto">
              {analysis.hash.sha256}
            </div>
          </div>
        </div>
      </MetadataCard>

      {/* File Metadata Card */}
      <MetadataCard 
        title="Extracted Metadata"
        variant="grid"
        delay={0.4}
      >
        {Object.keys(analysis.metadata).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(analysis.metadata)
              .filter(([_, value]) => value !== null && value !== undefined)
              .map(([key, value], index) => {
                // Format the key name with proper capitalization
                const formattedKey = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                // Format the value for display
                let formattedValue = value;
                if (typeof value === "object") {
                  formattedValue = JSON.stringify(value);
                } else if (typeof value === "boolean") {
                  formattedValue = value ? "Yes" : "No";
                }

                return (
                  <motion.div 
                    key={key}
                    variants={STAGGER_ITEM}
                    custom={index}
                  >
                    <div className="text-xs sm:text-sm font-medium text-gray-500">{formattedKey}</div>
                    <div className="text-sm sm:text-base text-gray-900 break-words">{String(formattedValue)}</div>
                  </motion.div>
                );
              })}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No metadata could be extracted</div>
        )}
      </MetadataCard>

      {/* Analysis Information */}
      <motion.div 
        className="text-xs text-gray-400 text-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        Analysis ID: {analysis.id}
        <br />
        Performed: {formatDate(new Date(analysis.timestamp))}
      </motion.div>
    </motion.div>
  );
};