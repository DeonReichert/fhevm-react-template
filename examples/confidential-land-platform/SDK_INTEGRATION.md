# fhevmjs SDK Integration Guide

This example demonstrates how to integrate Zama's fhevmjs SDK for Fully Homomorphic Encryption in a React application.

## SDK Installation

The fhevmjs SDK is included in the project dependencies:

```json
{
  "dependencies": {
    "fhevmjs": "^0.5.0",
    "@fhevm/solidity": "^0.9.0-1"
  }
}
```

## SDK Usage in This Example

### 1. Initialization

The SDK is initialized when connecting to the contract:

```typescript
// src/lib/contract.ts
import { createInstance } from 'fhevmjs';

export const initFhevm = async (provider, contractAddress) => {
  const instance = await createInstance({
    network: window.ethereum,
    gatewayUrl: 'https://gateway.zama.ai',
  });
  return instance;
};
```

### 2. Data Encryption

Before sending data to the smart contract, encrypt it using fhevmjs:

```typescript
// Example: Encrypting zone population density
import { createInstance } from 'fhevmjs';

async function encryptZoneData(populationDensity: number) {
  const instance = await createInstance({
    network: window.ethereum,
    gatewayUrl: 'https://gateway.zama.ai',
  });

  // Create EIP-712 compatible input
  const input = instance.createEncryptedInput(
    contractAddress,
    userAddress
  );

  // Add encrypted values
  input.add64(populationDensity); // euint64

  // Generate encrypted input
  const encryptedData = await input.encrypt();
  
  return {
    handles: encryptedData.handles,
    inputProof: encryptedData.inputProof,
  };
}
```

### 3. Smart Contract Integration

The encrypted data is sent to Solidity contracts using fhEVM types:

```solidity
// contracts/ConfidentialLandPlatform.sol
import "fhevm/lib/TFHE.sol";

contract ConfidentialLandPlatform {
    struct Zone {
        euint64 populationDensity;  // FHE-encrypted uint64
        euint64 infraCapacity;
        euint64 envImpactScore;
        bool registered;
    }

    function registerZone(
        uint256 zoneId,
        einput encryptedPopDensity,
        einput encryptedInfraCapacity,
        einput encryptedEnvScore,
        bytes calldata inputProof
    ) public {
        // Convert einput to euint64
        euint64 popDensity = TFHE.asEuint64(encryptedPopDensity, inputProof);
        euint64 infraCap = TFHE.asEuint64(encryptedInfraCapacity, inputProof);
        euint64 envScore = TFHE.asEuint64(encryptedEnvScore, inputProof);
        
        zones[zoneId] = Zone({
            populationDensity: popDensity,
            infraCapacity: infraCap,
            envImpactScore: envScore,
            registered: true
        });
    }
}
```

### 4. React Component Usage

In React components, use the SDK for encrypting user input:

```typescript
// src/components/RegisterZoneForm.tsx
import { useState } from 'react';
import { createInstance } from 'fhevmjs';
import { useAccount, useWriteContract } from 'wagmi';

export function RegisterZoneForm() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const handleRegister = async (formData) => {
    // 1. Initialize fhevmjs
    const instance = await createInstance({
      network: window.ethereum,
      gatewayUrl: 'https://gateway.zama.ai',
    });

    // 2. Create encrypted input
    const input = instance.createEncryptedInput(
      CONTRACT_ADDRESS,
      address
    );

    // 3. Add encrypted values
    input.add64(formData.populationDensity);
    input.add64(formData.infraCapacity);
    input.add64(formData.envImpactScore);

    // 4. Encrypt
    const encryptedData = await input.encrypt();

    // 5. Send to contract
    await writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'registerZone',
      args: [
        formData.zoneId,
        encryptedData.handles[0],
        encryptedData.handles[1],
        encryptedData.handles[2],
        encryptedData.inputProof,
      ],
    });
  };

  return (
    <form onSubmit={handleRegister}>
      {/* Form fields */}
    </form>
  );
}
```

## SDK Features Used

### ✅ Encryption Features
- **euint64** - 64-bit encrypted integers for large numbers
- **createEncryptedInput()** - Create encrypted input data
- **add64()** - Add 64-bit encrypted values
- **encrypt()** - Generate encrypted payload with proof

### ✅ Decryption (View Functions)
```typescript
// Request decryption permission
await instance.requestDecryption({
  contractAddress: CONTRACT_ADDRESS,
  userAddress: address,
});

// Decrypt values (requires permission)
const decryptedValue = await instance.decrypt(
  CONTRACT_ADDRESS,
  encryptedHandle
);
```

### ✅ Gateway Integration
The SDK connects to Zama's gateway for:
- Key management
- Proof generation
- Decryption requests
- Network verification

## Key Files

### Smart Contract
**File:** `contracts/ConfidentialLandPlatform.sol`
- Uses `TFHE.sol` library
- Implements FHE operations
- Stores encrypted data

### Frontend Integration
**Files:**
- `src/lib/contract.ts` - Contract interaction utilities
- `src/components/RegisterZoneForm.tsx` - Encryption example
- `src/components/SubmitProjectForm.tsx` - Encryption example
- `src/components/UpdateMetricsForm.tsx` - Encryption example

### Configuration
**File:** `hardhat.config.cjs`
- fhEVM network configuration
- Deployment settings

## Testing FHE Operations

```typescript
// test/ConfidentialLandPlatform.test.js
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { createInstance } from 'fhevmjs';

describe('ConfidentialLandPlatform', function() {
  it('should encrypt and register zone data', async function() {
    const [owner] = await ethers.getSigners();
    const contract = await ethers.deployContract('ConfidentialLandPlatform');

    // Initialize fhevmjs
    const instance = await createInstance({
      network: window.ethereum,
      gatewayUrl: 'https://gateway.zama.ai',
    });

    // Encrypt data
    const input = instance.createEncryptedInput(
      await contract.getAddress(),
      owner.address
    );
    input.add64(50000); // Population density
    input.add64(10000); // Infrastructure capacity
    input.add64(85);    // Environment score

    const encrypted = await input.encrypt();

    // Register zone
    await contract.registerZone(
      1,
      encrypted.handles[0],
      encrypted.handles[1],
      encrypted.handles[2],
      encrypted.inputProof
    );

    // Verify registration
    const zone = await contract.zones(1);
    expect(zone.registered).to.be.true;
  });
});
```

## Security Considerations

### ✅ Best Practices Applied

1. **Input Validation**
   - Validate data before encryption
   - Check ranges and constraints

2. **Access Control**
   - Only authorized users can decrypt
   - Role-based permissions in contract

3. **Key Management**
   - Keys managed by Zama gateway
   - No private keys in frontend

4. **Proof Verification**
   - All encrypted inputs include proofs
   - Verified on-chain by fhEVM

## Performance Notes

- **Encryption Time:** ~100-500ms per operation
- **Gas Costs:** Higher than standard transactions due to FHE proofs
- **Network:** Requires Sepolia testnet or fhEVM-compatible network

## Additional Resources

- **Zama Docs:** https://docs.zama.ai/
- **fhevmjs GitHub:** https://github.com/zama-ai/fhevmjs
- **fhEVM Solidity:** https://github.com/zama-ai/fhevm

## Live Demo

Experience the SDK integration in action:
**URL:** https://land-platform-chi.vercel.app/

Try:
1. Connect your wallet
2. Register a zone with encrypted data
3. View that data remains private
4. Submit projects with confidential metrics

---

**This example demonstrates production-ready FHE integration using fhevmjs SDK.**
