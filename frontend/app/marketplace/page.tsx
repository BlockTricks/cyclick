'use client'

import { Header } from '@/components/layout/Header'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contracts } from '@/lib/contracts-config'
import { formatEther, parseEther } from 'viem'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { ShoppingCart, Coins, Heart, TrendingUp } from 'lucide-react'
import { MarketplaceAction } from '@/types'

export default function MarketplacePage() {
  const { address, isConnected } = useAccount()
  const [tokenBalance, setTokenBalance] = useState<bigint>(BigInt(0))
  const [conversionAmount, setConversionAmount] = useState('')
  const [listingPrice, setListingPrice] = useState('')
  const [selectedCredit, setSelectedCredit] = useState<string | null>(null)
  const [actionType, setActionType] = useState<MarketplaceAction>(null)

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read token balance
  const { data: balance } = useReadContract({
    address: contracts.CyclickToken.address as `0x${string}`,
    abi: contracts.CyclickToken.abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  useEffect(() => {
    if (balance) {
      setTokenBalance(balance as bigint)
    }
  }, [balance])

  // Mock marketplace data - in production, fetch from contract events
  const [marketplaceCredits] = useState([
    {
      id: '0x1234...5678',
      owner: '0xabcd...efgh',
      amount: 5000, // grams
      price: '0.5', // tokens per gram
      timestamp: Date.now() - 86400000,
    },
    {
      id: '0xabcd...efgh',
      owner: '0x1234...5678',
      amount: 3000,
      price: '0.6',
      timestamp: Date.now() - 172800000,
    },
  ])

  const handleConvert = async () => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    const amount = parseFloat(conversionAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const amountWei = parseEther(conversionAmount)
    if (amountWei > tokenBalance) {
      toast.error('Insufficient balance')
      return
    }

    try {
      setActionType('convert')
      toast.loading('Converting tokens to carbon credits...', { id: 'tx-action' })

      writeContract({
        address: contracts.CarbonCredits.address as `0x${string}`,
        abi: contracts.CarbonCredits.abi,
        functionName: 'convertToCarbonCredit',
        args: [amountWei],
      })
    } catch (error) {
      console.error('Error converting:', error)
      toast.error('Error converting tokens', { id: 'tx-action' })
      setActionType(null)
    }
  }

  const handleList = async () => {
    if (!selectedCredit) {
      toast.error('Please select a credit to list')
      return
    }

    const price = parseFloat(listingPrice)
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price')
      return
    }

    try {
      setActionType('list')
      toast.loading('Listing carbon credit...', { id: 'tx-action' })

      writeContract({
        address: contracts.CarbonCredits.address as `0x${string}`,
        abi: contracts.CarbonCredits.abi,
        functionName: 'listForSale',
        args: [selectedCredit as `0x${string}`, parseEther(listingPrice)],
      })
    } catch (error) {
      console.error('Error listing:', error)
      toast.error('Error listing credit', { id: 'tx-action' })
      setActionType(null)
    }
  }

  const handleBuy = async (creditId: string) => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setActionType('buy')
      toast.loading('Purchasing carbon credit...', { id: 'tx-action' })

      writeContract({
        address: contracts.CarbonCredits.address as `0x${string}`,
        abi: contracts.CarbonCredits.abi,
        functionName: 'purchaseCarbonCredit',
        args: [creditId as `0x${string}`],
      })
    } catch (error) {
      console.error('Error purchasing:', error)
      toast.error('Error purchasing credit', { id: 'tx-action' })
      setActionType(null)
    }
  }

  const handleDonate = async (creditId: string) => {
    if (!address || !isConnected) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setActionType('donate')
      toast.loading('Donating carbon credit...', { id: 'tx-action' })

      writeContract({
        address: contracts.CarbonCredits.address as `0x${string}`,
        abi: contracts.CarbonCredits.abi,
        functionName: 'donateCarbonCredit',
        args: [creditId as `0x${string}`],
      })
    } catch (error) {
      console.error('Error donating:', error)
      toast.error('Error donating credit', { id: 'tx-action' })
      setActionType(null)
    }
  }

  useEffect(() => {
    if (isPending && actionType) {
      toast.loading('Transaction pending...', { id: 'tx-action' })
    } else if (isConfirming && actionType) {
      toast.loading('Confirming transaction...', { id: 'tx-action' })
    } else if (isConfirmed && actionType) {
      if (actionType === 'convert') {
        toast.success('Tokens converted to carbon credits! 🌱', { id: 'tx-action' })
        setConversionAmount('')
      } else if (actionType === 'list') {
        toast.success('Carbon credit listed for sale!', { id: 'tx-action' })
        setListingPrice('')
        setSelectedCredit(null)
      } else if (actionType === 'buy') {
        toast.success('Carbon credit purchased!', { id: 'tx-action' })
      } else if (actionType === 'donate') {
        toast.success('Carbon credit donated! Thank you! ❤️', { id: 'tx-action' })
      }
      setActionType(null)
    }
  }, [isPending, isConfirming, isConfirmed, actionType])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          🌱 Carbon Credit Marketplace
        </h1>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Convert & List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Convert Tokens to Credits */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Convert to Credits
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount (CYC Tokens)
                  </label>
                  <input
                    type="number"
                    value={conversionAmount}
                    onChange={(e) => setConversionAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Balance: {formatEther(tokenBalance)} CYC
                  </p>
                </div>
                <button
                  onClick={handleConvert}
                  disabled={!isConnected || isPending || isConfirming || !conversionAmount}
                  className="w-full px-4 py-3 bg-[#35D07F] text-white rounded-lg font-semibold hover:bg-[#2db86a] transition-colors disabled:opacity-50"
                >
                  Convert to Carbon Credits
                </button>
              </div>
            </div>

            {/* List for Sale */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                List for Sale
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Credit
                  </label>
                  <select
                    value={selectedCredit || ''}
                    onChange={(e) => setSelectedCredit(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a credit...</option>
                    {/* In production, fetch user's credits from contract */}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (CYC per gram)
                  </label>
                  <input
                    type="number"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    placeholder="0.5"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  onClick={handleList}
                  disabled={!isConnected || isPending || isConfirming || !selectedCredit || !listingPrice}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  List for Sale
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Marketplace */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Available Credits
              </h2>

              {marketplaceCredits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">No carbon credits available for sale</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {marketplaceCredits.map((credit) => (
                    <div
                      key={credit.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {credit.amount.toLocaleString()}g CO₂
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {credit.price} CYC/gram • Total: {(credit.amount * parseFloat(credit.price)).toFixed(2)} CYC
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Owner: {credit.owner.slice(0, 6)}...{credit.owner.slice(-4)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleBuy(credit.id)}
                            disabled={!isConnected || isPending || isConfirming || credit.owner === address}
                            className="px-4 py-2 bg-[#35D07F] text-white rounded-lg font-semibold hover:bg-[#2db86a] transition-colors disabled:opacity-50 text-sm"
                          >
                            Buy
                          </button>
                          {credit.owner === address && (
                            <button
                              onClick={() => handleDonate(credit.id)}
                              disabled={isPending || isConfirming}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 text-sm flex items-center gap-1"
                            >
                              <Heart className="w-4 h-4" />
                              Donate
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Impact Stats */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Marketplace Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-[#35D07F]">
                    {marketplaceCredits.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}g
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Credits</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {marketplaceCredits.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Listings</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {(marketplaceCredits.reduce((sum, c) => sum + (c.amount * parseFloat(c.price)), 0)).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Value (CYC)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
