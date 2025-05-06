"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  AnalysisCase, 
  FileAnalysis, 
  ReportOptions 
} from '../types';
import * as storage from '../services/storage';
import { processFile } from '../services/file-processor';
import { extractMetadata } from '../services/metadata-extractor';
import { generateReport, generateCaseReport as generateCaseReportPdf } from '../services/report-generator';
import { generateId } from '../utils';

interface ForensicStoreContextType {
  // Analysis state
  analyses: FileAnalysis[];
  selectedAnalysis: FileAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  
  // Case state
  cases: AnalysisCase[];
  selectedCase: AnalysisCase | null;
  
  // Actions
  analyzeFile: (file: File) => Promise<FileAnalysis>;
  selectAnalysis: (id: string) => Promise<void>;
  deleteAnalysis: (id: string) => Promise<void>;
  
  // Case actions
  createCase: (name: string, description?: string) => Promise<AnalysisCase>;
  updateCase: (caseData: AnalysisCase) => Promise<void>;
  selectCase: (id: string) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  addAnalysisToCase: (analysisId: string, caseId: string) => Promise<void>;
  removeAnalysisFromCase: (analysisId: string, caseId: string) => Promise<void>;
  
  // Report generation
  generateAnalysisReport: (
    analysisId: string, 
    options: ReportOptions
  ) => Promise<Blob>;
  
  generateCaseReport: (
    caseId: string, 
    options: ReportOptions
  ) => Promise<Blob>;
}

const ForensicStoreContext = createContext<ForensicStoreContextType | undefined>(undefined);

