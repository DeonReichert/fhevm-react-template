/**
 * FHE Key Management
 * Utilities for managing FHE keys
 */

/**
 * Key storage interface
 */
export interface KeyStore {
  publicKey?: Uint8Array;
  privateKey?: Uint8Array;
  timestamp?: number;
}

const KEY_STORAGE_KEY = 'fhe_keys';

/**
 * Store keys in local storage (for demo purposes)
 * Note: In production, use secure key management
 */
export function storeKeys(keys: KeyStore): void {
  if (typeof window !== 'undefined') {
    const keysData = {
      publicKey: keys.publicKey ? Array.from(keys.publicKey) : undefined,
      privateKey: keys.privateKey ? Array.from(keys.privateKey) : undefined,
      timestamp: Date.now(),
    };
    localStorage.setItem(KEY_STORAGE_KEY, JSON.stringify(keysData));
  }
}

/**
 * Retrieve keys from local storage
 */
export function retrieveKeys(): KeyStore | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(KEY_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        publicKey: data.publicKey ? new Uint8Array(data.publicKey) : undefined,
        privateKey: data.privateKey ? new Uint8Array(data.privateKey) : undefined,
        timestamp: data.timestamp,
      };
    }
  }
  return null;
}

/**
 * Clear stored keys
 */
export function clearKeys(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEY_STORAGE_KEY);
  }
}
