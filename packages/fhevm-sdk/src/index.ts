/**
 * Universal FHEVM SDK
 * Framework-agnostic SDK for Zama's Fully Homomorphic Encryption
 *
 * @packageDocumentation
 */

// Core exports
export { createFhevmClient, type FhevmClient } from './core/fhevm';
export { defaultConfig, validateConfig, mergeConfig } from './core/config';

// Type exports
export type {
  FhevmConfig,
  FhevmInstance,
  EncryptedValue,
  DecryptedValue,
  EncryptionInput,
} from './types';

// Utility exports
export {
  encryptValue,
  encryptBatch,
  createEncryptedInput,
} from './utils/encryption';

export {
  decryptValue,
  userDecrypt,
  publicDecrypt,
  requestDecryptPermission,
} from './utils/decryption';

export {
  isValidAddress,
  validateContractAddress,
  validateUserAddress,
  validateEncryptionType,
  validateValueForType,
  sanitizeEncryptedData,
} from './utils/validation';

// Framework adapters (re-export for convenience)
export {
  FhevmProvider,
  useFhevmContext,
  useFhevm,
  useEncrypt,
  useDecrypt,
} from './adapters/react';

/**
 * Quick Start Example
 *
 * @example
 * ```tsx
 * // 1. Create client
 * import { createFhevmClient, FhevmProvider, useFhevm } from '@fhevm-template/fhevm-sdk';
 *
 * const client = createFhevmClient({
 *   network: window.ethereum,
 *   gatewayUrl: 'https://gateway.zama.ai'
 * });
 *
 * // 2. Wrap your app
 * <FhevmProvider client={client}>
 *   <App />
 * </FhevmProvider>
 *
 * // 3. Use in components
 * function MyComponent() {
 *   const { encrypt, isReady } = useFhevm();
 *
 *   const handleEncrypt = async () => {
 *     const encrypted = await encrypt(contractAddress, userAddress, {
 *       value: 50000,
 *       type: 'uint64'
 *     });
 *   };
 * }
 * ```
 */
