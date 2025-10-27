'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { FhevmProvider } from '@fhevm-template/fhe-sdk';
import { ReactNode } from 'react';

// Configure wagmi
const config = getDefaultConfig({
  appName: 'Next.js FHE Demo',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia],
  ssr: true,
});

// Configure React Query
const queryClient = new QueryClient();

// Configure FHEVM SDK
const fhevmConfig = {
  network: sepolia,
  gatewayUrl: 'https://gateway.zama.ai',
  aclAddress: process.env.NEXT_PUBLIC_ACL_ADDRESS,
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <FhevmProvider config={fhevmConfig}>
            {children}
          </FhevmProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
