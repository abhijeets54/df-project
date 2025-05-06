import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AnalysisCase, FileAnalysis } from '../types';

// Define our database schema
interface ForensicDBSchema extends DBSchema {
  cases: {
    key: string;
    value: AnalysisCase;
    indexes: { 'by-date': number };
  };
  analyses: {
    key: string;
    value: FileAnalysis;
    indexes: { 'by-date': number };
  };
  settings: {
    key: string;
    value: any;
  };
}

// Database version
const DB_VERSION = 1;

// Database name
const DB_NAME = 'forensic-analyzer-db';

// Get or create database
const getDB = async (): Promise<IDBPDatabase<ForensicDBSchema>> => {
  return openDB<ForensicDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('cases')) {
        const casesStore = db.createObjectStore('cases', { keyPath: 'id' });
        casesStore.createIndex('by-date', 'updatedAt');
      }
      
      if (!db.objectStoreNames.contains('analyses')) {
        const analysesStore = db.createObjectStore('analyses', { keyPath: 'id' });
        analysesStore.createIndex('by-date', 'timestamp');
      }
      
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    }
  });
};

/**
 * Save a new analysis to IndexedDB
 */
export const saveAnalysis = async (analysis: FileAnalysis): Promise<string> => {
  const db = await getDB();
  const tx = db.transaction('analyses', 'readwrite');
  await tx.store.put(analysis);
  await tx.done;
  return analysis.id;
};

/**
 * Get all analyses ordered by date
 */
export const getAllAnalyses = async (): Promise<FileAnalysis[]> => {
  const db = await getDB();
  return db.getAllFromIndex('analyses', 'by-date');
};

/**
 * Get a specific analysis by ID
 */
export const getAnalysis = async (id: string): Promise<FileAnalysis | undefined> => {
  const db = await getDB();
  return db.get('analyses', id);
};

/**
 * Delete an analysis by ID
 */
export const deleteAnalysis = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('analyses', id);
};

/**
 * Create a new case
 */
export const createCase = async (newCase: AnalysisCase): Promise<string> => {
  const db = await getDB();
  const tx = db.transaction('cases', 'readwrite');
  await tx.store.put(newCase);
  await tx.done;
  return newCase.id;
};

/**
 * Update an existing case
 */
export const updateCase = async (updatedCase: AnalysisCase): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction('cases', 'readwrite');
  await tx.store.put(updatedCase);
  await tx.done;
};

/**
 * Get all cases ordered by update date
 */
export const getAllCases = async (): Promise<AnalysisCase[]> => {
  const db = await getDB();
  return db.getAllFromIndex('cases', 'by-date');
};

/**
 * Get a specific case by ID
 */
export const getCase = async (id: string): Promise<AnalysisCase | undefined> => {
  const db = await getDB();
  return db.get('cases', id);
};

/**
 * Delete a case by ID
 */
export const deleteCase = async (id: string): Promise<void> => {
  const db = await getDB();
  await db.delete('cases', id);
};

/**
 * Save a user setting
 */
export const saveSetting = async (key: string, value: any): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction('settings', 'readwrite');
  await tx.store.put(value, key);
  await tx.done;
};

/**
 * Get a user setting
 */
export const getSetting = async <T>(key: string, defaultValue: T): Promise<T> => {
  const db = await getDB();
  const value = await db.get('settings', key);
  return value === undefined ? defaultValue : value;
}; 