'use client'

import { Share2, Twitter, Facebook, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface SocialShareProps {
  title: string
  text: string
  url?: string
  achievement?: string
}

export function SocialShare({ title, text, url, achievement }: SocialShareProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareText = achievement ? `${text} - ${achievement}` : text

  const handleShare = async (platform: 'twitter' | 'facebook' | 'copy') => {
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(shareUrl)

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
          '_blank',
          'width=550,height=420'
        )
        break
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'width=550,height=420'
        )
        break
      case 'copy':
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          setCopied(true)
          toast.success('Link copied to clipboard!')
          setTimeout(() => setCopied(false), 2000)
        } else {
          toast.error('Clipboard not available')
        }
        break
    }
  }

  // Native Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        })
        toast.success('Shared successfully!')
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    } else {
      // Fallback to copy
      handleShare('copy')
    }
  }

  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <div className="flex items-center gap-2">
      {hasNativeShare && (
        <button
          onClick={handleNativeShare}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        title="Share on Twitter"
      >
        <Twitter className="w-4 h-4 text-blue-500" />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4 text-blue-600" />
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Copy link"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
