'use client'

import { Header } from '@/components/layout/Header'
import { useAccount } from 'wagmi'
import { useState, useEffect, useRef } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contracts } from '@/lib/contracts-config'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'
import confetti from 'canvas-confetti'
import { Position } from '@/types'
import { calculateDistance, calculateCarbonOffset, rideIdToBytes32, formatDuration, formatDistance } from '@/utils'
import { GPS_OPTIONS, STORAGE_KEYS } from '@/constants'

// Dynamically import map to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/features/RideMap'), { ssr: false })

export default function RidePage() {
  const { address, isConnected } = useAccount()
  const [isTracking, setIsTracking] = useState(false)
  const [distance, setDistance] = useState(0) // in meters
  const [duration, setDuration] = useState(0) // in seconds
  const [startTime, setStartTime] = useState<number | null>(null)
  const [rideId, setRideId] = useState<string>('')
  const [route, setRoute] = useState<Position[]>([])
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null)
  const [watchId, setWatchId] = useState<number | null>(null)
  const [speed, setSpeed] = useState(0) // in km/h
  const [maxSpeed, setMaxSpeed] = useState(0)
  const [elevation, setElevation] = useState(0) // in meters
  const [avgSpeed, setAvgSpeed] = useState(0)

  const [actionType, setActionType] = useState<'submit' | 'verify' | null>(null)
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Calculate carbon offset
  const carbonOffset = calculateCarbonOffset(distance)

  // Update duration timer
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      if (startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        setDuration(elapsed)
        if (elapsed > 0 && distance > 0) {
          setAvgSpeed((distance / 1000) / (elapsed / 3600)) // km/h
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTracking, startTime, distance])

  // GPS tracking
  useEffect(() => {
    if (!isTracking || !navigator.geolocation) return

    const options = GPS_OPTIONS

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos: Position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now()
        }

        setCurrentPosition(newPos)

        // Calculate speed if we have previous position
        if (route.length > 0) {
          const lastPos = route[route.length - 1]
          const segmentDistance = calculateDistance(lastPos, newPos)
          const timeDiff = (newPos.timestamp - lastPos.timestamp) / 1000 // seconds
          
          if (timeDiff > 0) {
            const currentSpeed = (segmentDistance / 1000) / (timeDiff / 3600) // km/h
            setSpeed(currentSpeed)
            if (currentSpeed > maxSpeed) {
              setMaxSpeed(currentSpeed)
            }
          }

          // Update total distance
          setDistance(prev => prev + segmentDistance)
        }

        // Update elevation if available
        if (position.coords.altitude) {
          setElevation(position.coords.altitude)
        }

        // Add to route
        setRoute(prev => [...prev, newPos])
      },
      (error) => {
        console.error('GPS error:', error)
        toast.error('GPS error: ' + error.message)
      },
      options
    )

    setWatchId(watchId)

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [isTracking, route.length, maxSpeed])

  const startRide = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!navigator.geolocation) {
      toast.error('GPS is not available in your browser')
      return
    }

    // Request location permission
    navigator.geolocation.getCurrentPosition(
      () => {
        setIsTracking(true)
        setStartTime(Date.now())
        setDistance(0)
        setDuration(0)
        setRoute([])
        setSpeed(0)
        setMaxSpeed(0)
        setElevation(0)
        setAvgSpeed(0)
        setRideId(`ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
        toast.success('Ride started! 🚴')
      },
      (error) => {
        toast.error('Please allow location access to track your ride')
        console.error('Location error:', error)
      }
    )
  }

  const stopRide = () => {
    setIsTracking(false)
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    toast.success('Ride stopped! You can now submit your ride.')
  }

  const submitRide = async () => {
    if (!address || distance < 1000) {
      toast.error('Ride must be at least 1km to submit')
      return
    }

    try {
      // Convert rideId to bytes32
      const rideIdBytes32 = rideIdToBytes32(rideId)

      setActionType('submit')
      toast.loading('Submitting ride...', { id: 'tx-action' })
      
      writeContract({
        address: contracts.RideVerifier.address as `0x${string}`,
        abi: contracts.RideVerifier.abi,
        functionName: 'submitRide',
        args: [
          rideIdBytes32 as `0x${string}`,
          BigInt(distance),
          BigInt(duration),
          BigInt(carbonOffset),
        ],
      })
    } catch (error) {
      console.error('Error submitting ride:', error)
      toast.error('Error submitting ride. Please try again.', { id: 'tx-action' })
      setActionType(null)
    }
  }

  const verifyRide = async () => {
    if (!rideId) return

    try {
      const rideIdBytes32 = rideIdToBytes32(rideId)

      setActionType('verify')
      toast.loading('Verifying ride and claiming rewards...', { id: 'tx-action' })

      writeContract({
        address: contracts.RideVerifier.address as `0x${string}`,
        abi: contracts.RideVerifier.abi,
        functionName: 'verifyRide',
        args: [rideIdBytes32 as `0x${string}`],
      })
    } catch (error) {
      console.error('Error verifying ride:', error)
      toast.error('Error verifying ride. Please try again.', { id: 'tx-action' })
      setActionType(null)
    }
  }

  // Handle transaction status
  useEffect(() => {
    if (isPending && actionType) {
      toast.loading(
        actionType === 'submit' ? 'Transaction pending...' : 'Verifying ride...',
        { id: 'tx-action' }
      )
    } else if (isConfirming && actionType) {
      toast.loading(
        actionType === 'submit' ? 'Confirming transaction...' : 'Confirming verification...',
        { id: 'tx-action' }
      )
    } else if (isConfirmed && actionType) {
      if (actionType === 'submit') {
        toast.success('Ride submitted successfully! You can now verify it.', { id: 'tx-action' })
      } else if (actionType === 'verify') {
        toast.success('Ride verified! Rewards have been claimed! 🎉', { id: 'tx-action' })
        // Celebrate with confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
      setActionType(null)
    }
  }, [isPending, isConfirming, isConfirmed, actionType])

  // Update streak in localStorage
  useEffect(() => {
    if (isConfirmed && actionType === 'verify') {
      const today = new Date().toDateString()
      const lastRide = localStorage.getItem(STORAGE_KEYS.LAST_RIDE_DATE)
      const currentStreak = parseInt(localStorage.getItem(STORAGE_KEYS.RIDE_STREAK) || '0')
      
      if (lastRide === today) {
        // Already rode today, don't update streak
        return
      }
      
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toDateString()
      
      if (lastRide === yesterdayStr) {
        // Continue streak
        localStorage.setItem(STORAGE_KEYS.RIDE_STREAK, (currentStreak + 1).toString())
      } else {
        // New streak
        localStorage.setItem(STORAGE_KEYS.RIDE_STREAK, '1')
      }
      
      localStorage.setItem(STORAGE_KEYS.LAST_RIDE_DATE, today)
    }
  }, [isConfirmed, actionType])

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Start a Ride</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Please connect your wallet to start tracking your ride
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">🚴 Track Your Ride</h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats and Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Ride Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Ride Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-[#35D07F]">
                {formatDistance(distance)}
              </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatDuration(duration)}
              </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {carbonOffset}g
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">CO₂ Saved</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {avgSpeed.toFixed(1)} km/h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg Speed</div>
                </div>
                {maxSpeed > 0 && (
                  <>
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {maxSpeed.toFixed(1)} km/h
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Max Speed</div>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {elevation.toFixed(0)}m
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Elevation</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
              {!isTracking ? (
                <button
                  onClick={startRide}
                  className="w-full px-6 py-4 bg-[#35D07F] text-white rounded-lg font-semibold text-lg hover:bg-[#2db86a] transition-colors"
                >
                  Start Ride
                </button>
              ) : (
                <button
                  onClick={stopRide}
                  className="w-full px-6 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                >
                  Stop Ride
                </button>
              )}

              {!isTracking && distance > 0 && (
                <>
                  <button
                    onClick={submitRide}
                    disabled={isPending || isConfirming}
                    className="w-full px-6 py-4 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isPending ? 'Submitting...' : isConfirming ? 'Confirming...' : 'Submit Ride'}
                  </button>
                  {isConfirmed && (
                    <button
                      onClick={verifyRide}
                      disabled={isPending || isConfirming || actionType === 'verify'}
                      className="w-full px-6 py-4 bg-purple-500 text-white rounded-lg font-semibold text-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                      {actionType === 'verify' && (isPending || isConfirming) 
                        ? 'Verifying...' 
                        : 'Verify & Claim Rewards'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Route Map</h2>
              <div className="h-[600px] rounded-lg overflow-hidden">
                <MapComponent 
                  route={route} 
                  currentPosition={currentPosition}
                  isTracking={isTracking}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
