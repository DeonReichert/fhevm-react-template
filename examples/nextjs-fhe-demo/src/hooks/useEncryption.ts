/**
 * useEncryption Hook
 * Custom hook for encryption operations with additional functionality
 */

import { useEncrypt } from '@fhevm-template/fhevm-sdk';
import { validateEncryptionValue } from '@/lib/utils/validation';
import { useState } from 'react';

export function useEncryption() {
  const encrypt = useEncrypt();
  const [validationError, setValidationError] = useState<string>('');

  const encryptWithValidation = async (params: {
    contractAddress: string;
    userAddress: string;
    value: string;
    type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address';
  }) => {
    // Validate value
    const validation = validateEncryptionValue(params.value, params.type);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid value');
      throw new Error(validation.error);
    }

    setValidationError('');

    // Process value based on type
    let processedValue: number | bigint | boolean | string;
    if (params.type === 'bool') {
      processedValue = params.value.toLowerCase() === 'true';
    } else if (params.type === 'address') {
      processedValue = params.value;
    } else {
      processedValue = BigInt(params.value);
    }

    // Encrypt
    return await encrypt.encryptValue({
      ...params,
      value: processedValue,
    });
  };

  return {
    ...encrypt,
    encryptWithValidation,
    validationError,
  };
}
