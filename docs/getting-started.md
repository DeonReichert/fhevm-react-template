# Getting Started

Complete guide to setting up and using the Universal FHEVM SDK.

## Installation

Install the SDK and its peer dependencies:

```bash
npm install @fhevm-template/fhevm-sdk fhevmjs ethers
```

For React/Next.js projects:

```bash
npm install @fhevm-template/fhevm-sdk fhevmjs ethers react
```

## Basic Setup

### Framework-Agnostic Usage

```typescript
import { createFhevmClient, encryptValue } from '@fhevm-template/fhevm-sdk';

// Create client
const client = createFhevmClient({
  network: provider,
  gatewayUrl: 'https://gateway.zama.ai'
});

// Encrypt data
const encrypted = await encryptValue(client, {
  contractAddress: '0x...',
  userAddress: '0x...',
  value: 50000,
  type: 'uint64'
});

console.log('Encrypted:', encrypted.handles);
```

### React Integration

#### Step 1: Create Client and Setup Provider

```tsx
// app/providers.tsx
'use client';

import { createFhevmClient, FhevmProvider } from '@fhevm-template/fhevm-sdk';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create FHEVM client
const fhevmClient = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FhevmProvider client={fhevmClient}>
          {children}
        </FhevmProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

#### Step 2: Wrap Your App

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### Step 3: Use in Components

```tsx
// components/EncryptionDemo.tsx
'use client';

import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useAccount } from 'wagmi';

export function EncryptionDemo() {
  const { encrypt, isReady, loading } = useFhevm();
  const { address } = useAccount();

  const handleEncrypt = async () => {
    if (!address) return;

    const encrypted = await encrypt(
      '0xContractAddress',
      address,
      {
        value: 50000,
        type: 'uint64'
      }
    );

    console.log('Encrypted:', encrypted);
  };

  return (
    <div>
      <p>SDK Status: {isReady ? 'Ready' : 'Initializing...'}</p>
      <button
        onClick={handleEncrypt}
        disabled={!isReady || loading}
      >
        {loading ? 'Encrypting...' : 'Encrypt Data'}
      </button>
    </div>
  );
}
```

## Next.js 14 Setup

For Next.js 14 with App Router:

### 1. Create Providers File

```tsx
// app/providers.tsx
'use client';

import { createFhevmClient, FhevmProvider } from '@fhevm-template/fhevm-sdk';

const fhevmClient = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FhevmProvider client={fhevmClient}>
      {children}
    </FhevmProvider>
  );
}
```

### 2. Update Root Layout

```tsx
// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### 3. Use in Pages

```tsx
// app/page.tsx
'use client';

import { useFhevm } from '@fhevm-template/fhevm-sdk';

export default function Home() {
  const { encrypt, isReady } = useFhevm();

  return (
    <main>
      <h1>Next.js FHE App</h1>
      <p>SDK Status: {isReady ? 'Ready ✓' : 'Loading...'}</p>
    </main>
  );
}
```

## Configuration Options

### Client Configuration

```typescript
interface FhevmConfig {
  network: any;              // Ethereum provider (window.ethereum, ethers provider)
  gatewayUrl?: string;       // FHE gateway URL (default: 'https://gateway.zama.ai')
  aclAddress?: string;       // ACL contract address (optional)
}
```

### Provider Configuration

```tsx
<FhevmProvider
  client={fhevmClient}
  autoInit={true}  // Auto-initialize on mount (default: true)
>
  {children}
</FhevmProvider>
```

## Supported Data Types

The SDK supports encrypting the following types:

- `uint8` - 8-bit unsigned integer (0 to 255)
- `uint16` - 16-bit unsigned integer (0 to 65,535)
- `uint32` - 32-bit unsigned integer (0 to 4,294,967,295)
- `uint64` - 64-bit unsigned integer (0 to 18,446,744,073,709,551,615)
- `bool` - Boolean (true/false)
- `address` - Ethereum address (0x...)

## Common Patterns

### Encrypting User Input

```tsx
function EncryptForm() {
  const { encrypt, isReady } = useFhevm();
  const [value, setValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const encrypted = await encrypt(contractAddress, userAddress, {
      value: Number(value),
      type: 'uint64'
    });

    // Use encrypted.handles and encrypted.inputProof
    // in your contract call
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" disabled={!isReady}>
        Encrypt & Submit
      </button>
    </form>
  );
}
```

### Batch Encryption

```tsx
import { useFhevm } from '@fhevm-template/fhevm-sdk';

function BatchEncrypt() {
  const { encrypt } = useFhevm();

  const encryptMultiple = async () => {
    // Method 1: Multiple separate encryptions
    const encrypted1 = await encrypt(addr, user, { value: 100, type: 'uint64' });
    const encrypted2 = await encrypt(addr, user, { value: true, type: 'bool' });

    // Method 2: Use batch utility
    import { encryptBatch } from '@fhevm-template/fhevm-sdk/utils';

    const encrypted = await encryptBatch(client, {
      contractAddress: addr,
      userAddress: user,
      values: [
        { value: 100, type: 'uint64' },
        { value: true, type: 'bool' }
      ]
    });
  };
}
```

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](./examples.md) - Real-world examples
- [Deployment](./deployment.md) - Deploy your app
