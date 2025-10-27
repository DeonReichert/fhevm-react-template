/**
 * Constants for FHE operations
 */

export const FHE_DATA_TYPES = {
  UINT8: 'uint8',
  UINT16: 'uint16',
  UINT32: 'uint32',
  UINT64: 'uint64',
  BOOL: 'bool',
  ADDRESS: 'address',
} as const;

export type FHEDataType = typeof FHE_DATA_TYPES[keyof typeof FHE_DATA_TYPES];

export const FHE_MAX_VALUES = {
  [FHE_DATA_TYPES.UINT8]: 255,
  [FHE_DATA_TYPES.UINT16]: 65535,
  [FHE_DATA_TYPES.UINT32]: 4294967295,
  [FHE_DATA_TYPES.UINT64]: BigInt('18446744073709551615'),
} as const;

export const FHE_BYTE_SIZES = {
  [FHE_DATA_TYPES.UINT8]: 1,
  [FHE_DATA_TYPES.UINT16]: 2,
  [FHE_DATA_TYPES.UINT32]: 4,
  [FHE_DATA_TYPES.UINT64]: 8,
  [FHE_DATA_TYPES.BOOL]: 1,
  [FHE_DATA_TYPES.ADDRESS]: 20,
} as const;

export const DEFAULT_GATEWAY_URL = 'https://gateway.zama.ai';

export const ENCRYPTION_TIMEOUT = 30000; // 30 seconds

export const DECRYPTION_TIMEOUT = 30000; // 30 seconds

export const COMPUTATION_TIMEOUT = 60000; // 60 seconds

export const SUPPORTED_OPERATIONS = [
  'add',
  'subtract',
  'multiply',
  'divide',
  'compare',
  'and',
  'or',
  'xor',
  'not',
] as const;

export type FHEOperation = typeof SUPPORTED_OPERATIONS[number];
