# Universal FHEVM SDK

A framework-agnostic SDK for building privacy-preserving decentralized applications using Zama's Fully Homomorphic Encryption (FHE) technology.

## 🎯 Overview

This repository provides a complete SDK and template collection for developing FHE-powered applications:

- **Universal SDK**: Framework-agnostic core that works with React, Next.js, Vue, Node.js
- **Simple Setup**: Less than 10 lines of code to get started
- **React Adapter**: Pre-built hooks and providers (wagmi-style API)
- **Complete Templates**: Production-ready Next.js and React examples
- **Comprehensive Docs**: Full documentation and real-world examples

## 🌐 Live Demo

**Website**: [https://land-platform-chi.vercel.app/](https://land-platform-chi.vercel.app/)

**Video Demo**: demo.mp4

**Smart Contract**: [`0xba4FB3D706a6754FFbcF9B01Cc3176F003343d11`](https://sepolia.etherscan.io/address/0xba4FB3D706a6754FFbcF9B01Cc3176F003343d11)

## 📚 What is FHE?

Fully Homomorphic Encryption (FHE) allows computations to be performed directly on encrypted data without decryption. This enables:

- Complete data privacy during processing
- Confidential smart contract execution
- Zero-knowledge operations on blockchain
- Secure multi-party computation

## 🚀 Quick Start

### Installation

```bash
# Install the SDK
npm install @fhevm-template/fhevm-sdk fhevmjs ethers
```

### Basic Usage

```typescript
import { createFhevmClient, encryptValue } from '@fhevm-template/fhevm-sdk';

// Create client
const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});

// Encrypt data
const encrypted = await encryptValue(client, {
  contractAddress: '0x...',
  userAddress: '0x...',
  value: 50000,
  type: 'uint64'
});
```

### React/Next.js Setup

```tsx
import { createFhevmClient, FhevmProvider, useFhevm } from '@fhevm-template/fhevm-sdk';

const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai'
});

// Wrap your app
<FhevmProvider client={client}>
  <App />
</FhevmProvider>

// Use in components
function MyComponent() {
  const { encrypt, isReady } = useFhevm();

  const handleEncrypt = async () => {
    const encrypted = await encrypt(contractAddr, userAddr, {
      value: 50000,
      type: 'uint64'
    });
  };
}
```

## 📁 Repository Structure

```
fhevm-react-template/
├── packages/                           # SDK packages
│   ├── fhevm-sdk/                     # Core FHEVM SDK (universal)
│   │   ├── src/
│   │   │   ├── core/                  # Framework-agnostic core
│   │   │   ├── adapters/              # Framework adapters (React)
│   │   │   └── utils/                 # Encryption/decryption utilities
│   │   ├── package.json
│   │   └── README.md
│   ├── fhe-sdk/                       # FHE SDK wrapper
│   │   └── src/                       # Core FHE operations
│   └── fhe-utils/                     # Utility functions
│       └── src/                       # Formatting, conversion, constants
│
├── templates/                          # Ready-to-use templates
│   └── nextjs/                        # Next.js 14 template
│       └── nextjs-fhe-demo/           # Template boilerplate
│
├── examples/                           # Example applications
│   ├── nextjs-complete-template/      # Complete Next.js example (NEW)
│   │   ├── src/app/                   # App Router with API routes
│   │   ├── src/components/            # UI and FHE components
│   │   ├── src/hooks/                 # Custom React hooks
│   │   ├── src/lib/                   # FHE utilities
│   │   └── src/types/                 # TypeScript types
│   ├── nextjs-fhe-demo/               # Next.js demo
│   ├── confidential-land-platform/    # Land registry example
│   └── land-platform-static/          # Static deployment artifact
│
├── docs/                              # Documentation
│   ├── getting-started.md
│   ├── api-reference.md
│   ├── examples.md
│   ├── architecture.md
│   └── deployment.md
│
├── demo.mp4                           # Video demonstration
└── README.md
```

## 📦 SDK Packages

### Core FHEVM SDK (`@fhevm-template/fhevm-sdk`)

Universal framework-agnostic SDK for FHE operations:
- **Framework Agnostic**: Core works with any JavaScript framework or vanilla JS
- **Simple API**: wagmi-inspired design for intuitive usage
- **Type Safe**: Complete TypeScript support with full type definitions
- **Encryption**: Support for uint8, uint16, uint32, uint64, bool, and address types
- **Decryption**: Full decryption workflow with EIP-712 signatures
- **Batch Operations**: Encrypt multiple values in single operation
- **Validation**: Built-in input validation and security checks

### React Adapter

- **Hooks**: `useFhevm`, `useEncrypt`, `useDecrypt`
- **Provider**: `FhevmProvider` for app-wide FHE state
- **Auto-init**: Automatic SDK initialization
- **Loading States**: Built-in loading and error state management

### FHE SDK Wrapper (`@fhevm-template/fhe-sdk`)

Simplified wrapper around fhevmjs:
- Direct fhevmjs integration
- Client-side encryption utilities
- React hooks and providers
- Streamlined API

### FHE Utils (`@fhevm-template/fhe-utils`)

Utility functions for FHE operations:
- **Formatting**: Format encrypted data, addresses, timestamps, bytes, durations
- **Conversion**: Convert between hex, bytes, base64, strings, and numbers
- **Constants**: FHE data types, max values, byte sizes, timeouts, operations

## 💡 Templates & Examples

### Next.js Template

Complete Next.js 14 template with App Router:
- [templates/nextjs](./templates/nextjs)
- SDK integration with RainbowKit
- Encryption/decryption demos
- Production-ready configuration

### Example Applications

#### Next.js Complete Template (NEW)
Full-featured Next.js 13+ App Router template with comprehensive FHE integration:
- [examples/nextjs-complete-template](./examples/nextjs-complete-template)
- Complete API routes for FHE operations (encrypt, decrypt, compute, keys)
- Custom React hooks (useFHE, useEncryption, useComputation)
- Real-world examples (Banking, Medical Records)
- Full TypeScript support
- Production-ready architecture

#### Next.js FHE Demo
Basic demonstration of SDK features:
- [examples/nextjs-fhe-demo](./examples/nextjs-fhe-demo)
- Encryption demo with all data types
- Decryption workflow
- Wallet integration

#### Confidential Land Platform
Production-grade privacy-preserving urban planning platform:
- [examples/confidential-land-platform](./examples/confidential-land-platform)
- FHE-encrypted land registry
- Private urban analytics
- Role-based access control
- Smart contract integration with Solidity
- **Live Demo:** [https://land-platform-chi.vercel.app/](https://land-platform-chi.vercel.app/)

## 🎬 Video Demonstration

See `demo.mp4` for a complete walkthrough of:
- Setting up the development environment
- Deploying FHE contracts
- Building privacy-preserving UI
- Testing encrypted operations
- Wallet integration

## 📚 Documentation

Complete documentation available in the [docs](./docs) directory:

- **[Getting Started](./docs/getting-started.md)** - Installation and setup guide
- **[API Reference](./docs/api-reference.md)** - Complete API documentation
- **[Examples](./docs/examples.md)** - Real-world usage examples
- **[Deployment](./docs/deployment.md)** - Production deployment guide

### Quick Links

- [SDK Package README](./packages/fhevm-sdk/README.md)
- [Next.js Template](./templates/nextjs/README.md)
- [Zama Documentation](https://docs.zama.ai/)

## 🔧 SDK Configuration

```typescript
interface FhevmConfig {
  network: any;              // Ethereum provider
  gatewayUrl?: string;       // FHE gateway (default: 'https://gateway.zama.ai')
  aclAddress?: string;       // ACL contract address (optional)
}
```

### Environment Variables

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_FHE_GATEWAY_URL=https://gateway.zama.ai
```

## 🏗️ Development

### Building All Packages

```bash
# Build all SDK packages
npm run build:all

# Or build individually
npm run build:sdk          # Build fhe-sdk
npm run build:fhevm-sdk    # Build fhevm-sdk
npm run build:utils        # Build fhe-utils
```

### SDK Development

```bash
cd packages/fhevm-sdk

# Install dependencies
npm install

# Build SDK
npm run build

# Watch mode
npm run dev
```

### Running Examples

```bash
# Run confidential land platform
npm run dev

# Run Next.js complete template
npm run dev:nextjs

# Or run specific examples
cd examples/nextjs-complete-template
npm install
npm run dev

cd examples/nextjs-fhe-demo
npm install
npm run dev

cd examples/confidential-land-platform
npm install
npm run dev
```

### Clean Build Artifacts

```bash
# Clean all build artifacts
npm run clean
```

## 🔐 Security Best Practices

1. **Never commit private keys** - Use environment variables
2. **Validate FHE inputs** - Ensure encrypted data integrity
3. **Implement access control** - Use OpenZeppelin contracts
4. **Audit smart contracts** - Before mainnet deployment
5. **Test thoroughly** - Cover all encryption scenarios

## 🎬 Video Demonstration

See [demo.mp4](./demo.mp4) for a complete walkthrough covering:
- SDK architecture and design decisions
- Setting up the development environment
- Framework-agnostic core implementation
- React adapter usage
- Building with Next.js template
- Encryption/decryption workflow
- Production deployment

## 🛠️ Technology Stack

### SDK Packages
- **TypeScript** - Type safety and developer experience
- **fhevmjs** - Zama's official FHE library
- **Ethers.js** - Blockchain interaction

### React Integration
- **React 18** - Hooks and context API
- **TypeScript** - Full type definitions
- **Framework Agnostic Core** - Use with any React meta-framework

### Examples & Templates
- **Next.js 14** - App Router with API routes
- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **RainbowKit** - Wallet connection
- **wagmi** - Ethereum React hooks
- **Hardhat** - Smart contract development (for Land Platform)

## 🌟 Key Design Decisions

1. **Framework Agnostic Core**: Core functionality independent of any framework
2. **Adapter Pattern**: Framework-specific features in separate adapters
3. **wagmi-like API**: Familiar API for web3 developers
4. **Type Safety**: Complete TypeScript coverage
5. **Minimal Dependencies**: Only essential peer dependencies
6. **Monorepo Structure**: Organized codebase for SDK and examples

## 📖 Resources

- [Zama Documentation](https://docs.zama.ai/)
- [fhEVM Guide](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🏆 Bounty Submission

This SDK was created for the Zama FHEVM Developer Tools Bounty, providing a universal solution for building privacy-preserving applications.

### Submission Highlights

#### Core SDK (`packages/fhevm-sdk/`)
- ✅ Framework-agnostic core implementation
- ✅ React adapter with wagmi-style hooks
- ✅ Complete TypeScript support
- ✅ Encryption/decryption utilities
- ✅ Input validation and security checks
- ✅ Comprehensive documentation

#### Templates (`templates/`)
- ✅ Next.js 14 complete template
- ✅ Production-ready configuration
- ✅ SDK integration examples
- ✅ Wallet connection setup

#### Examples (`examples/`)
- ✅ Next.js FHE demo application
- ✅ Confidential Land Platform (production app)
- ✅ Real-world use cases
- ✅ Live deployment

#### Documentation (`docs/`)
- ✅ Getting started guide
- ✅ Complete API reference
- ✅ Usage examples
- ✅ Deployment guide

#### Deliverables
- ✅ Video demonstration (demo.mp4)
- ✅ GitHub repository with full history
- ✅ Live demo deployment
- ✅ Comprehensive README

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Zama FHE Technology**
