/**
 * API type definitions
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EncryptApiRequest {
  value: number | string | boolean;
  type: string;
  contractAddress: string;
  userAddress: string;
}

export interface EncryptApiResponse {
  success: boolean;
  encrypted?: {
    data: string;
    type: string;
    contractAddress: string;
    userAddress: string;
    timestamp: string;
  };
  error?: string;
  message?: string;
}

export interface DecryptApiRequest {
  encryptedData: string;
  signature: string;
  contractAddress: string;
}

export interface DecryptApiResponse {
  success: boolean;
  decrypted?: {
    value: any;
    contractAddress: string;
    timestamp: string;
  };
  error?: string;
  message?: string;
}

export interface ComputeApiRequest {
  operation: 'add' | 'subtract' | 'multiply' | 'compare';
  operands: number[];
  contractAddress: string;
}

export interface ComputeApiResponse {
  success: boolean;
  computation?: {
    operation: string;
    operands: number[];
    result: string;
    contractAddress: string;
    timestamp: string;
  };
  error?: string;
  message?: string;
}

export interface KeysApiResponse {
  success: boolean;
  keys?: {
    publicKey: string;
    gatewayUrl: string;
    timestamp: string;
  };
  keyPair?: {
    publicKey: string;
    privateKey: string;
    userAddress: string;
    contractAddress: string;
    timestamp: string;
  };
  error?: string;
  message?: string;
}
