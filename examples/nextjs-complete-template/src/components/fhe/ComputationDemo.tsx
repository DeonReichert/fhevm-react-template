'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useComputation } from '@/hooks/useComputation';

export const ComputationDemo: React.FC = () => {
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState('add');
  const { compute, isComputing, result, error } = useComputation();

  const handleCompute = async () => {
    if (!operand1 || !operand2) return;

    await compute({
      operation,
      operands: [parseInt(operand1), parseInt(operand2)],
      contractAddress: '0x0000000000000000000000000000000000000000',
    });
  };

  return (
    <Card title="Homomorphic Computation">
      <div className="space-y-4">
        <Input
          label="First Operand"
          type="number"
          value={operand1}
          onChange={(e) => setOperand1(e.target.value)}
          placeholder="Enter first number"
        />

        <Input
          label="Second Operand"
          type="number"
          value={operand2}
          onChange={(e) => setOperand2(e.target.value)}
          placeholder="Enter second number"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operation
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
          >
            <option value="add">Addition</option>
            <option value="subtract">Subtraction</option>
            <option value="multiply">Multiplication</option>
            <option value="compare">Comparison</option>
          </select>
        </div>

        <Button
          onClick={handleCompute}
          disabled={!operand1 || !operand2 || isComputing}
          className="w-full"
        >
          {isComputing ? 'Computing...' : 'Compute'}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-800 mb-1">Computation Result:</p>
            <p className="text-xs text-blue-600 break-all font-mono">
              {JSON.stringify(result, null, 2)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
