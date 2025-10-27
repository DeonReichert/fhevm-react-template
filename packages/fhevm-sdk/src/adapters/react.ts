/**
 * React Adapter for FHEVM SDK
 * Provides React hooks and context for FHE operations
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import type { FhevmClient } from '../core';
import type { EncryptedValue, FhevmConfig } from '../types';

/**
 * FHEVM Context Type
 */
interface FhevmContextType {
  client: FhevmClient | null;
  isReady: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextType | null>(null);

/**
 * FHEVM Provider Props
 */
interface FhevmProviderProps {
  children: ReactNode;
  client: FhevmClient;
  autoInit?: boolean;
}

/**
 * FHEVM Provider Component
 * Wraps your app to provide FHEVM functionality
 *
 * @example
 * ```tsx
 * import { FhevmProvider } from '@fhevm-template/fhevm-sdk/adapters/react';
 *
 * <FhevmProvider client={client}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ children, client, autoInit = true }: FhevmProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!autoInit) return;

    let mounted = true;

    async function init() {
      try {
        await client.getInstance();
        if (mounted) {
          setIsReady(true);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [client, autoInit]);

  return (
    <FhevmContext.Provider value={{ client, isReady, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Use FHEVM Context
 */
export function useFhevmContext(): FhevmContextType {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}

/**
 * Main FHEVM Hook
 * Provides encrypt, decrypt, and status information
 *
 * @example
 * ```tsx
 * const { encrypt, decrypt, isReady } = useFhevm();
 *
 * const encrypted = await encrypt(contractAddress, userAddress, {
 *   value: 50000,
 *   type: 'uint64'
 * });
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

  return {
    client,
    isReady,
    error,
    loading,
    encrypt,
    decrypt,
  };
}

/**
 * Encryption Hook
 * Dedicated hook for encryption with loading states
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
 * Decryption Hook
 * Dedicated hook for decryption with loading states
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
