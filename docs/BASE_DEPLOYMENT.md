# Base Network Deployment

## ✅ Successfully Deployed to Base Mainnet!

All contracts have been successfully deployed to **Base Mainnet**!

### Contract Addresses on Base

| Contract | Address | BaseScan Link |
|----------|---------|---------------|
| **CyclickToken** | `0xc735cF00dE720119aa1078c905AD11088abbDC09` | [View on BaseScan](https://basescan.org/address/0xc735cF00dE720119aa1078c905AD11088abbDC09) |
| **RideVerifier** | `0x60F908818315649B06B74f6D3f2B736205fF486D` | [View on BaseScan](https://basescan.org/address/0x60F908818315649B06B74f6D3f2B736205fF486D) |
| **CarbonCredits** | `0xaE5C34C772cB8DA92D892586cdd80f15845526Df` | [View on BaseScan](https://basescan.org/address/0xaE5C34C772cB8DA92D892586cdd80f15845526Df) |
| **NFTBadges** | `0xA17d98FFc3949e9E0046d3C8342bB82F8B05567e` | [View on BaseScan](https://basescan.org/address/0xA17d98FFc3949e9E0046d3C8342bB82F8B05567e) |

### Deployment Details

- **Network**: Base Mainnet (Chain ID: 8453)
- **Deployer**: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41`
- **Deployment Time**: 2025-12-12
- **RPC URL**: https://mainnet.base.org

## Contract Verification

### Current Status: ⚠️ Pending Verification

Contracts are deployed but need verification on BaseScan. To verify:

### Option 1: Using BaseScan API Key (Recommended)

1. **Get a BaseScan API Key**:
   - Visit [BaseScan](https://basescan.org/)
   - Sign up/Login
   - Go to Account Settings → API Keys
   - Create a new API key

2. **Add to `.env` file**:
   ```env
   BASESCAN_API_KEY=your_api_key_here
   # OR use Etherscan API key (same key works)
   ETHERSCAN_API_KEY=your_api_key_here
   ```

3. **Run verification**:
   ```bash
   npm run verify:base
   ```

### Option 2: Manual Verification via BaseScan UI

1. Go to each contract address on BaseScan
2. Click on the "Contract" tab
3. Click "Verify and Publish"
4. Select "Via Standard JSON Input"
5. Fill in:
   - Compiler Type: Solidity (Single file) or Standard JSON Input
   - Compiler Version: 0.8.20
   - License: MIT
   - Enter the contract source code
   - Enter constructor arguments (ABI-encoded)

### Constructor Arguments

- **CyclickToken**: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41` (deployer address)
- **RideVerifier**: 
  - Token address: `0xc735cF00dE720119aa1078c905AD11088abbDC09`
  - Owner address: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41`
- **CarbonCredits**:
  - Token address: `0xc735cF00dE720119aa1078c905AD11088abbDC09`
  - Owner address: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41`
- **NFTBadges**:
  - RideVerifier address: `0x60F908818315649B06B74f6D3f2B736205fF486D`
  - Owner address: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41`

### Option 3: Verify via Command Line

```bash
# CyclickToken
npx hardhat verify --network base \
  0xc735cF00dE720119aa1078c905AD11088abbDC09 \
  0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41

# RideVerifier
npx hardhat verify --network base \
  0x60F908818315649B06B74f6D3f2B736205fF486D \
  0xc735cF00dE720119aa1078c905AD11088abbDC09 \
  0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41

# CarbonCredits
npx hardhat verify --network base \
  0xaE5C34C772cB8DA92D892586cdd80f15845526Df \
  0xc735cF00dE720119aa1078c905AD11088abbDC09 \
  0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41

# NFTBadges
npx hardhat verify --network base \
  0xA17d98FFc3949e9E0046d3C8342bB82F8B05567e \
  0x60F908818315649B06B74f6D3f2B736205fF486D \
  0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41
```

## Deployment Commands

```bash
# Deploy to Base Mainnet
npm run deploy:base

# Deploy to Base Sepolia Testnet
npm run deploy:base-sepolia

# Verify on Base Mainnet
npm run verify:base

# Verify on Base Sepolia
npm run verify:base-sepolia
```

## Network Comparison

| Network | Chain ID | Status | Contracts |
|---------|----------|--------|-----------|
| **Celo Mainnet** | 42220 | ✅ Deployed & Verified | [View](./DEPLOYMENT_SUMMARY.md) |
| **Base Mainnet** | 8453 | ✅ Deployed | This document |

## Next Steps

1. **Get BaseScan API Key** and add to `.env`
2. **Verify Contracts** using `npm run verify:base`
3. **Update Frontend** to support Base network
4. **Test Contract Interactions** on Base

---

**Deployment completed successfully! 🎉**

For questions or issues, refer to the verification commands above or check the contract source code in the `contracts/` directory.

