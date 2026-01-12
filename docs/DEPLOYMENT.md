# Deployment Guide

## Prerequisites

1. Node.js (v16 or higher)
2. npm or yarn
3. A Celo wallet with testnet tokens (for Alfajores testnet)
4. Private key of your wallet

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Fill in your `.env` file:**
   ```env
   CELO_NETWORK=alfajores
   PRIVATE_KEY=your_private_key_here
   CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
   ```

## Getting Testnet Tokens

To get Alfajores testnet tokens:
1. Visit: https://faucet.celo.org/alfajores
2. Connect your wallet
3. Request testnet tokens (CELO, cUSD, cEUR)

## Compile Contracts

```bash
npm run compile
```

## Deploy to Alfajores Testnet

```bash
npm run deploy:testnet
```

## Deploy to Celo Mainnet

```bash
npm run deploy:mainnet
```

## Deployment Order

The deployment script automatically deploys contracts in the correct order:

1. **CyclickToken** - ERC-20 reward token
2. **RideVerifier** - Ride verification and reward distribution
3. **CarbonCredits** - Carbon credit marketplace
4. **NFTBadges** - Achievement badge NFTs

After deployment, the script will:
- Link RideVerifier to CyclickToken
- Set up all necessary contract relationships
- Save deployment addresses to `deployments/{network}.json`

## Verify Deployment

After deployment, check the `deployments/` directory for the deployment information file.

## Contract Addresses

After deployment, you'll see output like:

```
=== Deployment Summary ===
Network: alfajores
Deployer: 0x...

Contract Addresses:
CyclickToken: 0x...
RideVerifier: 0x...
CarbonCredits: 0x...
NFTBadges: 0x...
```

Save these addresses for your frontend integration!




