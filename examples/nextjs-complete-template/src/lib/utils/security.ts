/**
 * Security utilities for FHE operations
 */

export const validateAddress = (address: string): boolean => {
  const addressPattern = /^0x[a-fA-F0-9]{40}$/;
  return addressPattern.test(address);
};

export const validateEncryptedData = (data: string): boolean => {
  if (!data || typeof data !== 'string') {
    return false;
  }

  // Basic validation - should be base64 encoded
  try {
    Buffer.from(data, 'base64');
    return true;
  } catch {
    return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateSignature = (signature: string, message: string, address: string): boolean => {
  // In a real implementation, verify EIP-712 signature
  return signature.length > 0 && message.length > 0 && validateAddress(address);
};

export const generateNonce = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
