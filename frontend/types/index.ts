// Common types used across the application

export interface Position {
  lat: number
  lng: number
  timestamp: number
}

export interface LeaderboardEntry {
  address: string
  rides: bigint
  distance: bigint
  rewards: bigint
  rank: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'daily' | 'weekly' | 'special'
  target: number
  unit: string
  reward: number
  progress: number
  completed: boolean
  expiresAt: number
}

export interface CarbonCredit {
  id: string
  owner: string
  amount: number // in grams
  price: string // tokens per gram
  timestamp: number
}

export type LeaderboardFilter = 'distance' | 'rides' | 'rewards'

export type MarketplaceAction = 'convert' | 'list' | 'buy' | 'donate' | null

export type Theme = 'light' | 'dark'
