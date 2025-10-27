/**
 * Conversion utilities for FHE data types
 */

export const hexToBytes = (hex: string): Uint8Array => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
};

export const bytesToHex = (bytes: Uint8Array): string => {
  return '0x' + Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const stringToBytes = (str: string): Uint8Array => {
  return new TextEncoder().encode(str);
};

export const bytesToString = (bytes: Uint8Array): string => {
  return new TextDecoder().decode(bytes);
};

export const numberToBytes = (num: number, bytes: number): Uint8Array => {
  const buffer = new ArrayBuffer(bytes);
  const view = new DataView(buffer);

  if (bytes === 1) {
    view.setUint8(0, num);
  } else if (bytes === 2) {
    view.setUint16(0, num, false);
  } else if (bytes === 4) {
    view.setUint32(0, num, false);
  } else if (bytes === 8) {
    view.setBigUint64(0, BigInt(num), false);
  }

  return new Uint8Array(buffer);
};

export const bytesToNumber = (bytes: Uint8Array): number => {
  const view = new DataView(bytes.buffer);

  if (bytes.length === 1) {
    return view.getUint8(0);
  } else if (bytes.length === 2) {
    return view.getUint16(0, false);
  } else if (bytes.length === 4) {
    return view.getUint32(0, false);
  } else if (bytes.length === 8) {
    return Number(view.getBigUint64(0, false));
  }

  throw new Error('Unsupported byte length');
};

export const base64ToBytes = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const bytesToBase64 = (bytes: Uint8Array): string => {
  const binaryString = String.fromCharCode(...bytes);
  return btoa(binaryString);
};
