# Confidential Land Platform

Privacy-Preserving Urban Planning Platform with Fully Homomorphic Encryption (FHE)

## Overview

A decentralized application that enables confidential land registry and urban planning using Zama's FHE technology. This platform allows stakeholders to register zones, submit development projects, and analyze urban metrics while maintaining complete data privacy.

## Key Features

### 🔒 Privacy-First Architecture
- All sensitive land data encrypted using FHE
- Zero-knowledge proofs for verification
- Complete confidentiality during computations

### 🏙️ Urban Planning Tools
- Zone registration with encrypted attributes
- Project submission and evaluation
- Real-time metrics analysis
- Collaborative planning without data exposure

### 📊 Analytics
- Encrypted population density calculations
- Private infrastructure capacity analysis
- Confidential environmental impact assessment

## Technology Stack

- **Smart Contracts**: Solidity + Zama fhEVM
- **Frontend**: React 18 + TypeScript + Vite
- **Wallet Integration**: RainbowKit + wagmi
- **UI Components**: Radix UI + Tailwind CSS
- **Blockchain**: Sepolia Testnet

## Smart Contract Architecture

### ConfidentialLandPlatform.sol

Main contract implementing:
- Zone registration with FHE-encrypted properties
- Project submission system
- Metrics update mechanism
- Role-based access control

```solidity
struct Zone {
    euint64 populationDensity;
    euint64 infraCapacity;
    euint64 envImpactScore;
    bool registered;
}
```

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Set your private key and RPC URL
3. Configure WalletConnect project ID

## Deployment

```bash
# Compile contracts
npm run compile

# Deploy to Sepolia
npm run deploy

# Run tests
npm test
```

## Usage

### Register a Zone

```typescript
const tx = await contract.registerZone(
  zoneId,
  encryptedPopDensity,
  encryptedInfraCapacity,
  encryptedEnvScore
);
```

### Submit Project

```typescript
const tx = await contract.submitProject(
  zoneId,
  projectId,
  encryptedImpactScore
);
```

## Frontend Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Security Features

- FHE-encrypted data storage
- Access control via OpenZeppelin
- Input validation
- Event logging for transparency

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run gas report
npm run test:gas
```

## Project Structure

```
confidential-land-platform/
├── contracts/              # Solidity smart contracts
│   └── ConfidentialLandPlatform.sol
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── lib/              # Utilities & config
│   └── App.tsx           # Main application
├── scripts/              # Deployment scripts
└── test/                 # Contract tests
```

## Live Demo

Visit: [Deployed URL]

## License

MIT

## Contributors

Built for Zama FHE Competition 2025
