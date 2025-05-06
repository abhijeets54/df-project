'use client';

import React, { useEffect, useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { MetadataDisplay } from '../../../components/metadata-display';
import { useForensicStore } from '../../../lib/hooks/use-forensic-store';
import { FileAnalysis } from '../../../lib/types';
import Link from 'next/link';
import { FiArrowLeft, FiDownload, FiFileText } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { selectAnalysis, generateAnalysisReport } = useForensicStore();

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        await selectAnalysis(id);
      } catch (error) {
        console.error("Error loading analysis:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [id, selectAnalysis, router]);

  // Update our local state when the selected analysis changes
  const { selectedAnalysis } = useForensicStore();
  
  useEffect(() => {
    if (selectedAnalysis) {
      setAnalysis(selectedAnalysis);
    }
  }, [selectedAnalysis]);

  const handleGenerateReport = async () => {
    if (!analysis) return;
    
    try {
      const reportOptions = {
        title: `Analysis Report: ${analysis.file.name}`,
        includeMetadata: true,
        includeHashes: true,
        includeFileSignature: true,
        examinerName: "", // Could be populated from user profile in a full implementation
        notes: "",
      };
      
      const reportBlob = await generateAnalysisReport(analysis.id, reportOptions);
      
      // Create a download link for the report
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analysis_report_${analysis.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forensic"></div>
        </div>
      </AppShell>
    );
  }

  if (!analysis) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium text-gray-900">Analysis not found</h2>
          <p className="mt-2 text-gray-600">The analysis you're looking for doesn't exist or has been deleted.</p>
          <Link 
            href="/dashboard"
            className="mt-4 inline-flex items-center text-forensic hover:text-forensic-dark"
            aria-label="Return to dashboard"
            tabIndex={0}
          >
            <FiArrowLeft className="mr-2" />
            Return to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back button and page header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-600 hover:text-forensic"
              aria-label="Back to dashboard"
              tabIndex={0}
            >
              <FiArrowLeft className="mr-1 h-4 w-4" />
              <span>Back</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{analysis.file.name}</h1>
            <p className="text-sm text-gray-500">
              Analyzed on {new Date(analysis.timestamp).toLocaleString()}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateReport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              aria-label="Generate report"
              tabIndex={0}
            >
              <FiFileText className="h-4 w-4" />
              <span>Generate Report</span>
            </button>
            
            <Link
              href={`/reports/${analysis.id}`}
              className="flex items-center gap-2 px-4 py-2 bg-forensic text-white rounded-md hover:bg-forensic-dark transition-colors shadow-sm"
              aria-label="Create detailed report"
              tabIndex={0}
            >
              <FiDownload className="h-4 w-4" />
              <span>Full Report</span>
            </Link>
          </div>
        </div>

        {/* Analysis display */}
        <MetadataDisplay analysis={analysis} />
      </div>
    </AppShell>
  );
} 