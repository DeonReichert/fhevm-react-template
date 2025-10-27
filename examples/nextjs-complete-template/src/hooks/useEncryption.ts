import { useState, useCallback } from 'react';

interface EncryptionParams {
  value: number | string;
  type: string;
  contractAddress: string;
  userAddress: string;
}

export const useEncryption = () => {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedData, setEncryptedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(async (params: EncryptionParams) => {
    setIsEncrypting(true);
    setError(null);

    try {
      const response = await fetch('/api/fhe/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (data.success) {
        setEncryptedData(data.encrypted);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Encryption failed';
      setError(errorMessage);
    } finally {
      setIsEncrypting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setEncryptedData(null);
    setError(null);
  }, []);

  return {
    encrypt,
    isEncrypting,
    encryptedData,
    error,
    reset,
  };
};
