'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const BankingExample: React.FC = () => {
  const [balance, setBalance] = useState('10000');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Array<{ type: string; amount: string; time: string }>>([]);

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    if (!amount || isProcessing) return;

    setIsProcessing(true);

    // Simulate FHE transaction
    setTimeout(() => {
      const newTransaction = {
        type,
        amount,
        time: new Date().toLocaleTimeString(),
      };

      setTransactions([newTransaction, ...transactions].slice(0, 5));

      if (type === 'deposit') {
        setBalance(String(parseInt(balance) + parseInt(amount)));
      } else {
        setBalance(String(parseInt(balance) - parseInt(amount)));
      }

      setAmount('');
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <Card title="Banking Example - Private Transactions">
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Encrypted Balance</p>
          <p className="text-3xl font-bold">${balance}</p>
          <p className="text-xs opacity-75 mt-1">Balance is fully encrypted on-chain</p>
        </div>

        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleTransaction('deposit')}
            disabled={!amount || isProcessing}
            variant="primary"
          >
            {isProcessing ? 'Processing...' : 'Deposit'}
          </Button>
          <Button
            onClick={() => handleTransaction('withdraw')}
            disabled={!amount || isProcessing}
            variant="secondary"
          >
            {isProcessing ? 'Processing...' : 'Withdraw'}
          </Button>
        </div>

        {transactions.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Recent Transactions:</p>
            <div className="space-y-2">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm"
                >
                  <span className={tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                  </span>
                  <span className="text-gray-500">{tx.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
