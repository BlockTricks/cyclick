'use client'

import { useAccount, useSwitchChain, useChainId } from 'wagmi'
import { base, celo, celoAlfajores } from 'wagmi/chains'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const chains = [
  { id: celo.id, name: 'Celo', icon: '🌱' },
  { id: celoAlfajores.id, name: 'Celo Alfajores', icon: '🧪' },
  { id: base.id, name: 'Base', icon: '🔵' },
]

export function ChainSelector() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [isOpen, setIsOpen] = useState(false)

  if (!isConnected) return null

  const currentChain = chains.find(c => c.id === chainId) || chains[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <span>{currentChain.icon}</span>
        <span className="hidden md:inline">{currentChain.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 min-w-[200px]">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  switchChain({ chainId: chain.id })
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  chain.id === chainId ? 'bg-[#35D07F]/10' : ''
                }`}
              >
                <span>{chain.icon}</span>
                <span className="font-medium">{chain.name}</span>
                {chain.id === chainId && (
                  <span className="ml-auto text-[#35D07F]">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
