import type { FhevmClient } from './client';
import type { EncryptedValue, EncryptionInput } from './types';

/**
 * Create encrypted input builder
 * 
 * @example
 * ```ts
 * const encrypted = await createEncryptedInput(client, contractAddress, userAddress)
 *   .add64(50000)
 *   .add64(10000)
 *   .encrypt();
 * ```
 */
export function createEncryptedInput(
  client: FhevmClient,
  contractAddress: string,
  userAddress: string
): EncryptionInput {
  let inputBuilder: any = null;

  const builder: EncryptionInput = {
    add8(value: number) {
      if (!inputBuilder) {
        throw new Error('Input builder not initialized');
      }
      inputBuilder.add8(value);
      return builder;
    },

    add16(value: number) {
      if (!inputBuilder) {
        throw new Error('Input builder not initialized');
      }
      inputBuilder.add16(value);
      return builder;
    },

    add32(value: number) {
      if (!inputBuilder) {
        throw new Error('Input builder not initialized');
      }
      inputBuilder.add32(value);
      return builder;
    },

    add64(value: number | bigint) {
      if (!inputBuilder) {
        throw new Error('Input builder not initialized');
      }
      inputBuilder.add64(value);
      return builder;
    },

    addBool(value: boolean) {
      if (!inputBuilder) {
        throw new Error('Input builder not initialized');
      }
      inputBuilder.addBool(value);
      return builder;
    },

    addAddress(value: string) {
      if (!inputBuilder) {
        throw new Error('Input builder not initialized');
      }
      inputBuilder.addAddress(value);
      return builder;
    },

    async encrypt(): Promise<EncryptedValue> {
      if (!inputBuilder) {
        const { instance } = await client.getInstance();
        inputBuilder = instance.createEncryptedInput(contractAddress, userAddress);
        
        // Re-add all values
        // Note: This is a simplified version. In production, you'd track the values
        throw new Error('No values added to encrypt');
      }

      const result = await inputBuilder.encrypt();
      return {
        handles: result.handles,
        inputProof: result.inputProof,
      };
    },
  };

  // Initialize on first use
  (async () => {
    const { instance } = await client.getInstance();
    inputBuilder = instance.createEncryptedInput(contractAddress, userAddress);
  })();

  return builder;
}

/**
 * Encrypt a single value
 * 
 * @example
 * ```ts
 * const encrypted = await encrypt(client, contractAddress, userAddress, {
 *   value: 50000,
 *   type: 'uint64'
 * });
 * ```
 */
export async function encrypt(
  client: FhevmClient,
  contractAddress: string,
  userAddress: string,
  data: { value: number | bigint | boolean | string; type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address' }
): Promise<EncryptedValue> {
  const { instance } = await client.getInstance();
  const input = instance.createEncryptedInput(contractAddress, userAddress);

  switch (data.type) {
    case 'uint8':
      input.add8(data.value as number);
      break;
    case 'uint16':
      input.add16(data.value as number);
      break;
    case 'uint32':
      input.add32(data.value as number);
      break;
    case 'uint64':
      input.add64(data.value as number | bigint);
      break;
    case 'bool':
      input.addBool(data.value as boolean);
      break;
    case 'address':
      input.addAddress(data.value as string);
      break;
  }

  const result = await input.encrypt();
  return {
    handles: result.handles,
    inputProof: result.inputProof,
  };
}

/**
 * Decrypt an encrypted value
 * 
 * @example
 * ```ts
 * const decrypted = await decrypt(client, contractAddress, handle);
 * console.log(decrypted.value); // bigint
 * ```
 */
export async function decrypt(
  client: FhevmClient,
  contractAddress: string,
  handle: Uint8Array
): Promise<bigint> {
  const { instance } = await client.getInstance();
  
  // Request decryption permission if needed
  // Note: This is simplified. Real implementation would handle permissions properly
  const decryptedValue = await instance.decrypt(contractAddress, handle);
  
  return BigInt(decryptedValue);
}
