/**
 * FHE-related type definitions
 */

export type FHEDataType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';

export interface EncryptedValue {
  data: string;
  type: FHEDataType;
  contractAddress: string;
  userAddress: string;
  timestamp: string;
}

export interface DecryptedValue {
  value: number | boolean | string;
  contractAddress: string;
  timestamp: string;
}

export interface FHEInstance {
  encrypt: (value: any, type: FHEDataType) => Promise<EncryptedValue>;
  decrypt: (encryptedData: string, signature: string) => Promise<DecryptedValue>;
  isReady: () => boolean;
}

export interface FHEConfig {
  network: any;
  gatewayUrl?: string;
  aclAddress?: string;
}

export interface ComputationResult {
  operation: string;
  operands: number[];
  result: string;
  contractAddress: string;
  timestamp: string;
}
