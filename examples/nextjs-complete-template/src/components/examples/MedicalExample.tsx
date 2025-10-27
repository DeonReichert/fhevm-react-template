'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MedicalRecord {
  id: string;
  type: string;
  value: string;
  timestamp: string;
}

export const MedicalExample: React.FC = () => {
  const [recordType, setRecordType] = useState('blood-pressure');
  const [recordValue, setRecordValue] = useState('');
  const [isStoring, setIsStoring] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const handleStoreRecord = async () => {
    if (!recordValue || isStoring) return;

    setIsStoring(true);

    // Simulate FHE storage
    setTimeout(() => {
      const newRecord: MedicalRecord = {
        id: `record-${Date.now()}`,
        type: recordType,
        value: recordValue,
        timestamp: new Date().toLocaleString(),
      };

      setRecords([newRecord, ...records].slice(0, 5));
      setRecordValue('');
      setIsStoring(false);
    }, 1500);
  };

  const getRecordLabel = (type: string) => {
    const labels: Record<string, string> = {
      'blood-pressure': 'Blood Pressure',
      'heart-rate': 'Heart Rate',
      'glucose-level': 'Glucose Level',
      'temperature': 'Temperature',
    };
    return labels[type] || type;
  };

  return (
    <Card title="Medical Records - Private Health Data">
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Protected Health Information</p>
          <p className="text-2xl font-bold">{records.length} Encrypted Records</p>
          <p className="text-xs opacity-75 mt-1">HIPAA-compliant FHE storage</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Record Type
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
          >
            <option value="blood-pressure">Blood Pressure</option>
            <option value="heart-rate">Heart Rate</option>
            <option value="glucose-level">Glucose Level</option>
            <option value="temperature">Body Temperature</option>
          </select>
        </div>

        <Input
          label="Value"
          type="text"
          value={recordValue}
          onChange={(e) => setRecordValue(e.target.value)}
          placeholder={`Enter ${getRecordLabel(recordType).toLowerCase()}`}
        />

        <Button
          onClick={handleStoreRecord}
          disabled={!recordValue || isStoring}
          variant="primary"
          className="w-full"
        >
          {isStoring ? 'Encrypting & Storing...' : 'Store Encrypted Record'}
        </Button>

        {records.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Encrypted Records:</p>
            <div className="space-y-2">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        {getRecordLabel(record.type)}
                      </p>
                      <p className="text-xs text-green-600 font-mono mt-1">
                        Encrypted: {record.value}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">{record.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
