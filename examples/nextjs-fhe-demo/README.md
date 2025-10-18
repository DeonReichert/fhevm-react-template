# Next.js FHE Demo

Next.js 14 application demonstrating integration with the Universal FHEVM SDK.

## Features

- **App Router**: Uses Next.js 14 App Router with Server and Client Components
- **Universal SDK Integration**: Demonstrates `@fhevm-template/fhe-sdk` usage
- **Wallet Connection**: RainbowKit integration for seamless wallet connection
- **FHE Operations**: Interactive encryption and decryption demos
- **TypeScript**: Fully typed with TypeScript
- **Tailwind CSS**: Modern, responsive UI design

## Quick Start

### 1. Install Dependencies

From the repository root:

```bash
npm install
```

### 2. Configure Environment

Copy the environment template:

```bash
cd examples/nextjs-fhe-demo
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

Get a free Project ID at: https://cloud.walletconnect.com/

### 3. Run Development Server

From the repository root:

```bash
npm run dev --workspace=examples/nextjs-fhe-demo
```

Or from this directory:

```bash
npm run dev
```

Visit http://localhost:3000

## SDK Integration

This example shows how to integrate the Universal FHEVM SDK in a Next.js application.

### Provider Setup

The SDK is initialized in `app/providers.tsx`:

```typescript
import { FhevmProvider } from '@fhevm-template/fhe-sdk';

const fhevmConfig = {
  network: sepolia,
  gatewayUrl: 'https://gateway.zama.ai',
  aclAddress: process.env.NEXT_PUBLIC_ACL_ADDRESS,
};

export function Providers({ children }) {
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
```

### Using SDK Hooks

In your components:

```typescript
'use client';

import { useFhevm } from '@fhevm-template/fhe-sdk';
import { useAccount } from 'wagmi';

export function MyComponent() {
  const { encrypt, decrypt, isReady, loading } = useFhevm();
  const { address } = useAccount();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(
      contractAddress,
      address,
      { value: 12345, type: 'uint64' }
    );
    // Use encrypted.handles and encrypted.inputProof
  };

  const handleDecrypt = async () => {
    const decrypted = await decrypt(
      contractAddress,
      address,
      ciphertextHandle
    );
    console.log('Decrypted value:', decrypted);
  };

  return (
    <div>
      {isReady ? 'SDK Ready' : 'Initializing...'}
      {/* Your UI */}
    </div>
  );
}
```

## Project Structure

```
nextjs-fhe-demo/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with tabs
│   ├── providers.tsx       # SDK and wallet providers
│   └── globals.css         # Global styles
├── components/
│   ├── EncryptionDemo.tsx  # Interactive encryption UI
│   └── DecryptionDemo.tsx  # Interactive decryption UI
├── lib/                    # Utility functions (if needed)
├── public/                 # Static assets
├── .env.example            # Environment template
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Available Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run Next.js linter
```

## Key Concepts

### Client Components

Components using hooks must be client components:

```typescript
'use client';  // Required for useFhevm()

export function MyComponent() {
  const { encrypt } = useFhevm();
  // ...
}
```

### Server Components

Server components can't use hooks but can fetch data:

```typescript
// app/page.tsx (default is server component)
export default async function Page() {
  // Server-side data fetching
  return <ClientComponent />;
}
```

### Encryption Flow

1. User connects wallet (RainbowKit)
2. SDK initializes with network config
3. User enters data to encrypt
4. SDK creates encrypted input and proof
5. Submit to smart contract

### Decryption Flow

1. Read ciphertext handle from contract
2. Request decryption through gateway
3. SDK verifies permissions
4. Returns decrypted value if authorized

## Learn More

- [Universal FHEVM SDK Documentation](../../packages/fhe-sdk/README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Zama FHE Documentation](https://docs.zama.ai/)
- [RainbowKit Documentation](https://rainbowkit.com)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the application:

```bash
npm run build
```

The output will be in `.next/` directory. Serve with:

```bash
npm start
```

## Troubleshooting

### SDK Not Initializing

- Check network configuration in `app/providers.tsx`
- Verify ACL address in `.env.local`
- Ensure WalletConnect Project ID is valid

### Wallet Connection Issues

- Update WalletConnect Project ID
- Check network in wagmi config matches your contract

### Build Errors

- Run `npm install` in repository root
- Ensure SDK package is built: `npm run build --workspace=packages/fhe-sdk`

## Support

For issues with:
- **SDK**: See [SDK README](../../packages/fhe-sdk/README.md)
- **Next.js**: Visit [Next.js Docs](https://nextjs.org/docs)
- **FHE**: Check [Zama Docs](https://docs.zama.ai/)
