import { useState, useCallback } from 'react';
import type { ToastMessage } from '../types';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((
    title: string,
    description?: string,
    type: ToastMessage['type'] = 'info'
  ) => {
    const id = Math.random().toString(36).substring(7);
    const toast: ToastMessage = {
      id,
      title,
      description,
      type,
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
  };
}
