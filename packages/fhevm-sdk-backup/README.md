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

### Core Functions

#### `createFhevmClient(config)`

Create a new FHEVM client for framework-agnostic usage.

```ts
const client = createFhevmClient({
  network: window.ethereum,        // Required: ethers provider or window.ethereum
  gatewayUrl: 'https://...',      // Optional: Custom gateway URL
  contractAddress: '0x...',       // Optional: Default contract address
  aclAddress: '0x...'            // Optional: ACL contract address
});
```

**Methods:**
- `getInstance()`: Get initialized FHE instance
- `isReady()`: Check if client is ready
- `reinit(config)`: Reinitialize with new config

### React Components

#### `FhevmProvider`

React provider component that initializes the FHEVM client.

```tsx
<FhevmProvider config={{
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai',
  aclAddress: '0x...'
}}>
  {children}
</FhevmProvider>
```

### React Hooks

#### `useFhevm()`

Main hook for FHE operations with manual control.

```ts
const {
  client,        // FhevmClient instance
  isReady,       // boolean - SDK ready state
  error,         // Error | null - Initialization errors
  loading,       // boolean - Operation in progress
  encrypt,       // Function to encrypt single value
  decrypt,       // Function to decrypt value
  createInput    // Function to create encryption input builder
} = useFhevm();
```

**Example:**
```tsx
const { encrypt, isReady } = useFhevm();

const handleEncrypt = async () => {
  const encrypted = await encrypt(contractAddress, userAddress, {
    value: 50000,
    type: 'uint64'
  });
};
```

#### `useEncrypt()`

Hook for encrypting single values with automatic state management.

```ts
const {
  encryptValue,    // Function to encrypt
  isEncrypting,    // boolean - Encryption in progress
  encryptedData,   // EncryptedValue | null - Result
  error,           // Error | null
  reset            // Function to clear state
} = useEncrypt();
```

**Example:**
```tsx
const { encryptValue, isEncrypting, encryptedData } = useEncrypt();

const handleSubmit = async () => {
  await encryptValue({
    contractAddress: '0x...',
    userAddress: address,
    value: 50000,
    type: 'uint64'
  });

  // encryptedData is automatically set
  if (encryptedData) {
    await contract.submit(encryptedData.handles[0], encryptedData.inputProof);
  }
};
```

#### `useDecrypt()`

Hook for decrypting values with automatic state management.

```ts
const {
  decryptValue,    // Function to decrypt
  isDecrypting,    // boolean - Decryption in progress
  decryptedData,   // bigint | null - Decrypted result
  error,           // Error | null
  reset            // Function to clear state
} = useDecrypt();
```

**Example:**
```tsx
const { decryptValue, isDecrypting, decryptedData } = useDecrypt();

const handleDecrypt = async () => {
  const handle = await contract.getEncryptedValue(zoneId);
  await decryptValue({
    contractAddress: contract.address,
    handle
  });

  // decryptedData is automatically set
  console.log('Value:', decryptedData);
};
```

#### `useBatchEncrypt()`

Hook for encrypting multiple values in a single operation.

```ts
const {
  values,           // Array of added values
  addValue,         // Function to add value to batch
  removeValue,      // Function to remove value by index
  clearValues,      // Function to clear all values
  encryptBatch,     // Function to encrypt all values
  isEncrypting,     // boolean - Encryption in progress
  encryptedValues,  // EncryptedValue | null - Result
  error,            // Error | null
  reset             // Function to reset all state
} = useBatchEncrypt();
```

**Example:**
```tsx
const { addValue, encryptBatch, encryptedValues } = useBatchEncrypt();

const handleRegister = async () => {
  // Add multiple values
  addValue({ value: 50000, type: 'uint64' });  // Population density
  addValue({ value: 10000, type: 'uint64' });  // Infrastructure
  addValue({ value: 85, type: 'uint32' });     // Environment score
  addValue({ value: true, type: 'bool' });     // Approved

  // Encrypt all at once
  await encryptBatch(contractAddress, userAddress);

  // Submit to contract
  if (encryptedValues) {
    await contract.registerZone(
      zoneId,
      encryptedValues.handles[0],
      encryptedValues.handles[1],
      encryptedValues.handles[2],
      encryptedValues.handles[3],
      encryptedValues.inputProof
    );
  }
};
```

#### `useFhevmStatus()`

Hook to monitor FHEVM client initialization status.

```ts
const {
  isReady,         // boolean - Client ready
  isInitializing,  // boolean - Currently initializing
  error,           // Error | null
  reinitialize     // Function to reinitialize with new config
} = useFhevmStatus();
```

**Example:**
```tsx
const { isReady, isInitializing, reinitialize } = useFhevmStatus();

return (
  <div>
    {isInitializing && <Spinner />}
    {isReady && <p>✓ SDK Ready</p>}
    <button onClick={() => reinitialize({ network: newProvider })}>
      Switch Network
    </button>
  </div>
);
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

## Usage Examples

### Example 1: Simple Encryption (useFhevm)

```tsx
import { useFhevm } from '@fhevm-template/fhe-sdk';
import { useAccount } from 'wagmi';

