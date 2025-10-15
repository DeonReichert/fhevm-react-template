import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../lib/contract';
import { useContractWrite } from '../hooks/useContract';
import { useToast } from '../hooks/useToast';
import { LoadingSpinner } from './LoadingSpinner';

export function AnalysisTools() {
  const { address } = useAccount();
  const { showToast } = useToast();
  const { writeContractAsync, isPending } = useContractWrite();

  const [zoneId, setZoneId] = useState<number>(1);
  const [compareZones, setCompareZones] = useState({ zone1: 1, zone2: 2 });
  const [potentialZoneId, setPotentialZoneId] = useState<number>(1);
  const [isComparing, setIsComparing] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleRequestAnalysis = async () => {
    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    try {
      console.log('🔍 Requesting urban analysis for zone:', zoneId);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'requestUrbanAnalysis',
        args: [BigInt(zoneId)],
        gas: BigInt(3000000),
      });

      console.log('✅ Analysis request hash:', hash);

      showToast(
        'Analysis Requested',
        `Urban analysis for Zone ${zoneId} has been requested`,
        'success'
      );
    } catch (error: unknown) {
      console.error('❌ Analysis request error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.reason?.includes('Zone not registered')) {
          errorMessage = 'The zone ID does not exist';
          showToast('Invalid Zone ID', errorMessage, 'warning');
          return;
        }
        if (err.reason?.includes('Not authorized')) {
          errorMessage = 'You must be the zone owner or an authorized planner';
          showToast('Authorization Required', errorMessage, 'warning');
          return;
        }
      }

      showToast('Request Failed', errorMessage, 'error');
    }
  };

  const handleCompareZones = async () => {
    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!compareZones.zone1 || !compareZones.zone2) {
      showToast('Please enter both zone IDs', undefined, 'warning');
      return;
    }

    setIsComparing(true);
    try {
      console.log('⚖️ Comparing zones:', compareZones);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'compareZoneValues',
        args: [BigInt(compareZones.zone1), BigInt(compareZones.zone2)],
        gas: BigInt(3000000),
      });

      console.log('✅ Comparison hash:', hash);

      showToast(
        'Zone Comparison Complete',
        `Encrypted comparison of Zone ${compareZones.zone1} vs Zone ${compareZones.zone2}`,
        'success'
      );
    } catch (error: unknown) {
      console.error('❌ Comparison error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.reason?.includes('Zones not registered')) {
          errorMessage = 'One or both zones do not exist';
          showToast('Invalid Zone IDs', errorMessage, 'warning');
          return;
        }
      }

      showToast('Comparison Failed', errorMessage, 'error');
    } finally {
      setIsComparing(false);
    }
  };

  const handleCalculatePotential = async () => {
    if (!address) {
      showToast('Please connect your wallet', undefined, 'error');
      return;
    }

    if (!potentialZoneId) {
      showToast('Please enter a zone ID', undefined, 'warning');
      return;
    }

    setIsCalculating(true);
    try {
      console.log('📊 Calculating development potential for zone:', potentialZoneId);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'calculateDevelopmentPotential',
        args: [BigInt(potentialZoneId)],
        gas: BigInt(3000000),
      });

      console.log('✅ Calculation hash:', hash);

      showToast(
        'Potential Calculated',
        `Development potential calculated for Zone ${potentialZoneId}`,
        'success'
      );
    } catch (error: unknown) {
      console.error('❌ Calculation error:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        if (err.reason?.includes('Zone not registered')) {
          errorMessage = 'The zone does not exist';
          showToast('Invalid Zone ID', errorMessage, 'warning');
          return;
        }
        if (err.reason?.includes('Metrics not set')) {
          errorMessage = 'Metrics have not been set for this zone';
          showToast('Metrics Required', errorMessage, 'warning');
          return;
        }
      }

      showToast('Calculation Failed', errorMessage, 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="panel animate-slideIn" style={{ padding: '1.5rem' }}>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 mb-1" style={{ color: 'var(--color-text)' }}>
          🔍 Confidential Analysis Tools
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Perform encrypted zone comparisons and development potential calculations
        </p>
      </div>

      {/* Urban Analysis Request */}
      <div className="mb-6 panel-alt p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span>🏙️</span> Request Urban Analysis
        </h4>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="label">Zone ID</label>
            <input
              type="number"
              className="input w-full"
              placeholder="e.g., 1"
              min="1"
              value={zoneId || ''}
              onChange={(e) => setZoneId(Number(e.target.value))}
              disabled={isPending}
            />
          </div>
          <button
            onClick={handleRequestAnalysis}
            className="btn btn-primary"
            disabled={isPending || !zoneId}
            style={{ minWidth: '180px' }}
          >
            {isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Processing...
              </>
            ) : (
              <>🔬 Request Analysis</>
            )}
          </button>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
          Request confidential analysis for urban planning decisions
        </p>
      </div>

      {/* Zone Comparison */}
      <div className="mb-6 panel-alt p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span>⚖️</span> Compare Zones (Encrypted)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="label">Zone 1 ID</label>
            <input
              type="number"
              className="input w-full"
              placeholder="e.g., 1"
              min="1"
              value={compareZones.zone1 || ''}
              onChange={(e) => setCompareZones({ ...compareZones, zone1: Number(e.target.value) })}
              disabled={isPending}
            />
          </div>
          <div>
            <label className="label">Zone 2 ID</label>
            <input
              type="number"
              className="input w-full"
              placeholder="e.g., 2"
              min="1"
              value={compareZones.zone2 || ''}
              onChange={(e) => setCompareZones({ ...compareZones, zone2: Number(e.target.value) })}
              disabled={isPending}
            />
          </div>
          <button
            onClick={handleCompareZones}
            className="btn btn-secondary"
            disabled={isComparing || isPending || compareZones.zone1 <= 0 || compareZones.zone2 <= 0}
            style={{ minWidth: '180px' }}
          >
            {isComparing ? (
              <>
                <LoadingSpinner size="sm" />
                Comparing...
              </>
            ) : (
              <>🔄 Compare Values</>
            )}
          </button>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
          Note: Zone comparison performs encrypted calculations without revealing actual values
        </p>
      </div>

      {/* Development Potential */}
      <div className="panel-alt p-6">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <span>📈</span> Calculate Development Potential
        </h4>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="label">Zone ID</label>
            <input
              type="number"
              className="input w-full"
              placeholder="e.g., 1"
              min="1"
              value={potentialZoneId || ''}
              onChange={(e) => setPotentialZoneId(Number(e.target.value))}
              disabled={isPending}
            />
          </div>
          <button
            onClick={handleCalculatePotential}
            className="btn btn-secondary"
            disabled={isCalculating || isPending || potentialZoneId <= 0}
            style={{ minWidth: '200px' }}
          >
            {isCalculating ? (
              <>
                <LoadingSpinner size="sm" />
                Calculating...
              </>
            ) : (
              <>📊 Calculate Potential</>
            )}
          </button>
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
          Encrypted calculation of development potential based on metrics
        </p>
      </div>

      {/* Info Box */}
      <div className="mt-6 panel-alt p-4" style={{
        background: 'rgba(109, 110, 255, 0.08)',
        border: '1px solid rgba(109, 110, 255, 0.2)'
      }}>
        <div className="flex items-start gap-3">
          <div className="text-xl flex-shrink-0">🔐</div>
          <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <strong style={{ color: 'var(--accent)' }}>Privacy Preserved:</strong> All analysis operations
            use FHE to perform calculations on encrypted data. Results maintain confidentiality while
            enabling collaborative urban planning decisions.
          </div>
        </div>
      </div>
    </div>
  );
}
