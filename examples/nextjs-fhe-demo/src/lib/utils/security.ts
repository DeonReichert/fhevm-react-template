/**
 * Security Utilities
 * Security-related helper functions
 */

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Validate numeric input for encryption
 */
export function isValidNumericInput(value: string, type: string): boolean {
  const num = BigInt(value);

  switch (type) {
    case 'uint8':
      return num >= 0n && num <= 255n;
    case 'uint16':
      return num >= 0n && num <= 65535n;
    case 'uint32':
      return num >= 0n && num <= 4294967295n;
    case 'uint64':
      return num >= 0n && num <= 18446744073709551615n;
    default:
      return false;
  }
}

/**
 * Validate boolean input
 */
export function isValidBooleanInput(value: string): boolean {
  const lower = value.toLowerCase();
  return lower === 'true' || lower === 'false';
}
