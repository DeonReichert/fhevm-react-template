import { useState, useEffect, useCallback } from 'react';
import { useFhevmContext } from './provider';
import { createEncryptedInput } from './encryption';
import type { EncryptedValue } from './types';

/**
 * Hook to use FHEVM client
 * 
 * @example
 * ```tsx
 * const { encrypt, decrypt, isReady } = useFhevm();
 * 
 * const handleEncrypt = async () => {
 *   const result = await encrypt(contractAddress, userAddress, {
 *     value: 50000,
 *     type: 'uint64'
 *   });
 * };
 * ```
 */
export function useFhevm() {
  const { client, isReady, error } = useFhevmContext();
  const [loading, setLoading] = useState(false);

  const encrypt = useCallback(
    async (
      contractAddress: string,
      userAddress: string,
      data: { value: number | bigint | boolean | string; type: string }
    ): Promise<EncryptedValue> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      setLoading(true);
      try {
        const { instance } = await client.getInstance();
        const input = instance.createEncryptedInput(contractAddress, userAddress);

        // Add value based on type
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
          default:
            throw new Error(`Unsupported type: ${data.type}`);
        }

        const result = await input.encrypt();
        return {
          handles: result.handles,
          inputProof: result.inputProof,
        };
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const decrypt = useCallback(
    async (contractAddress: string, handle: Uint8Array): Promise<bigint> => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      setLoading(true);
      try {
        const { instance } = await client.getInstance();
        const decrypted = await instance.decrypt(contractAddress, handle);
        return BigInt(decrypted);
      } finally {
        setLoading(false);
      }
    },
    [client]
  );

  const createInput = useCallback(
    (contractAddress: string, userAddress: string) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }
      return createEncryptedInput(client, contractAddress, userAddress);
    },
    [client]
  );

  return {
    client,
    isReady,
    error,
    loading,
    encrypt,
    decrypt,
    createInput,
  };
}
