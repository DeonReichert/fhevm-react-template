'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createFhevmClient, FhevmProvider } from '@fhevm-template/fhevm-sdk';

const config = getDefaultConfig({
  appName: 'Next.js FHE Demo',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia],
  ssr: false,
});

const queryClient = new QueryClient();

// Create FHEVM client
const fhevmClient = createFhevmClient({
  network: typeof window !== 'undefined' ? window.ethereum : null,
  gatewayUrl: process.env.NEXT_PUBLIC_FHE_GATEWAY_URL || 'https://gateway.zama.ai',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <FhevmProvider client={fhevmClient}>
            {children}
          </FhevmProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
