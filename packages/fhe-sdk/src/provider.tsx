import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createFhevmClient, type FhevmClient } from './client';
import type { FhevmConfig } from './types';

interface FhevmContextValue {
  client: FhevmClient | null;
  isReady: boolean;
  error: Error | null;
}

const FhevmContext = createContext<FhevmContextValue>({
  client: null,
  isReady: false,
  error: null,
});

/**
 * FHEVM Provider for React applications
 * 
 * @example
 * ```tsx
 * <FhevmProvider config={{ network: window.ethereum }}>
 *   <App />
 * </FhevmProvider>
 * ```
 */
export function FhevmProvider({ 
  config, 
  children 
}: { 
  config: FhevmConfig; 
  children: ReactNode 
}) {
  const [client, setClient] = useState<FhevmClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const fhevmClient = createFhevmClient(config);
      setClient(fhevmClient);

      // Initialize
      fhevmClient.getInstance()
        .then(() => {
          setIsReady(true);
        })
        .catch((err) => {
          setError(err);
        });
    } catch (err) {
      setError(err as Error);
    }
  }, [config]);

  return (
    <FhevmContext.Provider value={{ client, isReady, error }}>
      {children}
    </FhevmContext.Provider>
  );
}

/**
 * Use FHEVM context
 * 
 * @example
 * ```tsx
 * const { client, isReady } = useFhevmContext();
 * ```
 */
export function useFhevmContext() {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}
