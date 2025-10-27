'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFHE } from '@/hooks/useFHE';

export const KeyManager: React.FC = () => {
  const { publicKey, isReady, error, refresh } = useFHE();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  return (
    <Card title="Key Management">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">FHE Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isReady
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {isReady ? 'Ready' : 'Initializing'}
          </span>
        </div>

        {publicKey && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Public Key:</p>
            <p className="text-xs text-gray-600 break-all font-mono">
              {publicKey}
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="secondary"
          className="w-full"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Keys'}
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>Gateway: {process.env.NEXT_PUBLIC_FHE_GATEWAY_URL || 'Default'}</p>
          <p>Network: {process.env.NEXT_PUBLIC_NETWORK || 'Development'}</p>
        </div>
      </div>
    </Card>
  );
};
