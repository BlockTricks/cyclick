# Cyclick Frontend

Next.js frontend for the Cyclick sustainable cycling rewards platform, built on Celo blockchain.

## Features

- 🚴 **Ride Tracking** - Track your cycling rides and earn rewards
- 💰 **Token Rewards** - Earn CYC tokens for verified rides
- 🎖️ **NFT Badges** - Collect achievement badges as NFTs
- 🌱 **Carbon Credits** - Convert rewards to carbon credits
- 🔗 **Wallet Connect** - Connect using Reown (WalletConnect) with support for multiple wallets

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Wallet**: Reown (WalletConnect)
- **Blockchain**: Celo Mainnet

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- WalletConnect Project ID (get one at [cloud.reown.com](https://cloud.reown.com))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── ride/              # Ride tracking page
│   ├── rewards/           # Rewards dashboard
│   └── badges/            # NFT badges page
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   └── WalletButton.tsx   # Wallet connection button
├── lib/                   # Utilities and config
│   ├── contracts.ts       # Contract addresses
│   ├── contracts-config.ts # Contract ABIs and config
│   ├── wagmi.ts           # Wagmi/Reown configuration
│   └── abis/              # Contract ABIs
└── public/                # Static assets
```

## Contract Addresses

All contracts are deployed on Celo Mainnet:

- **CyclickToken**: `0xEADa32369D1342886679f04CC1dEEf390E2a43C4`
- **RideVerifier**: `0xe0eb4791ee8Fce0Bf144074Ab88A40Dab8c24191`
- **CarbonCredits**: `0x77A9bc6bE75D3Be641Ec649f5b6463D901CFB51d`
- **NFTBadges**: `0xFee1D3Ae671f77FaB5922C960B9558B29eF6EE39`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Wallet Connection

The app uses Reown (WalletConnect) for wallet connections. Supported wallets include:

- MetaMask
- WalletConnect
- Celo Wallet
- Valora
- And many more...

## Features in Development

- [ ] GPS-based ride tracking
- [ ] Real-time route visualization
- [ ] Carbon credit marketplace UI
- [ ] Social features and leaderboards
- [ ] Mobile app (React Native)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Reown Documentation](https://docs.reown.com)
- [Celo Documentation](https://docs.celo.org)

## License

MIT
