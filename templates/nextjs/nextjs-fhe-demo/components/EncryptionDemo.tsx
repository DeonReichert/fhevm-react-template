'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm-template/fhe-sdk';
import { useAccount } from 'wagmi';

export function EncryptionDemo() {
  const { encrypt, loading } = useFhevm();
  const { address } = useAccount();

  const [value, setValue] = useState('');
  const [encryptionType, setEncryptionType] = useState<'uint64' | 'bool' | 'address'>('uint64');
  const [contractAddress, setContractAddress] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleEncrypt = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!contractAddress) {
      setError('Please enter a contract address');
      return;
    }

    try {
      setError('');
      setResult(null);

      let processedValue: any = value;
      if (encryptionType === 'uint64') {
        processedValue = BigInt(value);
      } else if (encryptionType === 'bool') {
        processedValue = value.toLowerCase() === 'true';
      }

      const encrypted = await encrypt(contractAddress, address, {
        value: processedValue,
        type: encryptionType,
      });

      setResult({
        handles: Array.from(encrypted.handles[0]).slice(0, 20).join(', ') + '...',
        inputProof: Array.from(encrypted.inputProof).slice(0, 20).join(', ') + '...',
        fullHandlesLength: encrypted.handles[0].length,
        fullProofLength: encrypted.inputProof.length,
      });
    } catch (err: any) {
      setError(err.message || 'Encryption failed');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Encrypt Data with FHE</h2>

      <div className="space-y-4">
        {/* Contract Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contract Address
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Encryption Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Data Type
          </label>
          <select
            value={encryptionType}
            onChange={(e) => setEncryptionType(e.target.value as any)}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="uint64">uint64 (Number)</option>
            <option value="bool">bool (Boolean)</option>
            <option value="address">address (Ethereum Address)</option>
          </select>
        </div>

        {/* Value Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Value to Encrypt
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={
              encryptionType === 'uint64'
                ? '12345'
                : encryptionType === 'bool'
                ? 'true or false'
                : '0x...'
            }
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Encrypt Button */}
        <button
          onClick={handleEncrypt}
          disabled={loading || !value || !contractAddress}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Encrypting...' : 'Encrypt Data'}
        </button>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-300 mb-3">
              ✓ Encryption Successful
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Handles (first 20 bytes):</span>
                <p className="text-white font-mono text-xs mt-1 break-all">
                  {result.handles}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Full length: {result.fullHandlesLength} bytes
                </p>
              </div>
              <div>
                <span className="text-gray-400">Input Proof (first 20 bytes):</span>
                <p className="text-white font-mono text-xs mt-1 break-all">
                  {result.inputProof}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Full length: {result.fullProofLength} bytes
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
        <h4 className="text-blue-300 font-semibold mb-2">How it works:</h4>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Enter the contract address that will receive the encrypted data</li>
          <li>Select the data type you want to encrypt</li>
          <li>Enter the value (will be encrypted using Zama FHE)</li>
          <li>The SDK returns encrypted handles and proof for on-chain submission</li>
        </ul>
      </div>
    </div>
  );
}
