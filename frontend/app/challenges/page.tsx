'use client'

import { Header } from '@/components/layout/Header'
import { useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import { Target, Trophy, Clock, CheckCircle, Flame } from 'lucide-react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { Challenge } from '@/types'
import { getTimeRemaining } from '@/utils'
import { STORAGE_KEYS } from '@/constants'

export default function ChallengesPage() {
  const { address, isConnected } = useAccount()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Load streak from localStorage
    const savedStreak = parseInt(localStorage.getItem(STORAGE_KEYS.RIDE_STREAK) || '0')
    setStreak(savedStreak)

    // Generate daily challenges
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dailyChallenges: Challenge[] = [
      {
        id: 'daily-1',
        title: 'Daily Ride',
        description: 'Complete a ride of at least 5km today',
        type: 'daily',
        target: 5,
        unit: 'km',
        reward: 50,
        progress: 0, // In production, fetch from contract
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
      {
        id: 'daily-2',
        title: 'Speed Demon',
        description: 'Achieve an average speed of 20 km/h',
        type: 'daily',
        target: 20,
        unit: 'km/h',
        reward: 30,
        progress: 0,
        completed: false,
        expiresAt: tomorrow.getTime(),
      },
      {
        id: 'weekly-1',
        title: 'Weekly Warrior',
        description: 'Complete 7 rides this week',
        type: 'weekly',
        target: 7,
        unit: 'rides',
        reward: 200,
        progress: 0,
        completed: false,
        expiresAt: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).getTime(),
      },
      {
        id: 'special-1',
        title: 'Carbon Hero',
        description: 'Save 1kg of CO₂ this month',
        type: 'special',
        target: 1000,
        unit: 'g CO₂',
        reward: 500,
        progress: 0,
        completed: false,
        expiresAt: new Date(today.getFullYear(), today.getMonth() + 1, 0).getTime(),
      },
    ]

    setChallenges(dailyChallenges)
  }, [])

  const handleClaim = (challenge: Challenge) => {
    if (!challenge.completed) {
      toast.error('Complete the challenge first!')
      return
    }

    // In production, call contract to claim reward
    toast.success(`Challenge completed! You earned ${challenge.reward} CYC tokens! 🎉`)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Update challenge status
    setChallenges(prev =>
      prev.map(c => c.id === challenge.id ? { ...c, completed: false } : c)
    )
  }


  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Target className="w-5 h-5" />
      case 'weekly':
        return <Trophy className="w-5 h-5" />
      default:
        return <CheckCircle className="w-5 h-5" />
    }
  }

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500'
      case 'weekly':
        return 'bg-purple-500'
      default:
        return 'bg-yellow-500'
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Challenges</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Please connect your wallet to participate in challenges
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          🎯 Challenges
        </h1>

        {/* Streak Display */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8 text-orange-500" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {streak} Day Streak
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Keep it going! Ride every day to maintain your streak.
                  </div>
                </div>
              </div>
              {streak > 0 && (
                <div className="text-right">
                  <div className="text-lg font-semibold text-[#35D07F]">
                    +{streak * 10}% Bonus
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Reward multiplier
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => {
            const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100)
            const isExpired = Date.now() > challenge.expiresAt

            return (
              <div
                key={challenge.id}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 ${
                  challenge.completed ? 'ring-2 ring-[#35D07F]' : ''
                } ${isExpired ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getChallengeColor(challenge.type)} text-white`}>
                      {getChallengeIcon(challenge.type)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {challenge.progress.toFixed(1)} / {challenge.target} {challenge.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        challenge.completed ? 'bg-[#35D07F]' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeRemaining(challenge.expiresAt)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold text-[#35D07F]">{challenge.reward} CYC</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Reward</div>
                    </div>
                    {challenge.completed ? (
                      <button
                        onClick={() => handleClaim(challenge)}
                        className="px-4 py-2 bg-[#35D07F] text-white rounded-lg font-semibold hover:bg-[#2db86a] transition-colors text-sm"
                      >
                        Claim
                      </button>
                    ) : (
                      <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg font-semibold text-sm">
                        In Progress
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
