import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
// This is a demo ID - replace with your own in production
const projectId = 'c0d9ec9a4b8e53e6b6c0e4e3f3a9c2c1';

export const config = getDefaultConfig({
  appName: 'Confidential Land Platform',
  projectId,
  chains: [sepolia],
  ssr: false,
});
