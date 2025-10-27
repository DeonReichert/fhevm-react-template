'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FHEContextType {
  isReady: boolean;
  publicKey: string | null;
  error: string | null;
  initializeFHE: () => Promise<void>;
}

const FHEContext = createContext<FHEContextType | undefined>(undefined);

export const useFHEContext = () => {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
};

export const FHEProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeFHE = async () => {
    try {
      setError(null);
      // In a real implementation, initialize fhevmjs here
      const response = await fetch('/api/fhe/keys');
      const data = await response.json();

      if (data.success) {
        setPublicKey(data.keys.publicKey);
        setIsReady(true);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize FHE');
      setIsReady(false);
    }
  };

  useEffect(() => {
    initializeFHE();
  }, []);

  return (
    <FHEContext.Provider value={{ isReady, publicKey, error, initializeFHE }}>
      {children}
    </FHEContext.Provider>
  );
};
