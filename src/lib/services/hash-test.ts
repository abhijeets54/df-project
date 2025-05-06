import { generateFileHash } from './file-processor';

/**
 * Simple test function to verify hash calculation works
 */
export const testHashCalculation = async () => {
  try {
    // Create a simple test file
    const testContent = 'This is a test file for hash calculation';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
    
    console.log('Starting hash calculation test...');
    
    // Calculate hashes
    const hashes = await generateFileHash(testFile);
    
    console.log('Hash calculation successful!');
    console.log('MD5:', hashes.md5);
    console.log('SHA-256:', hashes.sha256);
    
    return hashes;
  } catch (error) {
    console.error('Hash calculation test failed:', error);
    throw error;
  }
};

// Run the test if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('Hash test module loaded. Call testHashCalculation() to run the test.');
}
