'use client';

import { AppShell } from "../../components/app-shell";
import { FileDropzone } from "../../components/file-dropzone";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForensicStore } from "../../lib/hooks/use-forensic-store";

export default function UploadPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();
  const { analyzeFile } = useForensicStore();

  const handleFilesAccepted = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Process the first file
      const file = files[0];
      const analysis = await analyzeFile(file);
      
      // Navigate to the analysis result page
      router.push(`/analysis/${analysis.id}`);
    } catch (error) {
      console.error('Error analyzing file:', error);
      // In a real app, we'd show an error message to the user
      alert('An error occurred while analyzing the file. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Upload Evidence File</h1>
          <p className="mt-2 text-gray-600">
            Upload a file to analyze its metadata, generate hashes, and verify file integrity.
            All processing is done locally in your browser.
          </p>
        </div>
        
        {/* File upload dropzone */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <FileDropzone
            onFilesAccepted={handleFilesAccepted}
            isLoading={isAnalyzing}
            maxFiles={1}
            maxSize={200 * 1024 * 1024} // 200MB limit
          />
          
          <div className="mt-6 text-sm text-gray-500">
            <p className="font-medium mb-2">Supported file types:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Images (JPG, PNG, GIF, TIFF, WebP)</li>
              <li>Documents (PDF, DOCX, XLSX, PPTX, TXT)</li>
              <li>Media files (MP3, MP4, AVI, MKV)</li>
              <li>And many more...</li>
            </ul>
          </div>
          
          <div className="mt-6 px-4 py-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <p><strong>Privacy Note:</strong> All file processing occurs locally in your browser. 
            Your files are never uploaded to any server.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
} 