export const ForensicStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for analyses
  const [analyses, setAnalyses] = useState<FileAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<FileAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for cases
  const [cases, setCases] = useState<AnalysisCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<AnalysisCase | null>(null);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load analyses
        const savedAnalyses = await storage.getAllAnalyses();
        setAnalyses(savedAnalyses);
        
        // Load cases
        const savedCases = await storage.getAllCases();
        setCases(savedCases);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Analyze a file
  const analyzeFile = async (file: File): Promise<FileAnalysis> => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Process the file for basic info and hash
      let analysis = await processFile(file);
      
      // Extract file metadata based on type
      analysis = await extractMetadata(file, analysis);
      
      // Save analysis to storage
      await storage.saveAnalysis(analysis);
      
      // Update state
      setAnalyses(prevAnalyses => [...prevAnalyses, analysis]);
      setSelectedAnalysis(analysis);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing file:', error);
      
      // Set error message based on error type
      if (error instanceof Error) {
        if (error.name === 'NotSupportedError' && error.message.includes('Algorithm')) {
          setError('Crypto algorithm not supported by this browser. Please try a different file or browser.');
        } else {
          setError(`Error analyzing file: ${error.message}`);
        }
      } else {
        setError('Unknown error occurred during file analysis');
      }
      
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Select an analysis by ID
  const selectAnalysis = async (id: string): Promise<void> => {
    try {
      const analysis = await storage.getAnalysis(id);
      setSelectedAnalysis(analysis || null);
    } catch (error) {
      console.error('Error selecting analysis:', error);
      throw error;
    }
  };
  
  // Delete an analysis by ID
  const deleteAnalysis = async (id: string): Promise<void> => {
    try {
      await storage.deleteAnalysis(id);
      
      // Update state
      setAnalyses(prev => prev.filter(a => a.id !== id));
      
      // If the deleted analysis was selected, clear selection
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
      
      // Update any cases that included this analysis
      const updatedCases = await Promise.all(cases.map(async (c) => {
        if (c.files.some(f => f.id === id)) {
          const updatedCase = {
            ...c,
            files: c.files.filter(f => f.id !== id),
            updatedAt: Date.now()
          };
          await storage.updateCase(updatedCase);
          return updatedCase;
        }
        return c;
      }));
      
      setCases(updatedCases);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  };
  
  // Create a new case
  const createCase = async (
    name: string, 
    description?: string
  ): Promise<AnalysisCase> => {
    const newCase: AnalysisCase = {
      id: generateId(),
      name,
      description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      files: []
    };
    
    try {
      await storage.createCase(newCase);
      
      // Update state
      setCases(prev => [...prev, newCase]);
      setSelectedCase(newCase);
      
      return newCase;
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  };
  
  // Update an existing case
  const updateCase = async (caseData: AnalysisCase): Promise<void> => {
    try {
      const updatedCase = {
        ...caseData,
        updatedAt: Date.now()
      };
      
      await storage.updateCase(updatedCase);
      
      // Update state
      setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
      
      // If this was the selected case, update selection
      if (selectedCase?.id === updatedCase.id) {
        setSelectedCase(updatedCase);
      }
    } catch (error) {
      console.error('Error updating case:', error);
      throw error;
    }
  };
  
  // Select a case by ID
  const selectCase = async (id: string): Promise<void> => {
    try {
      const caseData = await storage.getCase(id);
      setSelectedCase(caseData || null);
    } catch (error) {
      console.error('Error selecting case:', error);
      throw error;
    }
  };
  
  // Delete a case by ID
  const deleteCase = async (id: string): Promise<void> => {
    try {
      await storage.deleteCase(id);
      
      // Update state
      setCases(prev => prev.filter(c => c.id !== id));
      
      // If the deleted case was selected, clear selection
      if (selectedCase?.id === id) {
        setSelectedCase(null);
      }
    } catch (error) {
      console.error('Error deleting case:', error);
      throw error;
    }
  };
  
  // Add an analysis to a case
  const addAnalysisToCase = async (analysisId: string, caseId: string): Promise<void> => {
    try {
      // Get the case
      const caseData = await storage.getCase(caseId);
      if (!caseData) throw new Error('Case not found');
      
      // Get the analysis
      const analysis = await storage.getAnalysis(analysisId);
      if (!analysis) throw new Error('Analysis not found');
      
      // Check if analysis is already in the case
      if (caseData.files.some(f => f.id === analysisId)) {
        return; // Already in the case
      }
      
      // Add analysis to case
      const updatedCase = {
        ...caseData,
        files: [...caseData.files, analysis],
        updatedAt: Date.now()
      };
      
      // Save updated case
      await storage.updateCase(updatedCase);
      
      // Update state
      setCases(prev => prev.map(c => c.id === caseId ? updatedCase : c));
      
      // If this was the selected case, update selection
      if (selectedCase?.id === caseId) {
        setSelectedCase(updatedCase);
      }
    } catch (error) {
      console.error('Error adding analysis to case:', error);
      throw error;
    }
  };
  
  // Remove an analysis from a case
  const removeAnalysisFromCase = async (analysisId: string, caseId: string): Promise<void> => {
    try {
      // Get the case
      const caseData = await storage.getCase(caseId);
      if (!caseData) throw new Error('Case not found');
      
      // Remove analysis from case
      const updatedCase = {
        ...caseData,
        files: caseData.files.filter(f => f.id !== analysisId),
        updatedAt: Date.now()
      };
      
      // Save updated case
      await storage.updateCase(updatedCase);
      
      // Update state
      setCases(prev => prev.map(c => c.id === caseId ? updatedCase : c));
      
      // If this was the selected case, update selection
      if (selectedCase?.id === caseId) {
        setSelectedCase(updatedCase);
      }
    } catch (error) {
      console.error('Error removing analysis from case:', error);
      throw error;
    }
  };
  
  // Generate a report for an analysis
  const generateAnalysisReport = async (
    analysisId: string, 
    options: ReportOptions
  ): Promise<Blob> => {
    // Get the analysis
    const analysis = await storage.getAnalysis(analysisId);
    if (!analysis) throw new Error('Analysis not found');
    
    // Generate report
    return generateReport(analysis, options);
  };
  
  // Generate a report for a case
  const generateCaseReport = async (
    caseId: string, 
    options: ReportOptions
  ): Promise<Blob> => {
    // Get the case
    const caseData = await storage.getCase(caseId);
    if (!caseData) throw new Error('Case not found');
    
    // Generate report
    return generateCaseReportPdf(caseData, options);
  };

  return (
    <ForensicStoreContext.Provider value={{
      analyses,
      selectedAnalysis,
      isAnalyzing,
      error,
      cases,
      selectedCase,
      analyzeFile,
      selectAnalysis,
      deleteAnalysis,
      createCase,
      updateCase,
      deleteCase,
      selectCase,
      addAnalysisToCase,
      removeAnalysisFromCase,
      generateAnalysisReport,
      generateCaseReport,
    }}>
      {children}
    </ForensicStoreContext.Provider>
  );
};

// ... (rest of the code remains the same)

// Custom hook to use the forensic store
export const useForensicStore = (): ForensicStoreContextType => {
  const context = useContext(ForensicStoreContext);
  
  if (context === undefined) {
    throw new Error('useForensicStore must be used within a ForensicStoreProvider');
  }
  
  return context;
}; 