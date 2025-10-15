import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import { useContractWrite } from '../hooks/useContract';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from './LoadingSpinner';
import type { ZoneData } from '../types';

export function RegisterZoneForm() {
  const { address } = useAccount();
  const { showToast } = useToast();
  const { addTransaction, updateTransactionStatus } = useTransactions();
  const { writeContractAsync, isPending, isConfirming } = useContractWrite();

  const [formData, setFormData] = useState<ZoneData>({
    area: 0,
    population: 0,
    value: 0,
    zoningType: 1,
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!formData.area || !formData.population || !formData.value || !formData.description) {
      showToast('Please fill in all fields', undefined, 'warning');
      return;
    }

    try {
      console.log('🚀 Submitting transaction...');
      console.log('📝 Form data:', formData);
      console.log('📍 Contract address:', CONTRACT_ADDRESS);
      console.log('⛽ Gas limit:', BigInt(5000000).toString());

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'registerLandZone',
        args: [
          formData.area,
          formData.population,
          formData.value,
          formData.zoningType,
          formData.description,
        ],
        gas: BigInt(5000000), // Set reasonable gas limit (5M, well below 16.7M cap)
      });

      console.log('✅ Transaction hash:', hash);

      if (hash) {
        addTransaction({
          hash,
          type: 'register',
          timestamp: Date.now(),
          status: 'pending',
          description: `Register Zone: ${formData.description}`,
        });

        showToast(
          'Zone Registration Submitted',
          'Please wait for transaction confirmation',
          'info'
        );

        // Reset form
        setFormData({
          area: 0,
          population: 0,
          value: 0,
          zoningType: 1,
          description: '',
        });

        // Update status when confirmed
        setTimeout(() => {
          updateTransactionStatus(hash, 'success');
          showToast('Zone Registered Successfully!', 'Your zone has been registered on-chain', 'success');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('❌ Error message:', errorMessage);
        console.error('❌ Error stack:', error.stack);
      }

      // Check for specific error types
      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.code) console.error('❌ Error code:', err.code);
        if (err.reason) console.error('❌ Error reason:', err.reason);
        if (err.data) console.error('❌ Error data:', err.data);
      }

      showToast('Registration Failed', errorMessage, 'error');
    }
  };

  const isLoading = isPending || isConfirming;

  return (
    <form onSubmit={handleSubmit} className="panel animate-slideIn" style={{ padding: '1.5rem' }}>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--color-text)' }}>
          🏘️ Register Confidential Land Zone
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          All sensitive data will be encrypted using FHE technology
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="label">Land Area (sq meters)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 5000"
            value={formData.area || ''}
            onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label">Population Density</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 1200"
            value={formData.population || ''}
            onChange={(e) => setFormData({ ...formData, population: Number(e.target.value) })}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label">Land Value per sq meter</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 850"
            value={formData.value || ''}
            onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label">Zoning Type</label>
          <select
            className="input w-full"
            value={formData.zoningType}
            onChange={(e) => setFormData({ ...formData, zoningType: Number(e.target.value) })}
            disabled={isLoading}
          >
            <option value={1}>Residential</option>
            <option value={2}>Commercial</option>
            <option value={3}>Industrial</option>
            <option value={4}>Mixed Use</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="label">Public Description</label>
        <textarea
          className="input w-full"
          rows={3}
          placeholder="Non-sensitive public information about the zone..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isLoading}
        />
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
          <>🔒 Register Confidential Zone</>
        )}
      </button>

      {/* Info Box */}
      <div className="mt-6 panel-alt p-4" style={{
        background: 'rgba(109, 110, 255, 0.08)',
        border: '1px solid rgba(109, 110, 255, 0.2)'
      }}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0">🔐</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <strong style={{ color: 'var(--accent)' }}>Privacy Protected:</strong> Area, population density,
            and land value are encrypted on-chain. Only authorized parties can access the decrypted values.
          </div>
        </div>
      </div>
    </form>
  );
}
