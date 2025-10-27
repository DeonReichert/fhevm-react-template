# Next.js Complete Template - FHEVM SDK Integration

Complete Next.js 13+ App Router template demonstrating full integration with FHEVM SDK for privacy-preserving applications.

## Features

- **Full FHE Operations**: Encryption, decryption, and homomorphic computation
- **Next.js 14 App Router**: Modern React Server Components architecture
- **API Routes**: Server-side FHE operations with RESTful endpoints
- **React Hooks**: Custom hooks for FHE operations (`useFHE`, `useEncryption`, `useComputation`)
- **Provider Pattern**: FHE context provider for app-wide state management
- **Real-world Examples**: Banking and medical use cases demonstrating FHE applications
- **Type-Safe**: Complete TypeScript support
- **Tailwind CSS**: Modern, responsive UI components

## Structure

```
src/
├── app/                        # App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── api/                    # API routes
│       └── fhe/                # FHE endpoints
│           ├── route.ts        # Main FHE endpoint
│           ├── encrypt/        # Encryption endpoint
│           ├── decrypt/        # Decryption endpoint
│           ├── compute/        # Computation endpoint
│           └── keys/           # Key management endpoint
│
├── components/                 # React components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── fhe/                    # FHE functionality components
│   │   ├── FHEProvider.tsx     # FHE context provider
│   │   ├── EncryptionDemo.tsx  # Encryption demonstration
│   │   ├── ComputationDemo.tsx # Computation demonstration
│   │   └── KeyManager.tsx      # Key management UI
│   └── examples/               # Use case examples
│       ├── BankingExample.tsx  # Banking use case
│       └── MedicalExample.tsx  # Medical records use case
│
├── lib/                        # Utility libraries
│   ├── fhe/                    # FHE integration
│   │   ├── client.ts           # FHE client operations
│   │   └── keys.ts             # Key management
│   └── utils/                  # Utility functions
│       ├── security.ts         # Security utilities
│       └── validation.ts       # Input validation
│
├── hooks/                      # Custom React hooks
│   ├── useFHE.ts               # FHE operations hook
│   ├── useEncryption.ts        # Encryption hook
│   └── useComputation.ts       # Computation hook
│
└── types/                      # TypeScript types
    ├── fhe.ts                  # FHE type definitions
    └── api.ts                  # API type definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your values
```

### Environment Variables

```env
NEXT_PUBLIC_FHE_GATEWAY_URL=https://gateway.zama.ai
NEXT_PUBLIC_NETWORK=development
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Components

### FHE Components

#### FHEProvider

Context provider for FHE state management across the application.

```tsx
import { FHEProvider } from '@/components/fhe/FHEProvider';

<FHEProvider>
  <App />
</FHEProvider>
```

#### EncryptionDemo

Demonstrates encryption of various data types (uint8, uint16, uint32, uint64).

#### ComputationDemo

Shows homomorphic operations (addition, subtraction, multiplication, comparison) on encrypted data.

#### KeyManager

Manages FHE keys and displays system status.

### Example Applications

#### BankingExample

Demonstrates private financial transactions with encrypted balances and transaction history.

#### MedicalExample

Shows HIPAA-compliant storage and retrieval of encrypted medical records.

## Custom Hooks

### useFHE

Access FHE client state and operations.

```tsx
const { isReady, publicKey, error, refresh } = useFHE();
```

### useEncryption

Encrypt data with FHE.

```tsx
const { encrypt, isEncrypting, encryptedData, error } = useEncryption();

await encrypt({
  value: 1000,
  type: 'uint32',
  contractAddress: '0x...',
  userAddress: '0x...',
});
```

### useComputation

Perform homomorphic computations.

```tsx
const { compute, isComputing, result, error } = useComputation();

await compute({
  operation: 'add',
  operands: [100, 200],
  contractAddress: '0x...',
});
```

## API Endpoints

### GET /api/fhe

Get FHE API status and available endpoints.

### POST /api/fhe/encrypt

Encrypt a value.

**Request:**
```json
{
  "value": 1000,
  "type": "uint32",
  "contractAddress": "0x...",
  "userAddress": "0x..."
}
```

### POST /api/fhe/decrypt

Decrypt encrypted data.

**Request:**
```json
{
  "encryptedData": "base64_encoded_data",
  "signature": "eip712_signature",
  "contractAddress": "0x..."
}
```

### POST /api/fhe/compute

Perform homomorphic computation.

**Request:**
```json
{
  "operation": "add",
  "operands": [100, 200],
  "contractAddress": "0x..."
}
```

### GET /api/fhe/keys

Retrieve FHE public keys.

### POST /api/fhe/keys

Generate key pair for user.

**Request:**
```json
{
  "userAddress": "0x...",
  "contractAddress": "0x..."
}
```

## Integration with FHEVM SDK

This template uses the `@fhevm-template/fhevm-sdk` package from the workspace:

```typescript
import { createFhevmClient, encryptValue } from '@fhevm-template/fhevm-sdk';

const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});
```

## Learn More

- [FHEVM SDK Documentation](../../packages/fhevm-sdk/README.md)
- [Zama Documentation](https://docs.zama.ai/)
- [Next.js Documentation](https://nextjs.org/docs)
- [FHE Overview](https://www.zama.ai/post/what-is-fully-homomorphic-encryption-fhe)

## License

MIT
