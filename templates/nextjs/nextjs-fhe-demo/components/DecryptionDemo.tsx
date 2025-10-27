'use client';

import { useState } from 'react';
import { useFhevm } from '@fhevm-template/fhe-sdk';
import { useAccount } from 'wagmi';

export function DecryptionDemo() {
  const { decrypt, loading } = useFhevm();
  const { address } = useAccount();

  const [handle, setHandle] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [decryptionType, setDecryptionType] = useState<'uint64' | 'bool' | 'address'>('uint64');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleDecrypt = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    if (!contractAddress) {
      setError('Please enter a contract address');
      return;
    }

    if (!handle) {
      setError('Please enter a ciphertext handle');
      return;
    }

    try {
      setError('');
      setResult(null);

      const decrypted = await decrypt(contractAddress, address, handle);

      // Format result based on type
      let formattedValue = decrypted.toString();
      if (decryptionType === 'bool') {
        formattedValue = decrypted === 1n || decrypted === true ? 'true' : 'false';
      } else if (decryptionType === 'address') {
        formattedValue = `0x${decrypted.toString(16).padStart(40, '0')}`;
      }

      setResult({
        raw: decrypted.toString(),
        formatted: formattedValue,
        type: decryptionType,
      });
    } catch (err: any) {
      setError(err.message || 'Decryption failed');
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6">Decrypt FHE Data</h2>

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

        {/* Decryption Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Expected Data Type
          </label>
          <select
            value={decryptionType}
            onChange={(e) => setDecryptionType(e.target.value as any)}
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="uint64">uint64 (Number)</option>
            <option value="bool">bool (Boolean)</option>
            <option value="address">address (Ethereum Address)</option>
          </select>
        </div>

        {/* Ciphertext Handle */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ciphertext Handle
          </label>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="Enter ciphertext handle from contract"
            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            This is the encrypted handle returned from the smart contract
          </p>
        </div>

        {/* Decrypt Button */}
        <button
          onClick={handleDecrypt}
          disabled={loading || !handle || !contractAddress}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {loading ? 'Decrypting...' : 'Decrypt Data'}
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
              ✓ Decryption Successful
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Decrypted Value:</span>
                <p className="text-white font-mono text-xl mt-1">
                  {result.formatted}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Raw Value:</span>
                <p className="text-white font-mono text-sm mt-1">
                  {result.raw}
                </p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Type:</span>
                <p className="text-white font-mono text-sm mt-1">
                  {result.type}
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
          <li>Get the ciphertext handle from your smart contract</li>
          <li>Select the expected data type of the encrypted value</li>
          <li>The SDK will request decryption permission from the gateway</li>
          <li>Returns the decrypted value if you have permission</li>
        </ul>
      </div>
    </div>
  );
}
