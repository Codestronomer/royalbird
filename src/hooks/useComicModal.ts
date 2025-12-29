'use client'

import { useState, useCallback } from 'react'
import type { Comic } from '~/types/comics'

interface UseComicModalReturn {
  selectedComic: Comic | null
  isModalOpen: boolean
  openModal: (comic: Comic) => void
  closeModal: () => void
  navigateToComic: (direction: 'prev' | 'next', comicList: Comic[]) => void
}

export function useComicModal(): UseComicModalReturn {
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback((comic: Comic) => {
    setSelectedComic(comic)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    // Small delay before clearing comic to allow animation
    setTimeout(() => setSelectedComic(null), 300)
  }, [])

  const navigateToComic = useCallback((direction: 'prev' | 'next', comicList: Comic[]) => {
    if (!selectedComic) return

    const currentIndex = comicList.findIndex(comic => comic.id === selectedComic.id)
    let newIndex = -1

    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else if (direction === 'next' && currentIndex < comicList.length - 1) {
      newIndex = currentIndex + 1
    }

    if (newIndex >= 0 && newIndex < comicList.length) {
      const nextComic = comicList[newIndex]
      if (nextComic) {
        setSelectedComic(nextComic)
      }
    }
  }, [selectedComic])

  return {
    selectedComic,
    isModalOpen,
    openModal,
    closeModal,
    navigateToComic
  }
}