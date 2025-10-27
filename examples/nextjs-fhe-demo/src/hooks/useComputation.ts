/**
 * useComputation Hook
 * Custom hook for FHE computation operations
 */

import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useState, useCallback } from 'react';

export type ComputationOperation = 'add' | 'sub' | 'mul' | 'div' | 'gt' | 'lt' | 'eq' | 'and' | 'or';

export function useComputation() {
  const { client, isReady } = useFhevm();
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  const compute = useCallback(
    async (
      operation: ComputationOperation,
      operand1: Uint8Array,
      operand2: Uint8Array,
      contractAddress: string
    ) => {
      if (!client || !isReady) {
        throw new Error('FHEVM client not ready');
      }

      setIsComputing(true);
      setError(null);

      try {
        // Note: Actual computation would be done via smart contract
        // This is a placeholder for the client-side interface
        const computationResult = {
          operation,
          timestamp: new Date().toISOString(),
          note: 'Computation performed on-chain',
        };

        setResult(computationResult);
        return computationResult;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsComputing(false);
      }
    },
    [client, isReady]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    compute,
    isComputing,
    result,
    error,
    reset,
    isReady,
  };
}
