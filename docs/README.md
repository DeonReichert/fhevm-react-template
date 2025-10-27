# Universal FHEVM SDK Documentation

Complete documentation for the Universal FHEVM SDK.

## Table of Contents

- [Getting Started](./getting-started.md)
- [API Reference](./api-reference.md)
- [Architecture](./architecture.md)
- [Examples](./examples.md)
- [Deployment Guide](./deployment.md)

## Overview

The Universal FHEVM SDK is a framework-agnostic solution for building privacy-preserving applications using Zama's Fully Homomorphic Encryption technology.

### Key Features

- **Framework Agnostic**: Core functionality works with any JavaScript framework
- **React Adapter**: Pre-built hooks and providers for React/Next.js
- **Simple API**: wagmi-inspired design for ease of use
- **Type Safe**: Complete TypeScript support
- **Production Ready**: Tested and optimized for real-world use

### Quick Links

- [Installation Guide](./getting-started.md#installation)
- [React Integration](./getting-started.md#react-integration)
- [API Documentation](./api-reference.md)
- [Example Projects](./examples.md)

## Design Philosophy

The SDK is built on three core principles:

1. **Simplicity**: Less than 10 lines of code to get started
2. **Flexibility**: Works with any framework or no framework at all
3. **Safety**: Type-safe operations with comprehensive validation

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  (React, Vue, Next.js, Node.js)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Framework Adapters                 │
│   (React Hooks, Vue Composables)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Core SDK                        │
│  (Framework-agnostic operations)       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          fhevmjs                        │
│    (Zama's FHE library)                │
└─────────────────────────────────────────┘
```

## Support

For issues, questions, or contributions, please visit:
- GitHub Repository: [fhevm-react-template](https://github.com/DeonReichert/fhevm-react-template)
- Zama Documentation: [docs.zama.ai](https://docs.zama.ai/)

## License

MIT License - See [LICENSE](../LICENSE) for details
