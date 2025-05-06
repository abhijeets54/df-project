import { jsPDF } from 'jspdf';
import { AnalysisCase, FileAnalysis, ReportOptions } from '../types';
import { formatBytes, formatDate } from '../utils';

/**
 * Generate a PDF report for an analysis
 */
export const generateReport = async (
  analysis: FileAnalysis, 
  options: ReportOptions
): Promise<Blob> => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set default font
  doc.setFont('helvetica');
  
  // Add report title
  doc.setFontSize(18);
  doc.text(options.title || 'Forensic Analysis Report', 105, 20, { align: 'center' });
  
  // Add case information if provided
  if (options.caseName || options.examinerName) {
    doc.setFontSize(12);
    doc.text('Case Information', 20, 35);
    doc.setFontSize(10);
    let y = 40;
    
    if (options.caseName) {
      doc.text(`Case Name: ${options.caseName}`, 25, y);
      y += 5;
    }
    
    if (options.examinerName) {
      doc.text(`Examiner: ${options.examinerName}`, 25, y);
      y += 5;
    }
    
    doc.text(`Report Generated: ${formatDate(new Date())}`, 25, y);
    y += 10;
  } else {
    const y = 35;
  }
  
  // Add file information
  doc.setFontSize(12);
  doc.text('File Information', 20, 50);
  doc.setFontSize(10);
  doc.text(`Filename: ${analysis.file.name}`, 25, 55);
  doc.text(`File Size: ${formatBytes(analysis.file.size)}`, 25, 60);
  doc.text(`File Type: ${analysis.file.type || 'Unknown'}`, 25, 65);
  doc.text(`Last Modified: ${formatDate(new Date(analysis.file.lastModified))}`, 25, 70);
  
  // Add hash information if selected
  if (options.includeHashes) {
    doc.setFontSize(12);
    doc.text('Cryptographic Hashes', 20, 80);
    doc.setFontSize(10);
    doc.text(`MD5: ${analysis.hash.md5}`, 25, 85);
    doc.text(`SHA-256: ${analysis.hash.sha256}`, 25, 90);
    
    if (options.includeFileSignature) {
      doc.text(`File Signature Match: ${analysis.fileSignatureMatch ? 'Yes' : 'No'}`, 25, 95);
    }
  }
  
  // Add metadata section if selected
  if (options.includeMetadata) {
    const metadataY = options.includeHashes ? 105 : 80;
    doc.setFontSize(12);
    doc.text('File Metadata', 20, metadataY);
    doc.setFontSize(10);
    
    const metadata = analysis.metadata;
    let y = metadataY + 5;
    
    for (const [key, value] of Object.entries(metadata)) {
      if (value !== undefined && value !== null) {
        // Format the key name with proper capitalization
        const formattedKey = key.replace(/([A-Z])/g, ' $1')
                               .replace(/^./, str => str.toUpperCase());
        
        // For nested objects or arrays, stringify them
        const formattedValue = typeof value === 'object' 
          ? JSON.stringify(value) 
          : String(value);
        
        doc.text(`${formattedKey}: ${formattedValue}`, 25, y);
        y += 5;
        
        // Add new page if we're near the bottom
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      }
    }
  }
  
  // Add notes if provided
  if (options.notes) {
    // Determine where to place notes
    let notesY = 105;
    if (options.includeHashes) notesY += 25;
    if (options.includeMetadata) notesY += 60;
    
    // Add a new page if we're near the bottom
    if (notesY > 240) {
      doc.addPage();
      notesY = 20;
    }
    
    doc.setFontSize(12);
    doc.text('Examiner Notes', 20, notesY);
    doc.setFontSize(10);
    
    // Split notes into lines that fit on the page
    const maxWidth = 170; // mm
    const textLines = doc.splitTextToSize(options.notes, maxWidth);
    doc.text(textLines, 25, notesY + 5);
  }
  
  // Return as blob
  return doc.output('blob');
};

/**
 * Generate a PDF report for a case containing multiple analyses
 */
export const generateCaseReport = async (
  analysisCase: AnalysisCase, 
  options: ReportOptions
): Promise<Blob> => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set default font
  doc.setFont('helvetica');
  
  // Add report title
  doc.setFontSize(18);
  doc.text(options.title || `Case Report: ${analysisCase.name}`, 105, 20, { align: 'center' });
  
  // Add case information
  doc.setFontSize(12);
  doc.text('Case Information', 20, 35);
  doc.setFontSize(10);
  doc.text(`Case Name: ${analysisCase.name}`, 25, 40);
  doc.text(`Case Created: ${formatDate(new Date(analysisCase.createdAt))}`, 25, 45);
  doc.text(`Report Generated: ${formatDate(new Date())}`, 25, 50);
  
  if (analysisCase.description) {
    doc.text('Description:', 25, 55);
    const descLines = doc.splitTextToSize(analysisCase.description, 160);
    doc.text(descLines, 30, 60);
  }
  
  // Process each file in the case
  let currentY = 75;
  let fileIndex = 1;
  
  for (const analysis of analysisCase.files) {
    // Add a new page if less than 100mm space left
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }
    
    // Add file header
    doc.setFontSize(12);
    doc.text(`File ${fileIndex}: ${analysis.file.name}`, 20, currentY);
    doc.setFontSize(10);
    currentY += 5;
    
    // Add file information
    doc.text(`Size: ${formatBytes(analysis.file.size)}`, 25, currentY);
    currentY += 5;
    doc.text(`Type: ${analysis.file.type || 'Unknown'}`, 25, currentY);
    currentY += 5;
    
    // Add hash information if selected
    if (options.includeHashes) {
      doc.text(`MD5: ${analysis.hash.md5}`, 25, currentY);
      currentY += 5;
      doc.text(`SHA-256: ${analysis.hash.sha256}`, 25, currentY);
      currentY += 5;
      
      if (options.includeFileSignature) {
        doc.text(`File Signature Match: ${analysis.fileSignatureMatch ? 'Yes' : 'No'}`, 25, currentY);
        currentY += 5;
      }
    }
    
    // Add space between files
    currentY += 10;
    fileIndex++;
  }
  
  // Return as blob
  return doc.output('blob');
}; 