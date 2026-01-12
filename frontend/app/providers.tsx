'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/lib/wagmi'
import { ThemeProvider } from '@/lib/theme-provider'
import { ThemeSync } from '@/components/ui/ThemeSync'
import { NotificationManager } from '@/components/features/NotificationManager'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider defaultTheme="light" storageKey="cyclick-theme">
      <ThemeSync />
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <NotificationManager />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              className: 'dark:border-gray-700',
              success: {
                iconTheme: {
                  primary: '#35D07F',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  )
}

