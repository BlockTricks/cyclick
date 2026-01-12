'use client'

import { Header } from '@/components/layout/Header'
import { useAccount, useReadContract } from 'wagmi'
import { contracts } from '@/lib/contracts-config'
import { formatEther } from 'viem'
import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { LeaderboardEntry, LeaderboardFilter } from '@/types'
import { formatAddress, formatTokens } from '@/utils'

export default function LeaderboardPage() {
  const { address } = useAccount()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [filter, setFilter] = useState<LeaderboardFilter>('distance')
  const [loading, setLoading] = useState(true)

  // This is a simplified version - in production, you'd index events or use The Graph
  // For now, we'll show a demo leaderboard structure
  useEffect(() => {
    // Simulate loading leaderboard data
    // In production, you'd fetch from an indexer or subgraph
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        address: '0x1234...5678',
        rides: BigInt(150),
        distance: BigInt(5000000), // 5000 km
        rewards: BigInt('70000000000000000000'), // 70 tokens
        rank: 1,
      },
      {
        address: '0xabcd...efgh',
        rides: BigInt(120),
        distance: BigInt(4000000), // 4000 km
        rewards: BigInt('56000000000000000000'), // 56 tokens
        rank: 2,
      },
      {
        address: address || '0x0000...0000',
        rides: BigInt(45),
        distance: BigInt(1500000), // 1500 km
        rewards: BigInt('21000000000000000000'), // 21 tokens
        rank: 3,
      },
    ]

    setTimeout(() => {
      setLeaderboard(mockLeaderboard)
      setLoading(false)
    }, 1000)
  }, [address])

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (filter === 'distance') {
      return Number(b.distance - a.distance)
    } else if (filter === 'rides') {
      return Number(b.rides - a.rides)
    } else {
      return Number(b.rewards - a.rewards)
    }
  })

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />
    return <span className="text-gray-500 font-bold">#{rank}</span>
  }


  const isCurrentUser = (addr: string) => addr === address

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          🏆 Leaderboard
        </h1>

        {/* Filter Buttons */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setFilter('distance')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                filter === 'distance'
                  ? 'bg-[#35D07F] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Distance
            </button>
            <button
              onClick={() => setFilter('rides')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                filter === 'rides'
                  ? 'bg-[#35D07F] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Total Rides
            </button>
            <button
              onClick={() => setFilter('rewards')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                filter === 'rewards'
                  ? 'bg-[#35D07F] text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Rewards
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#35D07F]"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedLeaderboard.map((entry, index) => (
                  <div
                    key={entry.address}
                    className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      isCurrentUser(entry.address) ? 'bg-green-50 dark:bg-green-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(index + 1)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {formatAddress(entry.address, address)}
                            </span>
                            {isCurrentUser(entry.address) && (
                              <span className="px-2 py-1 bg-[#35D07F] text-white text-xs rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-8">
                        <div className="text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Distance</div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {(Number(entry.distance) / 1000).toFixed(1)} km
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Rides</div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {entry.rides.toString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400">Rewards</div>
                          <div className="font-bold text-[#35D07F]">
                            {formatTokens(entry.rewards)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              Note: In production, this would fetch real-time data from blockchain events or a subgraph indexer.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
