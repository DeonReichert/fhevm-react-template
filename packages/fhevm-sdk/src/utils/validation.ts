/**
 * Validation Utilities
 * Input validation and security checks
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): void {
  if (!address) {
    throw new Error('Contract address is required');
  }
  if (!isValidAddress(address)) {
    throw new Error('Invalid contract address format');
  }
}

/**
 * Validate user address
 */
export function validateUserAddress(address: string): void {
  if (!address) {
    throw new Error('User address is required');
  }
  if (!isValidAddress(address)) {
    throw new Error('Invalid user address format');
  }
}

/**
 * Validate encryption type
 */
export function validateEncryptionType(type: string): void {
  const validTypes = ['uint8', 'uint16', 'uint32', 'uint64', 'bool', 'address'];
  if (!validTypes.includes(type)) {
    throw new Error(`Invalid encryption type: ${type}. Must be one of: ${validTypes.join(', ')}`);
  }
}

/**
 * Validate value for given type
 */
export function validateValueForType(
  value: any,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'
): void {
  switch (type) {
    case 'uint8':
      validateUint(value, 8);
      break;
    case 'uint16':
      validateUint(value, 16);
      break;
    case 'uint32':
      validateUint(value, 32);
      break;
    case 'uint64':
      validateUint64(value);
      break;
    case 'bool':
      if (typeof value !== 'boolean') {
        throw new Error('Value must be boolean for bool type');
      }
      break;
    case 'address':
      validateContractAddress(value);
      break;
  }
}

/**
 * Validate unsigned integer
 */
function validateUint(value: any, bits: 8 | 16 | 32): void {
  const num = Number(value);
  if (!Number.isInteger(num)) {
    throw new Error(`Value must be an integer for uint${bits} type`);
  }
  const max = 2 ** bits - 1;
  if (num < 0 || num > max) {
    throw new Error(`Value must be between 0 and ${max} for uint${bits} type`);
  }
}

/**
 * Validate uint64 (can be bigint or number)
 */
function validateUint64(value: any): void {
  if (typeof value === 'bigint') {
    if (value < 0n || value > 2n ** 64n - 1n) {
      throw new Error('Value must be between 0 and 2^64-1 for uint64 type');
    }
  } else {
    const num = Number(value);
    if (!Number.isInteger(num) || num < 0) {
      throw new Error('Value must be a non-negative integer for uint64 type');
    }
  }
}

/**
 * Sanitize encrypted data before transmission
 */
export function sanitizeEncryptedData(data: any): any {
  if (!data) {
    throw new Error('Encrypted data is required');
  }

  if (!data.handles || !data.inputProof) {
    throw new Error('Invalid encrypted data format');
  }

  return {
    handles: data.handles,
    inputProof: data.inputProof,
  };
}
