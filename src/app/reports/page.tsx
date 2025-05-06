"use client";

import { useState } from 'react';
import { useForensicStore } from '@/lib/hooks/use-forensic-store';
import Link from 'next/link';
import { FiFileText, FiFolder, FiChevronRight, FiSearch, FiX } from 'react-icons/fi';
import { formatDate } from '@/lib/utils';
import { AppShell } from '@/components/app-shell';

export default function ReportsPage() {
  const { analyses, cases } = useForensicStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter analyses and cases based on search term
  const filteredAnalyses = analyses.filter(
    analysis => analysis.file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCases = cases.filter(
    caseItem => caseItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppShell
      pageTitle="Generate Reports"
      pageDescription="Create professional forensic reports for analyses and cases"
      backgroundVariant="grid"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Reports</h1>
          <p className="text-gray-600">
            Create professional forensic reports for individual file analyses or complete cases.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative w-full sm:w-64 mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-forensic focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Individual Analysis Reports Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiFileText className="mr-2 text-forensic" />
            Individual Analysis Reports
          </h2>
          
          {filteredAnalyses.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {filteredAnalyses.map(analysis => (
                  <li key={analysis.id} className="hover:bg-gray-50 transition-colors">
                    <Link 
                      href={`/reports/${analysis.id}`}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {analysis.file.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {analysis.file.type || 'Unknown'} • {formatDate(new Date(analysis.timestamp))}
                        </p>
                      </div>
                      <FiChevronRight className="text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
              {searchTerm ? (
                <p className="text-gray-500">No analyses match your search criteria.</p>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">No analyses available for reporting.</p>
                  <Link
                    href="/upload"
                    className="text-forensic hover:text-forensic-dark transition-colors"
                  >
                    Upload a file to analyze
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Case Reports Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FiFolder className="mr-2 text-forensic" />
            Case Reports
          </h2>
          
          {filteredCases.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {filteredCases.map(caseItem => (
                  <li key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                    <Link 
                      href={`/reports/generate?caseId=${caseItem.id}`}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {caseItem.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {caseItem.files.length} file{caseItem.files.length !== 1 ? 's' : ''} • 
                          Last updated: {formatDate(new Date(caseItem.updatedAt))}
                        </p>
                      </div>
                      <FiChevronRight className="text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-200">
              {searchTerm ? (
                <p className="text-gray-500">No cases match your search criteria.</p>
              ) : (
                <div>
                  <p className="text-gray-500 mb-4">No cases available for reporting.</p>
                  <Link
                    href="/cases"
                    className="text-forensic hover:text-forensic-dark transition-colors"
                  >
                    Create a case
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}