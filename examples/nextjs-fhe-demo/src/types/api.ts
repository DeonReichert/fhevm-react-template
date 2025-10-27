/**
 * API Type Definitions
 * TypeScript types for API requests and responses
 */

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

/**
 * Encryption API request
 */
export interface EncryptionRequest {
  contractAddress: string;
  userAddress: string;
  value: number | bigint | boolean | string;
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
}

/**
 * Decryption API request
 */
export interface DecryptionRequest {
  contractAddress: string;
  handle: string | Uint8Array;
  signature?: string;
}

/**
 * Computation API request
 */
export interface ComputationRequest {
  operation: string;
  operands: Array<string | Uint8Array>;
  contractAddress: string;
}

/**
 * Key management API request
 */
export interface KeyManagementRequest {
  action: 'generate' | 'import' | 'export' | 'delete';
  keyData?: any;
}
