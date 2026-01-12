// Application constants

export const APP_NAME = 'Cyclick'
export const APP_DESCRIPTION = 'Sustainable Cycling Rewards Platform'

// Colors
export const PRIMARY_COLOR = '#35D07F'
export const PRIMARY_COLOR_DARK = '#2db86a'

// Carbon offset calculation (200g CO2 per km)
export const CARBON_OFFSET_PER_KM = 200 // grams

// Minimum ride distance (1km in meters)
export const MIN_RIDE_DISTANCE = 1000

// Streak bonus multiplier (10% per day)
export const STREAK_BONUS_PER_DAY = 0.1

// Badge types
export const BADGE_TYPES = [
  { name: 'First Ride', emoji: '🎯', description: 'Complete your first ride' },
  { name: '100 km', emoji: '🏅', description: 'Cycle 100 kilometers' },
  { name: '500 km', emoji: '🥇', description: 'Cycle 500 kilometers' },
  { name: '1000 km', emoji: '👑', description: 'Cycle 1000 kilometers' },
  { name: '5000 km', emoji: '🌟', description: 'Cycle 5000 kilometers' },
  { name: '10 Rides', emoji: '⭐', description: 'Complete 10 rides' },
  { name: '50 Rides', emoji: '💫', description: 'Complete 50 rides' },
  { name: '100 Rides', emoji: '🔥', description: 'Complete 100 rides' },
  { name: 'Carbon Hero', emoji: '🌱', description: 'Special carbon offset achievement' },
] as const

// LocalStorage keys
export const STORAGE_KEYS = {
  THEME: 'cyclick-theme',
  RIDE_STREAK: 'rideStreak',
  LAST_RIDE_DATE: 'lastRideDate',
} as const

// GPS options
export const GPS_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
}
