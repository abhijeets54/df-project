'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ForensicDataVisualization } from './forensic-data-visualization';
import { FiEye, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { Icon } from './icon';

interface HexdumpViewerProps {
  data: ArrayBuffer;
  highlightOffsets?: number[];
  anomalyOffsets?: number[];
  startOffset?: number;
  bytesPerRow?: number;
  maxRows?: number;
  className?: string;
}

export const HexdumpViewer = ({
  data,
  highlightOffsets = [],
  anomalyOffsets = [],
  startOffset = 0,
  bytesPerRow = 16,
  maxRows = 16,
  className,
}: HexdumpViewerProps) => {
  const [hoverOffset, setHoverOffset] = useState<number | null>(null);
  const bytes = new Uint8Array(data);
  
  // Process the bytes to create rows for display
  const createRows = () => {
    const rows = [];
    const endOffset = Math.min(bytes.length, startOffset + maxRows * bytesPerRow);
    
    for (let i = startOffset; i < endOffset; i += bytesPerRow) {
      const rowBytes = bytes.slice(i, Math.min(i + bytesPerRow, bytes.length));
      rows.push({
        offset: i,
        bytes: Array.from(rowBytes),
        ascii: Array.from(rowBytes).map(byte => {
          const char = String.fromCharCode(byte);
          return byte >= 32 && byte <= 126 ? char : '.';
        }).join('')
      });
    }
    
    return rows;
  };
  
  const rows = createRows();
  
  // Create data for visualization
  const visualizationData = Array.from(bytes.slice(startOffset, startOffset + maxRows * bytesPerRow))
    .map((byte, idx) => {
      const absoluteOffset = startOffset + idx;
      return {
        value: byte / 2.55, // Scale to 0-100
        highlighted: highlightOffsets.includes(absoluteOffset) || absoluteOffset === hoverOffset,
        tampered: anomalyOffsets.includes(absoluteOffset)
      };
    });
  
  // Format offset as hexadecimal with leading zeros
  const formatOffset = (offset: number) => {
    return offset.toString(16).padStart(8, '0').toUpperCase();
  };
  
  return (
    <div className={cn("font-mono text-xs", className)}>
      {/* File visualization */}
      <div className="mb-4">
        <ForensicDataVisualization 
          data={visualizationData} 
          height={40} 
          variant="bytes" 
          showAnimation={true}
        />
        <div className="flex justify-between text-[9px] text-gray-500 mt-1">
          <span>Offset: 0x{formatOffset(startOffset)}</span>
          <span>End: 0x{formatOffset(Math.min(startOffset + maxRows * bytesPerRow, bytes.length))}</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex space-x-4 mb-3 text-[10px]">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-forensic-accent mr-1"></div>
          <span>Highlighted Bytes</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-forensic-error mr-1"></div>
          <span>Anomalies</span>
        </div>
      </div>
      
      {/* Headers */}
      <div className="grid grid-cols-3 mb-1 border-b border-gray-200 pb-1">
        <div className="text-gray-500">Offset</div>
        <div className="text-gray-500">Hex</div>
        <div className="text-gray-500">ASCII</div>
      </div>
      
      {/* Hexdump rows */}
      <div className="space-y-1">
        {rows.map((row, rowIdx) => (
          <motion.div
            key={row.offset}
            className="grid grid-cols-3 hover:bg-gray-50 rounded"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: rowIdx * 0.03 }}
          >
            {/* Offset column */}
            <div className="pr-2 text-forensic-dark font-medium">
              0x{formatOffset(row.offset)}
            </div>
            
            {/* Hex values column */}
            <div className="flex flex-wrap">
              {row.bytes.map((byte, idx) => {
                const absoluteOffset = row.offset + idx;
                const isHighlighted = highlightOffsets.includes(absoluteOffset);
                const isAnomaly = anomalyOffsets.includes(absoluteOffset);
                const isHovered = hoverOffset === absoluteOffset;
                
                return (
                  <div
                    key={idx}
                    className={cn(
                      "w-6 text-center py-0.5 mr-0.5 transition-colors rounded",
                      isHovered ? "bg-blue-100 font-semibold" : 
                      isHighlighted ? "bg-forensic-accent/10 text-forensic" :
                      isAnomaly ? "bg-forensic-error/10 text-forensic-error" : ""
                    )}
                    onMouseEnter={() => setHoverOffset(absoluteOffset)}
                    onMouseLeave={() => setHoverOffset(null)}
                  >
                    {byte.toString(16).padStart(2, '0').toUpperCase()}
                  </div>
                );
              })}
            </div>
            
            {/* ASCII representation column */}
            <div className="font-mono flex">
              {row.ascii.split('').map((char, idx) => {
                const absoluteOffset = row.offset + idx;
                const isHighlighted = highlightOffsets.includes(absoluteOffset);
                const isAnomaly = anomalyOffsets.includes(absoluteOffset);
                const isHovered = hoverOffset === absoluteOffset;
                
                return (
                  <div
                    key={idx}
                    className={cn(
                      "w-[14px] text-center transition-colors",
                      isHovered ? "bg-blue-100 font-semibold" : 
                      isHighlighted ? "bg-forensic-accent/10 text-forensic" :
                      isAnomaly ? "bg-forensic-error/10 text-forensic-error" : ""
                    )}
                    onMouseEnter={() => setHoverOffset(row.offset + idx)}
                    onMouseLeave={() => setHoverOffset(null)}
                  >
                    {char}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Status bar */}
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200 text-gray-500 text-[10px]">
        <div>
          Total bytes: {bytes.length}
        </div>
        <div className="flex items-center">
          {hoverOffset !== null && (
            <span className="flex items-center">
              <Icon icon={FiEye} className="mr-1 h-3 w-3" />
              Offset: 0x{formatOffset(hoverOffset)} (Decimal: {hoverOffset})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 