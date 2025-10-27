'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEncrypt } from '@fhevm-template/fhevm-sdk';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function BankingExample() {
  const { address } = useAccount();
  const { encryptValue, isEncrypting } = useEncrypt();

  const [accountBalance, setAccountBalance] = useState('10000');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [result, setResult] = useState('');

  const handlePrivateTransfer = async () => {
    if (!address || !recipientAddress || !transferAmount) {
      alert('Please fill all fields and connect wallet');
      return;
    }

    try {
      // In a real implementation, this would encrypt the transfer amount
      // and call a smart contract for private transfer
      const mockContractAddress = '0x1234567890123456789012345678901234567890';

      await encryptValue({
        contractAddress: mockContractAddress,
        userAddress: address,
        value: BigInt(transferAmount),
        type: 'uint64',
      });

      setResult(`Private transfer of ${transferAmount} initiated to ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`);
    } catch (err) {
      console.error('Transfer error:', err);
    }
  };

  return (
    <Card title="Private Banking Example" subtitle="Confidential balance and transfers using FHE">
      <div className="space-y-4">
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-gray-300 text-sm mb-1">Account Balance (Encrypted)</p>
          <p className="text-white text-2xl font-bold">****</p>
          <p className="text-gray-400 text-xs mt-2">
            Your actual balance: {accountBalance} (visible only to you)
          </p>
        </div>

        <Input
          label="Recipient Address"
          placeholder="0x..."
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
        />

        <Input
          label="Transfer Amount"
          type="number"
          placeholder="Enter amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />

        <Button onClick={handlePrivateTransfer} loading={isEncrypting} disabled={!address}>
          Execute Private Transfer
        </Button>

        {result && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">{result}</p>
          </div>
        )}

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-purple-300 text-sm font-medium mb-2">Privacy Features</p>
          <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
            <li>Balance remains encrypted on-chain</li>
            <li>Transfer amounts are never exposed</li>
            <li>Only authorized parties can view balances</li>
            <li>Full auditability with privacy</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
