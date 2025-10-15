import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import { useContractWrite } from '../hooks/useContract';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from './LoadingSpinner';

interface MetricsData {
  zoneId: number;
  densityIndex: number;
  trafficVolume: number;
  greenSpaceRatio: number;
  infrastructureScore: number;
}

export function UpdateMetricsForm() {
  const { address } = useAccount();
  const { showToast } = useToast();
  const { addTransaction, updateTransactionStatus } = useTransactions();
  const { writeContractAsync, isPending, isConfirming } = useContractWrite();

  const [formData, setFormData] = useState<MetricsData>({
    zoneId: 1,
    densityIndex: 0,
    trafficVolume: 0,
    greenSpaceRatio: 0,
    infrastructureScore: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!formData.densityIndex || !formData.trafficVolume || !formData.zoneId) {
      showToast('Please fill in all required fields', undefined, 'warning');
      return;
    }

    if (formData.greenSpaceRatio > 100 || formData.infrastructureScore > 100) {
      showToast('Percentage scores must be between 0-100', undefined, 'warning');
      return;
    }

    try {
      console.log('🚀 Submitting metrics update...');
      console.log('📝 Metrics data:', formData);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'updateDevelopmentMetrics',
        args: [
          BigInt(formData.zoneId),
          formData.densityIndex,
          formData.trafficVolume,
          formData.greenSpaceRatio,
          formData.infrastructureScore,
        ],
        gas: BigInt(5000000),
      });

      console.log('✅ Transaction hash:', hash);

      if (hash) {
        addTransaction({
          hash,
          type: 'update',
          timestamp: Date.now(),
          status: 'pending',
          description: `Update Metrics for Zone ${formData.zoneId}`,
        });

        showToast(
          'Metrics Update Submitted',
          'Please wait for transaction confirmation',
          'info'
        );

        setFormData({
          zoneId: 1,
          densityIndex: 0,
          trafficVolume: 0,
          greenSpaceRatio: 0,
          infrastructureScore: 0,
        });

        setTimeout(() => {
          updateTransactionStatus(hash, 'success');
          showToast('Metrics Updated Successfully!', 'Development metrics have been updated', 'success');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('❌ Metrics update error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.reason?.includes('Not authorized planner')) {
          errorMessage = 'You must be an authorized planner to update metrics';
          showToast('Authorization Required', errorMessage, 'warning');
          return;
        }
        if (err.reason?.includes('Zone not registered')) {
          errorMessage = 'The zone ID does not exist';
          showToast('Invalid Zone ID', errorMessage, 'warning');
          return;
        }
      }

      showToast('Update Failed', errorMessage, 'error');
    }
  };

  const isLoading = isPending || isConfirming;

  return (
    <form onSubmit={handleSubmit} className="panel animate-slideIn" style={{ padding: '1.5rem' }}>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--color-text)' }}>
          📊 Update Development Metrics
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Track development indicators with encrypted density, traffic, and infrastructure data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="label">Zone ID</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 1"
            min="1"
            value={formData.zoneId || ''}
            onChange={(e) => setFormData({ ...formData, zoneId: Number(e.target.value) })}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label">Density Index</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 850"
            value={formData.densityIndex || ''}
            onChange={(e) => setFormData({ ...formData, densityIndex: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Development density index (encrypted)
          </p>
        </div>

        <div>
          <label className="label">Traffic Volume</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 5000"
            value={formData.trafficVolume || ''}
            onChange={(e) => setFormData({ ...formData, trafficVolume: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Daily traffic volume (encrypted)
          </p>
        </div>

        <div>
          <label className="label">Green Space Ratio (0-100)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 35"
            min="0"
            max="100"
            value={formData.greenSpaceRatio || ''}
            onChange={(e) => setFormData({ ...formData, greenSpaceRatio: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Percentage of green space (encrypted)
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="label">Infrastructure Score (0-100)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 78"
            min="0"
            max="100"
            value={formData.infrastructureScore || ''}
            onChange={(e) => setFormData({ ...formData, infrastructureScore: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Infrastructure quality score (encrypted)
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            {isConfirming ? 'Confirming...' : 'Processing...'}
          </>
        ) : (
          <>📈 Update Confidential Metrics</>
        )}
      </button>

      <div className="mt-6 panel-alt p-4" style={{
        background: 'rgba(43, 195, 123, 0.08)',
        border: '1px solid rgba(43, 195, 123, 0.2)'
      }}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0">ℹ️</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <strong style={{ color: 'var(--success)' }}>Authorization Required:</strong> Only authorized
            planners can update development metrics. All metrics data is encrypted on-chain for privacy.
          </div>
        </div>
      </div>
    </form>
  );
}
