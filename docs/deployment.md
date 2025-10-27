# Deployment Guide

Guide for deploying applications built with the Universal FHEVM SDK.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Production Checklist](#production-checklist)
- [Network Configuration](#network-configuration)
- [Troubleshooting](#troubleshooting)

---

## Vercel Deployment

### Next.js App Deployment

1. **Prepare Your Application**

```bash
# Build locally to test
npm run build
npm run start
```

2. **Install Vercel CLI** (optional)

```bash
npm install -g vercel
```

3. **Deploy**

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

4. **Configure via Dashboard**

Visit your Vercel dashboard to:
- Add environment variables
- Configure custom domain
- Set up deployment webhooks

### Configuration Files

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID": "@walletconnect-project-id"
  }
}
```

---

## Environment Variables

### Required Variables

Create `.env.local` for development:

```env
# Wallet Connect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# FHE Gateway (optional, has default)
NEXT_PUBLIC_FHE_GATEWAY_URL=https://gateway.zama.ai

# Network Configuration (optional)
NEXT_PUBLIC_CHAIN_ID=8009
NEXT_PUBLIC_RPC_URL=https://devnet.zama.ai
```

### Vercel Environment Variables

Add in Vercel Dashboard (Settings → Environment Variables):

1. `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - Get from: https://cloud.walletconnect.com/
   - Required for wallet connection

2. `NEXT_PUBLIC_FHE_GATEWAY_URL` (optional)
   - Default: `https://gateway.zama.ai`
   - Use if you have custom gateway

### Security Best Practices

- Never commit `.env.local` to git
- Use Vercel's encrypted environment variables
- Rotate API keys regularly
- Use different keys for dev/staging/production

---

## Production Checklist

### Before Deployment

- [ ] Test build locally: `npm run build`
- [ ] Verify environment variables
- [ ] Test wallet connection
- [ ] Test encryption/decryption flows
- [ ] Check error handling
- [ ] Verify contract addresses
- [ ] Test on target network (testnet/mainnet)
- [ ] Review security practices
- [ ] Enable TypeScript strict mode
- [ ] Run linter: `npm run lint`

### Performance Optimization

```tsx
// 1. Dynamic imports for heavy components
const EncryptionDemo = dynamic(() => import('@/components/EncryptionDemo'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

// 2. Memoize expensive operations
const memoizedEncrypt = useCallback(async (value) => {
  return await encrypt(contractAddr, userAddr, { value, type: 'uint64' });
}, [encrypt, contractAddr, userAddr]);

// 3. Lazy load SDK
useEffect(() => {
  if (isClient) {
    // Initialize SDK only on client
  }
}, []);
```

### Build Optimization

```json
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['@fhevm-template/fhevm-sdk'],
  },
};
```

---

## Network Configuration

### Testnet Configuration

```typescript
// config/networks.ts
export const networks = {
  zama_devnet: {
    id: 8009,
    name: 'Zama Devnet',
    rpcUrl: 'https://devnet.zama.ai',
    blockExplorer: 'https://explorer.zama.ai',
    gatewayUrl: 'https://gateway.zama.ai',
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
};
```

### Dynamic Network Selection

```tsx
import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useNetwork, useSwitchNetwork } from 'wagmi';

function NetworkSelector() {
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { client } = useFhevm();

  const changeNetwork = async (chainId: number) => {
    // Switch wallet network
    switchNetwork?.(chainId);

    // Reinitialize SDK with new network
    await client?.reinit({
      network: window.ethereum,
      gatewayUrl: networks[chainId].gatewayUrl,
    });
  };

  return (
    <select onChange={(e) => changeNetwork(Number(e.target.value))}>
      <option value="8009">Zama Devnet</option>
      <option value="11155111">Sepolia</option>
    </select>
  );
}
```

---

## Troubleshooting

### Common Issues

#### 1. SDK Not Initializing

**Symptom:** `isReady` stays false

**Solutions:**
```tsx
// Check provider availability
useEffect(() => {
  if (typeof window.ethereum === 'undefined') {
    console.error('No Ethereum provider found');
  }
}, []);

// Add error boundary
<ErrorBoundary fallback={<ErrorMessage />}>
  <FhevmProvider client={client}>
    <App />
  </FhevmProvider>
</ErrorBoundary>
```

#### 2. Encryption Fails

**Symptom:** Encryption throws errors

**Solutions:**
```tsx
// Validate before encrypting
import { validateValueForType } from '@fhevm-template/fhevm-sdk/utils';

try {
  validateValueForType(value, 'uint64');
  const encrypted = await encrypt(...);
} catch (error) {
  console.error('Validation failed:', error);
}
```

#### 3. Build Errors

**Symptom:** Build fails with module not found

**Solutions:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

#### 4. Hydration Errors

**Symptom:** React hydration mismatch

**Solutions:**
```tsx
// Disable SSR for crypto components
import dynamic from 'next/dynamic';

const EncryptionDemo = dynamic(
  () => import('@/components/EncryptionDemo'),
  { ssr: false }
);
```

#### 5. Large Bundle Size

**Solutions:**
```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@fhevm-template/fhevm-sdk'],
  },
  webpack: (config) => {
    config.externals.push({
      'fhevmjs': 'fhevmjs',
    });
    return config;
  },
};
```

### Debug Mode

Enable detailed logging:

```typescript
// Enable in development
const client = createFhevmClient({
  network: window.ethereum,
  gatewayUrl: 'https://gateway.zama.ai',
  debug: process.env.NODE_ENV === 'development',
});
```

### Performance Monitoring

```tsx
// Add performance tracking
useEffect(() => {
  const start = performance.now();

  encrypt(contractAddr, userAddr, { value: 50000, type: 'uint64' })
    .then(() => {
      const duration = performance.now() - start;
      console.log(`Encryption took ${duration}ms`);
    });
}, []);
```

---

## Production Monitoring

### Error Tracking

Integrate with error tracking services:

```tsx
// app/providers.tsx
import * as Sentry from '@sentry/nextjs';

function Providers({ children }) {
  return (
    <ErrorBoundary
      fallback={<Error />}
      onError={(error) => {
        Sentry.captureException(error);
      }}
    >
      <FhevmProvider client={client}>
        {children}
      </FhevmProvider>
    </ErrorBoundary>
  );
}
```

### Analytics

Track SDK usage:

```tsx
import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useEffect } from 'react';

function MyComponent() {
  const { isReady } = useFhevm();

  useEffect(() => {
    if (isReady) {
      // Track SDK initialization
      analytics.track('FHEVM SDK Ready');
    }
  }, [isReady]);
}
```

---

## Deployment Platforms

### Other Platforms

#### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### Railway

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

---

## Support

For deployment issues:
- Check [Troubleshooting](#troubleshooting) section
- Review [Examples](./examples.md)
- Open an issue on [GitHub](https://github.com/DeonReichert/fhevm-react-template/issues)
