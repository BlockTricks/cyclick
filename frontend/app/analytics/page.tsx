'use client'

import { Header } from '@/components/layout/Header'
import { useAccount, useReadContract } from 'wagmi'
import { contracts } from '@/lib/contracts-config'
import { formatEther } from 'viem'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Activity, Award, Coins } from 'lucide-react'

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount()
  const [stats, setStats] = useState({
    totalRides: 0,
    totalDistance: 0,
    totalRewards: BigInt(0),
    avgDistance: 0,
    totalCarbonSaved: 0,
  })

  const { data: riderStats } = useReadContract({
    address: contracts.RideVerifier.address as `0x${string}`,
    abi: contracts.RideVerifier.abi,
    functionName: 'getRiderStats',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })

  useEffect(() => {
    if (riderStats) {
      const [rides, distance, rewards] = riderStats as [bigint, bigint, bigint]
      setStats({
        totalRides: Number(rides),
        totalDistance: Number(distance),
        totalRewards: rewards,
        avgDistance: Number(rides) > 0 ? Number(distance) / Number(rides) / 1000 : 0,
        totalCarbonSaved: (Number(distance) / 1000) * 200, // 200g per km
      })
    }
  }, [riderStats])

  // Mock weekly data for charts
  const weeklyData = [
    { day: 'Mon', distance: 12, rides: 2, rewards: 24 },
    { day: 'Tue', distance: 8, rides: 1, rewards: 16 },
    { day: 'Wed', distance: 15, rides: 2, rewards: 30 },
    { day: 'Thu', distance: 10, rides: 1, rewards: 20 },
    { day: 'Fri', distance: 18, rides: 3, rewards: 36 },
    { day: 'Sat', distance: 25, rides: 4, rewards: 50 },
    { day: 'Sun', distance: 20, rides: 3, rewards: 40 },
  ]

  const carbonData = [
    { name: 'This Week', value: stats.totalCarbonSaved * 0.3 },
    { name: 'This Month', value: stats.totalCarbonSaved * 0.7 },
  ]

  const COLORS = ['#35D07F', '#2db86a']

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Please connect your wallet to view your analytics
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
          📊 Analytics Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rides</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalRides}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Distance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {(stats.totalDistance / 1000).toFixed(1)} km
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Rewards</p>
                <p className="text-3xl font-bold text-[#35D07F]">
                  {parseFloat(formatEther(stats.totalRewards)).toFixed(1)} CYC
                </p>
              </div>
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Carbon Saved</p>
                <p className="text-3xl font-bold text-purple-500">
                  {(stats.totalCarbonSaved / 1000).toFixed(1)} kg
                </p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Distance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Weekly Distance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="distance" fill="#35D07F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Rides Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Weekly Rides</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="rides" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rewards Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Weekly Rewards</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="rewards" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Carbon Impact Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Carbon Impact</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={carbonData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {carbonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="max-w-6xl mx-auto mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Distance per Ride</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.avgDistance.toFixed(2)} km
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Reward per Ride</p>
              <p className="text-2xl font-bold text-[#35D07F]">
                {stats.totalRides > 0
                  ? parseFloat(formatEther(stats.totalRewards / BigInt(stats.totalRides))).toFixed(1)
                  : '0.0'}{' '}
                CYC
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Carbon Saved per Ride</p>
              <p className="text-2xl font-bold text-purple-500">
                {stats.totalRides > 0 ? (stats.totalCarbonSaved / stats.totalRides / 1000).toFixed(2) : '0.00'} kg
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
