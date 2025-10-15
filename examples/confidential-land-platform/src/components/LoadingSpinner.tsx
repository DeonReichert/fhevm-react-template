interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`spinner ${sizeClasses[size]} ${className}`} />
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Processing transaction...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)'
    }}>
      <div className="panel p-8 flex flex-col items-center gap-4 max-w-md mx-4 animate-slideIn" style={{
        boxShadow: '0 24px 64px -16px rgba(0, 0, 0, 0.8)'
      }}>
        <LoadingSpinner size="lg" />
        <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          {message}
        </p>
        <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
          Please confirm the transaction in your wallet and wait for confirmation.
        </p>
      </div>
    </div>
  );
}
