// hooks/useDeviceDetection.ts
'use client'

import { useEffect, useState } from 'react'
import { getDeviceInfo, getBestFormat, getQualityImages } from '~/lib/utils'
import type { DeviceType } from '~/lib/utils'
import type { Comic } from '~/types/comics'

interface UseDeviceDetectionReturn {
  deviceType: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouchDevice: boolean
  isHighDpi: boolean
  viewportWidth: number
  viewportHeight: number
}

/**
 * Hook to detect device type and capabilities
 * Updates on resize and orientation change
 */
export function useDeviceDetection(): UseDeviceDetectionReturn {
  const [deviceInfo, setDeviceInfo] = useState<UseDeviceDetectionReturn>(() => {
    if (typeof window === 'undefined') {
      return {
        deviceType: 'desktop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        isHighDpi: false,
        viewportWidth: 1920,
        viewportHeight: 1080,
      }
    }

    const info = getDeviceInfo()
    return {
      deviceType: info.type,
      isMobile: info.type === 'mobile',
      isTablet: info.type === 'tablet',
      isDesktop: info.type === 'desktop',
      isTouchDevice: info.isTouchDevice,
      isHighDpi: info.isHighDpi,
      viewportWidth: info.width,
      viewportHeight: info.height,
    }
  })

  useEffect(() => {
    const handleResize = () => {
      const info = getDeviceInfo()
      setDeviceInfo({
        deviceType: info.type,
        isMobile: info.type === 'mobile',
        isTablet: info.type === 'tablet',
        isDesktop: info.type === 'desktop',
        isTouchDevice: info.isTouchDevice,
        isHighDpi: info.isHighDpi,
        viewportWidth: info.width,
        viewportHeight: info.height,
      })
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return deviceInfo
}

/**
 * Hook to get the best comic format based on device
 */
export function useBestComicFormat(comic: Comic) {
  const { deviceType } = useDeviceDetection()
  const [bestFormat, setBestFormat] = useState(() => getBestFormat(comic, deviceType))

  useEffect(() => {
    setBestFormat(getBestFormat(comic, deviceType))
  }, [comic, deviceType])

  return bestFormat
}

/**
 * Hook to get quality-optimized images for a comic
 */
export function useOptimizedComicImages(comic: Comic) {
  const { deviceType } = useDeviceDetection()
  const [images, setImages] = useState(() => getQualityImages(comic, deviceType))

  useEffect(() => {
    setImages(getQualityImages(comic, deviceType))
  }, [comic, deviceType])

  return images
}
