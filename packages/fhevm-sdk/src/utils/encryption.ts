/**
 * Encryption Utilities
 * Helper functions for FHE encryption operations
 */

import type { FhevmClient } from '../core';
import type { EncryptedValue } from '../types';

/**
 * Encrypt a single value
 *
 * @example
 * ```ts
 * const encrypted = await encryptValue(client, {
 *   contractAddress: '0x...',
 *   userAddress: '0x...',
 *   value: 50000,
 *   type: 'uint64'
 * });
 * ```
 */
export async function encryptValue(
  client: FhevmClient,
  params: {
    contractAddress: string;
    userAddress: string;
    value: number | bigint | boolean | string;
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
  }
): Promise<EncryptedValue> {
  const { instance } = await client.getInstance();
  const input = instance.createEncryptedInput(params.contractAddress, params.userAddress);

  switch (params.type) {
    case 'uint8':
      input.add8(params.value as number);
      break;
    case 'uint16':
      input.add16(params.value as number);
      break;
    case 'uint32':
      input.add32(params.value as number);
      break;
    case 'uint64':
      input.add64(params.value as number | bigint);
      break;
    case 'bool':
      input.addBool(params.value as boolean);
      break;
    case 'address':
      input.addAddress(params.value as string);
      break;
  }

  const result = await input.encrypt();
  return {
    handles: result.handles,
    inputProof: result.inputProof,
  };
}

/**
 * Encrypt multiple values in batch
 *
 * @example
 * ```ts
 * const encrypted = await encryptBatch(client, {
 *   contractAddress: '0x...',
 *   userAddress: '0x...',
 *   values: [
 *     { value: 50000, type: 'uint64' },
 *     { value: true, type: 'bool' }
 *   ]
 * });
 * ```
 */
export async function encryptBatch(
  client: FhevmClient,
  params: {
    contractAddress: string;
    userAddress: string;
    values: Array<{
      value: number | bigint | boolean | string;
      type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
    }>;
  }
): Promise<EncryptedValue> {
  const { instance } = await client.getInstance();
  const input = instance.createEncryptedInput(params.contractAddress, params.userAddress);

  for (const item of params.values) {
    switch (item.type) {
      case 'uint8':
        input.add8(item.value as number);
        break;
      case 'uint16':
        input.add16(item.value as number);
        break;
      case 'uint32':
        input.add32(item.value as number);
        break;
      case 'uint64':
        input.add64(item.value as number | bigint);
        break;
      case 'bool':
        input.addBool(item.value as boolean);
        break;
      case 'address':
        input.addAddress(item.value as string);
        break;
    }
  }

  const result = await input.encrypt();
  return {
    handles: result.handles,
    inputProof: result.inputProof,
  };
}

/**
 * Create an encrypted input builder
 * For advanced use cases requiring manual input construction
 */
export async function createEncryptedInput(
  client: FhevmClient,
  contractAddress: string,
  userAddress: string
) {
  const { instance } = await client.getInstance();
  return instance.createEncryptedInput(contractAddress, userAddress);
}
