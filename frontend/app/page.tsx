'use client'

import { Header } from '@/components/Header'
import { useAccount } from 'wagmi'
import Link from 'next/link'

export default function Home() {
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            🚴 Earn Rewards for Cycling
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Gamify sustainable transportation and earn tokens for every ride. 
            Save the planet while getting rewarded!
          </p>
          {!isConnected && (
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              Connect your wallet to get started
            </p>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Track Rides</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Use GPS to track your cycling routes and automatically calculate distance, 
              duration, and carbon offset.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Earn Tokens</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get rewarded with CYC tokens for every verified ride. The longer you cycle, 
              the more you earn!
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Save the Planet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Convert your rewards into carbon credits and contribute to a sustainable future.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        {isConnected && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Your Stats</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-[#35D07F]">0</div>
                <div className="text-gray-600 dark:text-gray-400">Total Rides</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#35D07F]">0 km</div>
                <div className="text-gray-600 dark:text-gray-400">Distance Cycled</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#35D07F]">0 CYC</div>
                <div className="text-gray-600 dark:text-gray-400">Tokens Earned</div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <Link
            href="/ride"
            className="inline-block px-8 py-4 bg-[#35D07F] text-white rounded-lg font-semibold text-lg hover:bg-[#2db86a] transition-colors"
          >
            Start Your First Ride
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>Built on Celo • Made with 🌱 for a sustainable future</p>
        </div>
      </footer>
    </div>
  )
}
