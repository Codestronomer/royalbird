// components/comics/ComicReader.tsx
'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Zoom, Keyboard } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings,
  Grid,
  List,
  Download,
  Bookmark,
  Heart,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  PanelLeftClose,
  PanelRightClose,
  ArrowLeft,
  Play,
  Pause
} from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'
import 'swiper/css/effect-fade'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-fade'
import type { Comic } from '~/types/comics'
import { getDeviceInfo, getOptimizedImageUrl, preloadImage } from '~/lib/utils'

type ViewMode = 'single' | 'double' | 'vertical'
type ThemeMode = 'light' | 'dark' | 'sepia'

// Define the structure for the device info returned by getDeviceInfo
interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  isTouch: boolean;
}

interface ComicReaderProps {
  pages: string[],
  comic: Partial<Comic>,
  onClose?: () => void
  isFullscreen?: boolean
  onToggleFullscreen?: () => void
  initialPage?: number
}

// --- CONSTANTS ---
const DEFAULT_THEME: ThemeMode = 'dark';
const DEFAULT_DEVICE: DeviceInfo = { type: 'desktop', isTouch: false }; // Safe server default
const PRELOAD_COUNT = 3 // preload next 2-3 pages ahead

export default function ComicReader({
  pages,
  comic,
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
  initialPage = 0
}: ComicReaderProps) {
  // --- STATE MANAGEMENT ---
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [isFullscreenMode, setIsFullscreenMode] = useState(isFullscreen)
  const [viewMode, setViewMode] = useState<ViewMode>('single')
  
  // 1. HYDRATION FIX: Initialize theme to the default theme directly.
  const [theme, setTheme] = useState<ThemeMode>(DEFAULT_THEME)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set())
  const loadedPagesRef = useRef<Set<number>>(new Set())

  const [readingProgress, setReadingProgress] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(3000) // 3 seconds per page
  const [isMuted, setIsMuted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  // 2. HYDRATION FIX: Use a state for device info, initialized to a safe default.
  const [device, setDevice] = useState<DeviceInfo>(DEFAULT_DEVICE);
  
  // --- REFS ---
  const swiperRef = useRef<SwiperType | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // --- MEMOIZED VALUES ---
  // Build optimized page URLs once per render, now dependent on the stateful 'device'
  const optimizedPages = useMemo(() => {
    return pages.map(p => getOptimizedImageUrl(p, device.type))
  }, [pages, device.type])

  const swiperStyle = useMemo(() => ({ '--swiper-navigation-color': '#ffffff', '--swiper-pagination-color': '#ffffff' } as unknown as React.CSSProperties), [])

  // --- FUNCTIONS ---
  // Mark page as loaded in both ref and state
  const markPageLoaded = useCallback((index: number) => {
    loadedPagesRef.current.add(index)
    setLoadedPages(prev => new Set(prev).add(index))
  }, [])

  // Ensure a page (by index) is preloaded into the browser cache
  const ensurePagePreloaded = useCallback(async (index: number) => {
    if (index < 0 || index >= optimizedPages.length) return
    if (loadedPagesRef.current.has(index)) return
    try {
      await preloadImage(optimizedPages[index])
    } finally {
      // Mark as loaded regardless of preload success/failure to prevent re-tries
      markPageLoaded(index) 
    }
  }, [optimizedPages, markPageLoaded])

  // Calculate reading progress
  const calculateProgress = useCallback((pageIndex: number) => {
    return ((pageIndex + 1) / pages.length) * 100
  }, [pages.length])
  
  // Go to specific page
  const goToPage = useCallback((pageIndex: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(pageIndex)
    }
  }, [])
  
  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get background color based on theme
  const getThemeBgColor = () => {
    switch (theme) {
      case 'dark': return 'bg-black'
      case 'sepia': return 'bg-amber-50'
      default: return 'bg-white'
    }
  }

  // Get text color based on theme
  const getThemeTextColor = () => {
    switch (theme) {
      case 'dark': return 'text-white'
      case 'sepia': return 'text-amber-900'
      default: return 'text-black'
    }
  }
  
  // Toggle fullscreen (memoized so we can safely use it in effects)
  const handleToggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen()
      setIsFullscreenMode(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreenMode(false)
    }
    onToggleFullscreen?.()
  }, [onToggleFullscreen])

  // Handle page change
  const handleSlideChange = useCallback((swiper: SwiperType) => {
    const newPage = swiper.activeIndex
    setCurrentPage(newPage)
    setReadingProgress(calculateProgress(newPage))
  }, [calculateProgress])


  // --- EFFECTS ---

  // 3. HYDRATION FIX: Set client-specific states ONLY after the component mounts.
  useEffect(() => {
    // 1. Initialize Device Info (Uses window/navigator, must be client-side)
    setDevice(getDeviceInfo());
    
    // 2. Initialize Reading Time Tracker
    startTimeRef.current = Date.now()
    
    // 3. Cleanup for time tracking
    return () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setReadingTime(prev => prev + timeSpent)
    }
  }, [])

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return

    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    handleMouseMove() // Initial setup

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchstart', handleMouseMove)

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchstart', handleMouseMove)
    }
  }, [showControls])

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && swiperRef.current) {
      autoPlayTimerRef.current = setInterval(() => {
        if (swiperRef.current && currentPage < pages.length - 1) {
          swiperRef.current.slideNext()
        } else {
          setIsPlaying(false)
        }
      }, autoPlaySpeed)
    } else {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current)
    }
  }, [isPlaying, currentPage, pages.length, autoPlaySpeed])

  // Preload current + next PRELOAD_COUNT pages for smooth reading
  useEffect(() => {
    // Always ensure current page is considered loaded
    void ensurePagePreloaded(currentPage)

    for (let i = 1; i <= PRELOAD_COUNT; i++) {
      void ensurePagePreloaded(currentPage + i)
    }
    // also preload previous page for quick back navigation
    void ensurePagePreloaded(currentPage - 1)
  }, [currentPage, ensurePagePreloaded])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!swiperRef.current) return

      switch (e.key) {
        case 'ArrowLeft':
          swiperRef.current.slidePrev()
          break
        case 'ArrowRight':
          swiperRef.current.slideNext()
          break
        case ' ':
          e.preventDefault()
          setIsPlaying(prev => !prev)
          break
        case 'f':
          void handleToggleFullscreen()
          break
        case 'Escape':
          if (isFullscreenMode) {
            void handleToggleFullscreen()
          } else if (onClose) {
            onClose()
          }
          break
        case 'm':
          setIsMuted(prev => !prev)
          break
        case 'b':
          setIsBookmarked(prev => !prev)
          break
        case 'l':
          setIsLiked(prev => !prev)
          break
        case '1':
          setViewMode('single')
          break
        case '2':
          setViewMode('double')
          break
        case 'v':
          setViewMode('vertical')
          break
        case '+':
        case '=':
          setZoomLevel(prev => Math.min(prev + 0.25, 3))
          break
        case '-':
          setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
          break
        case '0':
          setZoomLevel(1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, isFullscreenMode, isMuted, isBookmarked, isLiked, onClose, handleToggleFullscreen])


  // --- COMPONENTS ---

  // Navigation controls component
  const NavigationControls = () => (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-4">
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        disabled={currentPage === 0}
        className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div className="flex items-center gap-2 text-white text-sm">
        <span className="font-semibold">{currentPage + 1}</span>
        <span className="text-white/60">/</span>
        <span>{pages.length}</span>
      </div>
      
      <button
        onClick={() => swiperRef.current?.slideNext()}
        disabled={currentPage === pages.length - 1}
        className="p-2 text-white hover:bg-white/20 rounded-full disabled:opacity-30"
        aria-label="Next page"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  )

  // Settings panel component
  const SettingsPanel = () => (
    // ... (SettingsPanel implementation remains the same)
    <div className="absolute top-20 right-4 z-30 bg-black/80 backdrop-blur-lg rounded-2xl p-4 w-64 shadow-2xl border border-white/10">
      <h3 className="text-white font-bold mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Reader Settings
      </h3>
      
      {/* View Mode */}
      <div className="mb-4">
        <label className="text-white/80 text-sm mb-2 block">View Mode</label>
        <div className="flex gap-2">
          {([
            { mode: 'single' as ViewMode, label: 'Single', icon: <PanelLeftClose className="w-4 h-4" /> },
            { mode: 'double' as ViewMode, label: 'Double', icon: <PanelRightClose className="w-4 h-4" /> },
            { mode: 'vertical' as ViewMode, label: 'Webtoon', icon: <List className="w-4 h-4" /> }
            ] as const).map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 ${
                viewMode === mode ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {icon}
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Theme */}
      <div className="mb-4">
        <label className="text-white/80 text-sm mb-2 block">Theme</label>
        <div className="flex gap-2">
          {(['light', 'dark', 'sepia'] as const).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => setTheme(themeOption as ThemeMode)}
              className={`flex-1 py-2 rounded-lg capitalize ${
                theme === themeOption ? 'bg-purple-600 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {themeOption}
            </button>
          ))}
        </div>
      </div>
      
      {/* Zoom */}
      <div className="mb-4">
        <label className="text-white/80 text-sm mb-2 block">Zoom: {Math.round(zoomLevel * 100)}%</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.5))}
            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${((zoomLevel - 0.5) / 2.5) * 100}%` }}
            />
          </div>
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
            className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Auto-play */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-white/80 text-sm">Auto-play</label>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-white/10'} text-white`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
        {isPlaying && (
          <div className="mt-2">
            <label className="text-white/60 text-xs mb-1 block">Speed</label>
            <select
              value={autoPlaySpeed}
              onChange={(e) => setAutoPlaySpeed(Number(e.target.value))}
              className="w-full bg-white/10 text-white rounded-lg px-3 py-1 text-sm"
            >
              <option value="5000">Slow (5s)</option>
              <option value="3000">Normal (3s)</option>
              <option value="1500">Fast (1.5s)</option>
            </select>
          </div>
        )}
      </div>
      
      {/* Reading Stats */}
      <div className="pt-4 border-t border-white/10">
        <div className="text-white/60 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Progress</span>
            <span>{Math.round(readingProgress)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Time spent</span>
            <span>{formatTime(readingTime)}</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Thumbnails panel component
  const ThumbnailsPanel = () => (
    // ... (ThumbnailsPanel implementation remains the same)
    <div className="absolute top-0 left-0 bottom-0 z-30 bg-black/90 backdrop-blur-lg w-48 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Pages</h3>
          <button
            onClick={() => setShowThumbnails(false)}
            className="text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="space-y-2">
          {pages.map((page, index) => (
            <button
              key={index}
              onClick={() => {
                goToPage(index)
                setShowThumbnails(false)
              }}
              className={`w-full aspect-[3/4] relative overflow-hidden rounded-lg border-2 ${
                currentPage === index ? 'border-blue-500' : 'border-transparent'
              }`}
            >
              <Image
                src={page}
                alt={`Page ${index + 1}`}
                fill
                className="object-cover"
                sizes="192px"
              />
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )


  // --- RENDER ---
  return (
    // HYDRATION FIX: The `className` is now safe because `theme` is initialized to DEFAULT_THEME ('dark') 
    // on both the server and client before hydration.
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${getThemeBgColor()} ${getThemeTextColor()} transition-colors duration-300`}
    >
      {/* Top Bar */}
      {showControls && (
        // ... (Top bar content)
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-4">
          <div className="flex items-center justify-between">
            {/* Left: Comic Info */}
            <div className="flex items-center gap-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-white hover:bg-white/20 rounded-full"
                  aria-label="Close reader"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              <div className="text-white">
                <h2 className="font-bold text-lg truncate max-w-xs">{comic.title}</h2>
                <p className="text-white/70 text-sm">
                  by {comic.publisher}
                  {comic.issueNumber && ` • Issue #${comic.issueNumber}`}
                </p>
              </div>
            </div>

            {/* Center: Progress */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-white text-sm">
                Page {currentPage + 1} of {pages.length}
              </div>
              <div className="w-48">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
              </div>
              <div className="text-white/60 text-sm">
                {Math.round(readingProgress)}%
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              {/* Thumbnails */}
              <button
                onClick={() => setShowThumbnails(!showThumbnails)}
                className="p-2 text-white hover:bg-white/20 rounded-full"
                aria-label="Show thumbnails"
              >
                <Grid className="w-5 h-5" />
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowControls(true)}
                className="p-2 text-white hover:bg-white/20 rounded-full"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleToggleFullscreen}
                className="p-2 text-white hover:bg-white/20 rounded-full"
                aria-label="Toggle fullscreen"
              >
                {isFullscreenMode ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full ${isBookmarked ? 'text-blue-400' : 'text-white hover:bg-white/20'}`}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full ${isLiked ? 'text-red-400' : 'text-white hover:bg-white/20'}`}
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Comic Reader */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Single/Double Page View */}
        {viewMode !== 'vertical' && (
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              swiper.slideTo(initialPage)
            }}
            onSlideChange={handleSlideChange}
            slidesPerView={viewMode === 'double' ? 2 : 1}
            spaceBetween={viewMode === 'double' ? 20 : 0}
            navigation
            pagination={{ clickable: true }}
            zoom={{ maxRatio: 3 }}
            keyboard={{ enabled: true }}
            modules={[Navigation, Pagination, Zoom, Keyboard]}
            className="w-full h-full"
            style={swiperStyle}
          >
            {pages.map((page, index) => (
              <SwiperSlide key={index}>
                <div className="swiper-zoom-container">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div
                      className="relative"
                      style={{
                        transform: `scale(${zoomLevel})`,
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <Image
                        // optimizedPages is now safe as its dependency 'device.type' is stable on SSR
                        src={optimizedPages[index]}
                        alt={`${comic.title} - Page ${index + 1}`}
                        width={viewMode === 'double' ? 600 : 1200}
                        height={viewMode === 'double' ? 800 : 1600}
                        className={`object-contain ${theme === 'sepia' ? 'sepia' : ''} transition-opacity duration-300 ${loadedPages.has(index) ? 'opacity-100 blur-0' : 'opacity-60 blur-sm'}`}
                        priority={index === currentPage}
                        loading={index <= currentPage + 1 ? 'eager' : 'lazy'}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Vertical/Webtoon View */}
        {viewMode === 'vertical' && (
          <div className="w-full max-w-2xl mx-auto h-full overflow-y-auto">
            <div className="space-y-4 py-8">
              {pages.map((page, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <Image
                    src={optimizedPages[index]}
                    alt={`${comic.title} - Page ${index + 1}`}
                    width={800}
                    height={1200}
                    className={`w-full h-auto ${theme === 'sepia' ? 'sepia' : ''} transition-opacity duration-300 ${loadedPages.has(index) ? 'opacity-100 blur-0' : 'opacity-60 blur-sm'}`}
                    priority={index === currentPage}
                    loading={index <= currentPage + 1 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    Page {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      {showControls && <NavigationControls />}

      {/* Settings Panel */}
      {showControls && <SettingsPanel />}

      {/* Thumbnails Panel */}
      {showThumbnails && <ThumbnailsPanel />}

      {/* Quick Actions Bar */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => setZoomLevel(1)}
          className="p-3 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/90"
          aria-label="Reset zoom"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        {comic?.formats?.pdf && (
          <button
            onClick={() => {
              const a = document.createElement('a')
              a.href = comic.formats!.pdf!
              a.target = '_blank'
              a.rel = 'noopener noreferrer'
              a.download = `${(comic.slug ?? comic.title ?? 'comic').replace(/\s+/g, '-')}.pdf`
              document.body.appendChild(a)
              a.click()
              a.remove()
            }}
            className="p-3 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/90"
            aria-label="Download PDF"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
        
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          className="p-3 bg-black/70 backdrop-blur-md text-white rounded-full hover:bg-black/90"
          aria-label="Toggle thumbnails"
        >
          <Grid className="w-5 h-5" />
        </button>
      </div>

      {/* Page Indicator (Mobile) */}
      <div className="md:hidden absolute bottom-4 left-4 z-20 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm">
        {currentPage + 1} / {pages.length}
      </div>

      {/* Auto-play Indicator */}
      {isPlaying && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-green-500/90 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <Play className="w-4 h-4" />
          <span className="text-sm font-medium">Auto-playing</span>
          <button
            onClick={() => setIsPlaying(false)}
            className="ml-2 hover:bg-white/20 p-1 rounded-full"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      {showControls && (
        <div className="absolute bottom-20 left-4 z-30 bg-black/80 backdrop-blur-lg rounded-xl p-4 w-64 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <h4 className="text-white font-bold mb-2 text-sm">Keyboard Shortcuts</h4>
          <div className="space-y-1 text-white/70 text-xs">
            <div className="flex justify-between">
              <span>← →</span>
              <span>Navigate</span>
            </div>
            <div className="flex justify-between">
              <span>Space</span>
              <span>Play/Pause</span>
            </div>
            <div className="flex justify-between">
              <span>F</span>
              <span>Fullscreen</span>
            </div>
            <div className="flex justify-between">
              <span>1, 2, V</span>
              <span>View modes</span>
            </div>
            <div className="flex justify-between">
              <span>+/-</span>
              <span>Zoom</span>
            </div>
            <div className="flex justify-between">
              <span>ESC</span>
              <span>Exit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}