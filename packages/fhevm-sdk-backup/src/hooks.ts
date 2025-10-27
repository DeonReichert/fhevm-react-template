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

/**
 * Hook to encrypt a single value with automatic loading state
 *
 * @example
 * ```tsx
 * const { encryptValue, isEncrypting, encryptedData, error } = useEncrypt();
 *
 * await encryptValue({
 *   contractAddress,
 *   userAddress,
 *   value: 50000,
 *   type: 'uint64'
 * });
 * ```
 */
export function useEncrypt() {
  const { client } = useFhevmContext();
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedData, setEncryptedData] = useState<EncryptedValue | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const encryptValue = useCallback(
    async (params: {
      contractAddress: string;
      userAddress: string;
      value: number | bigint | boolean | string;
      type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
    }) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const { instance } = await client.getInstance();
        const input = instance.createEncryptedInput(
          params.contractAddress,
          params.userAddress
        );

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
        const encrypted = {
          handles: result.handles,
          inputProof: result.inputProof,
        };

        setEncryptedData(encrypted);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client]
  );

  const reset = useCallback(() => {
    setEncryptedData(null);
    setError(null);
  }, []);

  return {
    encryptValue,
    isEncrypting,
    encryptedData,
    error,
    reset,
  };
}

/**
 * Hook to decrypt a value with automatic loading state
 *
 * @example
 * ```tsx
 * const { decryptValue, isDecrypting, decryptedData, error } = useDecrypt();
 *
 * await decryptValue({
 *   contractAddress,
 *   handle: ciphertextHandle
 * });
 * ```
 */
export function useDecrypt() {
  const { client } = useFhevmContext();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedData, setDecryptedData] = useState<bigint | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const decryptValue = useCallback(
    async (params: { contractAddress: string; handle: Uint8Array }) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsDecrypting(true);
      setError(null);

      try {
        const { instance } = await client.getInstance();
        const decrypted = await instance.decrypt(params.contractAddress, params.handle);
        const result = BigInt(decrypted);

        setDecryptedData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsDecrypting(false);
      }
    },
    [client]
  );

  const reset = useCallback(() => {
    setDecryptedData(null);
    setError(null);
  }, []);

  return {
    decryptValue,
    isDecrypting,
    decryptedData,
    error,
    reset,
  };
}

/**
 * Hook to manage multiple encrypted values with batch operations
 *
 * @example
 * ```tsx
 * const { addValue, encryptBatch, isEncrypting, encryptedValues } = useBatchEncrypt();
 *
 * addValue({ value: 50000, type: 'uint64' });
 * addValue({ value: true, type: 'bool' });
 *
 * await encryptBatch(contractAddress, userAddress);
 * ```
 */
export function useBatchEncrypt() {
  const { client } = useFhevmContext();
  const [values, setValues] = useState<
    Array<{ value: number | bigint | boolean | string; type: string }>
  >([]);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedValues, setEncryptedValues] = useState<EncryptedValue | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const addValue = useCallback(
    (data: { value: number | bigint | boolean | string; type: string }) => {
      setValues((prev) => [...prev, data]);
    },
    []
  );

  const removeValue = useCallback((index: number) => {
    setValues((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearValues = useCallback(() => {
    setValues([]);
  }, []);

  const encryptBatch = useCallback(
    async (contractAddress: string, userAddress: string) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      if (values.length === 0) {
        throw new Error('No values to encrypt');
      }

      setIsEncrypting(true);
      setError(null);

      try {
        const { instance } = await client.getInstance();
        const input = instance.createEncryptedInput(contractAddress, userAddress);

        // Add all values to input
        values.forEach((data) => {
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
        });

        const result = await input.encrypt();
        const encrypted = {
          handles: result.handles,
          inputProof: result.inputProof,
        };

        setEncryptedValues(encrypted);
        return encrypted;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsEncrypting(false);
      }
    },
    [client, values]
  );

  const reset = useCallback(() => {
    setValues([]);
    setEncryptedValues(null);
    setError(null);
  }, []);

  return {
    values,
    addValue,
    removeValue,
    clearValues,
    encryptBatch,
    isEncrypting,
    encryptedValues,
    error,
    reset,
  };
}

/**
 * Hook to monitor FHEVM instance initialization
 *
 * @example
 * ```tsx
 * const { isReady, isInitializing, error, reinitialize } = useFhevmStatus();
 * ```
 */
export function useFhevmStatus() {
  const { client, isReady, error } = useFhevmContext();
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    if (!isReady && client) {
      setIsInitializing(true);
    } else {
      setIsInitializing(false);
    }
  }, [isReady, client]);

  const reinitialize = useCallback(
    async (newConfig?: Partial<any>) => {
      if (!client) {
        throw new Error('FHEVM client not initialized');
      }

      setIsInitializing(true);
      try {
        await client.reinit(newConfig || {});
      } finally {
        setIsInitializing(false);
      }
    },
    [client]
  );

  return {
    isReady,
    isInitializing,
    error,
    reinitialize,
  };
}
