import { FileAnalysis, FileMetadata } from "../lib/types";
import { formatBytes, formatDate } from "../lib/utils";
import Link from "next/link";
import { FiEye, FiFileText, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";

interface AnalysisHistoryTableProps {
  analyses: FileAnalysis[];
  onDelete: (id: string) => void;
  onSort?: (key: keyof FileMetadata | "timestamp") => void;
  sortConfig?: {
    key: keyof FileMetadata | "timestamp";
    direction: "asc" | "desc";
  };
}

export const AnalysisHistoryTable = ({
  analyses,
  onDelete,
  onSort,
  sortConfig,
}: AnalysisHistoryTableProps) => {
  if (analyses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No analysis records found. Upload a file to begin analysis.
      </div>
    );
  }

  const renderSortIcon = (columnKey: keyof FileMetadata | "timestamp") => {
    if (!sortConfig || !onSort) return null;
    
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <FiChevronUp className="inline ml-1 h-4 w-4" />
      ) : (
        <FiChevronDown className="inline ml-1 h-4 w-4" />
      );
    }
    
    return null;
  };

  const getSortableHeaderProps = (columnKey: keyof FileMetadata | "timestamp") => {
    if (!onSort) return {};
    
    return {
      onClick: () => onSort(columnKey),
      className: "cursor-pointer hover:bg-gray-100",
      tabIndex: 0,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSort(columnKey);
        }
      },
      "aria-label": `Sort by ${columnKey}`,
    };
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${onSort ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              {...getSortableHeaderProps("name")}
            >
              File Name {renderSortIcon("name")}
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell ${onSort ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              {...getSortableHeaderProps("type")}
            >
              File Type {renderSortIcon("type")}
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell ${onSort ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              {...getSortableHeaderProps("size")}
            >
              Size {renderSortIcon("size")}
            </th>
            <th
              scope="col"
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell ${onSort ? 'cursor-pointer hover:bg-gray-100' : ''}`}
              {...getSortableHeaderProps("timestamp")}
            >
              Date {renderSortIcon("timestamp")}
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
          {analyses.map((analysis) => (
            <tr
              key={analysis.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                  {analysis.file.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <div className="text-sm text-gray-500">
                  {analysis.file.type || "Unknown"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                <div className="text-sm text-gray-500">
                  {formatBytes(analysis.file.size)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                <div className="text-sm text-gray-500">
                  {formatDate(new Date(analysis.timestamp))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <Link
                  href={`/analysis/${analysis.id}`}
                  className="text-forensic hover:text-forensic-dark inline-flex items-center"
                  tabIndex={0}
                  aria-label={`View analysis for ${analysis.file.name}`}
                >
                  <FiEye className="w-4 h-4 mr-1" /> View
                </Link>
                <Link
                  href={`/reports/${analysis.id}`}
                  className="text-forensic hover:text-forensic-dark inline-flex items-center"
                  tabIndex={0}
                  aria-label={`Generate report for ${analysis.file.name}`}
                >
                  <FiFileText className="w-4 h-4 mr-1" /> Report
                </Link>
                <button
                  onClick={() => onDelete(analysis.id)}
                  className="text-red-500 hover:text-red-600 inline-flex items-center"
                  tabIndex={0}
                  aria-label={`Delete analysis for ${analysis.file.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      onDelete(analysis.id);
                    }
                  }}
                >
                  <FiTrash2 className="mr-1" /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 