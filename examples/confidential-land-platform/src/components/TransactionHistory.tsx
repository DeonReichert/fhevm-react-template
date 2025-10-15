import * as Dialog from '@radix-ui/react-dialog';
import { useTransactions } from '../hooks/useTransactions';
import type { Transaction } from '../types';

function TransactionItem({ tx }: { tx: Transaction }) {
  const getBadgeClass = () => {
    switch (tx.status) {
      case 'success':
        return 'badge-success';
      case 'failed':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  const getStatusIcon = () => {
    switch (tx.status) {
      case 'success':
        return '✓';
      case 'failed':
        return '✕';
      default:
        return '⟳';
    }
  };

  return (
    <div className="py-4 last:border-0" style={{
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate" style={{ color: 'var(--color-text)' }}>
            {tx.description}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {new Date(tx.timestamp).toLocaleString()}
          </p>
          <a
            href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs mt-1 inline-flex items-center gap-1 transition-all"
            style={{ color: 'var(--accent)' }}
          >
            View on Etherscan →
          </a>
        </div>
        <span className={`badge ${getBadgeClass()} flex-shrink-0`}>
          {getStatusIcon()} {tx.status}
        </span>
      </div>
    </div>
  );
}

export function TransactionHistory() {
  const { transactions, clearTransactions } = useTransactions();

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="btn btn-outline relative">
          📜 Transaction History
          {transactions.length > 0 && (
            <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold" style={{
              background: 'var(--accent)'
            }}>
              {transactions.length}
            </span>
          )}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 data-[state=open]:animate-fadeIn" style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)'
        }} />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] overflow-hidden data-[state=open]:animate-slideIn panel" style={{
          boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.8)'
        }}>
          <div className="p-6" style={{
            borderBottom: '1px solid var(--color-border)'
          }}>
            <Dialog.Title className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
              📜 Transaction History
            </Dialog.Title>
            <Dialog.Description className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              View all your recent transactions on the platform
            </Dialog.Description>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(85vh-200px)]">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📜</div>
                <p className="font-semibold" style={{ color: 'var(--color-text)' }}>No transactions yet</p>
                <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  Your transaction history will appear here
                </p>
              </div>
            ) : (
              <div>
                {transactions.map((tx) => (
                  <TransactionItem key={tx.hash} tx={tx} />
                ))}
              </div>
            )}
          </div>

          <div className="p-6 flex items-center justify-between flex-wrap gap-3" style={{
            borderTop: '1px solid var(--color-border)'
          }}>
            <button
              onClick={clearTransactions}
              className="btn btn-secondary"
              disabled={transactions.length === 0}
            >
              🗑️ Clear History
            </button>
            <Dialog.Close asChild>
              <button className="btn btn-primary">Close</button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
