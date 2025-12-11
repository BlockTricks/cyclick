# Frontend Setup Guide

## ✅ Frontend Successfully Created!

The Cyclick frontend has been set up with Next.js and Reown (WalletConnect) integration.

## Quick Start

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Get a WalletConnect Project ID:**
   - Visit [cloud.reown.com](https://cloud.reown.com)
   - Sign up/login
   - Create a new project
   - Copy your Project ID

3. **Create `.env.local` file:**
   ```bash
   echo "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here" > .env.local
   ```
   Replace `your_project_id_here` with your actual Project ID.

4. **Install dependencies (if not already installed):**
   ```bash
   npm install
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features Implemented

### ✅ Pages
- **Home Page** (`/`) - Landing page with features and stats
- **Ride Tracking** (`/ride`) - Track cycling rides and submit for rewards
- **Rewards** (`/rewards`) - View token balance and cycling statistics
- **Badges** (`/badges`) - View earned NFT achievement badges

### ✅ Components
- **Header** - Navigation with wallet connection
- **WalletButton** - Connect/disconnect wallet button

### ✅ Integration
- ✅ Reown (WalletConnect) for wallet connections
- ✅ Wagmi + Viem for blockchain interactions
- ✅ Contract ABIs integrated
- ✅ Celo Mainnet contract addresses configured
- ✅ TypeScript support
- ✅ Tailwind CSS styling

## Contract Integration

All contracts are connected to Celo Mainnet:

- **CyclickToken**: `0xEADa32369D1342886679f04CC1dEEf390E2a43C4`
- **RideVerifier**: `0xe0eb4791ee8Fce0Bf144074Ab88A40Dab8c24191`
- **CarbonCredits**: `0x77A9bc6bE75D3Be641Ec649f5b6463D901CFB51d`
- **NFTBadges**: `0xFee1D3Ae671f77FaB5922C960B9558B29eF6EE39`

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page
│   ├── ride/page.tsx       # Ride tracking
│   ├── rewards/page.tsx    # Rewards dashboard
│   ├── badges/page.tsx     # NFT badges
│   └── providers.tsx       # Wagmi/Query providers
├── components/
│   ├── Header.tsx          # Navigation header
│   └── WalletButton.tsx    # Wallet connection
├── lib/
│   ├── contracts.ts        # Contract addresses
│   ├── contracts-config.ts # Contract ABIs
│   ├── wagmi.ts            # Wagmi/Reown config
│   └── abis/               # Contract ABIs (JSON)
└── public/                 # Static assets
```

## Next Steps

1. **Get WalletConnect Project ID** - Required for wallet connections
2. **Test Wallet Connection** - Connect your Celo wallet
3. **Test Ride Submission** - Submit a test ride (demo mode available)
4. **Customize Styling** - Adjust colors, fonts, and layout as needed
5. **Add GPS Tracking** - Integrate real GPS tracking for rides
6. **Deploy to Vercel** - Deploy the frontend to production

## Development Notes

- The ride tracking page includes a demo mode button to simulate distance
- In production, you'll want to integrate actual GPS tracking
- All contract interactions are ready and functional
- The app automatically connects to Celo Mainnet

## Troubleshooting

### Wallet Connection Issues
- Make sure you have a valid WalletConnect Project ID in `.env.local`
- Ensure your wallet supports Celo network
- Try switching to Celo Alfajores testnet for testing

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### Contract Interaction Issues
- Verify you're connected to Celo Mainnet
- Check that you have CELO tokens for gas fees
- Ensure contract addresses are correct in `lib/contracts.ts`

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [Reown Documentation](https://docs.reown.com)
- [Celo Documentation](https://docs.celo.org)

---

**Frontend is ready to use! 🚀**

