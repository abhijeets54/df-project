'use client';

import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { AnalysisHistoryTable } from "../../components/analysis-history-table";
import { useForensicStore } from "../../lib/hooks/use-forensic-store";
import { FileAnalysis } from "../../lib/types";
import Link from "next/link";
import { FiArrowLeft, FiSearch } from "react-icons/fi";

export default function HistoryPage() {
  const { analyses, deleteAnalysis } = useForensicStore();
  const [filteredAnalyses, setFilteredAnalyses] = useState<FileAnalysis[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof FileAnalysis['file'] | 'timestamp';
    direction: 'asc' | 'desc';
  }>({
    key: 'timestamp',
    direction: 'desc',
  });

  // Apply filtering and sorting to analyses
  useEffect(() => {
    let result = [...analyses];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(analysis => 
        analysis.file.name.toLowerCase().includes(query) ||
        analysis.file.type.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: any = sortConfig.key === 'timestamp' 
        ? a.timestamp 
        : a.file[sortConfig.key as keyof FileAnalysis['file']];
      
      let bValue: any = sortConfig.key === 'timestamp'
        ? b.timestamp
        : b.file[sortConfig.key as keyof FileAnalysis['file']];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredAnalyses(result);
  }, [analyses, searchQuery, sortConfig]);

  const handleSort = (key: keyof FileAnalysis['file'] | 'timestamp') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) {
      try {
        await deleteAnalysis(id);
      } catch (error) {
        console.error('Error deleting analysis:', error);
        alert('Failed to delete analysis. Please try again.');
      }
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page header */}
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
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Analysis History</h1>
            <p className="text-sm text-gray-500">
              View and manage all your previous file analyses
            </p>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-forensic focus:border-forensic"
              aria-label="Search analyses"
            />
          </div>
        </div>
        
        {/* Analysis table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          {filteredAnalyses.length > 0 ? (
            <AnalysisHistoryTable 
              analyses={filteredAnalyses} 
              onDelete={handleDelete}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          ) : (
            <div className="py-16 text-center">
              {searchQuery ? (
                <>
                  <p className="text-gray-600 font-medium">No matching analyses found</p>
                  <p className="text-sm text-gray-500 mt-1">Try changing your search query</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 font-medium">No analyses yet</p>
                  <Link
                    href="/upload"
                    className="mt-4 inline-flex items-center text-forensic hover:text-forensic-dark"
                    tabIndex={0}
                  >
                    Upload a file to get started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
} 