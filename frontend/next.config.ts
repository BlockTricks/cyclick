import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  // Use webpack instead of Turbopack for better compatibility with blockchain libraries
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      crypto: false,
    };
    
    // Ignore optional dependencies that may not be installed
    const optionalDependencies = [
      '@solana/kit',
      '@metamask/sdk',
      '@walletconnect/ethereum-provider',
      '@coinbase/wallet-sdk',
      '@gemini-wallet/core',
      'porto',
    ];
    
    config.resolve.alias = {
      ...config.resolve.alias,
      ...optionalDependencies.reduce((acc, dep) => {
        acc[dep] = false;
        return acc;
      }, {} as Record<string, false>),
    };
    
    // Use NormalModuleReplacementPlugin to handle optional dependencies
    config.plugins = config.plugins || [];
    optionalDependencies.forEach((dep) => {
      config.plugins!.push(
        new webpack.NormalModuleReplacementPlugin(
          new RegExp(`^${dep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`),
          require.resolve('./lib/empty-module.js')
        )
      );
    });
    
    // Ignore warnings for optional dependencies
    if (!config.ignoreWarnings) {
      config.ignoreWarnings = [];
    }
    config.ignoreWarnings.push(
      { module: /@solana/ },
      { module: /@coinbase/ },
      { module: /@metamask/ },
      { module: /@walletconnect/ },
      { module: /@gemini/ },
      { module: /porto/ },
    );
    
    return config;
  },
  // Set empty turbopack config to silence the warning
  turbopack: {},
};

export default nextConfig;
