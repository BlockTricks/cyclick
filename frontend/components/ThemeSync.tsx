'use client'

import { useTheme } from '@/lib/theme-provider'
import { useEffect } from 'react'

export function ThemeSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Update Reown AppKit theme to match app theme
    // The theme will be synced via CSS variables and the appKit themeMode
    // This is handled by the appKit configuration which uses themeMode: 'light' by default
    // For dynamic theme switching, we'd need to reinitialize appKit or use a different approach
    // For now, the wallet modal will use the system preference or default to light
  }, [resolvedTheme])

  return null
}

