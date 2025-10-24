import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import { useContractWrite } from '../hooks/useContract';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from './LoadingSpinner';

export function PlatformManagement() {
  const { address } = useAccount();
  const { showToast } = useToast();
  const { addTransaction, updateTransactionStatus } = useTransactions();
  const { writeContractAsync, isPending, isConfirming } = useContractWrite();

  const [plannerAddress, setPlannerAddress] = useState<string>('');
  const [projectId, setProjectId] = useState<number>(1);
  const [revokeAddress, setRevokeAddress] = useState<string>('');
  const [isRevoking, setIsRevoking] = useState(false);

  const handleAuthorizePlanner = async () => {
    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!plannerAddress || !plannerAddress.startsWith('0x') || plannerAddress.length !== 42) {
      showToast('Please enter a valid Ethereum address', undefined, 'warning');
      return;
    }

    try {
      console.log('👤 Authorizing planner:', plannerAddress);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'authorizePlanner',
        args: [plannerAddress as `0x${string}`],
        gas: BigInt(3000000),
      });

      console.log('✅ Authorization hash:', hash);

      if (hash) {
        addTransaction({
          hash,
          type: 'authorize',
          timestamp: Date.now(),
          status: 'pending',
          description: `Authorize Planner: ${plannerAddress.slice(0, 6)}...${plannerAddress.slice(-4)}`,
        });

        showToast(
          'Planner Authorization Submitted',
          'Please wait for transaction confirmation',
          'info'
        );

        setPlannerAddress('');

        setTimeout(() => {
          updateTransactionStatus(hash, 'success');
          showToast('Planner Authorized!', 'The planner has been authorized successfully', 'success');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('❌ Authorization error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.reason?.includes('Only planning authority')) {
          errorMessage = 'Only the planning authority can authorize planners';
          showToast('Authorization Required', errorMessage, 'warning');
          return;
        }
      }

      showToast('Authorization Failed', errorMessage, 'error');
    }
  };

  const handleApproveProject = async () => {
    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!projectId) {
      showToast('Please enter a valid project ID', undefined, 'warning');
      return;
    }

    try {
      console.log('✅ Approving project:', projectId);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'approveProject',
        args: [BigInt(projectId)],
        gas: BigInt(3000000),
      });

      console.log('✅ Approval hash:', hash);

      if (hash) {
        addTransaction({
          hash,
          type: 'approve',
          timestamp: Date.now(),
          status: 'pending',
          description: `Approve Project #${projectId}`,
        });

        showToast(
          'Project Approval Submitted',
          'Please wait for transaction confirmation',
          'info'
        );

        setTimeout(() => {
          updateTransactionStatus(hash, 'success');
          showToast('Project Approved!', `Project #${projectId} has been approved`, 'success');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('❌ Approval error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.reason?.includes('Only planning authority')) {
          errorMessage = 'Only the planning authority can approve projects';
          showToast('Authorization Required', errorMessage, 'warning');
          return;
        }
        if (err.reason?.includes('Project not active')) {
          errorMessage = 'The project ID does not exist or is not active';
          showToast('Invalid Project ID', errorMessage, 'warning');
          return;
        }
      }

      showToast('Approval Failed', errorMessage, 'error');
    }
  };

  const handleRevokePlanner = async () => {
    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!revokeAddress || !revokeAddress.startsWith('0x') || revokeAddress.length !== 42) {
      showToast('Please enter a valid Ethereum address', undefined, 'warning');
      return;
    }

    setIsRevoking(true);
    try {
      console.log('🚫 Revoking planner authorization:', revokeAddress);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'revokePlannerAuthorization',
        args: [revokeAddress as `0x${string}`],
        gas: BigInt(3000000),
      });

      console.log('✅ Revocation hash:', hash);

      if (hash) {
        addTransaction({
          hash,
          type: 'revoke',
          timestamp: Date.now(),
          status: 'pending',
          description: `Revoke Planner: ${revokeAddress.slice(0, 6)}...${revokeAddress.slice(-4)}`,
        });

        showToast(
          'Revocation Submitted',
          'Please wait for transaction confirmation',
          'info'
        );

        setRevokeAddress('');

        setTimeout(() => {
          updateTransactionStatus(hash, 'success');
          showToast('Authorization Revoked!', 'The planner authorization has been revoked', 'success');
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('❌ Revocation error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.reason?.includes('Only planning authority')) {
          errorMessage = 'Only the planning authority can revoke planner authorization';
          showToast('Authorization Required', errorMessage, 'warning');
          return;
        }
      }

      showToast('Revocation Failed', errorMessage, 'error');
    } finally {
      setIsRevoking(false);
    }
  };

  const isLoading = isPending || isConfirming;

  return (
    <div className="panel animate-slideIn" style={{ padding: '1.5rem' }}>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--color-text)' }}>
          ⚙️ Platform Management
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Authorize planners and manage project approvals (Authority only)
        </p>
      </div>

      {/* Authorize Planner */}
      <div className="mb-6 panel-alt p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span>👤</span> Authorize Urban Planner
        </h4>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="label">Planner Address</label>
            <input
              type="text"
              className="input w-full"
              placeholder="0x..."
              value={plannerAddress}
              onChange={(e) => setPlannerAddress(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Enter Ethereum address of the planner to authorize
            </p>
          </div>
          <button
            onClick={handleAuthorizePlanner}
            className="btn btn-primary"
            disabled={isLoading || !plannerAddress}
            style={{ minWidth: '180px' }}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              <>👥 Authorize Planner</>
            )}
          </button>
        </div>
      </div>

      {/* Approve Project */}
      <div className="mb-6 panel-alt p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span>✅</span> Approve Planning Project
        </h4>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="label">Project ID</label>
            <input
              type="number"
              className="input w-full"
              placeholder="e.g., 1"
              min="1"
              value={projectId || ''}
              onChange={(e) => setProjectId(Number(e.target.value))}
              disabled={isLoading}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Enter the ID of the project to approve
            </p>
          </div>
          <button
            onClick={handleApproveProject}
            className="btn btn-success"
            disabled={isLoading || projectId <= 0}
            style={{ minWidth: '180px' }}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              <>✓ Approve Project</>
            )}
          </button>
        </div>
      </div>

      {/* Revoke Authorization */}
      <div className="panel-alt p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span>🚫</span> Revoke Planner Authorization
        </h4>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="label">Planner Address</label>
            <input
              type="text"
              className="input w-full"
              placeholder="0x..."
              value={revokeAddress}
              onChange={(e) => setRevokeAddress(e.target.value)}
              disabled={isLoading || isRevoking}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Revoke authorization from a planner
            </p>
          </div>
          <button
            onClick={handleRevokePlanner}
            className="btn btn-danger"
            disabled={isLoading || isRevoking || !revokeAddress || revokeAddress.length < 42}
            style={{ minWidth: '180px' }}
          >
            {isRevoking ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              <>⊗ Revoke Authorization</>
            )}
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 panel-alt p-4" style={{
        background: 'rgba(255, 193, 7, 0.08)',
        border: '1px solid rgba(255, 193, 7, 0.2)'
      }}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0">⚠️</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <strong style={{ color: '#ffc107' }}>Authority Only:</strong> These management functions
            can only be executed by the City Planning Authority account. Unauthorized attempts will
            be rejected by the smart contract.
          </div>
        </div>
      </div>
    </div>
  );
}
