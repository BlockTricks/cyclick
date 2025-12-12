'use client'

import { Header } from '@/components/Header'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contracts } from '@/lib/contracts-config'
import { parseEther, formatEther } from 'viem'

export default function RidePage() {
  const { address, isConnected } = useAccount()
  const [isTracking, setIsTracking] = useState(false)
  const [distance, setDistance] = useState(0) // in meters
  const [duration, setDuration] = useState(0) // in seconds
  const [startTime, setStartTime] = useState<number | null>(null)
  const [rideId, setRideId] = useState<string>('')

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Calculate carbon offset (rough estimate: 0.2kg CO2 per km)
  const carbonOffset = Math.round((distance / 1000) * 200) // in grams

  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      if (startTime) {
        setDuration(Math.floor((Date.now() - startTime) / 1000))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const startRide = () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    setIsTracking(true)
    setStartTime(Date.now())
    setDistance(0)
    setDuration(0)
    // Generate a unique ride ID
    setRideId(`ride_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  }

  const stopRide = () => {
    setIsTracking(false)
  }

  const submitRide = async () => {
    if (!address || distance < 1000) {
      alert('Ride must be at least 1km to submit')
      return
    }

    try {
      // Convert rideId to bytes32
      const rideIdBytes32 = `0x${rideId.replace(/[^0-9a-f]/gi, '').padStart(64, '0')}`

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
      alert('Error submitting ride. Please try again.')
    }
  }

  const verifyRide = async () => {
    if (!rideId) return

    try {
      const rideIdBytes32 = `0x${rideId.replace(/[^0-9a-f]/gi, '').padStart(64, '0')}`

      writeContract({
        address: contracts.RideVerifier.address as `0x${string}`,
        abi: contracts.RideVerifier.abi,
        functionName: 'verifyRide',
        args: [rideIdBytes32 as `0x${string}`],
      })
    } catch (error) {
      console.error('Error verifying ride:', error)
      alert('Error verifying ride. Please try again.')
    }
  }

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

        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {/* Ride Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div className="text-2xl font-bold text-[#35D07F]">
                {(distance / 1000).toFixed(2)} km
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {carbonOffset}g
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">CO₂ Saved</div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {!isTracking ? (
              <button
                onClick={startRide}
                className="w-full px-6 py-4 bg-[#35D07F] text-white rounded-lg font-semibold text-lg hover:bg-[#2db86a] transition-colors"
              >
                Start Ride
              </button>
            ) : (
              <>
                <button
                  onClick={stopRide}
                  className="w-full px-6 py-4 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600 transition-colors"
                >
                  Stop Ride
                </button>
                <div className="text-center text-gray-600 dark:text-gray-300">
                  <p>Ride in progress... 🚴</p>
                  <p className="text-sm mt-2">
                    Note: In a real app, this would use GPS to track your actual route
                  </p>
                </div>
              </>
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
                    disabled={isPending || isConfirming}
                    className="w-full px-6 py-4 bg-purple-500 text-white rounded-lg font-semibold text-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    Verify & Claim Rewards
                  </button>
                )}
              </>
            )}

            {isConfirmed && (
              <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-center">
                ✅ Ride submitted successfully! You can now verify it to claim rewards.
              </div>
            )}
          </div>

          {/* Demo: Simulate distance increase */}
          {isTracking && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Demo Mode:</p>
              <button
                onClick={() => setDistance(distance + 1000)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                +1 km (Demo)
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

