// components/comics/ComicReaderModal.tsx
'use client'

import { useEffect, useState } from 'react'
import ComicReader from './comicReader'
import { X, Maximize2, Minimize2 } from 'lucide-react'

interface ComicReaderModalProps {
  isOpen: boolean
  onClose: () => void
  comic: {
    pages: string[]
    issueNumber?: number
    totalPages?: number
  }
  initialPage?: number
}

export default function ComicReaderModal({
  isOpen,
  onClose,
  comic,
  initialPage = 0
}: ComicReaderModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isFullscreen) {
          void handleToggleFullscreen()
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, isFullscreen, onClose])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (error) {
        console.error('Failed to enter fullscreen:', error)
      }
    } else {
      try {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } catch (error) {
        console.error('Failed to exit fullscreen:', error)
      }
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isFullscreen ? '' : 'overflow-y-auto'}`}>
        <div className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-7xl h-[90vh]'} bg-black rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300`}>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 hover:scale-110 transition-all duration-300"
            aria-label="Close reader"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => void handleToggleFullscreen()}
            className="absolute top-4 right-16 z-50 w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/90 hover:scale-110 transition-all duration-300"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>

          {/* Comic Reader */}
          <div className="w-full h-full">
            <ComicReader
              pages={comic.pages}
              comic={{
                issueNumber: comic.issueNumber,
              }}
              onClose={onClose}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              initialPage={initialPage}
            />
          </div>
        </div>
      </div>
    </>
  )
}