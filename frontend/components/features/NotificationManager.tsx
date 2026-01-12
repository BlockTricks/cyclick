'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

export function NotificationManager() {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          toast.success('Notifications enabled!')
        }
      })
    }

    // Listen for achievement events (custom events)
    const handleAchievement = (event: CustomEvent) => {
      const { title, message } = event.detail
      
      // Show toast
      toast.success(message || title)
      
      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
        })
      }
    }

    // Listen for challenge completion
    const handleChallenge = (event: CustomEvent) => {
      const { title, message } = event.detail
      
      toast.success(message || title)
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/favicon.svg',
        })
      }
    }

    // Listen for streak updates
    const handleStreak = (event: CustomEvent) => {
      const { days, message } = event.detail
      
      toast.success(message || `🔥 ${days} day streak!`)
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🔥 ${days} Day Streak!`, {
          body: message || 'Keep it going!',
          icon: '/favicon.svg',
        })
      }
    }

    window.addEventListener('achievement-unlocked' as any, handleAchievement as EventListener)
    window.addEventListener('challenge-completed' as any, handleChallenge as EventListener)
    window.addEventListener('streak-updated' as any, handleStreak as EventListener)

    return () => {
      window.removeEventListener('achievement-unlocked' as any, handleAchievement as EventListener)
      window.removeEventListener('challenge-completed' as any, handleChallenge as EventListener)
      window.removeEventListener('streak-updated' as any, handleStreak as EventListener)
    }
  }, [])

  return null
}

// Helper functions to trigger notifications
export const notifyAchievement = (title: string, message: string) => {
  window.dispatchEvent(
    new CustomEvent('achievement-unlocked', {
      detail: { title, message },
    })
  )
}

export const notifyChallenge = (title: string, message: string) => {
  window.dispatchEvent(
    new CustomEvent('challenge-completed', {
      detail: { title, message },
    })
  )
}

export const notifyStreak = (days: number, message?: string) => {
  window.dispatchEvent(
    new CustomEvent('streak-updated', {
      detail: { days, message },
    })
  )
}
