'use client'

import { useTheme } from '@/lib/theme-provider'
import { useEffect } from 'react'

export function ThemeSync() {
  const { theme } = useTheme()

  useEffect(() => {
    // Theme is now handled directly via CSS classes on the html element
    // No additional sync needed
  }, [theme])

  return null
}