function EncryptForm() {
  const { encrypt, isReady, loading } = useFhevm();
  const { address } = useAccount();
  const [value, setValue] = useState('');

  const handleSubmit = async () => {
    const encrypted = await encrypt(contractAddress, address, {
      value: parseInt(value),
      type: 'uint64'
    });

    // Submit to contract
    await contract.submitValue(encrypted.handles[0], encrypted.inputProof);
  };

  return (
    <button onClick={handleSubmit} disabled={!isReady || loading}>
      {loading ? 'Encrypting...' : 'Encrypt & Submit'}
    </button>
  );
}
```

### Example 2: Automatic State Management (useEncrypt)

```tsx
import { useEncrypt } from '@fhevm-template/fhe-sdk';

function EncryptWithState() {
  const { encryptValue, isEncrypting, encryptedData, error } = useEncrypt();

  const handleEncrypt = async () => {
    await encryptValue({
      contractAddress: '0x...',
      userAddress: address,
      value: 50000,
      type: 'uint64'
    });
  };

  return (
    <>
      <button onClick={handleEncrypt} disabled={isEncrypting}>
        Encrypt
      </button>
      {encryptedData && <p>✓ Encrypted successfully</p>}
      {error && <p>Error: {error.message}</p>}
    </>
  );
}
```

### Example 3: Batch Encryption (useBatchEncrypt)

```tsx
import { useBatchEncrypt } from '@fhevm-template/fhe-sdk';

function RegisterZone() {
  const { addValue, encryptBatch, encryptedValues, isEncrypting } = useBatchEncrypt();
  const { address } = useAccount();

  const handleRegister = async () => {
    // Add multiple values
    addValue({ value: 50000, type: 'uint64' });  // Population
    addValue({ value: 10000, type: 'uint64' });  // Infrastructure
    addValue({ value: 85, type: 'uint32' });     // Score
    addValue({ value: true, type: 'bool' });     // Approved

    // Encrypt all at once
    await encryptBatch(contractAddress, address);

    // Submit to contract
    if (encryptedValues) {
      await contract.registerZone(
        zoneId,
        encryptedValues.handles[0],
        encryptedValues.handles[1],
        encryptedValues.handles[2],
        encryptedValues.handles[3],
        encryptedValues.inputProof
      );
    }
  };

  return (
    <button onClick={handleRegister} disabled={isEncrypting}>
      {isEncrypting ? 'Processing...' : 'Register Zone'}
    </button>
  );
}
```

### Example 4: Decryption (useDecrypt)

```tsx
import { useDecrypt } from '@fhevm-template/fhe-sdk';

function ViewSecret() {
  const { decryptValue, isDecrypting, decryptedData } = useDecrypt();

  const handleView = async () => {
    const handle = await contract.getEncryptedValue(zoneId);
    await decryptValue({
      contractAddress: contract.address,
      handle
    });
  };

  return (
    <>
      <button onClick={handleView} disabled={isDecrypting}>
        View Secret Value
      </button>
      {decryptedData && (
        <p>Decrypted Value: {decryptedData.toString()}</p>
      )}
    </>
  );
}
```

### Example 5: Manual Input Builder (createInput)

```tsx
import { useFhevm } from '@fhevm-template/fhe-sdk';

function ManualEncryption() {
  const { createInput } = useFhevm();

  const handleEncrypt = async () => {
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
  };

  return <button onClick={handleEncrypt}>Register</button>;
}
```

### Example 6: Framework-Agnostic (Node.js/Vue)

```ts
import { createFhevmClient } from '@fhevm-template/fhe-sdk';
import { ethers } from 'ethers';

// Setup
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});

// Encrypt
const { instance } = await client.getInstance();
const input = instance.createEncryptedInput(
  contractAddress,
  await signer.getAddress()
);
input.add64(secretValue);
const encrypted = await input.encrypt();

// Use with contract
const contract = new ethers.Contract(contractAddress, abi, signer);
await contract.submitSecret(encrypted.handles[0], encrypted.inputProof);

// Decrypt
const handle = await contract.getEncryptedValue(zoneId);
const decrypted = await instance.decrypt(contractAddress, handle);
console.log('Decrypted:', BigInt(decrypted));
```

### Example 7: Status Monitoring (useFhevmStatus)

```tsx
import { useFhevmStatus } from '@fhevm-template/fhe-sdk';

function StatusMonitor() {
  const { isReady, isInitializing, error, reinitialize } = useFhevmStatus();

  return (
    <div>
      {isInitializing && <Spinner text="Initializing FHEVM..." />}
      {isReady && <Badge>✓ SDK Ready</Badge>}
      {error && <Alert>Error: {error.message}</Alert>}
      <button onClick={() => reinitialize()}>Reload SDK</button>
    </div>
  );
}
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
