'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function ComputationDemo() {
  const { address } = useAccount();
  const { isReady } = useFhevm();

  const [contractAddress, setContractAddress] = useState('');
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'gt' | 'lt' | 'eq'>('add');
  const [result, setResult] = useState<string>('');
  const [isComputing, setIsComputing] = useState(false);

  const handleCompute = async () => {
    if (!address || !contractAddress) {
      alert('Please connect wallet and enter contract address');
      return;
    }

    setIsComputing(true);
    try {
      // Note: In a real implementation, this would call a smart contract
      // that performs the computation on encrypted data
      const mockResult = `Computation ${operation}(${operand1}, ${operand2}) submitted to contract`;
      setResult(mockResult);
    } catch (err) {
      console.error('Computation error:', err);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <Card title="Homomorphic Computation Demo" subtitle="Perform computations on encrypted data">
      <div className="space-y-4">
        <Input
          label="Contract Address"
          placeholder="0x..."
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Operation
          </label>
          <select
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={operation}
            onChange={(e) => setOperation(e.target.value as any)}
          >
            <option value="add">Addition (+)</option>
            <option value="sub">Subtraction (-)</option>
            <option value="mul">Multiplication (*)</option>
            <option value="gt">Greater Than (&gt;)</option>
            <option value="lt">Less Than (&lt;)</option>
            <option value="eq">Equal (==)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Encrypted Operand 1"
            placeholder="Handle 1"
            value={operand1}
            onChange={(e) => setOperand1(e.target.value)}
          />
          <Input
            label="Encrypted Operand 2"
            placeholder="Handle 2"
            value={operand2}
            onChange={(e) => setOperand2(e.target.value)}
          />
        </div>

        <Button onClick={handleCompute} loading={isComputing} disabled={!address || !isReady}>
          Perform Computation
        </Button>

        {result && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm font-medium mb-2">Computation Result:</p>
            <p className="text-gray-300 text-sm">{result}</p>
            <p className="text-gray-400 text-xs mt-2">
              Note: The result remains encrypted on-chain and can only be decrypted with proper authorization.
            </p>
          </div>
        )}

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-purple-300 text-sm font-medium mb-2">About Homomorphic Computation</p>
          <p className="text-gray-400 text-xs">
            FHE allows mathematical operations to be performed directly on encrypted data.
            The computation happens without ever decrypting the values, maintaining complete privacy.
          </p>
        </div>
      </div>
    </Card>
  );
}
