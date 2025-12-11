import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, celo, celoAlfajores } from '@reown/appkit/networks'
import { CELO_MAINNET_CHAIN_ID, CELO_MAINNET_RPC } from './contracts'

// Get project ID from environment or use a default
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Create the Wagmi adapter
const metadata = {
  name: 'Cyclick',
  description: 'Sustainable Cycling Rewards Platform',
  url: 'https://cyclick.app',
  icons: ['https://cyclick.app/logo.png']
}

// Configure networks
const networks = [celo, celoAlfajores, mainnet]

// Create Wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  metadata
})

// Create AppKit
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook'],
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#35D07F', // Celo green
  },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

