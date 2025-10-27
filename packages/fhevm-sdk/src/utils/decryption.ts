/**
 * Decryption Utilities
 * Helper functions for FHE decryption operations
 */

import type { FhevmClient } from '../core';

/**
 * Decrypt a single encrypted value
 *
 * @example
 * ```ts
 * const decrypted = await decryptValue(client, {
 *   contractAddress: '0x...',
 *   handle: ciphertextHandle
 * });
 * ```
 */
export async function decryptValue(
  client: FhevmClient,
  params: {
    contractAddress: string;
    handle: Uint8Array;
  }
): Promise<bigint> {
  const { instance } = await client.getInstance();
  const decrypted = await instance.decrypt(params.contractAddress, params.handle);
  return BigInt(decrypted);
}

/**
 * Request permission to decrypt
 * EIP-712 signature for decryption permission
 */
export async function requestDecryptPermission(
  client: FhevmClient,
  contractAddress: string,
  signer: any
): Promise<string> {
  const { instance } = await client.getInstance();

  // Create EIP-712 signature for permission
  const permission = await instance.generatePermissionSignature(
    contractAddress,
    signer
  );

  return permission;
}

/**
 * Decrypt value with user permission
 * Handles the full decryption flow with EIP-712 signature
 */
export async function userDecrypt(
  client: FhevmClient,
  params: {
    contractAddress: string;
    handle: Uint8Array;
    signer: any;
  }
): Promise<bigint> {
  // First request permission
  await requestDecryptPermission(client, params.contractAddress, params.signer);

  // Then decrypt
  return decryptValue(client, {
    contractAddress: params.contractAddress,
    handle: params.handle,
  });
}

/**
 * Public decrypt (no permission required)
 * For publicly accessible encrypted values
 */
export async function publicDecrypt(
  client: FhevmClient,
  params: {
    contractAddress: string;
    handle: Uint8Array;
  }
): Promise<bigint> {
  return decryptValue(client, params);
}
