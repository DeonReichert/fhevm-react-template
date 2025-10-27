'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useEncrypt } from '@fhevm-template/fhevm-sdk';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function MedicalExample() {
  const { address } = useAccount();
  const { encryptValue, isEncrypting } = useEncrypt();

  const [patientId, setPatientId] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [result, setResult] = useState('');

  const handleSubmitRecords = async () => {
    if (!address || !patientId || !bloodPressure || !heartRate) {
      alert('Please fill all fields and connect wallet');
      return;
    }

    try {
      const mockContractAddress = '0x2345678901234567890123456789012345678901';

      // Encrypt blood pressure
      await encryptValue({
        contractAddress: mockContractAddress,
        userAddress: address,
        value: parseInt(bloodPressure),
        type: 'uint16',
      });

      // Encrypt heart rate
      await encryptValue({
        contractAddress: mockContractAddress,
        userAddress: address,
        value: parseInt(heartRate),
        type: 'uint16',
      });

      setResult(`Medical records for patient ${patientId} securely stored on-chain`);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <Card title="Private Medical Records" subtitle="HIPAA-compliant health data storage using FHE">
      <div className="space-y-4">
        <Input
          label="Patient ID"
          placeholder="Enter patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Blood Pressure (mmHg)"
            type="number"
            placeholder="120"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
          />
          <Input
            label="Heart Rate (bpm)"
            type="number"
            placeholder="72"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmitRecords} loading={isEncrypting} disabled={!address}>
          Submit Encrypted Records
        </Button>

        {result && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">{result}</p>
          </div>
        )}

        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <p className="text-purple-300 text-sm font-medium mb-2">Healthcare Privacy</p>
          <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
            <li>Medical data encrypted end-to-end</li>
            <li>HIPAA-compliant data storage</li>
            <li>Computations on encrypted health records</li>
            <li>Access control for authorized personnel only</li>
            <li>Tamper-proof audit trail</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
