/**
 * Configuration Management
 * Default configurations and validators
 */

import type { FhevmConfig } from '../types';

/**
 * Default FHEVM configuration
 */
export const defaultConfig: Partial<FhevmConfig> = {
  gatewayUrl: 'https://gateway.zama.ai',
};

/**
 * Validate FHEVM configuration
 */
export function validateConfig(config: FhevmConfig): void {
  if (!config.network) {
    throw new Error('Network provider is required');
  }

  if (config.gatewayUrl && !isValidUrl(config.gatewayUrl)) {
    throw new Error('Invalid gateway URL');
  }

  if (config.aclAddress && !isValidAddress(config.aclAddress)) {
    throw new Error('Invalid ACL address');
  }
}

/**
 * Check if string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is a valid Ethereum address
 */
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Merge user config with defaults
 */
export function mergeConfig(
  userConfig: Partial<FhevmConfig>,
  defaults: Partial<FhevmConfig> = defaultConfig
): FhevmConfig {
  return {
    ...defaults,
    ...userConfig,
  } as FhevmConfig;
}
