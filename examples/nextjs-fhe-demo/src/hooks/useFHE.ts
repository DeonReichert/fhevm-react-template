/**
 * useFHE Hook
 * Custom hook for FHE operations
 */

import { useFhevm } from '@fhevm-template/fhevm-sdk';

export function useFHE() {
  const fhevm = useFhevm();

  return {
    ...fhevm,
    // Add any custom FHE operations here
  };
}
