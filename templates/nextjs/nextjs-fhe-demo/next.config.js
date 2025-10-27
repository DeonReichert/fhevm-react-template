/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@fhevm-template/fhe-sdk'],
  },
};

module.exports = nextConfig;
