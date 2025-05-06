'use client';

import { useEffect, useState } from "react";
import { AppShell } from "../../components/app-shell";
import { useForensicStore } from "../../lib/hooks/use-forensic-store";
import Link from "next/link";
import { FiArrowLeft, FiEye, FiFileText, FiTrash2, FiPlus } from "react-icons/fi";
import { AnalysisCase } from "../../lib/types";
import { formatDate } from "../../lib/utils";

export default function CasesPage() {
  const { cases, deleteCase, createCase } = useForensicStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newCaseName, setNewCaseName] = useState("");
  const [newCaseDescription, setNewCaseDescription] = useState("");
  
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCaseName.trim()) {
      alert("Please enter a case name");
      return;
    }
    
    setIsCreating(true);
    
    try {
      await createCase(newCaseName.trim(), newCaseDescription.trim() || undefined);
      setNewCaseName("");
      setNewCaseDescription("");
    } catch (error) {
      console.error("Error creating case:", error);
      alert("Failed to create case. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleDeleteCase = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this case? This action cannot be undone.")) {
      try {
        await deleteCase(id);
      } catch (error) {
        console.error("Error deleting case:", error);
        alert("Failed to delete case. Please try again.");
      }
    }
  };
  
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page header */}
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
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Cases</h1>
          <p className="text-sm text-gray-500">
            Organize your analyses into case collections
          </p>
        </div>
        
        {/* Create new case form */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Create New Case</h2>
          <form onSubmit={handleCreateCase} className="space-y-4">
            <div>
              <label htmlFor="caseName" className="block text-sm font-medium text-gray-700 mb-1">
                Case Name
              </label>
              <input
                type="text"
                id="caseName"
                value={newCaseName}
                onChange={(e) => setNewCaseName(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-forensic focus:ring focus:ring-forensic focus:ring-opacity-50"
                placeholder="Enter case name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="caseDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="caseDescription"
                value={newCaseDescription}
                onChange={(e) => setNewCaseDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-forensic focus:ring focus:ring-forensic focus:ring-opacity-50"
                placeholder="Enter case description"
              />
            </div>
            
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 bg-forensic text-white rounded-md hover:bg-forensic-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forensic disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Create Case
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Cases list */}
        <div>
          <h2 className="text-lg font-medium mb-4">Your Cases</h2>
          
          {cases.length > 0 ? (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Case Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Files
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cases.map((caseItem) => (
                    <tr key={caseItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {caseItem.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {caseItem.description || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="text-sm text-gray-500">
                          {formatDate(new Date(caseItem.createdAt))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {caseItem.files.length}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <Link
                          href={`/cases/${caseItem.id}`}
                          className="text-forensic-light hover:text-forensic-accent"
                          tabIndex={0}
                          aria-label={`View case ${caseItem.name}`}
                        >
                          <FiEye className="inline mr-1" />
                          View
                        </Link>
                        
                        <Link
                          href={`/reports/case/${caseItem.id}`}
                          className="text-forensic-light hover:text-forensic-accent"
                          tabIndex={0}
                          aria-label={`Generate report for case ${caseItem.name}`}
                        >
                          <FiFileText className="inline mr-1" />
                          Report
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteCase(caseItem.id)}
                          className="text-red-500 hover:text-red-600"
                          tabIndex={0}
                          aria-label={`Delete case ${caseItem.name}`}
                        >
                          <FiTrash2 className="inline mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cases yet</h3>
              <p className="text-gray-500">Create your first case to organize your analyses</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
} 