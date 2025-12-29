// hooks/useComicReader.ts
'use client'

import { useState, useCallback } from 'react'

interface ComicData {
  title: string
  author: string
  pages: string[]
  issueNumber?: number
  totalPages?: number
}

interface UseComicReaderReturn {
  isReaderOpen: boolean
  currentComic: ComicData | null
  openReader: (comic: ComicData, startPage?: number) => void
  closeReader: () => void
  startPage: number
}

export function useComicReader(): UseComicReaderReturn {
  const [isReaderOpen, setIsReaderOpen] = useState(false)
  const [currentComic, setCurrentComic] = useState<ComicData | null>(null)
  const [startPage, setStartPage] = useState(0)

  const openReader = useCallback((comic: ComicData, startPage = 0) => {
    setCurrentComic(comic)
    setStartPage(startPage)
    setIsReaderOpen(true)
    
    // Track comic reading start
    console.log(`Started reading: ${comic.title}`)
  }, [])

  const closeReader = useCallback(() => {
    setIsReaderOpen(false)
    // Small delay before clearing to allow animation
    setTimeout(() => {
      setCurrentComic(null)
      setStartPage(0)
    }, 300)
  }, [])

  return {
    isReaderOpen,
    currentComic,
    startPage,
    openReader,
    closeReader
  }
}