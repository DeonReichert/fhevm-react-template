import * as ToastPrimitive from '@radix-ui/react-toast';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          background: 'var(--success-soft)',
          borderColor: 'var(--success)',
          iconBg: 'var(--success)'
        };
      case 'error':
        return {
          background: 'var(--error-soft)',
          borderColor: 'var(--error)',
          iconBg: 'var(--error)'
        };
      case 'warning':
        return {
          background: 'var(--warning-soft)',
          borderColor: 'var(--warning)',
          iconBg: 'var(--warning)'
        };
      default:
        return {
          background: 'var(--info-soft)',
          borderColor: 'var(--info)',
          iconBg: 'var(--info)'
        };
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const styles = getToastStyles();

  return (
    <ToastPrimitive.Root
      className="panel flex items-start gap-3 p-4 data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut"
      style={{
        background: styles.background,
        borderLeft: `3px solid ${styles.borderColor}`,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
      }}
      onOpenChange={(open) => !open && onClose(toast.id)}
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{
        background: styles.iconBg
      }}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <ToastPrimitive.Title className="font-semibold" style={{ color: 'var(--color-text)' }}>
          {toast.title}
        </ToastPrimitive.Title>
        {toast.description && (
          <ToastPrimitive.Description className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {toast.description}
          </ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close className="flex-shrink-0 transition-opacity hover:opacity-70 text-lg" style={{
        color: 'var(--color-text-muted)'
      }}>
        ✕
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export function ToastProvider({ children, toasts, onClose }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 right-4 flex flex-col gap-2 w-96 max-w-[100vw] z-50" />
    </ToastPrimitive.Provider>
  );
}
