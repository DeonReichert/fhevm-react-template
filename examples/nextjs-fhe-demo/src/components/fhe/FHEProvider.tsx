'use client';

import { FhevmProvider as SDKFhevmProvider } from '@fhevm-template/fhevm-sdk';
import { createFhevmClient } from '@fhevm-template/fhevm-sdk';
import { ReactNode } from 'react';

interface FHEProviderProps {
  children: ReactNode;
}

/**
 * FHE Provider Component
 * Wraps the application with FHEVM SDK provider
 */
export function FHEProvider({ children }: FHEProviderProps) {
  const client = createFhevmClient({
    network: typeof window !== 'undefined' ? window.ethereum : null,
    gatewayUrl: process.env.NEXT_PUBLIC_FHE_GATEWAY_URL || 'https://gateway.zama.ai',
  });

  return (
    <SDKFhevmProvider client={client}>
      {children}
    </SDKFhevmProvider>
  );
}
