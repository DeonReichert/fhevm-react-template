/**
 * Validation utilities for FHE input data
 */

export const validateUint = (value: number, bits: 8 | 16 | 32 | 64): boolean => {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return false;
  }

  if (value < 0) {
    return false;
  }

  const maxValue = 2 ** bits - 1;
  return value <= maxValue;
};

export const validateUint8 = (value: number): boolean => validateUint(value, 8);
export const validateUint16 = (value: number): boolean => validateUint(value, 16);
export const validateUint32 = (value: number): boolean => validateUint(value, 32);
export const validateUint64 = (value: number): boolean => validateUint(value, 64);

export const validateBool = (value: any): boolean => {
  return typeof value === 'boolean';
};

export const validateDataType = (type: string): boolean => {
  const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
  return validTypes.includes(type);
};

export const validateEncryptionParams = (params: {
  value: any;
  type: string;
  contractAddress: string;
  userAddress: string;
}): { valid: boolean; error?: string } => {
  if (!validateDataType(params.type)) {
    return { valid: false, error: 'Invalid data type' };
  }

  if (!params.contractAddress || params.contractAddress.length !== 42) {
    return { valid: false, error: 'Invalid contract address' };
  }

  if (!params.userAddress || params.userAddress.length !== 42) {
    return { valid: false, error: 'Invalid user address' };
  }

  if (params.type.startsWith('uint')) {
    const bits = parseInt(params.type.substring(4)) as 8 | 16 | 32 | 64;
    if (!validateUint(params.value, bits)) {
      return { valid: false, error: `Invalid value for ${params.type}` };
    }
  }

  return { valid: true };
};
