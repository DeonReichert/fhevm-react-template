# FHE Utils

Utility functions and constants for FHE operations.

## Installation

```bash
npm install @fhevm-template/fhe-utils
```

## Features

- **Formatting**: Format encrypted data, addresses, timestamps
- **Conversion**: Convert between different data formats (hex, bytes, base64)
- **Constants**: FHE data types, max values, byte sizes, timeouts

## Usage

### Formatting

```typescript
import { formatEncryptedData, formatAddress, formatTimestamp } from '@fhevm-template/fhe-utils';

// Format encrypted data for display
const shortData = formatEncryptedData(longEncryptedString, 20);

// Format Ethereum address
const shortAddress = formatAddress('0x1234567890123456789012345678901234567890');

// Format timestamp
const readableTime = formatTimestamp(Date.now());
```

### Conversion

```typescript
import { hexToBytes, bytesToHex, base64ToBytes } from '@fhevm-template/fhe-utils';

// Convert hex to bytes
const bytes = hexToBytes('0x1234');

// Convert bytes to hex
const hex = bytesToHex(new Uint8Array([0x12, 0x34]));

// Convert base64 to bytes
const data = base64ToBytes('SGVsbG8=');
```

### Constants

```typescript
import { FHE_DATA_TYPES, FHE_MAX_VALUES, DEFAULT_GATEWAY_URL } from '@fhevm-template/fhe-utils';

// Use data type constants
const dataType = FHE_DATA_TYPES.UINT32;

// Check max value
const maxValue = FHE_MAX_VALUES[FHE_DATA_TYPES.UINT32];

// Use default gateway
const gateway = DEFAULT_GATEWAY_URL;
```

## API Reference

### Formatting

- `formatEncryptedData(data: string, maxLength?: number): string`
- `formatAddress(address: string, chars?: number): string`
- `formatTimestamp(timestamp: string | number): string`
- `formatBytes(bytes: number): string`
- `formatDuration(ms: number): string`

### Conversion

- `hexToBytes(hex: string): Uint8Array`
- `bytesToHex(bytes: Uint8Array): string`
- `stringToBytes(str: string): Uint8Array`
- `bytesToString(bytes: Uint8Array): string`
- `numberToBytes(num: number, bytes: number): Uint8Array`
- `bytesToNumber(bytes: Uint8Array): number`
- `base64ToBytes(base64: string): Uint8Array`
- `bytesToBase64(bytes: Uint8Array): string`

### Constants

- `FHE_DATA_TYPES`: Object containing all supported FHE data types
- `FHE_MAX_VALUES`: Maximum values for each FHE data type
- `FHE_BYTE_SIZES`: Byte sizes for each FHE data type
- `DEFAULT_GATEWAY_URL`: Default Zama gateway URL
- `ENCRYPTION_TIMEOUT`: Default encryption timeout (30s)
- `DECRYPTION_TIMEOUT`: Default decryption timeout (30s)
- `COMPUTATION_TIMEOUT`: Default computation timeout (60s)
- `SUPPORTED_OPERATIONS`: Array of supported FHE operations

## License

MIT
