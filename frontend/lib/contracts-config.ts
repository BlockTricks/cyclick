import { CONTRACT_ADDRESSES } from './contracts'
// @ts-ignore - JSON imports
import CyclickTokenABI from './abis/CyclickToken.json'
// @ts-ignore - JSON imports
import RideVerifierABI from './abis/RideVerifier.json'
// @ts-ignore - JSON imports
import CarbonCreditsABI from './abis/CarbonCredits.json'
// @ts-ignore - JSON imports
import NFTBadgesABI from './abis/NFTBadges.json'

export const contracts = {
  CyclickToken: {
    address: CONTRACT_ADDRESSES.CyclickToken,
    abi: CyclickTokenABI,
  },
  RideVerifier: {
    address: CONTRACT_ADDRESSES.RideVerifier,
    abi: RideVerifierABI,
  },
  CarbonCredits: {
    address: CONTRACT_ADDRESSES.CarbonCredits,
    abi: CarbonCreditsABI,
  },
  NFTBadges: {
    address: CONTRACT_ADDRESSES.NFTBadges,
    abi: NFTBadgesABI,
  },
} as const

