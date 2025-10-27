import { useState, useCallback } from 'react';
import { useFHEContext } from '@/components/fhe/FHEProvider';

export const useFHE = () => {
  const { isReady, publicKey, error: contextError, initializeFHE } = useFHEContext();
  const [error, setError] = useState<string | null>(contextError);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      await initializeFHE();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh FHE';
      setError(errorMessage);
    }
  }, [initializeFHE]);

  return {
    isReady,
    publicKey,
    error: error || contextError,
    refresh,
  };
};
