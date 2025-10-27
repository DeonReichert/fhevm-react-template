/**
 * FHE Client Operations
 * Client-side FHE encryption and decryption utilities
 */

import { createFhevmClient } from '@fhevm-template/fhevm-sdk';
import type { FhevmClient } from '@fhevm-template/fhevm-sdk';

let clientInstance: FhevmClient | null = null;

/**
 * Initialize FHE client
 */
export function initFheClient(network: any, gatewayUrl?: string): FhevmClient {
  if (!clientInstance) {
    clientInstance = createFhevmClient({
      network,
      gatewayUrl: gatewayUrl || process.env.NEXT_PUBLIC_FHE_GATEWAY_URL || 'https://gateway.zama.ai',
    });
  }
  return clientInstance;
}

/**
 * Get existing client instance
 */
export function getFheClient(): FhevmClient | null {
  return clientInstance;
}

/**
 * Reset client instance
 */
export function resetFheClient(): void {
  clientInstance = null;
}
