# Contract Verification Guide

## Contracts Deployed to Celo Mainnet

All contracts have been successfully deployed! Here are the addresses:

- **CyclickToken**: `0xEADa32369D1342886679f04CC1dEEf390E2a43C4`
- **RideVerifier**: `0xe0eb4791ee8Fce0Bf144074Ab88A40Dab8c24191`
- **CarbonCredits**: `0x77A9bc6bE75D3Be641Ec649f5b6463D901CFB51d`
- **NFTBadges**: `0xFee1D3Ae671f77FaB5922C960B9558B29eF6EE39`

## View on CeloScan

- [CyclickToken](https://celoscan.io/address/0xEADa32369D1342886679f04CC1dEEf390E2a43C4)
- [RideVerifier](https://celoscan.io/address/0xe0eb4791ee8Fce0Bf144074Ab88A40Dab8c24191)
- [CarbonCredits](https://celoscan.io/address/0x77A9bc6bE75D3Be641Ec649f5b6463D901CFB51d)
- [NFTBadges](https://celoscan.io/address/0xFee1D3Ae671f77FaB5922C960B9558B29eF6EE39)

## Getting a CeloScan API Key

1. Go to [CeloScan](https://celoscan.io/)
2. Create an account or sign in
3. Navigate to your account settings
4. Go to the API Keys section
5. Create a new API key
6. Copy the API key

## Setting Up Verification

1. Add the API key to your `.env` file:
   ```env
   CELOSCAN_API_KEY=your_api_key_here
   ```

2. The Hardhat config is already set up for verification.

## Verifying Contracts

### Option 1: Automatic Verification (Recommended)

Run the verification script:
```bash
npm run verify:mainnet
```

### Option 2: Manual Verification

Verify each contract individually:

```bash
# Verify CyclickToken
npx hardhat verify --network celo 0xEADa32369D1342886679f04CC1dEEf390E2a43C4 0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41

# Verify RideVerifier
npx hardhat verify --network celo 0xe0eb4791ee8Fce0Bf144074Ab88A40Dab8c24191 0xEADa32369D1342886679f04CC1dEEf390E2a43C4 0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41

# Verify CarbonCredits
npx hardhat verify --network celo 0x77A9bc6bE75D3Be641Ec649f5b6463D901CFB51d 0xEADa32369D1342886679f04CC1dEEf390E2a43C4 0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41

# Verify NFTBadges
npx hardhat verify --network celo 0xFee1D3Ae671f77FaB5922C960B9558B29eF6EE39 0xe0eb4791ee8Fce0Bf144074Ab88A40Dab8c24191 0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41
```

### Option 3: Manual Verification via CeloScan UI

1. Go to each contract address on CeloScan
2. Click on the "Contract" tab
3. Click "Verify and Publish"
4. Select "Via Standard JSON Input"
5. Fill in:
   - Compiler Type: Solidity (Single file) or Standard JSON Input
   - Compiler Version: 0.8.20
   - License: MIT
   - Enter the contract source code
   - Enter constructor arguments (ABI-encoded)

## Constructor Arguments

- **CyclickToken**: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41` (deployer address)
- **RideVerifier**: 
  - Token address: `0xEADa32369D1342886679f04CC1dEEf390E2a43C4`
  - Owner address: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41`
- **CarbonCredits**:
  - Token address: `0xEADa32369D1342886679f04CC1dEEf390E2a43C4`
  - Owner address: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41`
- **NFTBadges**:
  - RideVerifier address: `0xe0eb4791ee8Fce0Bf144074Ab88A40Dab8c24191`
  - Owner address: `0x3Be7fbBDbC73Fc4731D60EF09c4BA1A94DC58E41`

## Troubleshooting

If verification fails:
1. Ensure you have the correct API key in your `.env` file
2. Wait a few minutes after deployment for the contract to be indexed
3. Double-check constructor arguments
4. Try manual verification via CeloScan UI


