import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import { useContractWrite } from '../hooks/useContract';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from './LoadingSpinner';

interface ProjectData {
  budget: number;
  impactScore: number;
  timeline: number;
  projectName: string;
  targetZoneId: number;
}

export function SubmitProjectForm() {
  const { address } = useAccount();
  const { showToast } = useToast();
  const { addTransaction, updateTransactionStatus } = useTransactions();
  const { writeContractAsync, isPending, isConfirming } = useContractWrite();

  const [formData, setFormData] = useState<ProjectData>({
    budget: 0,
    impactScore: 0,
    timeline: 0,
    projectName: '',
    targetZoneId: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!formData.budget || !formData.timeline || !formData.projectName || !formData.targetZoneId) {
      showToast('Please fill in all fields', undefined, 'warning');
      return;
    }

    if (formData.impactScore > 100) {
      showToast('Impact score must be between 0-100', undefined, 'warning');
      return;
    }

    try {
      console.log('🚀 Submitting project transaction...');
      console.log('📝 Project data:', formData);
      console.log('📍 Contract address:', CONTRACT_ADDRESS);
      console.log('⛽ Gas limit:', BigInt(5000000).toString());

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'submitPlanningProject',
        args: [
          formData.budget,
          formData.impactScore,
          formData.timeline,
          formData.projectName,
          BigInt(formData.targetZoneId),
        ],
        gas: BigInt(5000000), // Set reasonable gas limit
      });

      console.log('✅ Transaction hash:', hash);

      if (hash) {
        addTransaction({
          hash,
          type: 'submit',
          timestamp: Date.now(),
          status: 'pending',
          description: `Submit Project: ${formData.projectName}`,
        });

        showToast(
          'Project Submission Submitted',
          'Please wait for transaction confirmation',
          'info'
        );

        // Reset form
        setFormData({
          budget: 0,
          impactScore: 0,
          timeline: 0,
          projectName: '',
          targetZoneId: 1,
        });

        // Update status when confirmed
        setTimeout(() => {
          updateTransactionStatus(hash, 'success');
          showToast('Project Submitted Successfully!', 'Your project proposal has been submitted', 'success');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('❌ Project submission error:', error);
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

        // Check for specific contract errors
        if (err.reason?.includes('Not registered land owner')) {
          errorMessage = 'You must register a land zone first before submitting projects';
          showToast('Land Owner Registration Required', errorMessage, 'warning');
          return;
        }
        if (err.reason?.includes('Zone not registered')) {
          errorMessage = 'The target zone ID does not exist. Please check the zone ID.';
          showToast('Invalid Zone ID', errorMessage, 'warning');
          return;
        }
      }

      showToast('Submission Failed', errorMessage, 'error');
    }
  };

  const isLoading = isPending || isConfirming;

  return (
    <form onSubmit={handleSubmit} className="panel animate-slideIn" style={{ padding: '1.5rem' }}>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--color-text)' }}>
          🏗️ Submit Planning Project
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Submit confidential project proposals with encrypted budget and impact data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="label">Project Budget</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 500000"
            value={formData.budget || ''}
            onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Project budget amount (encrypted)
          </p>
        </div>

        <div>
          <label className="label">Environmental Impact Score (0-100)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 75"
            min="0"
            max="100"
            value={formData.impactScore || ''}
            onChange={(e) => setFormData({ ...formData, impactScore: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Impact assessment score (encrypted)
          </p>
        </div>

        <div>
          <label className="label">Timeline (days)</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 365"
            value={formData.timeline || ''}
            onChange={(e) => setFormData({ ...formData, timeline: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Expected completion timeline (encrypted)
          </p>
        </div>

        <div>
          <label className="label">Target Zone ID</label>
          <input
            type="number"
            className="input w-full"
            placeholder="e.g., 1"
            min="1"
            value={formData.targetZoneId || ''}
            onChange={(e) => setFormData({ ...formData, targetZoneId: Number(e.target.value) })}
            disabled={isLoading}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Zone ID where project will be implemented
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label className="label">Project Name</label>
        <input
          type="text"
          className="input w-full"
          placeholder="e.g., Green Energy Infrastructure Upgrade"
          value={formData.projectName}
          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          disabled={isLoading}
        />
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Public project identifier (not encrypted)
        </p>
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
          <>📋 Submit Confidential Project</>
        )}
      </button>

      {/* Info Box */}
      <div className="mt-6 panel-alt p-4" style={{
        background: 'rgba(109, 110, 255, 0.08)',
        border: '1px solid rgba(109, 110, 255, 0.2)'
      }}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0">ℹ️</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <strong style={{ color: 'var(--accent)' }}>Requirements:</strong> You must be a registered land owner
            (have submitted at least one zone) to submit projects. Budget, impact score, and timeline data are
            encrypted on-chain for privacy protection.
          </div>
        </div>
      </div>
    </form>
  );
}
