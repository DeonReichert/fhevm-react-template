/**
 * FHE Type Definitions
 * TypeScript types for FHE operations
 */

/**
 * Supported FHE encryption types
 */
export type FHEType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

/**
 * Encryption parameters
 */
export interface EncryptionParams {
  contractAddress: string;
  userAddress: string;
  value: number | bigint | boolean | string;
  type: FHEType;
}

/**
 * Encrypted value result
 */
export interface EncryptedResult {
  handles: Uint8Array[];
  inputProof: string;
}

/**
 * Decryption parameters
 */
export interface DecryptionParams {
  contractAddress: string;
  handle: Uint8Array;
  signature?: string;
}

/**
 * Computation parameters
 */
export interface ComputationParams {
  operation: 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq' | 'and' | 'or';
  operand1: Uint8Array;
  operand2: Uint8Array;
  contractAddress: string;
}

/**
 * FHE operation result
 */
export interface FHEOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}
