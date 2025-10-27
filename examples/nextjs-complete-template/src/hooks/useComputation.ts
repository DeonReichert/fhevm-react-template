import { useState, useCallback } from 'react';

interface ComputationParams {
  operation: string;
  operands: number[];
  contractAddress: string;
}

export const useComputation = () => {
  const [isComputing, setIsComputing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = useCallback(async (params: ComputationParams) => {
    setIsComputing(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.computation);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Computation failed';
      setError(errorMessage);
    } finally {
      setIsComputing(false);
    }
  }, []);

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
  };
};
