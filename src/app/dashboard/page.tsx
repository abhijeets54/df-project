'use client';

import { AppShell } from "../../components/app-shell";
import { DashboardStats } from "../../components/dashboard-stats";
import { AnalysisHistoryTable } from "../../components/analysis-history-table";
import { useForensicStore } from "../../lib/hooks/use-forensic-store";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FiUpload, FiFolder, FiFileText, FiBarChart2 } from "react-icons/fi";
import { useEffect, useState } from "react";
import { FileAnalysis } from "../../lib/types";
import { motion } from "framer-motion";
import { MotionCard } from "@/components/ui/motion-card";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/lib/hooks/use-toast";
import { STAGGER_CHILDREN, STAGGER_ITEM } from "@/lib/utils/animations";

export default function DashboardPage() {
  const { user } = useUser();
  const { analyses, cases, deleteAnalysis } = useForensicStore();
  const { addToast } = useToast();
  
  // Get most recent analyses for display
  const [recentAnalyses, setRecentAnalyses] = useState<FileAnalysis[]>([]);
  
  useEffect(() => {
    // Sort analyses by timestamp (newest first) and take the first 5
    const sorted = [...analyses].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
    setRecentAnalyses(sorted);
  }, [analyses]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      try {
        await deleteAnalysis(id);
        addToast({
          title: "Analysis deleted",
          description: "The analysis has been removed from your history",
          variant: "success",
          duration: 3000,
        });
      } catch (error) {
        console.error('Error deleting analysis:', error);
        addToast({
          title: "Error",
          description: "Failed to delete analysis. Please try again.",
          variant: "error",
          duration: 5000,
        });
      }
    }
  };
  
  return (
    <AppShell 
      pageTitle={`Welcome, ${user?.firstName || 'Investigator'}`}
      pageDescription="Dashboard overview of your digital forensics workspace"
      backgroundVariant="grid"
    >
      <motion.div 
        className="space-y-8"
        variants={STAGGER_CHILDREN}
        initial="initial"
        animate="animate"
      >
        {/* Stats overview */}
        <motion.div variants={STAGGER_ITEM}>
          <DashboardStats />
        </motion.div>
        
        {/* Quick action buttons */}
        <motion.div variants={STAGGER_ITEM}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
          <Link
            href="/upload"
                className="flex items-center justify-center gap-2 px-4 py-6 bg-forensic text-white rounded-lg shadow hover:shadow-md transition-all"
            tabIndex={0}
            aria-label="Upload new file for analysis"
          >
                <Icon icon={FiUpload} className="w-5 h-5" />
            <span className="font-medium">Upload File</span>
          </Link>
            </motion.div>
          
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
          <Link
            href="/history"
                className="flex items-center justify-center gap-2 px-4 py-6 bg-white text-forensic border border-forensic rounded-lg shadow hover:shadow-md transition-all"
            tabIndex={0}
            aria-label="View analysis history"
          >
                <Icon icon={FiFileText} className="w-5 h-5" />
            <span className="font-medium">View History</span>
          </Link>
            </motion.div>
          
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
          <Link
            href="/cases"
                className="flex items-center justify-center gap-2 px-4 py-6 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:shadow-md transition-all"
            tabIndex={0}
            aria-label="Manage cases"
          >
                <Icon icon={FiFolder} className="w-5 h-5" />
            <span className="font-medium">Manage Cases</span>
          </Link>
            </motion.div>
        </div>
        </motion.div>
        
        {/* Recent analysis */}
        <motion.div variants={STAGGER_ITEM}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Icon icon={FiBarChart2} className="w-5 h-5 text-forensic" />
            <h2 className="text-lg font-medium text-gray-900">Recent Analysis</h2>
            </div>
            <Link
              href="/history"
              className="text-sm text-forensic hover:text-forensic-dark transition-colors font-medium"
              tabIndex={0}
              aria-label="View all analysis history"
            >
              View all →
            </Link>
          </div>
          
          <MotionCard variant="forensic">
          {recentAnalyses.length > 0 ? (
              <AnalysisHistoryTable
                analyses={recentAnalyses}
                onDelete={handleDelete}
              />
          ) : (
              <div className="text-center py-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forensic/10 text-forensic mb-4"
                >
                  <Icon icon={FiUpload} className="w-8 h-8" />
                </motion.div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
              <p className="text-gray-500 mb-4">Upload a file to begin your first analysis</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
              <Link
                href="/upload"
                className="inline-flex items-center px-4 py-2 bg-forensic text-white rounded-md hover:bg-forensic-dark transition-colors"
                tabIndex={0}
                aria-label="Upload a file"
              >
                    <Icon icon={FiUpload} className="w-4 h-4 mr-2" />
                Upload File
              </Link>
                </motion.div>
            </div>
          )}
          </MotionCard>
        </motion.div>
      </motion.div>
    </AppShell>
  );
} 