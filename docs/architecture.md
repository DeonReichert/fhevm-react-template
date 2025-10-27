# Architecture

Technical architecture and design decisions for the Universal FHEVM SDK.

## Overview

The SDK is designed with a layered architecture that separates framework-agnostic core logic from framework-specific implementations.

```
┌─────────────────────────────────────────────────┐
│         Application Layer                       │
│  (User's React/Next.js/Vue/Node.js app)        │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│      Framework Adapters                         │
│  React Hooks, Vue Composables, etc.            │
│  - useFhevm, useEncrypt, useDecrypt            │
│  - FhevmProvider (React Context)               │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│         Core SDK (Framework Agnostic)           │
│  - createFhevmClient                           │
│  - Encryption utilities                         │
│  - Decryption utilities                         │
│  - Validation functions                         │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│          fhevmjs (Zama)                         │
│  Low-level FHE operations                      │
└─────────────────────────────────────────────────┘
```

## Module Structure

### Core Module (`src/core/`)

**Purpose**: Framework-agnostic FHE operations

**Key Files**:
- `fhevm.ts` - Client initialization and lifecycle management
- `config.ts` - Configuration validation and defaults

**Design Principles**:
- No framework dependencies (React, Vue, etc.)
- Pure TypeScript
- Can be used in Node.js, browser, or any JS environment

**Example**:
```typescript
// Works in any JavaScript environment
import { createFhevmClient } from '@fhevm-template/fhevm-sdk/core';

const client = createFhevmClient({
  network: provider,
  gatewayUrl: 'https://gateway.zama.ai'
});
```

### Adapters Module (`src/adapters/`)

**Purpose**: Framework-specific implementations

**Current Adapters**:
- `react.ts` - React hooks and context provider

**Design Pattern**:
```
┌──────────────────┐
│  React Adapter   │
│                  │
│  - useFhevm()    │
│  - useEncrypt()  │
│  - Provider      │
└────────┬─────────┘
         │ depends on
         ▼
┌──────────────────┐
│   Core SDK       │
│  (no framework)  │
└──────────────────┘
```

**Extensibility**: New adapters can be added:
- `vue.ts` - Vue 3 composables
- `svelte.ts` - Svelte stores
- `angular.ts` - Angular services

### Utils Module (`src/utils/`)

**Purpose**: Helper functions and utilities

**Key Files**:
- `encryption.ts` - Encryption helpers
- `decryption.ts` - Decryption helpers
- `validation.ts` - Input validation and sanitization

**Why Separate**:
- Reusable across adapters
- Can be imported independently
- Easier testing and maintenance

### Types Module (`src/types/`)

**Purpose**: TypeScript type definitions

**Key Types**:
```typescript
interface FhevmConfig {
  network: any;
  gatewayUrl?: string;
  aclAddress?: string;
}

interface EncryptedValue {
  handles: Uint8Array[];
  inputProof: Uint8Array;
}

interface FhevmClient {
  getInstance(): Promise<FhevmInstance>;
  isReady(): boolean;
  reinit(config: Partial<FhevmConfig>): Promise<void>;
}
```

## Design Patterns

### 1. Adapter Pattern

**Problem**: Different frameworks have different state management
**Solution**: Core logic + framework-specific adapters

```
Core SDK (framework-agnostic)
    ↓
    ├─→ React Adapter (hooks + context)
    ├─→ Vue Adapter (composables)
    └─→ Vanilla JS (direct usage)
```

### 2. Provider Pattern (React)

**Implementation**:
```tsx
// Top-level provider
<FhevmProvider client={client}>
  <App />
</FhevmProvider>

// Hooks access provider context
function Component() {
  const { encrypt } = useFhevm(); // Gets from context
}
```

**Benefits**:
- Single initialization
- Shared state across components
- Automatic cleanup

### 3. Lazy Initialization

