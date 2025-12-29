// components/blog/ShareButtons.tsx
'use client'

import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  vertical?: boolean
}

export default function ShareButtons({ url, title, vertical = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : ''

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`flex ${vertical ? 'flex-col items-center' : 'flex-row items-center gap-2'}`}>
      {vertical && (
        <div className="mb-4">
          <Share2 className="w-6 h-6 text-slate-600" />
        </div>
      )}
      
      <div className={`flex ${vertical ? 'flex-col gap-2' : 'flex-row gap-2'}`}>
        <a
          href={isMounted ? shareLinks.twitter : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-10 h-10 bg-blue-100 hover:bg-blue-500 rounded-full flex items-center justify-center text-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </a>
        
        <a
          href={isMounted ? shareLinks.facebook : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-10 h-10 bg-blue-100 hover:bg-blue-600 rounded-full flex items-center justify-center text-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-5 h-5" />
        </a>
        
        <a
          href={isMounted ? shareLinks.linkedin : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-10 h-10 bg-blue-100 hover:bg-blue-700 rounded-full flex items-center justify-center text-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        
        <button
          onClick={copyToClipboard}
          className="group w-10 h-10 bg-blue-100 hover:bg-green-500 rounded-full flex items-center justify-center text-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="w-5 h-5" />
          ) : (
            <LinkIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  )
}