'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '../../../components/app-shell';
import { ReportForm } from '../../../components/report-form';
import { useForensicStore } from '../../../lib/hooks/use-forensic-store';
import { ReportOptions } from '../../../lib/types';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import { useSearchParams } from 'next/navigation';

export default function GenerateReportPage() {
  const searchParams = useSearchParams();
  const analysisId = searchParams.get('id');
  const caseId = searchParams.get('caseId');
  
  const { 
    selectedAnalysis, 
    selectAnalysis, 
    selectedCase,
    selectCase,
    generateAnalysisReport,
    generateCaseReport
  } = useForensicStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Determine if we're generating a report for an analysis or a case
  const isCase = Boolean(caseId);
  
  // Load the resource (analysis or case)
  useEffect(() => {
    async function loadResource() {
      setIsLoading(true);
      try {
        if (isCase && caseId) {
          await selectCase(caseId);
        } else if (analysisId) {
          await selectAnalysis(analysisId);
        } else {
          setError('No analysis or case ID provided');
        }
      } catch (err) {
        console.error('Failed to load resource:', err);
        setError('Failed to load the requested resource');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadResource();
  }, [analysisId, caseId, isCase, selectAnalysis, selectCase]);
  
  // Generate the report
  const handleGenerateReport = async (options: ReportOptions) => {
    setIsGenerating(true);
    try {
      let reportBlob: Blob;
      
      if (isCase && selectedCase) {
        reportBlob = await generateCaseReport(selectedCase.id, options);
      } else if (selectedAnalysis) {
        reportBlob = await generateAnalysisReport(selectedAnalysis.id, options);
      } else {
        throw new Error('No analysis or case selected');
      }
      
      // Create a download link for the PDF
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate report:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forensic"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }
  
  if (error || (!selectedAnalysis && !selectedCase)) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <div className="mb-4 text-red-500">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Resource Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested resource could not be found.'}</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-forensic text-white rounded-md hover:bg-forensic-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forensic transition-colors"
            tabIndex={0}
            aria-label="Return to dashboard"
          >
            Return to Dashboard
          </Link>
        </div>
      </AppShell>
    );
  }
  
  const resourceName = isCase 
    ? selectedCase?.name 
    : selectedAnalysis?.file.name;
  
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back button */}
        <Link
          href={isCase ? `/cases/${caseId}` : `/analysis/${analysisId}`}
          className="inline-flex items-center text-forensic hover:underline"
          tabIndex={0}
          aria-label={`Back to ${isCase ? 'case' : 'analysis'} details`}
        >
          <FiArrowLeft className="mr-1" /> Back to {isCase ? 'Case' : 'Analysis'}
        </Link>
        
        {/* Page header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Generate Report</h1>
          <p className="mt-2 text-gray-500">
            Create a PDF report for {isCase ? 'case' : 'analysis'}: <span className="font-medium">{resourceName}</span>
          </p>
        </div>
        
        {/* Report form */}
        <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
          <ReportForm 
            onGenerateReport={handleGenerateReport}
            isGenerating={isGenerating}
            isCase={isCase}
          />
        </div>
      </div>
    </AppShell>
  );
} 