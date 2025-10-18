'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useFhevm } from '@fhevm-template/fhe-sdk';
import { useState } from 'react';
import { EncryptionDemo } from '@/components/EncryptionDemo';
import { DecryptionDemo } from '@/components/DecryptionDemo';

export default function Home() {
  const { isReady, error } = useFhevm();
  const [activeTab, setActiveTab] = useState<'encrypt' | 'decrypt'>('encrypt');

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
              onClick={() => setActiveTab('decrypt')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'decrypt'
                  ? 'text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Decryption Demo
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'encrypt' ? <EncryptionDemo /> : <DecryptionDemo />}
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
