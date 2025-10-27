# Examples

Practical examples for common use cases with the Universal FHEVM SDK.

## Table of Contents

- [Basic Encryption](#basic-encryption)
- [Decryption with Permissions](#decryption-with-permissions)
- [Batch Operations](#batch-operations)
- [Form Integration](#form-integration)
- [Contract Interaction](#contract-interaction)
- [Error Handling](#error-handling)

---

## Basic Encryption

### Simple Value Encryption

```tsx
import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useAccount } from 'wagmi';

function EncryptDemo() {
  const { encrypt, isReady } = useFhevm();
  const { address } = useAccount();

  const encryptNumber = async () => {
    const encrypted = await encrypt(
      '0xContractAddress',
      address,
      {
        value: 50000,
        type: 'uint64'
      }
    );

    console.log('Handles:', encrypted.handles);
    console.log('Proof:', encrypted.inputProof);
  };

  return (
    <button onClick={encryptNumber} disabled={!isReady}>
      Encrypt Number
    </button>
  );
}
```

### Different Data Types

```tsx
function EncryptAllTypes() {
  const { encrypt, isReady } = useFhevm();
  const { address } = useAccount();
  const contractAddress = '0x...';

  const examples = async () => {
    // Encrypt uint8
    const uint8 = await encrypt(contractAddress, address, {
      value: 255,
      type: 'uint8'
    });

    // Encrypt boolean
    const bool = await encrypt(contractAddress, address, {
      value: true,
      type: 'bool'
    });

    // Encrypt address
    const addr = await encrypt(contractAddress, address, {
      value: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      type: 'address'
    });

    // Encrypt uint64
    const uint64 = await encrypt(contractAddress, address, {
      value: BigInt('9007199254740991'),
      type: 'uint64'
    });
  };

  return <button onClick={examples}>Encrypt Examples</button>;
}
```

---

## Decryption with Permissions

### Basic Decryption

```tsx
import { useDecrypt } from '@fhevm-template/fhevm-sdk';

function DecryptDemo() {
  const { decryptValue, isDecrypting, decryptedData } = useDecrypt();

  const decrypt = async (handle: Uint8Array) => {
    const result = await decryptValue({
      contractAddress: '0x...',
      handle: handle
    });

    console.log('Decrypted:', result.toString());
  };

  return (
    <div>
      {isDecrypting && <p>Decrypting...</p>}
      {decryptedData && <p>Result: {decryptedData.toString()}</p>}
    </div>
  );
}
```

---

## Batch Operations

### Encrypting Multiple Values

```tsx
import { encryptBatch } from '@fhevm-template/fhevm-sdk/utils';
import { useFhevmContext } from '@fhevm-template/fhevm-sdk';

function BatchEncrypt() {
  const { client } = useFhevmContext();
  const { address } = useAccount();

  const encryptMultiple = async () => {
    const encrypted = await encryptBatch(client!, {
      contractAddress: '0x...',
      userAddress: address!,
      values: [
        { value: 50000, type: 'uint64' },
        { value: 10000, type: 'uint64' },
        { value: true, type: 'bool' },
        { value: false, type: 'bool' }
      ]
    });

    // All values encrypted in one operation
    console.log('Batch encrypted:', encrypted);
  };

  return <button onClick={encryptMultiple}>Batch Encrypt</button>;
}
```

---

## Form Integration

### Encrypted Form Submission

```tsx
import { useState } from 'react';
import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useAccount } from 'wagmi';
import { useContractWrite } from 'wagmi';

function EncryptedForm() {
  const { encrypt, isReady } = useFhevm();
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const { write: submitToContract } = useContractWrite({
    address: '0xContractAddress',
    abi: contractABI,
    functionName: 'submitEncryptedValue'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Encrypt the value
      const encrypted = await encrypt(
        '0xContractAddress',
        address!,
        {
          value: Number(amount),
          type: 'uint64'
        }
      );

      // Submit to contract
      submitToContract({
        args: [encrypted.handles, encrypted.inputProof]
      });

      setAmount('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <button
        type="submit"
        disabled={!isReady || loading}
      >
        {loading ? 'Processing...' : 'Submit Encrypted'}
      </button>
    </form>
  );
}
```

### Multi-field Form

```tsx
function MultiFieldForm() {
  const { encrypt } = useFhevm();
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    age: '',
    salary: '',
    isActive: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Encrypt all fields
    const encryptedAge = await encrypt(contractAddr, address!, {
      value: Number(formData.age),
      type: 'uint8'
    });

    const encryptedSalary = await encrypt(contractAddr, address!, {
      value: Number(formData.salary),
      type: 'uint64'
    });

    const encryptedStatus = await encrypt(contractAddr, address!, {
      value: formData.isActive,
      type: 'bool'
    });

    // Submit all encrypted values
    await submitToContract([
      encryptedAge,
      encryptedSalary,
      encryptedStatus
    ]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={formData.age}
        onChange={(e) => setFormData({...formData, age: e.target.value})}
        placeholder="Age"
      />
      <input
        type="number"
        value={formData.salary}
        onChange={(e) => setFormData({...formData, salary: e.target.value})}
        placeholder="Salary"
      />
      <label>
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
        />
        Active
      </label>
      <button type="submit">Submit Encrypted Data</button>
    </form>
  );
}
```

---

## Contract Interaction

### Reading Encrypted Values

```tsx
import { useContractRead, useContractWrite } from 'wagmi';
import { useDecrypt } from '@fhevm-template/fhevm-sdk';

function ReadEncryptedBalance() {
  const { decryptValue } = useDecrypt();
  const [balance, setBalance] = useState<string>('');

  const { data: encryptedBalance } = useContractRead({
    address: '0xContractAddress',
    abi: contractABI,
    functionName: 'getEncryptedBalance'
  });

  const decryptBalance = async () => {
    if (!encryptedBalance) return;

    const decrypted = await decryptValue({
      contractAddress: '0xContractAddress',
      handle: encryptedBalance as Uint8Array
    });

    setBalance(decrypted.toString());
  };

  return (
    <div>
      <button onClick={decryptBalance}>Decrypt Balance</button>
      {balance && <p>Balance: {balance}</p>}
    </div>
  );
}
```

### Writing Encrypted Values

```tsx
function WriteEncryptedValue() {
  const { encrypt } = useFhevm();
  const { address } = useAccount();
  const { write } = useContractWrite({
    address: '0xContractAddress',
    abi: contractABI,
    functionName: 'storeEncryptedValue'
  });

  const storeValue = async (value: number) => {
    const encrypted = await encrypt('0xContractAddress', address!, {
      value: value,
      type: 'uint64'
    });

    write({
      args: [encrypted.handles, encrypted.inputProof]
    });
  };

  return (
    <button onClick={() => storeValue(50000)}>
      Store Encrypted Value
    </button>
  );
}
```

---

## Error Handling

### Comprehensive Error Handling

```tsx
function RobustEncryption() {
  const { encrypt, isReady } = useFhevm();
  const { address, isConnected } = useAccount();
  const [error, setError] = useState<string>('');

  const safeEncrypt = async (value: number) => {
    setError('');

    // Check wallet connection
    if (!isConnected) {
      setError('Please connect your wallet');
      return;
    }

    // Check SDK ready
    if (!isReady) {
      setError('SDK is initializing, please wait');
      return;
    }

    try {
      // Validate input
      if (value < 0 || value > Number.MAX_SAFE_INTEGER) {
        throw new Error('Value out of range');
      }

      const encrypted = await encrypt(
        '0xContractAddress',
        address!,
        {
          value: value,
          type: 'uint64'
        }
      );

      console.log('Success:', encrypted);
    } catch (err: any) {
      if (err.message.includes('User denied')) {
        setError('Transaction was rejected');
      } else if (err.message.includes('network')) {
        setError('Network error, please try again');
      } else {
        setError(`Encryption failed: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <button onClick={() => safeEncrypt(50000)}>
        Encrypt with Error Handling
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
```

### Validation Before Encryption

```tsx
import { validateValueForType, validateContractAddress } from '@fhevm-template/fhevm-sdk/utils';

function ValidatedEncryption() {
  const { encrypt } = useFhevm();

  const encryptWithValidation = async (
    contract: string,
    user: string,
    value: any,
    type: any
  ) => {
    try {
      // Validate contract address
      validateContractAddress(contract);

      // Validate value for type
      validateValueForType(value, type);

      // Proceed with encryption
      const encrypted = await encrypt(contract, user, { value, type });

      return encrypted;
    } catch (error: any) {
      console.error('Validation failed:', error.message);
      throw error;
    }
  };
}
```

---

## Complete Example App

```tsx
// Complete functional component
'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useAccount, useContractWrite } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function EncryptedVotingApp() {
  const { encrypt, isReady, loading } = useFhevm();
  const { address, isConnected } = useAccount();
  const [vote, setVote] = useState<number>(0);
  const [status, setStatus] = useState<string>('');

  const { write: submitVote } = useContractWrite({
    address: '0xVotingContract',
    abi: votingABI,
    functionName: 'castEncryptedVote'
  });

  const handleVote = async (voteValue: number) => {
    if (!isConnected || !isReady) return;

    setStatus('Encrypting vote...');
    try {
      const encrypted = await encrypt(
        '0xVotingContract',
        address!,
        {
          value: voteValue,
          type: 'uint8'
        }
      );

      setStatus('Submitting to blockchain...');
      submitVote({
        args: [encrypted.handles, encrypted.inputProof]
      });

      setStatus('Vote submitted successfully!');
      setVote(voteValue);
    } catch (error) {
      setStatus('Error: ' + (error as Error).message);
    }
  };

  return (
    <div className="container">
      <h1>Encrypted Voting</h1>

      <ConnectButton />

      {isConnected && (
        <div className="voting-panel">
          <p>SDK Status: {isReady ? '✓ Ready' : 'Initializing...'}</p>

          <div className="options">
            <button
              onClick={() => handleVote(1)}
              disabled={!isReady || loading}
            >
              Vote Option 1
            </button>
            <button
              onClick={() => handleVote(2)}
              disabled={!isReady || loading}
            >
              Vote Option 2
            </button>
          </div>

          {status && <p className="status">{status}</p>}
          {vote > 0 && <p>Your encrypted vote: {vote}</p>}
        </div>
      )}
    </div>
  );
}
```

---

For more examples, see the [templates](../templates) directory.
