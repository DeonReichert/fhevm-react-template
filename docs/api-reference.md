# API Reference

Complete API documentation for the Universal FHEVM SDK.

## Core API

### `createFhevmClient(config)`

Creates an FHEVM client instance.

**Parameters:**
```typescript
interface FhevmConfig {
  network: any;          // Ethereum provider
  gatewayUrl?: string;   // Optional gateway URL
  aclAddress?: string;   // Optional ACL address
}
```

**Returns:** `FhevmClient`

**Example:**
```typescript
const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});
```

### `FhevmClient`

**Methods:**

#### `getInstance(): Promise<FhevmInstance>`
Gets the initialized fhevmjs instance.

#### `isReady(): boolean`
Checks if the client is ready for operations.

#### `reinit(config): Promise<void>`
Reinitializes the client with new configuration.

---

## React API

### `FhevmProvider`

Provider component to wrap your application.

**Props:**
```typescript
interface FhevmProviderProps {
  children: ReactNode;
  client: FhevmClient;
  autoInit?: boolean;  // Default: true
}
```

**Example:**
```tsx
<FhevmProvider client={client}>
  <App />
</FhevmProvider>
```

### `useFhevm()`

Main hook for FHE operations.

**Returns:**
```typescript
{
  client: FhevmClient | null;
  isReady: boolean;
  error: Error | null;
  loading: boolean;
  encrypt: (contractAddress: string, userAddress: string, data: EncryptionData) => Promise<EncryptedValue>;
  decrypt: (contractAddress: string, handle: Uint8Array) => Promise<bigint>;
}
```

**Example:**
```tsx
const { encrypt, decrypt, isReady, loading } = useFhevm();

const encrypted = await encrypt(contractAddr, userAddr, {
  value: 50000,
  type: 'uint64'
});
```

### `useEncrypt()`

Dedicated encryption hook with automatic state management.

**Returns:**
```typescript
{
  encryptValue: (params: EncryptParams) => Promise<EncryptedValue>;
  isEncrypting: boolean;
  encryptedData: EncryptedValue | null;
  error: Error | null;
  reset: () => void;
}
```

**Example:**
```tsx
const { encryptValue, isEncrypting, encryptedData } = useEncrypt();

await encryptValue({
  contractAddress: '0x...',
  userAddress: '0x...',
  value: 50000,
  type: 'uint64'
});
```

### `useDecrypt()`

Dedicated decryption hook.

**Returns:**
```typescript
{
  decryptValue: (params: DecryptParams) => Promise<bigint>;
  isDecrypting: boolean;
  decryptedData: bigint | null;
  error: Error | null;
  reset: () => void;
}
```

**Example:**
```tsx
const { decryptValue, isDecrypting, decryptedData } = useDecrypt();

await decryptValue({
  contractAddress: '0x...',
  handle: encryptedHandle
});
```

---

## Utility Functions

### `encryptValue(client, params)`

Encrypts a single value.

**Parameters:**
```typescript
{
  contractAddress: string;
  userAddress: string;
  value: number | bigint | boolean | string;
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
}
```

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
import { encryptValue } from '@fhevm-template/fhevm-sdk/utils';

const encrypted = await encryptValue(client, {
  contractAddress: '0x...',
  userAddress: '0x...',
  value: 50000,
  type: 'uint64'
});
```

### `encryptBatch(client, params)`

Encrypts multiple values in a single operation.

**Parameters:**
```typescript
{
  contractAddress: string;
  userAddress: string;
  values: Array<{
    value: number | bigint | boolean | string;
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
  }>;
}
```

**Returns:** `Promise<EncryptedValue>`

**Example:**
```typescript
import { encryptBatch } from '@fhevm-template/fhevm-sdk/utils';

const encrypted = await encryptBatch(client, {
  contractAddress: '0x...',
  userAddress: '0x...',
  values: [
    { value: 50000, type: 'uint64' },
    { value: true, type: 'bool' }
  ]
});
```

### `decryptValue(client, params)`

Decrypts an encrypted value.

**Parameters:**
```typescript
{
  contractAddress: string;
  handle: Uint8Array;
}
```

**Returns:** `Promise<bigint>`

**Example:**
```typescript
import { decryptValue } from '@fhevm-template/fhevm-sdk/utils';

const decrypted = await decryptValue(client, {
  contractAddress: '0x...',
  handle: encryptedHandle
});
```

### `createEncryptedInput(client, contractAddress, userAddress)`

Creates an encrypted input builder for advanced use cases.

**Returns:** Encrypted input builder from fhevmjs

**Example:**
```typescript
import { createEncryptedInput } from '@fhevm-template/fhevm-sdk/utils';

const input = await createEncryptedInput(client, contractAddr, userAddr);
input.add64(50000);
input.addBool(true);
const encrypted = await input.encrypt();
```

---

## Validation Functions

### `isValidAddress(address)`

Validates Ethereum address format.

**Returns:** `boolean`

### `validateContractAddress(address)`

Validates and throws error if contract address is invalid.

**Throws:** `Error`

### `validateUserAddress(address)`

Validates and throws error if user address is invalid.

**Throws:** `Error`

### `validateEncryptionType(type)`

Validates encryption type.

**Throws:** `Error` if type is not supported

### `validateValueForType(value, type)`

Validates value matches the specified type constraints.

**Throws:** `Error` if validation fails

### `sanitizeEncryptedData(data)`

Sanitizes encrypted data before transmission.

**Returns:** Sanitized encrypted data object

---

## Types

### `EncryptedValue`

```typescript
interface EncryptedValue {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}
```

### `FhevmConfig`

```typescript
interface FhevmConfig {
  network: any;
  gatewayUrl?: string;
  aclAddress?: string;
}
```

### `FhevmInstance`

```typescript
interface FhevmInstance {
  instance: any;  // fhevmjs instance
  config: FhevmConfig;
  isReady: boolean;
}
```

### Encryption Types

```typescript
type EncryptionType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
```

---

## Error Handling

All SDK functions throw errors that should be caught:

```typescript
try {
  const encrypted = await encrypt(contractAddr, userAddr, {
    value: 50000,
    type: 'uint64'
  });
} catch (error) {
  console.error('Encryption failed:', error.message);
}
```

Common errors:
- `'FHEVM client not initialized'` - Client not ready
- `'Invalid contract address'` - Address validation failed
- `'Unsupported type'` - Encryption type not supported
- `'Value must be between...'` - Value out of range for type

---

## Advanced Usage

### Manual Instance Access

```typescript
const { client } = useFhevm();
const { instance } = await client.getInstance();

// Direct fhevmjs access
const input = instance.createEncryptedInput(contractAddr, userAddr);
input.add64(50000);
const result = await input.encrypt();
```

### Custom Configuration

```typescript
import { mergeConfig, validateConfig } from '@fhevm-template/fhevm-sdk';

const config = mergeConfig(userConfig, defaultConfig);
validateConfig(config);
```
