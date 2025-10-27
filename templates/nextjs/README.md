# Next.js FHEVM Template

Complete Next.js 14 template showcasing Universal FHEVM SDK integration.

## Features

- Next.js 14 with App Router
- Universal FHEVM SDK integration
- RainbowKit wallet connection
- TypeScript support
- Tailwind CSS styling
- Encryption/Decryption demos

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
templates/nextjs/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page
│   └── providers.tsx       # FHEVM & Wagmi providers
├── components/
│   ├── EncryptionDemo.tsx  # Encryption demonstration
│   └── DecryptionDemo.tsx  # Decryption demonstration
├── package.json
└── README.md
```

## SDK Integration

### 1. Setup Providers

```tsx
// app/providers.tsx
import { createFhevmClient, FhevmProvider } from '@fhevm-template/fhevm-sdk';

const fhevmClient = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});

export function Providers({ children }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FhevmProvider client={fhevmClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </FhevmProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 2. Use in Components

```tsx
// components/EncryptionDemo.tsx
'use client';

import { useFhevm } from '@fhevm-template/fhevm-sdk';

export function EncryptionDemo() {
  const { encrypt, isReady } = useFhevm();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(contractAddress, userAddress, {
      value: 50000,
      type: 'uint64'
    });

    console.log('Encrypted:', encrypted);
  };

  return (
    <button onClick={handleEncrypt} disabled={!isReady}>
      Encrypt Data
    </button>
  );
}
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHE Docs](https://docs.zama.ai/)

## License

MIT
