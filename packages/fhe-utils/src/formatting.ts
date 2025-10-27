/**
 * Formatting utilities for FHE data
 */

export const formatEncryptedData = (data: string, maxLength: number = 20): string => {
  if (data.length <= maxLength) {
    return data;
  }
  const start = data.slice(0, maxLength / 2);
  const end = data.slice(-maxLength / 2);
  return `${start}...${end}`;
};

export const formatAddress = (address: string, chars: number = 4): string => {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

export const formatTimestamp = (timestamp: string | number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
};
