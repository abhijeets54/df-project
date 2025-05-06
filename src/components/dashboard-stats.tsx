import React from "react";
import { useForensicStore } from "../lib/hooks/use-forensic-store";
import { formatBytes } from "../lib/utils";
import { motion } from "framer-motion";
import { FiBarChart2, FiFileText, FiHardDrive, FiActivity } from "react-icons/fi";
import { Icon } from "./ui/icon";
import { MotionCard } from "./ui/motion-card";
import { ForensicDataVisualization } from "./ui/forensic-data-visualization";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  color?: string;
  delay?: number;
}

const StatsCard = ({ title, value, description, icon, color = "bg-forensic", delay = 0 }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <MotionCard variant="forensic" className="h-full">
      <div className="flex items-start">
        <div className={`flex items-center justify-center h-10 w-10 rounded-md ${color} text-white`}>
          {icon}
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
          {description && (
            <div className="mt-1 text-xs text-gray-500">{description}</div>
          )}
        </div>
      </div>
    </MotionCard>
  </motion.div>
  );

export const DashboardStats = () => {
  const { analyses } = useForensicStore();

  // Calculate total file size
  const totalSize = analyses.reduce((acc, analysis) => acc + analysis.file.size, 0);
  
  // Get file type distribution
  const fileTypeCount = analyses.reduce((acc, analysis) => {
    const fileType = analysis.file.type || "unknown";
    acc[fileType] = (acc[fileType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Get suspicious files count
  const suspiciousCount = analyses.filter(analysis => !analysis.fileSignatureMatch).length;
  
  // Create visualization data
  const createVisualizationData = () => {
    if (analyses.length === 0) return [];
    
    // Create data blocks based on file types
    return Object.entries(fileTypeCount).map(([type, count]) => ({
      value: (count / analyses.length) * 100,
      highlighted: type.includes("image"),
      tampered: type === "unknown"
    }));
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Total Analyses"
          value={analyses.length.toString()}
          description="Total files analyzed"
          icon={<Icon icon={FiBarChart2} className="h-5 w-5" />}
        color="bg-forensic"
          delay={0.1}
        />
        <StatsCard
          title="Total Data Processed"
          value={formatBytes(totalSize)}
          icon={<Icon icon={FiHardDrive} className="h-5 w-5" />}
          color="bg-forensic-accent"
          delay={0.2}
      />
        <StatsCard
          title="File Types"
          value={Object.keys(fileTypeCount).length.toString()}
          description="Unique file types processed"
          icon={<Icon icon={FiFileText} className="h-5 w-5" />}
          color="bg-blue-500"
          delay={0.3}
      />
        <StatsCard
          title="Suspicious Files"
          value={suspiciousCount.toString()}
          description={suspiciousCount > 0 ? "Require attention" : "All files verified"}
          icon={<Icon icon={FiActivity} className="h-5 w-5" />}
          color={suspiciousCount > 0 ? "bg-forensic-warning" : "bg-forensic-success"}
          delay={0.4}
        />
      </div>
      
      {analyses.length > 0 && (
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <MotionCard variant="grid">
            <div className="p-4">
              <h3 className="text-base font-medium text-gray-900 mb-4">File Type Distribution</h3>
              <div className="mb-4">
                <ForensicDataVisualization 
                  data={createVisualizationData()} 
                  height={100} 
                  variant="segments" 
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs text-gray-600">
                {Object.entries(fileTypeCount).map(([type, count], index) => (
                  <motion.div 
                    key={type} 
                    className="flex items-center gap-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + (index * 0.05) }}
                  >
                    <div className={`h-3 w-3 rounded-full ${type === "unknown" ? "bg-forensic-error" : type.includes("image") ? "bg-forensic-accent" : "bg-forensic"}`}></div>
                    <span className="font-mono whitespace-nowrap overflow-hidden text-ellipsis">{type.split("/")[1] || type}: {count}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </MotionCard>
        </motion.div>
      )}
    </div>
  );
};