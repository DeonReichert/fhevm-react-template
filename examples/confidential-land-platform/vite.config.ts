import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable for production security
    minify: 'esbuild', // Fast minification
    target: 'es2020',

    // Security & Performance: Code Splitting Strategy
    // Reduces attack surface by isolating critical code
    // Improves load time with lazy loading
    rollupOptions: {
      output: {
        // Simplified manual chunks to avoid dependency issues
        manualChunks: {
          // React and core UI libraries
          'react-vendor': ['react', 'react-dom'],
          // RainbowKit wallet UI (keep together to preserve dependencies)
          'rainbowkit': ['@rainbow-me/rainbowkit'],
          // Radix UI components
          'radix-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs', '@radix-ui/react-toast'],
        },

        // Security: Content hashing for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      }
    },

    // Performance optimization
    chunkSizeWarningLimit: 600, // Warn if chunks exceed 600kb
    reportCompressedSize: true,

    // Security: Tree shaking for dead code elimination
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false
    }
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      // Security: Remove console logs in production
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    // Performance: Pre-bundle dependencies
    include: [
      'react',
      'react-dom',
      'ethers',
      'wagmi',
      'viem',
      '@rainbow-me/rainbowkit'
    ]
  },

  server: {
    port: 1271,
    strictPort: false,
    host: true,
    // Security headers for development
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  },

  // Security: Prevent exposure of sensitive env vars
  envPrefix: 'VITE_',

  // Performance: Enable CSS code splitting
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