**Implementation**:
```typescript
export function createFhevmClient(config: FhevmConfig): FhevmClient {
  let instance: FhevmInstance | null = null;
  let initPromise: Promise<FhevmInstance> | null = null;

  async function initialize(): Promise<FhevmInstance> {
    if (instance?.isReady) return instance;
    if (initPromise) return initPromise; // Prevent duplicate init

    initPromise = (async () => {
      // Heavy initialization here
      const fhevmInstance = await createInstance(config);
      instance = { instance: fhevmInstance, isReady: true };
      return instance;
    })();

    return initPromise;
  }
}
```

**Benefits**:
- Fast client creation
- Async initialization
- Prevents duplicate initialization

### 4. Hook Composition (React)

**Pattern**:
```tsx
// Specialized hooks
export function useEncrypt() {
  const { client } = useFhevmContext(); // Shared context
  const [state, setState] = useState(...);
  // Encryption-specific logic
}

export function useDecrypt() {
  const { client } = useFhevmContext(); // Same shared context
  const [state, setState] = useState(...);
  // Decryption-specific logic
}

// Composite hook
export function useFhevm() {
  return {
    ...useEncrypt(),
    ...useDecrypt(),
    // Combined functionality
  };
}
```

## Key Design Decisions

### 1. Why Framework Agnostic?

**Decision**: Core in pure TypeScript, framework wrappers separate

**Reasoning**:
- Wider adoption (React, Vue, Svelte, Node.js)
- Easier testing (no framework mocking)
- Future-proof (survives framework changes)
- Smaller core bundle

**Trade-off**: Slightly more code for adapters

### 2. Why wagmi-like API?

**Decision**: API mirrors wagmi patterns

**Reasoning**:
- Familiar to web3 developers
- Proven patterns (hooks, providers)
- Lower learning curve
- Consistent with ecosystem

**Examples**:
```tsx
// wagmi
const { data } = useContractRead(...)

// Our SDK
const { encrypt } = useFhevm()
```

### 3. Why TypeScript?

**Decision**: Full TypeScript implementation

**Reasoning**:
- Type safety for crypto operations
- Better DX (autocomplete, docs)
- Catch errors at compile time
- Industry standard

### 4. Peer Dependencies

**Decision**: fhevmjs and ethers as peer deps

**Reasoning**:
- Avoid version conflicts
- Reduce bundle duplication
- User controls versions
- Lighter package

```json
{
  "peerDependencies": {
    "fhevmjs": "^0.5.0",
    "ethers": "^6.10.0",
    "react": "^18.2.0"  // Optional
  }
}
```

### 5. Monorepo Structure

**Decision**: Packages, templates, examples, docs in one repo

**Reasoning**:
- Single source of truth
- Easier cross-referencing
- Simplified versioning
- Better for competition submission

**Structure**:
```
repo/
├── packages/fhevm-sdk/    # Core SDK
├── templates/nextjs/      # Starter templates
├── examples/              # Working examples
└── docs/                  # Documentation
```

## Data Flow

### Encryption Flow

```
User Input
    ↓
Component calls useFhevm().encrypt()
    ↓
React Hook (adapter layer)
    ↓
Core SDK encryption utils
    ↓
fhevmjs.createEncryptedInput()
    ↓
fhevmjs.add64() / addBool() / etc.
    ↓
fhevmjs.encrypt()
    ↓
Return { handles, inputProof }
    ↓
Component receives encrypted data
    ↓
Submit to smart contract
```

### Decryption Flow

```
Get encrypted handle from contract
    ↓
Component calls useFhevm().decrypt()
    ↓
React Hook (adapter layer)
    ↓
Core SDK decryption utils
    ↓
fhevmjs.decrypt()
    ↓
Return bigint value
    ↓
Component displays decrypted data
```

## State Management

### React Implementation

```tsx
// Provider maintains global state
<FhevmContext.Provider value={{ client, isReady, error }}>

// Components access via hooks
const { client, isReady } = useFhevmContext();

// Hooks manage local state
const [loading, setLoading] = useState(false);
const [encrypted, setEncrypted] = useState(null);
```

### State Lifecycle

