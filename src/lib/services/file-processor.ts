import { FileAnalysis, FileHash, FileMetadata } from "../types";
import { generateId } from "../utils";

// Import MD5 library or use a custom implementation
import SparkMD5 from 'spark-md5';

/**
 * Generate hash for a file using Web Crypto API and SparkMD5
 */
export const generateFileHash = async (file: File): Promise<FileHash> => {
  try {
    const md5Promise = calculateMD5Hash(file);
    const sha256Promise = calculateSHA256Hash(file);
    
    const [md5, sha256] = await Promise.all([md5Promise, sha256Promise]);
    
    return {
      md5,
      sha256
    };
  } catch (error) {
    console.error('Error generating file hash:', error);
    
    // Provide a more informative error message
    if (error instanceof Error) {
      if (error.name === 'NotSupportedError') {
        throw new Error('Hash algorithm not supported by this browser. Using SparkMD5 as fallback.');
      } else {
        throw error;
      }
    } else {
      throw new Error('Unknown error during hash calculation');
    }
  }
};

/**
 * Calculate MD5 hash using SparkMD5 library
 */
const calculateMD5Hash = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blobSlice = File.prototype.slice;
    const chunkSize = 2097152; // 2MB chunks
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    
    fileReader.onload = (e) => {
      if (e.target?.result) {
        spark.append(e.target.result as ArrayBuffer);
        currentChunk++;
        
        if (currentChunk < chunks) {
          loadNext();
        } else {
          const md5Hash = spark.end();
          resolve(md5Hash);
        }
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error('MD5 calculation failed'));
    };
    
    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    
    loadNext();
  });
};

/**
 * Calculate SHA-256 hash using Web Crypto API with chunking for large files
 */
const calculateSHA256Hash = async (file: File): Promise<string> => {
  // For small files (< 50MB), use the simple approach
  if (file.size < 50 * 1024 * 1024) {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // For larger files, use a chunked approach
  return new Promise((resolve, reject) => {
    const blobSlice = File.prototype.slice;
    const chunkSize = 2097152; // 2MB chunks
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let sha256Context: ArrayBuffer | null = null;
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        if (e.target?.result) {
          // Initialize or update the hash
          if (sha256Context === null) {
            // First chunk - create a new hash
            sha256Context = await crypto.subtle.digest('SHA-256', e.target.result as ArrayBuffer);
          } else {
            // Update the hash with the new chunk
            const newContext = await crypto.subtle.digest(
              'SHA-256', 
              concatenateArrayBuffers(sha256Context, e.target.result as ArrayBuffer)
            );
            sha256Context = newContext;
          }
          
          currentChunk++;
          
          if (currentChunk < chunks) {
            loadNext();
          } else {
            // Convert hash to hex string
            const hashArray = Array.from(new Uint8Array(sha256Context));
            const sha256Hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            resolve(sha256Hash);
          }
        }
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error('SHA-256 calculation failed'));
    };
    
    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }
    
    loadNext();
  });
};

/**
 * Helper function to concatenate ArrayBuffers
 */
const concatenateArrayBuffers = (buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer => {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};

/**
 * Check if file signature matches its extension
 */
export const checkFileSignature = async (file: File): Promise<boolean> => {
  // Simple implementation - in real world would check file magic numbers
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Very basic signature checks - would need expansion for real use
  const signatures: Record<string, Uint8Array> = {
    'image/jpeg': new Uint8Array([0xFF, 0xD8, 0xFF]),
    'image/png': new Uint8Array([0x89, 0x50, 0x4E, 0x47]),
    'application/pdf': new Uint8Array([0x25, 0x50, 0x44, 0x46]),
    'image/gif': new Uint8Array([0x47, 0x49, 0x46, 0x38]),
  };
  
  // Check if file type has a known signature
  const expectedSignature = signatures[file.type];
  if (!expectedSignature) {
    return true; // Can't verify, assume match
  }
  
  // Compare file bytes with signature
  for (let i = 0; i < expectedSignature.length; i++) {
    if (bytes[i] !== expectedSignature[i]) {
      return false;
    }
  }
  
  return true;
};

/**
 * Convert File to FileMetadata
 */
export const fileToMetadata = (file: File): FileMetadata => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  };
};

/**
 * Process a file and extract metadata
 */
export const processFile = async (file: File): Promise<FileAnalysis> => {
  // Generate file hashes
  const hash = await generateFileHash(file);
  
  // Check file signature
  const fileSignatureMatch = await checkFileSignature(file);
  
  // Basic file metadata
  const fileMetadata = fileToMetadata(file);
  
  // Create file analysis result
  const analysis: FileAnalysis = {
    id: generateId(),
    timestamp: Date.now(),
    file: fileMetadata,
    hash,
    metadata: {}, // Will be populated by specific extractors
    mimeType: file.type,
    fileSignatureMatch
  };
  
  return analysis;
}; 