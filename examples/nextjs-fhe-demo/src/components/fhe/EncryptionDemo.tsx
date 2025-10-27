'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEncrypt } from '@fhevm-template/fhevm-sdk';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function EncryptionDemo() {
  const { address } = useAccount();
  const { encryptValue, isEncrypting, encryptedData, error, reset } = useEncrypt();

  const [contractAddress, setContractAddress] = useState('');
  const [value, setValue] = useState('');
  const [encryptionType, setEncryptionType] = useState<'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'>('uint64');

  const handleEncrypt = async () => {
    if (!address || !contractAddress) {
      alert('Please connect wallet and enter contract address');
      return;
    }

    try {
      let processedValue: number | bigint | boolean | string;

      if (encryptionType === 'bool') {
        processedValue = value.toLowerCase() === 'true';
      } else if (encryptionType === 'address') {
        processedValue = value;
      } else {
        processedValue = BigInt(value);
      }

      await encryptValue({
        contractAddress,
        userAddress: address,
        value: processedValue,
        type: encryptionType,
      });
    } catch (err) {
      console.error('Encryption error:', err);
    }
  };

  return (
    <Card title="Encryption Demo" subtitle="Encrypt data using FHE">
      <div className="space-y-4">
        <Input
          label="Contract Address"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Encryption Type
          </label>
          <select
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={encryptionType}
            onChange={(e) => setEncryptionType(e.target.value as any)}
          >
            <option value="uint8">uint8</option>
            <option value="uint16">uint16</option>
            <option value="uint32">uint32</option>
            <option value="uint64">uint64</option>
            <option value="bool">bool</option>
            <option value="address">address</option>
          </select>
        </div>

        <Input
          label="Value to Encrypt"
          placeholder={encryptionType === 'bool' ? 'true/false' : encryptionType === 'address' ? '0x...' : 'Enter number'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className="flex gap-3">
          <Button onClick={handleEncrypt} loading={isEncrypting} disabled={!address}>
            Encrypt Value
          </Button>
          <Button onClick={reset} variant="outline">
            Reset
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error.message}</p>
          </div>
        )}

        {encryptedData && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm font-medium mb-2">Encryption Successful!</p>
            <div className="space-y-2">
              <div>
                <p className="text-gray-300 text-xs mb-1">Handles:</p>
                <pre className="text-gray-400 text-xs overflow-x-auto bg-black/20 p-2 rounded">
                  {JSON.stringify(encryptedData.handles, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-gray-300 text-xs mb-1">Input Proof:</p>
                <pre className="text-gray-400 text-xs overflow-x-auto bg-black/20 p-2 rounded break-all">
                  {encryptedData.inputProof}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
