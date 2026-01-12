'use client'

import { WalletButton } from '@/components/ui/WalletButton'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ChainSelector } from '@/components/ui/ChainSelector'
import Link from 'next/link'

export function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-[#35D07F]">🚴 Cyclick</div>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Home
          </Link>
          <Link href="/ride" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Start Ride
          </Link>
          <Link href="/challenges" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Challenges
          </Link>
          <Link href="/leaderboard" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Leaderboard
          </Link>
          <Link href="/marketplace" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Marketplace
          </Link>
          <Link href="/analytics" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Analytics
          </Link>
          <Link href="/rewards" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Rewards
          </Link>
          <Link href="/badges" className="text-gray-700 dark:text-gray-300 hover:text-[#35D07F] transition-colors">
            Badges
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ChainSelector />
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </header>
  )
}

