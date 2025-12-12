'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
          {address.slice(0, 6)}...{address.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => open()}
      className="px-6 py-3 bg-[#35D07F] text-white rounded-lg font-semibold hover:bg-[#2db86a] transition-colors"
    >
      Connect Wallet
    </button>
  )
}

