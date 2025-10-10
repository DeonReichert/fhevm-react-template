import { createInstance } from 'fhevmjs';
import type { FhevmConfig, FhevmInstance } from './types';

/**
 * FHEVM Client
 * Simple, wagmi-like API for FHE operations
 */
export interface FhevmClient {
  /** Get the underlying fhevmjs instance */
  getInstance(): Promise<FhevmInstance>;
  /** Check if client is ready */
  isReady(): boolean;
  /** Reinitialize with new config */
  reinit(config: Partial<FhevmConfig>): Promise<void>;
}

/**
 * Create FHEVM client
 * 
 * @example
 * ```ts
 * const client = createFhevmClient({
 *   network: window.ethereum,
 *   gatewayUrl: 'https://gateway.zama.ai'
 * });
 * ```
 */
export function createFhevmClient(config: FhevmConfig): FhevmClient {
  let instance: FhevmInstance | null = null;
  let initPromise: Promise<FhevmInstance> | null = null;

  async function initialize(): Promise<FhevmInstance> {
    if (instance?.isReady) {
      return instance;
    }

    if (initPromise) {
      return initPromise;
    }

    initPromise = (async () => {
      const fhevmInstance = await createInstance({
        network: config.network,
        gatewayUrl: config.gatewayUrl || 'https://gateway.zama.ai',
        aclAddress: config.aclAddress,
      });

      instance = {
        instance: fhevmInstance,
        config,
        isReady: true,
      };

      return instance;
    })();

    return initPromise;
  }

  return {
    async getInstance() {
      return initialize();
    },

    isReady() {
      return instance?.isReady ?? false;
    },

    async reinit(newConfig: Partial<FhevmConfig>) {
      const mergedConfig = { ...config, ...newConfig };
      instance = null;
      initPromise = null;
      config = mergedConfig;
      return initialize().then(() => {});
    },
  };
}
