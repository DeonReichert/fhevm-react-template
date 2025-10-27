/**
 * Validation Utilities
 * Input validation helper functions
 */

/**
 * Validate contract address
 */
export function validateContractAddress(address: string): { valid: boolean; error?: string } {
  if (!address) {
    return { valid: false, error: 'Contract address is required' };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { valid: false, error: 'Invalid Ethereum address format' };
  }

  return { valid: true };
}

/**
 * Validate user address
 */
export function validateUserAddress(address: string): { valid: boolean; error?: string } {
  return validateContractAddress(address);
}

/**
 * Validate encryption value based on type
 */
export function validateEncryptionValue(
  value: string,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'bool' | 'address'
): { valid: boolean; error?: string } {
  if (!value) {
    return { valid: false, error: 'Value is required' };
  }

  try {
    switch (type) {
      case 'uint8':
      case 'uint16':
      case 'uint32':
      case 'uint64':
        const num = BigInt(value);
        const maxValues = {
          uint8: 255n,
          uint16: 65535n,
          uint32: 4294967295n,
          uint64: 18446744073709551615n,
        };
        if (num < 0n || num > maxValues[type]) {
          return { valid: false, error: `Value must be between 0 and ${maxValues[type]}` };
        }
        break;

      case 'bool':
        const lower = value.toLowerCase();
        if (lower !== 'true' && lower !== 'false') {
          return { valid: false, error: 'Value must be true or false' };
        }
        break;

      case 'address':
        if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
          return { valid: false, error: 'Invalid Ethereum address format' };
        }
        break;
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Invalid value format' };
  }
}
