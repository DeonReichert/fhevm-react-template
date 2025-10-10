import type { FhevmInstance as FhevmjsInstance } from 'fhevmjs';

/**
 * Configuration for FHEVM client
 */
export interface FhevmConfig {
  /** Network provider (window.ethereum, custom provider, etc.) */
  network: any;
  /** Gateway URL for FHE operations */
  gatewayUrl?: string;
  /** Contract address for FHE operations */
  contractAddress?: string;
  /** ACL contract address (optional) */
  aclAddress?: string;
}

/**
 * FHEVM Client instance
 */
export interface FhevmInstance {
  /** Underlying fhevmjs instance */
  instance: FhevmjsInstance;
  /** Configuration */
  config: FhevmConfig;
  /** Is initialized */
  isReady: boolean;
}

/**
 * Encrypted value result
 */
export interface EncryptedValue {
  /** Encrypted handles */
  handles: Uint8Array[];
  /** Input proof for verification */
  inputProof: Uint8Array;
}

/**
 * Decrypted value result
 */
export interface DecryptedValue {
  /** Decrypted value */
  value: bigint;
  /** Original handle */
  handle: Uint8Array;
}

/**
 * Encryption input builder
 */
export interface EncryptionInput {
  /** Add 8-bit encrypted value */
  add8(value: number): EncryptionInput;
  /** Add 16-bit encrypted value */
  add16(value: number): EncryptionInput;
  /** Add 32-bit encrypted value */
  add32(value: number): EncryptionInput;
  /** Add 64-bit encrypted value */
  add64(value: number | bigint): EncryptionInput;
  /** Add boolean encrypted value */
  addBool(value: boolean): EncryptionInput;
  /** Add address encrypted value */
  addAddress(value: string): EncryptionInput;
  /** Finalize and encrypt */
  encrypt(): Promise<EncryptedValue>;
}
