import { createConfig, http } from 'wagmi'
import { celo, celoAlfajores, base } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { celo as celoNetwork, celoAlfajores as alfajoresNetwork, base as baseNetwork } from '@reown/appkit/networks'

// Get project ID from environment
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

// Configure metadata
const metadata = {
  name: 'Cyclick',
  description: 'Sustainable Cycling Rewards Platform',
  url: 'https://cyclick.app',
  icons: ['https://cyclick.app/logo.png']
}

// Configure networks
const networks = [celoNetwork, alfajoresNetwork, baseNetwork]
const wagmiChains = [celo, celoAlfajores, base]

// Create Wagmi config
export const wagmiConfig = createConfig({
  chains: wagmiChains as [typeof celo, typeof celoAlfajores, typeof base],
  transports: {
    [celo.id]: http(),
    [celoAlfajores.id]: http(),
    [base.id]: http(),
  },
})

// Create Wagmi adapter - it will use the wagmiConfig we created
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

// Create AppKit
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: networks as any, // Networks are already configured in adapter
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false,
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook'],
  },
  themeMode: 'light', // Wallet modal theme (can be 'light' or 'dark')
  themeVariables: {
    '--w3m-accent': '#35D07F', // Celo green
  },
})

