/**
 * @fhevm-template/fhe-sdk
 * Universal FHEVM SDK - Framework Agnostic
 * 
 * A wrapper around fhevmjs that provides:
 * - Simple setup (<10 lines of code)
 * - Framework agnostic (React, Vue, Node.js, Next.js)
 * - wagmi-like API structure
 * - Complete FHEVM workflow (init, encrypt, decrypt, contract interaction)
 */

export { createFhevmClient, type FhevmClient } from './client';
export { useFhevm } from './hooks';
export { encrypt, decrypt, createEncryptedInput } from './encryption';
export { FhevmProvider, useFhevmContext } from './provider';
export type { 
  FhevmConfig, 
  EncryptedValue, 
  DecryptedValue,
  FhevmInstance 
} from './types';

// Re-export fhevmjs types for convenience
export type { FhevmInstance as FhevmjsInstance } from 'fhevmjs';
