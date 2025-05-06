import { useState } from 'react';
import { ReportOptions } from '../lib/types';

interface ReportFormProps {
  onGenerateReport: (options: ReportOptions) => Promise<void>;
  isGenerating?: boolean;
  isCase?: boolean;
}

export const ReportForm = ({
  onGenerateReport,
  isGenerating = false,
  isCase = false,
}: ReportFormProps) => {
  const [options, setOptions] = useState<ReportOptions>({
    title: isCase ? 'Digital Forensics Case Report' : 'Digital Forensics Analysis Report',
    includeMetadata: true,
    includeHashes: true,
    includeFileSignature: true,
    caseName: '',
    examinerName: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox fields
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setOptions((prev) => ({ ...prev, [name]: checked }));
    } else {
      setOptions((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateReport(options);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <label 
          htmlFor="title" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Report Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={options.title}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-forensic-light focus:ring focus:ring-forensic-light focus:ring-opacity-50"
          required
          aria-required="true"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label 
            htmlFor="caseName" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Case Name
          </label>
          <input
            type="text"
            id="caseName"
            name="caseName"
            value={options.caseName || ''}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-forensic-light focus:ring focus:ring-forensic-light focus:ring-opacity-50"
          />
        </div>
        <div>
          <label 
            htmlFor="examinerName" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Examiner Name
          </label>
          <input
            type="text"
            id="examinerName"
            name="examinerName"
            value={options.examinerName || ''}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-forensic-light focus:ring focus:ring-forensic-light focus:ring-opacity-50"
          />
        </div>
      </div>

      <div>
        <label 
          htmlFor="notes" 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={options.notes || ''}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-forensic-light focus:ring focus:ring-forensic-light focus:ring-opacity-50"
          placeholder="Enter any additional notes or observations..."
        />
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="text-sm font-medium text-gray-700">Report Content</div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-md transition-colors">
            <input
              type="checkbox"
              name="includeMetadata"
              checked={options.includeMetadata}
              onChange={handleChange}
              className="rounded border-gray-300 text-forensic focus:ring-forensic focus:ring-offset-0"
            />
            <span className="text-sm text-gray-700">Include file metadata</span>
          </label>
          
          <label className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-md transition-colors">
            <input
              type="checkbox"
              name="includeHashes"
              checked={options.includeHashes}
              onChange={handleChange}
              className="rounded border-gray-300 text-forensic focus:ring-forensic focus:ring-offset-0"
            />
            <span className="text-sm text-gray-700">Include file hashes</span>
          </label>
          
          <label className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-md transition-colors">
            <input
              type="checkbox"
              name="includeFileSignature"
              checked={options.includeFileSignature}
              onChange={handleChange}
              className="rounded border-gray-300 text-forensic focus:ring-forensic focus:ring-offset-0"
            />
            <span className="text-sm text-gray-700">Include file signature verification</span>
          </label>
        </div>
      </div>

      <div className="pt-2 sm:pt-4">
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-2.5 px-4 bg-forensic text-white rounded-md hover:bg-forensic-dark focus:outline-none focus:ring-2 focus:ring-forensic focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Generate report"
          aria-busy={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white preload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Report...
            </span>
          ) : (
            'Generate Report'
          )}
        </button>
      </div>
    </form>
  );
};