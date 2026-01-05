'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCw,
  X,
  Grid,
  Columns,
  BookOpen,
  Settings,
  Bookmark,
  Clock,
  Menu,
  ArrowDown,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker with proper error handling
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Types
type ViewMode = 'single' | 'double' | 'continuous';
type ScrollDirection = 'vertical' | 'horizontal';

interface ComicMetadata {
  id?: string;
  title?: string;
  issueNumber?: string;
  publisher?: string;
  totalPages?: number;
  readTime?: string;
}

interface PdfComicReaderProps {
  pdfUrl: string;
  comic?: ComicMetadata;
  onPageChange?: (page: number) => void;
  initialPage?: number;
}

interface ProgressData {
  page: number;
  readingTime: number;
  timestamp: number;
  percentComplete: number;
}


// Constants
const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const CONTROL_HIDE_DELAY = 3000;
const TAP_ZONE_WIDTH = 0.25;
const SWIPE_THRESHOLD = 50;
const LONG_PRESS_DURATION = 500;

// Configuration for page loading
const PAGE_LOAD_CHUNK_SIZE = 10; // Load pages in chunks of 10
const PRELOAD_PAGES = 5; // Preload pages ahead of current position
const DEBOUNCE_SCROLL_TIME = 150;

export default function PdfComicReader({ 
  pdfUrl, 
  comic,
  onPageChange,
  initialPage = 1 
}: PdfComicReaderProps) {
  // Core state
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('vertical');
  
  // UI state
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showReadingProgress, setShowReadingProgress] = useState<boolean>(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [readingTime, setReadingTime] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);
  
  // Page loading state
  const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set([initialPage]));
  const [isLoadingMorePages, setIsLoadingMorePages] = useState<boolean>(false);
  const [visiblePageRange, setVisiblePageRange] = useState<{ start: number; end: number }>({
    start: initialPage,
    end: initialPage + PRELOAD_PAGES
  });
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isLongPressing, setIsLongPressing] = useState<boolean>(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollPositionRef = useRef<number>(0);
  const scrollDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingProgrammaticallyRef = useRef<boolean>(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchMoveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollObserverRef = useRef<IntersectionObserver | null>(null);
  
  // Detect mobile/tablet on mount
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // Auto-hide controls with proper cleanup
  const resetControlTimeout = useCallback(() => {
    if (showThumbnails || showSettings || isLongPressing) {
      setShowControls(true);
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
      return;
    }
    
    setShowControls(true);
    if (controlTimeoutRef.current) {
      clearTimeout(controlTimeoutRef.current);
    }
    controlTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, CONTROL_HIDE_DELAY);
  }, [showThumbnails, showSettings, isLongPressing]);
  
  // Calculate optimal zoom for mobile
  const getOptimalZoom = useCallback(() => {
    if (isMobile) {
      if (viewMode === 'single') return 1.0;
      if (viewMode === 'double') return 0.7;
      return 0.8;
    }
    if (isTablet) {
      if (viewMode === 'single') return 1.2;
      if (viewMode === 'double') return 0.9;
      return 1.0;
    }
    return 1.0;
  }, [isMobile, isTablet, viewMode]);
  
  // Reset zoom when device or view mode changes
  useEffect(() => {
    setScale(getOptimalZoom());
  }, [isMobile, isTablet, viewMode, getOptimalZoom]);
  
  // Load more pages when needed
  const loadMorePages = useCallback((startPage: number) => {
    if (!numPages || isLoadingMorePages) return;
    
    setIsLoadingMorePages(true);
    const endPage = Math.min(numPages, startPage + PAGE_LOAD_CHUNK_SIZE);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
      const newLoaded = new Set(loadedPages);
      for (let i = startPage; i <= endPage; i++) {
        newLoaded.add(i);
      }
      setLoadedPages(newLoaded);
      setIsLoadingMorePages(false);
    }, 300);
  }, [numPages, loadedPages, isLoadingMorePages]);
  
  // Calculate which pages should be visible based on current view
  const visiblePages = useMemo(() => {
    if (!numPages) return [];
    
    if (viewMode === 'single') {
      return [currentPage];
    } 
    
    if (viewMode === 'double') {
      const pages = [currentPage];
      if (currentPage < numPages) {
        pages.push(currentPage + 1);
      }
      return pages;
    }
    
    // Continuous view - load pages in current range plus buffer
    const pages: number[] = [];
    const startPage = Math.max(1, visiblePageRange.start);
    const endPage = Math.min(numPages, visiblePageRange.end);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [numPages, currentPage, viewMode, visiblePageRange]);
  
  // Calculate page width for continuous mode
  const pageWidth = useMemo(() => {
    if (viewMode === 'continuous' && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const optimalWidth = isMobile ? containerWidth * 0.95 : containerWidth * 0.9;
      return Math.min(optimalWidth, 1000) * scale;
    }
    return undefined;
  }, [viewMode, scale, isMobile]);
  
  // Setup Intersection Observer for scroll detection
  useEffect(() => {
    if (viewMode !== 'continuous' || !viewerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageElement = entry.target as HTMLDivElement;
            const pageNumber = parseInt(pageElement.dataset.pageNumber ?? '1');
            
            if (pageNumber !== currentPage) {
              setCurrentPage(pageNumber);
              onPageChange?.(pageNumber);
            }
            
            // Check if we need to load more pages ahead
            if (pageNumber + PRELOAD_PAGES > visiblePageRange.end && pageNumber < numPages) {
              const newEnd = Math.min(numPages, pageNumber + PRELOAD_PAGES + PAGE_LOAD_CHUNK_SIZE);
              setVisiblePageRange(prev => ({
                start: Math.max(1, pageNumber - PRELOAD_PAGES),
                end: newEnd
              }));
              
              // Load more pages if needed
              if (newEnd > visiblePageRange.end) {
                loadMorePages(visiblePageRange.end + 1);
              }
            }
            
            // Check if we need to load pages behind
            if (pageNumber - PRELOAD_PAGES < visiblePageRange.start && pageNumber > 1) {
              const newStart = Math.max(1, pageNumber - PRELOAD_PAGES - PAGE_LOAD_CHUNK_SIZE);
              setVisiblePageRange(prev => ({
                start: newStart,
                end: Math.min(numPages, pageNumber + PRELOAD_PAGES)
              }));
              
              // Load more pages if needed
              if (newStart < visiblePageRange.start) {
                loadMorePages(newStart);
              }
            }
          }
        });
      },
      {
        root: viewerRef.current,
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
      }
    );
    
    scrollObserverRef.current = observer;
    
    // Cleanup
    return () => {
      if (scrollObserverRef.current) {
        scrollObserverRef.current.disconnect();
      }
    };
  }, [viewMode, currentPage, numPages, visiblePageRange, loadMorePages, onPageChange]);
  
  // Observe page elements when they're rendered
  useEffect(() => {
    if (!scrollObserverRef.current || viewMode !== 'continuous') return;
    
    pageRefs.current.forEach((ref, pageNumber) => {
      if (ref && scrollObserverRef.current) {
        scrollObserverRef.current.observe(ref);
      }
    });
    
    return () => {
      if (scrollObserverRef.current) {
        pageRefs.current.forEach((ref) => {
          if (ref) {
            scrollObserverRef.current?.unobserve(ref);
          }
        });
      }
    };
  }, [visiblePages, viewMode]);
  
  // Reading progress calculation
  const readingProgress = useMemo(() => 
    numPages > 0 ? (currentPage / numPages) * 100 : 0,
    [currentPage, numPages]
  );
  
  // Estimated remaining time calculation
  const estimatedRemainingTime = useMemo(() => {
    if (!showReadingProgress || !comic?.readTime) return null;
    const totalSeconds = parseInt(comic.readTime) * 60 || 0;
    return Math.max(0, totalSeconds - readingTime);
  }, [comic?.readTime, readingTime, showReadingProgress]);
  
  // Format time for display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Document load handler
  const onDocumentLoadSuccess = useCallback(({ numPages: totalPages }: { numPages: number }) => {
    setNumPages(totalPages);
    
    // Initial load of pages
    const initialChunk = Math.min(totalPages, initialPage + PAGE_LOAD_CHUNK_SIZE);
    const initialLoaded = new Set<number>();
    for (let i = 1; i <= initialChunk; i++) {
      initialLoaded.add(i);
    }
    setLoadedPages(initialLoaded);
    
    // Set initial visible range
    setVisiblePageRange({
      start: Math.max(1, initialPage - PRELOAD_PAGES),
      end: Math.min(totalPages, initialPage + PRELOAD_PAGES + PAGE_LOAD_CHUNK_SIZE)
    });
    
    // Load saved bookmarks
    if (comic?.id) {
      try {
        const saved = localStorage.getItem(`comic-${comic.id}-bookmarks`);
        if (saved) {
          const parsedSaved = JSON.parse(saved) as number[];
          setBookmarks(parsedSaved);
        }
        
        // Load saved progress
        const savedProgress = localStorage.getItem(`comic-${comic.id}-progress`);
        if (savedProgress) {
          const progress = JSON.parse(savedProgress) as ProgressData;
          if (progress.page > 0 && progress.page <= totalPages) {
            setCurrentPage(progress.page);
            setReadingTime(progress.readingTime ?? 0);
          }
        }
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, [comic?.id, initialPage]);
  
  // Document load error handler
  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
  }, []);
  
  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (!numPages) return;
    
    const newPage = Math.max(1, Math.min(page, numPages));
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      resetControlTimeout();
      
      if (viewMode === 'continuous' && viewerRef.current) {
        // Scroll to the target page
        isScrollingProgrammaticallyRef.current = true;
        const pageElement = pageRefs.current.get(newPage);
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        setTimeout(() => {
          isScrollingProgrammaticallyRef.current = false;
        }, 500);
      }
      
      onPageChange?.(newPage);
    }
  }, [currentPage, numPages, resetControlTimeout, viewMode, onPageChange]);
  
  const goToPreviousPage = useCallback(() => {
    if (viewMode === 'double') {
      goToPage(currentPage - 2);
    } else {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage, viewMode]);
  
  const goToNextPage = useCallback(() => {
    if (viewMode === 'double') {
      goToPage(currentPage + 2);
    } else {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage, viewMode]);
  
  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    resetControlTimeout();
  }, [resetControlTimeout]);
  
  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
    resetControlTimeout();
  }, [resetControlTimeout]);
  
  const handleZoomReset = useCallback(() => {
    setScale(getOptimalZoom());
    resetControlTimeout();
  }, [getOptimalZoom, resetControlTimeout]);
  
  // Rotation
  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
    resetControlTimeout();
  }, [resetControlTimeout]);
  
  // View mode toggle
  const toggleViewMode = useCallback(() => {
    const newMode = viewMode === 'single' ? 'double' : viewMode === 'double' ? 'continuous' : 'single';
    setViewMode(newMode);
    
    if (newMode === 'continuous' && viewerRef.current) {
      // Reset scroll when changing to continuous mode
      viewerRef.current.scrollTop = 0;
      
      // Load initial range for continuous mode
      if (numPages) {
        const startRange = Math.max(1, currentPage - PRELOAD_PAGES);
        const endRange = Math.min(numPages, currentPage + PRELOAD_PAGES + PAGE_LOAD_CHUNK_SIZE);
        setVisiblePageRange({ start: startRange, end: endRange });
      }
    }
    
    resetControlTimeout();
  }, [viewMode, currentPage, numPages, resetControlTimeout]);
  
  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
    resetControlTimeout();
  }, [resetControlTimeout]);
  
  // Bookmarks
  const toggleBookmark = useCallback(() => {
    setBookmarks(prev => {
      const hasBookmark = prev.includes(currentPage);
      const newBookmarks = hasBookmark 
        ? prev.filter(p => p !== currentPage)
        : [...prev, currentPage].sort((a, b) => a - b);
      
      if (comic?.id) {
        localStorage.setItem(`comic-${comic.id}-bookmarks`, JSON.stringify(newBookmarks));
      }
      
      return newBookmarks;
    });
    resetControlTimeout();
  }, [currentPage, comic?.id, resetControlTimeout]);
  
  // Improved scroll handler for continuous mode
  const handleScroll = useCallback(() => {
    if (!viewerRef.current || isScrollingProgrammaticallyRef.current || viewMode !== 'continuous') return;
    
    resetControlTimeout();
  }, [viewMode, resetControlTimeout]);
  
  // Track reading time
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setReadingTime(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Save progress
  useEffect(() => {
    if (comic?.id && numPages > 0) {
      const progress: ProgressData = {
        page: currentPage,
        readingTime,
        timestamp: Date.now(),
        percentComplete: readingProgress
      };
      
      localStorage.setItem(`comic-${comic.id}-progress`, JSON.stringify(progress));
    }
  }, [currentPage, comic?.id, numPages, readingTime, readingProgress]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      resetControlTimeout();
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPreviousPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goToNextPage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleZoomReset();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          void toggleFullscreen();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          toggleBookmark();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          toggleViewMode();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setShowThumbnails(prev => !prev);
          break;
        case 'Escape':
          if (showThumbnails) {
            setShowThumbnails(false);
          } else if (showSettings) {
            setShowSettings(false);
          } else if (isFullscreen) {
            void toggleFullscreen();
          }
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          setShowControls(prev => !prev);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    goToPreviousPage, 
    goToNextPage, 
    resetControlTimeout, 
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    handleRotate,
    toggleFullscreen,
    toggleBookmark,
    toggleViewMode,
    showThumbnails,
    showSettings,
    isFullscreen
  ]);
  
  // Auto-hide controls with cleanup
  useEffect(() => {
    resetControlTimeout();
    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (scrollObserverRef.current) {
        scrollObserverRef.current.disconnect();
      }
    };
  }, [resetControlTimeout]);
  
  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  // Handle escape key for closing
  const handleClose = useCallback(() => {
    window.history.back();
  }, []);
  
  // Get page reference
  const setPageRef = useCallback((pageNumber: number) => (element: HTMLDivElement | null) => {
    if (element) {
      pageRefs.current.set(pageNumber, element);
      element.dataset.pageNumber = pageNumber.toString();
    } else {
      pageRefs.current.delete(pageNumber);
    }
  }, []);
  
  // Mobile-specific button size
  const buttonSize = isMobile ? "p-3" : "p-2";
  const iconSize = isMobile ? "w-6 h-6" : "w-5 h-5";
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col select-none"
      // onClick={handleClick}
      onMouseMove={resetControlTimeout}
      // onTouchStart={handleTouchStart}
      // onTouchMove={handleTouchMove}
      // onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar - Mobile Optimized */}
      <div className={`
        bg-gradient-to-b from-black/95 via-black/90 to-transparent 
        backdrop-blur-xl border-b border-gray-800/50
        transition-all duration-300 px-3 sm:px-4 py-2 sm:py-3
        ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleClose}
              className={`${buttonSize} hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white`}
              aria-label="Close"
            >
              <X className={iconSize} />
            </button>
            
            <div className="max-w-[140px] sm:max-w-xs truncate">
              <h1 className="text-white font-semibold text-sm sm:text-lg truncate">
                {comic?.title ?? 'Comic Reader'}
              </h1>
              <div className="flex items-center gap-1 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                {comic?.issueNumber && (
                  <span className="truncate">#{comic.issueNumber}</span>
                )}
                {showReadingProgress && estimatedRemainingTime && (
                  <span className="hidden sm:flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    {formatTime(estimatedRemainingTime)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Navigation - Simplified on mobile */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className={`${buttonSize} hover:bg-gray-800/50 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed`}
              aria-label="Previous page"
            >
              <ChevronLeft className={iconSize} />
            </button>
            
            <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur rounded-lg px-2 sm:px-3 py-1">
              <span className="text-white text-xs sm:text-sm font-medium">
                {currentPage}
              </span>
              <span className="text-gray-400 text-xs sm:text-sm">/ {numPages}</span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className={`${buttonSize} hover:bg-gray-800/50 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed`}
              aria-label="Next page"
            >
              <ChevronRight className={iconSize} />
            </button>
          </div>

          {/* Right: Controls - Simplified on mobile */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!isMobile && (
              <>
                <button
                  onClick={toggleBookmark}
                  className={`${buttonSize} hover:bg-gray-800/50 rounded-lg transition ${
                    bookmarks.includes(currentPage) 
                      ? 'text-yellow-500' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  aria-label="Bookmark"
                >
                  <Bookmark 
                    className={iconSize} 
                    fill={bookmarks.includes(currentPage) ? 'currentColor' : 'none'} 
                  />
                </button>

                <button
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className={`${buttonSize} hover:bg-gray-800/50 rounded-lg transition ${
                    showThumbnails ? 'text-blue-500' : 'text-gray-300 hover:text-white'
                  }`}
                  aria-label="Thumbnails"
                >
                  <Grid className={iconSize} />
                </button>
              </>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`${buttonSize} hover:bg-gray-800/50 rounded-lg transition ${
                showSettings ? 'text-blue-500' : 'text-gray-300 hover:text-white'
              }`}
              aria-label="Settings"
            >
              <Settings className={iconSize} />
            </button>

            {!isMobile && (
              <>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                <button
                  onClick={toggleViewMode}
                  className={`${buttonSize} hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white`}
                  aria-label="View mode"
                >
                  {viewMode === 'single' && <BookOpen className={iconSize} />}
                  {viewMode === 'double' && <Columns className={iconSize} />}
                  {viewMode === 'continuous' && <Menu className={iconSize} />}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Quick Controls - Floating */}
      {isMobile && showControls && (
        <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-40">
          <button
            onClick={toggleBookmark}
            className={`p-3 bg-black/70 backdrop-blur-md rounded-full shadow-lg transition ${
              bookmarks.includes(currentPage) 
                ? 'text-yellow-500 ring-2 ring-yellow-500/50' 
                : 'text-white hover:bg-black/80'
            }`}
            aria-label="Bookmark"
          >
            <Bookmark 
              className="w-6 h-6" 
              fill={bookmarks.includes(currentPage) ? 'currentColor' : 'none'} 
            />
          </button>
          
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-3 bg-black/70 backdrop-blur-md rounded-full shadow-lg transition ${
              showThumbnails 
                ? 'text-blue-500 ring-2 ring-blue-500/50' 
                : 'text-white hover:bg-black/80'
            }`}
            aria-label="Thumbnails"
          >
            <Grid className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Swipe Indicators */}
      {!showControls && !showThumbnails && !showSettings && isMobile && (
        <div className="fixed inset-0 pointer-events-none z-30">
          <div className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 animate-pulse">
              <ChevronLeft className="w-8 h-8 text-white/60" />
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-full p-2 animate-pulse">
              <ChevronRight className="w-8 h-8 text-white/60" />
            </div>
          </div>
        </div>
      )}

      {/* Main Viewer */}
      <div 
        ref={viewerRef}
        className="flex-1 overflow-auto bg-gray-950"
        onScroll={handleScroll}
      >
        <div className={`
          ${viewMode === 'continuous' ? 'py-4 sm:py-8' : 'flex items-center justify-center min-h-full py-8 sm:py-12'}
          ${viewMode === 'double' ? 'gap-2 sm:gap-4' : ''}
        `}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400 text-sm sm:text-base">Loading comic...</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md p-4 sm:p-8">
                  <p className="text-red-400 mb-4 text-base sm:text-lg">Failed to load comic</p>
                  <p className="text-gray-400 mb-6 text-sm sm:text-base">The PDF file could not be loaded. Please check the URL or try again later.</p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Close
                  </button>
                </div>
              </div>
            }
          >
            {visiblePages.map((pageNumber) => (
              <div 
                key={pageNumber}
                className={`
                  ${viewMode === 'continuous' ? 'mb-4 sm:mb-8 last:mb-0 flex justify-center' : ''}
                  relative
                `}
              >
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth}
                  scale={viewMode !== 'continuous' ? scale : undefined}
                  rotate={rotation}
                  loading={
                    <div className="w-full h-64 sm:h-96 flex items-center justify-center bg-gray-900/50 rounded-lg">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                  className={`
                    shadow-2xl transition-all duration-300 rounded-lg
                    ${viewMode === 'continuous' ? 'mx-auto' : ''}
                    ${bookmarks.includes(pageNumber) ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900' : ''}
                    ${isMobile ? 'max-w-full' : ''}
                  `}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
                
                <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/70 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full backdrop-blur-sm">
                  {pageNumber}
                </div>
                
                {bookmarks.includes(pageNumber) && (
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-yellow-500/90 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Bookmark className="w-3 h-3" fill="currentColor" />
                    <span className="hidden sm:inline">Bookmarked</span>
                  </div>
                )}
              </div>
            ))}
          </Document>
        </div>
      </div>

      {/* Thumbnails Panel - Mobile Responsive */}
      {showThumbnails && (
        <div className={`
          absolute inset-0 sm:left-0 sm:top-0 sm:bottom-0 sm:w-64 
          bg-black/95 backdrop-blur-xl border-r border-gray-800/50 
          overflow-y-auto z-50
        `}>
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-white font-semibold text-base sm:text-lg">Pages</h3>
              <button 
                onClick={() => setShowThumbnails(false)}
                className="p-1 sm:p-2 hover:bg-gray-800/50 rounded transition"
                aria-label="Close thumbnails"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 sm:gap-3">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    goToPage(pageNum);
                    setShowThumbnails(false);
                  }}
                  className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all bg-gray-800 ${
                    currentPage === pageNum 
                      ? 'border-blue-500 scale-105' 
                      : 'border-transparent hover:border-gray-600'
                  }`}
                  aria-label={`Go to page ${pageNum}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs sm:text-sm">{pageNum}</span>
                  </div>
                  {bookmarks.includes(pageNum) && (
                    <div className="absolute top-1 right-1">
                      <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" fill="currentColor" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel - Mobile Responsive */}
      {showSettings && (
        <div className={`
          absolute inset-0 sm:right-0 sm:top-0 sm:bottom-0 sm:w-80 
          bg-black/95 backdrop-blur-xl border-l border-gray-800/50 
          overflow-y-auto z-50
        `}>
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-white font-semibold text-base sm:text-lg">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 sm:p-2 hover:bg-gray-800/50 rounded transition"
                aria-label="Close settings"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Device Indicator */}
              <div className="flex items-center gap-2 p-2 bg-gray-800/30 rounded-lg">
                {isMobile && <Smartphone className="w-4 h-4 text-blue-400" />}
                {isTablet && <Tablet className="w-4 h-4 text-blue-400" />}
                {!isMobile && !isTablet && <Monitor className="w-4 h-4 text-blue-400" />}
                <span className="text-sm text-gray-300">
                  {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} View
                </span>
              </div>

              {/* Zoom */}
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-2 sm:mb-3">Zoom</h4>
                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={handleZoomOut}
                    disabled={scale <= MIN_ZOOM}
                    className="p-2 sm:p-3 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  
                  <div className="flex-1">
                    <input
                      type="range"
                      min={MIN_ZOOM * 100}
                      max={MAX_ZOOM * 100}
                      value={scale * 100}
                      onChange={(e) => setScale(parseInt(e.target.value) / 100)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                      aria-label="Zoom level"
                    />
                  </div>
                  
                  <button
                    onClick={handleZoomIn}
                    disabled={scale >= MAX_ZOOM}
                    className="p-2 sm:p-3 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">{Math.round(scale * 100)}%</span>
                  <button 
                    onClick={handleZoomReset}
                    className="text-xs text-blue-500 hover:text-blue-400"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* View Mode Settings */}
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-2 sm:mb-3">View Mode</h4>
                <div className="grid grid-cols-1 gap-2">
                  {(['single', 'double', 'continuous'] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border transition-all ${
                        viewMode === mode 
                          ? 'bg-blue-600/20 border-blue-500 text-white' 
                          : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {mode === 'single' && <BookOpen className="w-4 h-4" />}
                        {mode === 'double' && <Columns className="w-4 h-4" />}
                        {mode === 'continuous' && <Menu className="w-4 h-4" />}
                        <span className="capitalize text-sm sm:text-base">{mode} Page</span>
                      </div>
                      {viewMode === mode && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Settings */}
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-2 sm:mb-3">Display</h4>
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group p-2 hover:bg-gray-800/30 rounded-lg">
                    <span className="text-gray-400 group-hover:text-gray-300 transition text-sm sm:text-base">Show Progress Bar</span>
                    <input 
                      type="checkbox" 
                      checked={showReadingProgress}
                      onChange={(e) => setShowReadingProgress(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                  <button
                    onClick={toggleFullscreen}
                    className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition text-sm sm:text-base"
                  >
                    <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleRotate}
                    className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition text-sm sm:text-base"
                  >
                    <span>Rotate Page</span>
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Progress Bar - Mobile Optimized */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-40
        transition-all duration-300
        ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        {/* Progress Rail */}
        <div className="h-1 sm:h-2 w-full bg-gray-800/50">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Info Bar */}
        <div className="bg-black/90 backdrop-blur-xl border-t border-gray-800/50 px-3 sm:px-6 py-2 sm:py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-white font-medium">{Math.round(readingProgress)}%</span>
                <span className="hidden sm:inline">completed</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{formatTime(readingTime)} reading</span>
                  <span className="sm:hidden">{formatTime(readingTime)}</span>
                </div>
              )}
            </div>

            {bookmarks.length > 0 && (
              <div className="flex items-center -space-x-1 sm:-space-x-2">
                {bookmarks.slice(-2).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500 border-2 border-black flex items-center justify-center text-[10px] sm:text-xs text-black font-bold hover:scale-110 transition"
                    title={`Bookmark at page ${page}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      {isMobile && !showControls && !showThumbnails && !showSettings && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-30 animate-bounce">
          <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
            Swipe left/right to navigate • Tap to show controls
          </div>
        </div>
      )}
    </div>
  );
}