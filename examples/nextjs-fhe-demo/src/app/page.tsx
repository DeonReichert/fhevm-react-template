'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFhevm } from '@fhevm-template/fhevm-sdk';
import { useState } from 'react';
import { EncryptionDemo } from '@/components/fhe/EncryptionDemo';
import { ComputationDemo } from '@/components/fhe/ComputationDemo';

export default function Home() {
  const { isReady, error } = useFhevm();
  const [activeTab, setActiveTab] = useState<'encrypt' | 'compute'>('encrypt');

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Next.js FHE Demo
              </h1>
              <p className="text-gray-300">
                Universal FHEVM SDK Integration Example
              </p>
            </div>
            <ConnectButton />
          </div>

          {/* SDK Status */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isReady ? 'bg-green-500' : 'bg-yellow-500'
                } ${isReady ? 'animate-pulse' : ''}`}
              />
              <span className="text-white font-medium">
                {isReady ? 'SDK Ready' : 'Initializing SDK...'}
              </span>
              {error && (
                <span className="text-red-400 text-sm ml-auto">
                  Error: {error.message}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-white/20">
            <button
              onClick={() => setActiveTab('encrypt')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'encrypt'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Encryption Demo
            </button>
            <button
              onClick={() => setActiveTab('compute')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'compute'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Computation Demo
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'encrypt' ? <EncryptionDemo /> : <ComputationDemo />}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p>
            Built with Universal FHEVM SDK • Next.js 14 • Powered by Zama FHE
          </p>
        </footer>
      </div>
    </main>
  );
}
