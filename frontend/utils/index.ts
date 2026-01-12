// Utility functions

import { Position } from '@/types'
import { formatEther } from 'viem'

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param pos1 First position
 * @param pos2 Second position
 * @returns Distance in meters
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  const R = 6371000 // Earth radius in meters
  const dLat = (pos2.lat - pos1.lat) * Math.PI / 180
  const dLng = (pos2.lng - pos1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Calculate carbon offset from distance
 * @param distance Distance in meters
 * @returns Carbon offset in grams
 */
export function calculateCarbonOffset(distance: number): number {
  return Math.round((distance / 1000) * 200) // 200g per km
}

/**
 * Format address for display
 * @param address Ethereum address
 * @param currentAddress Current user's address (optional)
 * @returns Formatted address string
 */
export function formatAddress(address: string, currentAddress?: string): string {
  if (currentAddress && address === currentAddress) return 'You'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Format duration in seconds to MM:SS
 * @param seconds Duration in seconds
 * @returns Formatted time string
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format distance in meters to kilometers
 * @param meters Distance in meters
 * @param decimals Number of decimal places
 * @returns Formatted distance string
 */
export function formatDistance(meters: number, decimals: number = 2): string {
  return `${(meters / 1000).toFixed(decimals)} km`
}

/**
 * Format token amount from wei
 * @param amount Amount in wei (bigint)
 * @param decimals Number of decimal places
 * @returns Formatted token string
 */
export function formatTokens(amount: bigint, decimals: number = 1): string {
  return `${parseFloat(formatEther(amount)).toFixed(decimals)} CYC`
}

/**
 * Get time remaining until a timestamp
 * @param expiresAt Expiration timestamp
 * @returns Formatted time remaining string
 */
export function getTimeRemaining(expiresAt: number): string {
  const now = Date.now()
  const diff = expiresAt - now
  if (diff <= 0) return 'Expired'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? 's' : ''} left`
  }
  return `${hours}h ${minutes}m left`
}

/**
 * Convert rideId string to bytes32 format
 * @param rideId Ride ID string
 * @returns Bytes32 formatted string
 */
export function rideIdToBytes32(rideId: string): `0x${string}` {
  return `0x${rideId.replace(/[^0-9a-f]/gi, '').padStart(64, '0')}` as `0x${string}`
}
