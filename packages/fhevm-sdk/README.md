# Universal FHEVM SDK

A framework-agnostic SDK for building privacy-preserving applications with Zama's Fully Homomorphic Encryption (FHE).

## Features

- **Framework Agnostic**: Works with React, Next.js, Vue, Node.js, or vanilla JavaScript
- **Simple API**: wagmi-inspired hooks and functions
- **TypeScript Support**: Full type safety
- **Lightweight**: Minimal dependencies
- **Production Ready**: Complete encryption/decryption workflow

## Quick Start

### Installation

```bash
npm install @fhevm-template/fhevm-sdk fhevmjs ethers
```

### React/Next.js Setup

```tsx
import { createFhevmClient, FhevmProvider, useFhevm } from '@fhevm-template/fhevm-sdk';

// 1. Create client
const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});

// 2. Wrap your app
function App() {
  return (
    <FhevmProvider client={client}>
      <YourComponents />
    </FhevmProvider>
  );
}

// 3. Use in components
function MyComponent() {
  const { encrypt, decrypt, isReady } = useFhevm();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(contractAddress, userAddress, {
      value: 50000,
      type: 'uint64'
    });

    console.log('Encrypted:', encrypted.handles);
  };

  return (
    <div>
      <button onClick={handleEncrypt} disabled={!isReady}>
        Encrypt Data
      </button>
    </div>
  );
}
```

### Vanilla JavaScript Setup

```ts
import { createFhevmClient, encryptValue } from '@fhevm-template/fhevm-sdk';

const client = createFhevmClient({
  network: provider,
  gatewayUrl: 'https://gateway.zama.ai'
});

const encrypted = await encryptValue(client, {
  contractAddress: '0x...',
  userAddress: '0x...',
  value: 50000,
  type: 'uint64'
});
```

## API Reference

### Core

#### `createFhevmClient(config)`

Creates an FHEVM client instance.

```ts
const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai',
  aclAddress: '0x...' // optional
});
```

### React Hooks

#### `useFhevm()`

Main hook for encryption and decryption.

```tsx
const { encrypt, decrypt, isReady, loading, error } = useFhevm();
```

#### `useEncrypt()`

Dedicated encryption hook with loading states.

```tsx
const { encryptValue, isEncrypting, encryptedData, error } = useEncrypt();

await encryptValue({
  contractAddress: '0x...',
  userAddress: '0x...',
  value: 50000,
  type: 'uint64'
});
```

#### `useDecrypt()`

Dedicated decryption hook.

```tsx
const { decryptValue, isDecrypting, decryptedData } = useDecrypt();

await decryptValue({
  contractAddress: '0x...',
  handle: encryptedHandle
});
```

### Utility Functions

#### `encryptValue(client, params)`

Encrypt a single value.

```ts
import { encryptValue } from '@fhevm-template/fhevm-sdk/utils';

const encrypted = await encryptValue(client, {
  contractAddress: '0x...',
  userAddress: '0x...',
  value: 50000,
  type: 'uint64'
});
```

#### `encryptBatch(client, params)`

Encrypt multiple values in one operation.

```ts
const encrypted = await encryptBatch(client, {
  contractAddress: '0x...',
  userAddress: '0x...',
  values: [
    { value: 50000, type: 'uint64' },
    { value: true, type: 'bool' }
  ]
});
```

#### `decryptValue(client, params)`

Decrypt an encrypted value.

```ts
const decrypted = await decryptValue(client, {
  contractAddress: '0x...',
  handle: encryptedHandle
});
```

## Supported Types

- `uint8` - 8-bit unsigned integer
- `uint16` - 16-bit unsigned integer
- `uint32` - 32-bit unsigned integer
- `uint64` - 64-bit unsigned integer
- `bool` - Boolean value
- `address` - Ethereum address

## Architecture

```
packages/fhevm-sdk/
├── src/
│   ├── core/              # Core FHE logic (framework-agnostic)
│   │   ├── fhevm.ts       # Client implementation
│   │   └── config.ts      # Configuration management
│   ├── adapters/          # Framework-specific adapters
│   │   └── react.ts       # React hooks and provider
│   ├── utils/             # Utility functions
│   │   ├── encryption.ts  # Encryption helpers
│   │   ├── decryption.ts  # Decryption helpers
│   │   └── validation.ts  # Input validation
│   └── types/             # TypeScript definitions
│       └── index.ts
└── package.json
```

## Examples

See the [templates](../../templates) directory for complete examples:

- [Next.js Example](../../templates/nextjs)
- [React Example](../../examples/nextjs-fhe-demo)

## License

MIT
