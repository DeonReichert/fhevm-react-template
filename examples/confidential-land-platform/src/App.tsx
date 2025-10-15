import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import * as Tabs from '@radix-ui/react-tabs';
import { config } from './lib/wagmi';
import { useToast } from './hooks/useToast';
import { ToastProvider } from './components/Toast';
import { TransactionHistory } from './components/TransactionHistory';
import { RegisterZoneForm } from './components/RegisterZoneForm';
import { SubmitProjectForm } from './components/SubmitProjectForm';
import { UpdateMetricsForm } from './components/UpdateMetricsForm';
import { AnalysisTools } from './components/AnalysisTools';
import { PlatformManagement } from './components/PlatformManagement';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <ToastProvider toasts={toasts} onClose={removeToast}>
      <div className="min-h-screen">
        {/* Header with Glassmorphism */}
        <header className="relative border-b" style={{
          background: 'var(--color-panel)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
          <div className="container py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
                  <span className="text-4xl">🏙️</span>
                  <span style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--success))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Confidential Land Platform
                  </span>
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Privacy-Preserving Urban Planning with Fully Homomorphic Encryption
                </p>
              </div>
              <div className="flex items-center gap-3">
                <TransactionHistory />
                <ConnectButton />
              </div>
            </div>
          </div>
        </header>

        {/* Privacy Notice with Glassmorphism */}
        <div className="panel mx-4 mt-6 animate-slideIn" style={{
          background: 'linear-gradient(135deg, rgba(109, 110, 255, 0.12), rgba(43, 195, 123, 0.08))',
          border: '1px solid rgba(109, 110, 255, 0.25)'
        }}>
          <div className="container py-4">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">🔒</div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1" style={{ color: 'var(--accent)' }}>
                  Privacy Protection
                </h4>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  All sensitive land data is encrypted using FHE technology, ensuring complete privacy
                  while enabling collaborative urban planning analysis.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container py-8">
          <Tabs.Root defaultValue="register" className="space-y-6">
            <Tabs.List className="flex flex-wrap gap-2 pb-4" style={{
              borderBottom: '1px solid var(--color-border)'
            }}>
              <Tabs.Trigger
                value="register"
                className="px-6 py-3 font-semibold text-sm transition-all"
                style={{
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-muted)'
                }}
                data-state="active"
              >
                Register Zone
              </Tabs.Trigger>
              <Tabs.Trigger
                value="project"
                className="px-6 py-3 font-semibold text-sm transition-all"
                style={{
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-muted)'
                }}
              >
                Submit Project
              </Tabs.Trigger>
              <Tabs.Trigger
                value="metrics"
                className="px-6 py-3 font-semibold text-sm transition-all"
                style={{
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-muted)'
                }}
              >
                Update Metrics
              </Tabs.Trigger>
              <Tabs.Trigger
                value="analysis"
                className="px-6 py-3 font-semibold text-sm transition-all"
                style={{
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-muted)'
                }}
              >
                Analysis Tools
              </Tabs.Trigger>
              <Tabs.Trigger
                value="management"
                className="px-6 py-3 font-semibold text-sm transition-all"
                style={{
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--color-text-muted)'
                }}
              >
                Management
              </Tabs.Trigger>
            </Tabs.List>

            <style>{`
              [data-state="active"] {
                background: linear-gradient(135deg, var(--accent), var(--accent-hover)) !important;
                color: #ffffff !important;
                box-shadow: 0 4px 12px rgba(109, 110, 255, 0.3);
              }
              [data-state="inactive"]:hover {
                background: rgba(109, 110, 255, 0.1);
                color: var(--color-text) !important;
              }
            `}</style>

            <Tabs.Content value="register">
              <RegisterZoneForm />
            </Tabs.Content>

            <Tabs.Content value="project" className="animate-fadeIn">
              <SubmitProjectForm />
            </Tabs.Content>

            <Tabs.Content value="metrics" className="animate-fadeIn">
              <UpdateMetricsForm />
            </Tabs.Content>

            <Tabs.Content value="analysis" className="animate-fadeIn">
              <AnalysisTools />
            </Tabs.Content>

            <Tabs.Content value="management" className="animate-fadeIn">
              <PlatformManagement />
            </Tabs.Content>
          </Tabs.Root>
        </main>

        {/* Footer with Glassmorphism */}
        <footer className="relative mt-16 border-t" style={{
          background: 'var(--color-panel)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}>
          <div className="container py-8">
            <div className="text-center">
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                🔐 Confidential Land Platform
              </p>
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Powered by ZAMA fhEVM & Fully Homomorphic Encryption
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Deployed on Sepolia Testnet • © 2025
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale="en-US">
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