1. **Initialization**: Provider creates client, starts initialization
2. **Ready State**: Client initialized, `isReady = true`
3. **Operation**: Components call encrypt/decrypt
4. **Loading State**: Operation in progress
5. **Result State**: Operation complete, data available
6. **Error State**: Operation failed, error available

## Performance Considerations

### 1. Lazy Loading

```typescript
// Initialize on first use, not on import
const client = createFhevmClient(config); // Fast
const instance = await client.getInstance(); // Async, only when needed
```

### 2. Singleton Pattern

```tsx
// One client instance for entire app
const client = createFhevmClient(config);

<FhevmProvider client={client}> // Single instance
  <App />
</FhevmProvider>
```

### 3. Request Deduplication

```typescript
// Prevent duplicate initialization
if (initPromise) return initPromise; // Reuse pending promise
```

### 4. Tree Shaking

```typescript
// Enable importing only what you need
export { encryptValue } from './utils/encryption';
export { decryptValue } from './utils/decryption';

// User can import individually
import { encryptValue } from '@fhevm-template/fhevm-sdk/utils';
```

## Security Considerations

### 1. Input Validation

```typescript
// Validate before operations
validateContractAddress(address);
validateValueForType(value, type);
```

### 2. Type Safety

```typescript
// Prevent invalid type assignments
type EncryptionType = 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
```

### 3. Error Handling

```typescript
// Never expose sensitive errors
try {
  await encrypt(...);
} catch (error) {
  // Sanitize error before showing user
  throw new Error('Encryption failed');
}
```

### 4. No Secrets in Client

```typescript
// Never store private keys or secrets in SDK
// Only public operations (encryption, public data)
```

## Testing Strategy

### Unit Tests

```typescript
// Core functions (framework-agnostic)
test('createFhevmClient creates client', () => {
  const client = createFhevmClient(config);
  expect(client).toBeDefined();
});
```

### Integration Tests

```typescript
// Adapter integration
test('useFhevm hook provides encrypt function', () => {
  const { result } = renderHook(() => useFhevm());
  expect(result.current.encrypt).toBeDefined();
});
```

### E2E Tests

```typescript
// Full flow
test('can encrypt and submit to contract', async () => {
  const encrypted = await encrypt(...);
  const tx = await contract.submit(encrypted.handles);
  expect(tx).toBeDefined();
});
```

## Future Extensibility

### Adding New Frameworks

1. Create adapter file: `src/adapters/vue.ts`
2. Implement framework-specific patterns
3. Export from `src/adapters/index.ts`
4. Add to package.json exports

```json
"exports": {
  "./adapters/vue": {
    "import": "./dist/adapters/vue.js"
  }
}
```

### Adding New Features

1. Add to core if framework-agnostic
2. Add to adapters if framework-specific
3. Add to utils if helper function
4. Update types

### Breaking Changes

- Avoid breaking core API
- Deprecate before removing
- Version adapters independently if needed
- Maintain backward compatibility

## Comparison with Alternatives

### vs. Direct fhevmjs Usage

| Aspect | Direct fhevmjs | Our SDK |
|--------|---------------|---------|
| Setup | Complex | Simple (<10 lines) |
| React Integration | Manual | Built-in hooks |
| Type Safety | Partial | Complete |
| State Management | Manual | Automatic |
| Learning Curve | Steep | Gentle |

### vs. Framework-Specific Libraries

| Aspect | Framework-Specific | Our SDK |
|--------|-------------------|---------|
| Portability | Locked to one framework | Any framework |
| Bundle Size | Larger | Smaller core |
| Flexibility | Limited | High |
| Maintenance | Per-framework | Single core |

## Conclusion

The architecture balances:
- **Simplicity**: Easy to use
- **Flexibility**: Works everywhere
- **Performance**: Fast and efficient
- **Maintainability**: Clean, testable code
- **Extensibility**: Easy to add features

This design allows the SDK to serve as a universal solution for FHE integration across the JavaScript ecosystem.
