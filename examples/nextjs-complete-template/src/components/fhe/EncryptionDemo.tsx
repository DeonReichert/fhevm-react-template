'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEncryption } from '@/hooks/useEncryption';

export const EncryptionDemo: React.FC = () => {
  const [value, setValue] = useState('');
  const [type, setType] = useState('uint32');
  const { encrypt, isEncrypting, encryptedData, error } = useEncryption();

  const handleEncrypt = async () => {
    if (!value) return;

    await encrypt({
      value: parseInt(value),
      type,
      contractAddress: '0x0000000000000000000000000000000000000000',
      userAddress: '0x0000000000000000000000000000000000000000',
    });
  };

  return (
    <Card title="Encryption Demo">
      <div className="space-y-4">
        <Input
          label="Value to Encrypt"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a number"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Type
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="uint8">uint8</option>
            <option value="uint16">uint16</option>
            <option value="uint32">uint32</option>
            <option value="uint64">uint64</option>
          </select>
        </div>

        <Button
          onClick={handleEncrypt}
          disabled={!value || isEncrypting}
          className="w-full"
        >
          {isEncrypting ? 'Encrypting...' : 'Encrypt Value'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {encryptedData && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-1">Encrypted Data:</p>
            <p className="text-xs text-green-600 break-all font-mono">
              {JSON.stringify(encryptedData, null, 2)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
