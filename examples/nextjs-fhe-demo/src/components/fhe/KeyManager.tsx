'use client';

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function KeyManager() {
  const [keyStatus, setKeyStatus] = useState<'not-generated' | 'generating' | 'generated'>('not-generated');

  const handleGenerateKeys = async () => {
    setKeyStatus('generating');
    // Simulate key generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setKeyStatus('generated');
  };

  return (
    <Card title="Key Manager" subtitle="Manage FHE encryption keys">
      <div className="space-y-4">
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Key Status</p>
              <p className="text-gray-400 text-sm">
                {keyStatus === 'not-generated' && 'No keys generated'}
                {keyStatus === 'generating' && 'Generating keys...'}
                {keyStatus === 'generated' && 'Keys are ready'}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              keyStatus === 'generated' ? 'bg-green-500' :
              keyStatus === 'generating' ? 'bg-yellow-500 animate-pulse' :
              'bg-gray-500'
            }`} />
          </div>
        </div>

        <Button
          onClick={handleGenerateKeys}
          loading={keyStatus === 'generating'}
          disabled={keyStatus === 'generated'}
        >
          {keyStatus === 'generated' ? 'Keys Generated' : 'Generate Keys'}
        </Button>

        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm font-medium mb-2">About FHE Keys</p>
          <p className="text-gray-400 text-xs">
            FHE keys are automatically managed by the FHEVM SDK. The SDK handles key generation,
            storage, and lifecycle management securely.
          </p>
        </div>
      </div>
    </Card>
  );
}
