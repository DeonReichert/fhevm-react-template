# FHE React Template

A comprehensive template and example collection for building privacy-preserving decentralized applications using Zama's Fully Homomorphic Encryption (FHE) technology.

## 🎯 Overview

This template provides a production-ready foundation for developing FHE-powered dApps with React, featuring:

- **FHE Integration**: Built-in support for Zama's fhEVM
- **Modern Stack**: React 18, TypeScript, Vite
- **Wallet Support**: RainbowKit integration with multiple wallet connectors
- **Smart Contract Tools**: Hardhat development environment
- **Example Applications**: Real-world FHE use cases

## 📚 What is FHE?

Fully Homomorphic Encryption (FHE) allows computations to be performed directly on encrypted data without decryption. This enables:

- Complete data privacy during processing
- Confidential smart contract execution
- Zero-knowledge operations on blockchain
- Secure multi-party computation

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/DeonReichert/fhevm-react-template.git
cd fhevm-react-template

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your private key and RPC URL in .env
```

### Development

```bash
# Start development server
npm run dev

# Compile smart contracts
npm run compile

# Run tests
npm test

# Deploy contracts (testnet)
npm run deploy
```

## 📁 Project Structure

```
fhevm-react-template/
├── examples/                    # Example applications
│   └── confidential-land-platform/
│       ├── contracts/          # Smart contracts
│       ├── src/               # React frontend
│       ├── scripts/           # Deployment scripts
│       ├── test/              # Contract tests
│       └── README.md          # Example documentation
├── src/                       # Template source code
├── demo.mp4                   # Video demonstration
├── package.json
└── README.md
```

## 💡 Example Applications

### Confidential Land Platform

A privacy-preserving urban planning platform demonstrating:

- **FHE-Encrypted Land Registry**: Sensitive property data remains confidential
- **Private Urban Analytics**: Population density and infrastructure metrics
- **Confidential Project Evaluation**: Development proposals analyzed without data exposure
- **Role-Based Access Control**: Secure permission management

[View Full Documentation →](./examples/confidential-land-platform/README.md)

**Key Features:**
- Zone registration with encrypted attributes
- Project submission system
- Real-time encrypted metrics analysis
- Glassmorphism UI design
- Multi-wallet support

**Technology Stack:**
- Solidity + Zama fhEVM
- React 18 + TypeScript + Vite
- RainbowKit + wagmi
- Radix UI + Tailwind CSS
- Hardhat + Ethers.js

**Live Demo:** [https://land-platform-chi.vercel.app/](https://land-platform-chi.vercel.app/)

## 🎬 Video Demonstration

See `demo.mp4` for a complete walkthrough of:
- Setting up the development environment
- Deploying FHE contracts
- Building privacy-preserving UI
- Testing encrypted operations
- Wallet integration

## 🔧 Configuration

### Environment Variables

Create `.env` file with:

```env
PRIVATE_KEY=your_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
WALLETCONNECT_PROJECT_ID=your_project_id
```

### Network Configuration

Supports:
- Sepolia Testnet (default)
- Local Hardhat Network
- Custom FHE networks

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run gas report
npm run test:gas

# Test specific file
npx hardhat test test/YourContract.test.js
```

## 📦 Building

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## 🔐 Security Best Practices

1. **Never commit private keys** - Use environment variables
2. **Validate FHE inputs** - Ensure encrypted data integrity
3. **Implement access control** - Use OpenZeppelin contracts
4. **Audit smart contracts** - Before mainnet deployment
5. **Test thoroughly** - Cover all encryption scenarios

## 🛠️ Development Tools

### Smart Contracts
- Hardhat - Development environment
- OpenZeppelin - Security libraries
- Zama fhEVM - FHE functionality
- Ethers.js - Blockchain interaction

### Frontend
- Vite - Build tool
- React 18 - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- RainbowKit - Wallet integration

## 📖 Resources

- [Zama Documentation](https://docs.zama.ai/)
- [fhEVM Guide](https://docs.zama.ai/fhevm)
- [Hardhat Docs](https://hardhat.org/docs)
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

## 🏆 Competition Submission

This template was created for the Zama FHE Competition 2025, demonstrating practical applications of fully homomorphic encryption in decentralized applications.

### Submission Contents

- ✅ Complete React + FHE template
- ✅ Production-ready example application
- ✅ Comprehensive documentation
- ✅ Video demonstration (demo.mp4)
- ✅ Test coverage
- ✅ Deployment scripts

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Zama FHE Technology**
