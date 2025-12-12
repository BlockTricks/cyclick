'use client'

import { Header } from '@/components/Header'
import { useAccount, useReadContract } from 'wagmi'
import { contracts } from '@/lib/contracts-config'

export default function BadgesPage() {
  const { address, isConnected } = useAccount()

  // Read user's badges
  const { data: badges } = useReadContract({
    address: contracts.NFTBadges.address as `0x${string}`,
    abi: contracts.NFTBadges.abi,
    functionName: 'getOwnerBadges',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const badgeTypes = [
    { name: 'First Ride', emoji: '🎯', description: 'Complete your first ride' },
    { name: '100 km', emoji: '🏅', description: 'Cycle 100 kilometers' },
    { name: '500 km', emoji: '🥇', description: 'Cycle 500 kilometers' },
    { name: '1000 km', emoji: '👑', description: 'Cycle 1000 kilometers' },
    { name: '5000 km', emoji: '🌟', description: 'Cycle 5000 kilometers' },
    { name: '10 Rides', emoji: '⭐', description: 'Complete 10 rides' },
    { name: '50 Rides', emoji: '💫', description: 'Complete 50 rides' },
    { name: '100 Rides', emoji: '🔥', description: 'Complete 100 rides' },
    { name: 'Carbon Hero', emoji: '🌱', description: 'Special carbon offset achievement' },
  ]

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Your Badges</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Please connect your wallet to view your badges
          </p>
        </main>
      </div>
    )
  }

  const badgeCount = badges ? (badges as bigint[]).length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">🎖️ Your Badges</h1>

        <div className="max-w-4xl mx-auto">
          {/* Badge Count */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8 text-center">
            <div className="text-5xl font-bold text-[#35D07F] mb-2">
              {badgeCount}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-lg">Badges Earned</div>
          </div>

          {/* Badges Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {badgeTypes.map((badge, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{badge.emoji}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{badge.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{badge.description}</p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">About Badges</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Earn NFT badges as you reach cycling milestones! These badges are unique NFTs that you can
              collect, trade, or display. Each badge represents a significant achievement in your cycling journey.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

