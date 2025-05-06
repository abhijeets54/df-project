'use client';

import React, { useEffect, useState } from "react";
import { AppShell } from "../../../components/app-shell";
import { useForensicStore } from "../../../lib/hooks/use-forensic-store";
import { FileAnalysis, ReportOptions } from "../../../lib/types";
import { ReportForm } from "../../../components/report-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const { id } = unwrappedParams;
  const router = useRouter();
  const [analysis, setAnalysis] = useState<FileAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGenerateReport = async (options: ReportOptions) => {
    if (!analysis) return;
    
    setIsGenerating(true);
    
    try {
      const reportBlob = await generateAnalysisReport(analysis.id, options);
      
      // Create a download link for the report
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${options.title.replace(/\s+/g, '_').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Navigate back to the analysis page
      router.push(`/analysis/${id}`);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGenerating(false);
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
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Back button and page header */}
        <div>
          <Link
            href={`/analysis/${id}`}
            className="inline-flex items-center text-gray-600 hover:text-forensic"
            aria-label="Back to analysis"
            tabIndex={0}
          >
            <FiArrowLeft className="mr-1 h-4 w-4" />
            <span>Back to Analysis</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Generate Report</h1>
          <p className="text-sm text-gray-500">
            Create a detailed PDF report for {analysis.file.name}
          </p>
        </div>
        
        {/* Report form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ReportForm 
            onGenerateReport={handleGenerateReport}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </AppShell>
  );
} 