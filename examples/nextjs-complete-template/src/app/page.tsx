'use client';

import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';
import { KeyManager } from '@/components/fhe/KeyManager';
import { FHEProvider } from '@/components/fhe/FHEProvider';
import { BankingExample } from '@/components/examples/BankingExample';
import { MedicalExample } from '@/components/examples/MedicalExample';

export default function Home() {
  return (
    <FHEProvider>
      <main className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              FHEVM Next.js Template
            </h1>
            <p className="text-xl text-white/90">
              Complete demonstration of Fully Homomorphic Encryption operations
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <EncryptionDemo />
            <ComputationDemo />
            <KeyManager />
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <BankingExample />
            <MedicalExample />
          </div>
        </div>
      </main>
    </FHEProvider>
  );
}
