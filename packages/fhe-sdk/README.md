# @fhevm-template/fhe-sdk

Universal FHEVM SDK - Framework Agnostic FHE Operations

## Features

✅ **Framework Agnostic** - Works with React, Vue, Node.js, Next.js, or any JavaScript environment
✅ **Simple Setup** - Get started in less than 10 lines of code
✅ **wagmi-like API** - Familiar structure for web3 developers
✅ **Complete Workflow** - Initialization, encryption, decryption, contract interaction
✅ **TypeScript First** - Full type safety and autocompletion

## Installation

```bash
npm install @fhevm-template/fhe-sdk fhevmjs ethers
```

## Quick Start

### React/Next.js

```tsx
import { FhevmProvider, useFhevm } from '@fhevm-template/fhe-sdk';

// 1. Wrap your app
function App() {
  return (
    <FhevmProvider config={{ network: window.ethereum }}>
      <MyComponent />
    </FhevmProvider>
  );
}

// 2. Use in components
function MyComponent() {
  const { encrypt, isReady } = useFhevm();
  
  const handleEncrypt = async () => {
    const encrypted = await encrypt(contractAddress, userAddress, {
      value: 50000,
      type: 'uint64'
    });
    // Use encrypted.handles and encrypted.inputProof with your contract
  };
  
  return <button onClick={handleEncrypt} disabled={!isReady}>Encrypt</button>;
}
```

### Node.js / Vue / Vanilla JS

```ts
import { createFhevmClient } from '@fhevm-template/fhe-sdk';

// 1. Create client
const client = createFhevmClient({
  network: provider, // ethers provider or window.ethereum
  gatewayUrl: 'https://gateway.zama.ai'
});

// 2. Encrypt data
const { instance } = await client.getInstance();
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add64(50000);
const encrypted = await input.encrypt();

// 3. Use with your contract
await contract.myFunction(encrypted.handles[0], encrypted.inputProof);
```

## API Reference

### `createFhevmClient(config)`

Create a new FHEVM client.

```ts
const client = createFhevmClient({
  network: window.ethereum,        // Required
  gatewayUrl: 'https://...',      // Optional
  contractAddress: '0x...',       // Optional
  aclAddress: '0x...'            // Optional
});
```

### `FhevmProvider`

React provider component.

```tsx
<FhevmProvider config={{ network: window.ethereum }}>
  {children}
</FhevmProvider>
```

### `useFhevm()`

React hook for FHE operations.

```ts
const {
  client,        // FhevmClient instance
  isReady,       // boolean
  error,         // Error | null
  loading,       // boolean
  encrypt,       // (address, user, data) => Promise<EncryptedValue>
  decrypt,       // (address, handle) => Promise<bigint>
  createInput    // (address, user) => EncryptionInput
} = useFhevm();
```

### `encrypt()`

Encrypt a single value.

```ts
const encrypted = await encrypt(contractAddress, userAddress, {
  value: 50000,
  type: 'uint64'  // 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'
});
```

### `decrypt()`

Decrypt an encrypted value.

```ts
const value = await decrypt(contractAddress, handle);
console.log(value); // bigint
```

### `createInput()`

Create an encryption input builder.

```ts
const encrypted = await createInput(contractAddress, userAddress)
  .add64(50000)
  .add64(10000)
  .add32(85)
  .encrypt();
```

## Examples

### Encrypt Multiple Values

```ts
const encrypted = await createInput(contractAddress, userAddress)
  .add64(populationDensity)
  .add64(infrastructureCapacity)
  .add32(environmentScore)
  .addBool(isApproved)
  .encrypt();

await contract.registerZone(
  zoneId,
  encrypted.handles[0],
  encrypted.handles[1],
  encrypted.handles[2],
  encrypted.handles[3],
  encrypted.inputProof
);
```

### Decrypt Values

```ts
const encryptedHandle = await contract.getEncryptedValue(zoneId);
const decryptedValue = await decrypt(contractAddress, encryptedHandle);
console.log('Decrypted:', decryptedValue);
```

### With ethers.js

```ts
import { ethers } from 'ethers';
import { createFhevmClient } from '@fhevm-template/fhe-sdk';

const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const client = createFhevmClient({
  network: window.ethereum
});

const { instance } = await client.getInstance();
const input = instance.createEncryptedInput(contractAddress, await signer.getAddress());
input.add64(secretValue);
const encrypted = await input.encrypt();

const contract = new ethers.Contract(contractAddress, abi, signer);
await contract.submitSecret(encrypted.handles[0], encrypted.inputProof);
```

## TypeScript Support

Full TypeScript support with exported types:

```ts
import type {
  FhevmConfig,
  FhevmClient,
  FhevmInstance,
  EncryptedValue,
  DecryptedValue,
  EncryptionInput
} from '@fhevm-template/fhe-sdk';
```

## License

MIT
