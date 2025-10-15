import { useState, useEffect } from 'react';
import type { Transaction } from '../types';

const STORAGE_KEY = 'confidential_land_transactions';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored transactions', e);
      }
    }
  }, []);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => {
      const updated = [tx, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateTransactionStatus = (
    hash: string,
    status: Transaction['status']
  ) => {
    setTransactions(prev => {
      const updated = prev.map(tx =>
        tx.hash === hash ? { ...tx, status } : tx
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    transactions,
    addTransaction,
    updateTransactionStatus,
    clearTransactions,
  };
}
