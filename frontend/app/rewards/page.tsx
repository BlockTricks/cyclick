'use client'

import { Header } from '@/components/Header'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { contracts } from '@/lib/contracts-config'
import { formatEther } from 'viem'

export default function RewardsPage() {
  const { address, isConnected } = useAccount()

  // Read token balance
  const { data: tokenBalance } = useReadContract({
    address: contracts.CyclickToken.address as `0x${string}`,
    abi: contracts.CyclickToken.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  // Read rider stats
  const { data: riderStats } = useReadContract({
    address: contracts.RideVerifier.address as `0x${string}`,
    abi: contracts.RideVerifier.abi,
    functionName: 'getRiderStats',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Your Rewards</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Please connect your wallet to view your rewards
          </p>
        </main>
      </div>
    )
  }

  const balance = tokenBalance ? formatEther(tokenBalance as bigint) : '0'
  const stats = riderStats as [bigint, bigint, bigint] | undefined
  const totalRides = stats ? Number(stats[0]) : 0
  const totalDistance = stats ? Number(stats[1]) / 1000 : 0 // Convert to km
  const totalRewards = stats ? formatEther(stats[2]) : '0'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">💰 Your Rewards</h1>

        <div className="max-w-4xl mx-auto">
          {/* Token Balance Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">CYC Token Balance</h2>
            <div className="text-5xl font-bold text-[#35D07F] mb-4">
              {parseFloat(balance).toFixed(2)} CYC
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Your current Cyclick Token balance
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-[#35D07F] mb-2">
                {totalRides}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Rides</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalDistance.toFixed(2)} km
              </div>
              <div className="text-gray-600 dark:text-gray-400">Distance Cycled</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {parseFloat(totalRewards).toFixed(2)} CYC
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Earned</div>
            </div>
          </div>

          {/* Rewards Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">How Rewards Work</h2>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="text-[#35D07F] mr-2">✓</span>
                <span>Earn 10 CYC tokens per kilometer cycled</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#35D07F] mr-2">✓</span>
                <span>Get an additional 2 CYC tokens per km for carbon offset</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#35D07F] mr-2">✓</span>
                <span>Minimum ride distance: 1 km</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#35D07F] mr-2">✓</span>
                <span>Rewards are automatically minted when you verify your ride</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

