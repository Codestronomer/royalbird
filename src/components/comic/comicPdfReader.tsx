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
  Menu,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
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
}

interface PdfComicReaderProps {
  pdfUrl: string;
  comic?: ComicMetadata;
  onPageChange?: (page: number) => void;
  initialPage?: number;
}

interface ProgressData {
  page: number;
  timestamp: number;
  percentComplete: number;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

// Constants
const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3.0;
const CONTROL_HIDE_DELAY = 3000;
const TAP_ZONE_WIDTH = 0.25;
const SWIPE_THRESHOLD = 50;
const LONG_PRESS_DURATION = 500;
const PAGES_PER_CHUNK = 10;
const SCROLL_LOAD_THRESHOLD = 500;
const INTERSECTION_THRESHOLD = 0.5;

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
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isScrollingDown, setIsScrollingDown] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  
  // Loading state
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [isLoadingChunk, setIsLoadingChunk] = useState<boolean>(false);
  
  // Touch/swipe state
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isLongPressing, setIsLongPressing] = useState<boolean>(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const controlTimeoutRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const pageObserverRef = useRef<IntersectionObserver | null>(null);
  const pageElementsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  
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
    controlTimeoutRef.current = window.setTimeout(() => {
      setShowControls(false);
    }, CONTROL_HIDE_DELAY);
  }, [showThumbnails, showSettings, isLongPressing]);
  
  // Calculate optimal zoom for mobile
  const getOptimalZoom = useCallback((): number => {
    return 1.0;
  }, []);
  
  // Reset zoom when device or view mode changes
  useEffect(() => {
    setScale(getOptimalZoom());
  }, [getOptimalZoom]);
  
  // Calculate visible pages for continuous mode with lazy loading
  const visiblePages = useMemo(() => {
    if (!numPages) return [];
    
    if (viewMode !== 'continuous') {
      if (viewMode === 'single') {
        return [currentPage];
      } else {
        const pages = [currentPage];
        if (currentPage < numPages) {
          pages.push(currentPage + 1);
        }
        return pages;
      }
    }
    
    return loadedPages.length > 0 ? loadedPages : [currentPage];
  }, [currentPage, numPages, viewMode, loadedPages]);
  
  // Initialize loaded pages when view mode changes or numPages loads
  useEffect(() => {
    if (numPages > 0 && viewMode === 'continuous') {
      const start = Math.max(1, currentPage - Math.floor(PAGES_PER_CHUNK / 2));
      const end = Math.min(numPages, start + PAGES_PER_CHUNK - 1);
      
      const initialPages: number[] = [];
      for (let i = start; i <= end; i++) {
        initialPages.push(i);
      }
      setLoadedPages(initialPages);
    } else if (viewMode !== 'continuous') {
      setLoadedPages([]);
    }
  }, [numPages, viewMode, currentPage]);
  
  // Load more pages when scrolling near the end
  const loadMorePages = useCallback(() => {
    // 1. Initial Guards: Ensure we have pages to load and aren't already loading
    if (!numPages || isLoadingChunk || viewMode !== 'continuous') return;

    // 2. Safe calculation of the last page
    // Fallback to 0 if loadedPages is empty, so start becomes 1
    const lastLoadedPage = loadedPages.length > 0 ? Math.max(...loadedPages) : 0;
    
    // 3. Exit if we've already reached the end
    if (lastLoadedPage >= numPages) return;

    const start = lastLoadedPage + 1;
    const end = Math.min(numPages, start + PAGES_PER_CHUNK - 1);

    // 4. Critical Safety Check: Ensure the loop range is valid and finite
    if (!Number.isFinite(start) || start > end || start < 1) {
      console.warn("Invalid page range calculated:", { start, end });
      return;
    }

    setIsLoadingChunk(true);

    setTimeout(() => {
      const newPages: number[] = [];
      for (let i = start; i <= end; i++) {
        newPages.push(i);
      }

      setLoadedPages(prev => {
        const combined = [...prev, ...newPages];
        // Use a Set to ensure uniqueness and sort to maintain order
        return Array.from(new Set(combined)).sort((a, b) => a - b);
      });

      setIsLoadingChunk(false);
    }, 100);
  }, [numPages, loadedPages, isLoadingChunk, viewMode]);
  
  // Calculate page width for continuous mode
  const pageWidth = useMemo(() => {
    if (viewMode === 'continuous' && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const optimalWidth = containerWidth * 0.95;
      return Math.min(optimalWidth, 1000) * scale;
    }
    return undefined;
  }, [viewMode, scale]);
  
  // Reading progress calculation
  const readingProgress = useMemo(() => 
    numPages > 0 ? (currentPage / numPages) * 100 : 0,
    [currentPage, numPages]
  );
  
  // Save and load data from localStorage
  const saveToStorage = useCallback((key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, []);
  
  const loadFromStorage = useCallback(<T,>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }, []);
  
  // Document load handler
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    
    if (comic?.id) {
      const savedBookmarks = loadFromStorage<number[]>(`comic-${comic.id}-bookmarks`);
      if (savedBookmarks) {
        setBookmarks(savedBookmarks);
      }
      
      const savedProgress = loadFromStorage<ProgressData>(`comic-${comic.id}-progress`);
      if (savedProgress && savedProgress.page > 0 && savedProgress.page <= numPages) {
        setCurrentPage(savedProgress.page);
      }
    }
  }, [comic?.id, loadFromStorage]);
  
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
        const pageElement = pageElementsRef.current.get(newPage);
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      
      onPageChange?.(newPage);
    }
  }, [currentPage, numPages, resetControlTimeout, viewMode, onPageChange]);
  
  const goToPreviousPage = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    goToPage(currentPage - step);
  }, [currentPage, goToPage, viewMode]);
  
  const goToNextPage = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    goToPage(currentPage + step);
  }, [currentPage, goToPage, viewMode]);
  
  // Set up intersection observer to detect visible pages
  useEffect(() => {
    if (viewMode !== 'continuous' || !viewerRef.current) return;
    
    if (pageObserverRef.current) {
      pageObserverRef.current.disconnect();
    }
    
    pageObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > INTERSECTION_THRESHOLD) {
            const pageNumber = parseInt(entry.target.getAttribute('data-page-number') ?? '1', 10);
            if (pageNumber !== currentPage) {
              setCurrentPage(pageNumber);
              onPageChange?.(pageNumber);
              resetControlTimeout();
            }
            
            if (pageNumber > loadedPages.length - 5 && pageNumber < numPages) {
              loadMorePages();
            }
          }
        });
      },
      {
        root: viewerRef.current,
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '100px 0px 100px 0px'
      }
    );
    
    pageElementsRef.current.forEach((element) => {
      pageObserverRef.current?.observe(element);
    });
    
    return () => {
      pageObserverRef.current?.disconnect();
    };
  }, [viewMode, currentPage, loadedPages.length, numPages, loadMorePages, resetControlTimeout, onPageChange]);
  
  // Scroll handler for continuous mode
  const handleScroll = useCallback(() => {
    if (!viewerRef.current || viewMode !== 'continuous') return;
    
    const currentScrollY = viewerRef.current.scrollTop;
    
    // Detect scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down - hide controls
      setIsScrollingDown(true);
      setShowControls(false);
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up - show controls
      setIsScrollingDown(false);
      setShowControls(true);
      resetControlTimeout();
    }
    
    setLastScrollY(currentScrollY);
    
    // Load more pages logic
    const element = viewerRef.current;
    const scrollBottom = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    
    if (scrollHeight - scrollBottom < SCROLL_LOAD_THRESHOLD && !isLoadingChunk) {
      loadMorePages();
    }
  }, [viewMode, isLoadingChunk, loadMorePages, lastScrollY, resetControlTimeout]);
  
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
    setViewMode(prev => {
      if (prev === 'single') return 'double';
      if (prev === 'double') return 'continuous';
      return 'single';
    });
    resetControlTimeout();
  }, [resetControlTimeout]);
  
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
        saveToStorage(`comic-${comic.id}-bookmarks`, newBookmarks);
      }
      
      return newBookmarks;
    });
    resetControlTimeout();
  }, [currentPage, comic?.id, resetControlTimeout, saveToStorage]);
  
  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    const startTime = Date.now();
    const startPos: TouchPosition = { x: touch.clientX, y: touch.clientY, time: startTime };
    setTouchStart(startPos);
    setTouchEnd(null);
    
    longPressTimerRef.current = window.setTimeout(() => {
      setIsLongPressing(true);
      setShowControls(true);
    }, LONG_PRESS_DURATION);
    
    resetControlTimeout();
  }, [resetControlTimeout]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    const touch = e.touches[0];
    if (!touch) return;

    setTouchEnd({ x: touch.clientX, y: touch.clientY });
    
    if (touchStart) {
      const deltaX = touch.clientX - touchStart.x;
      const deltaY = touch.clientY - touchStart.y;
      
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (e.cancelable) e.preventDefault();
      }
    }
    
    resetControlTimeout();
  }, [touchStart, resetControlTimeout]);
  
  const handleTouchEnd = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    setIsLongPressing(false);
    
    if (touchStart && touchEnd) {
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;
      
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          goToPreviousPage();
        } else {
          goToNextPage();
        }
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, goToPreviousPage, goToNextPage]);
  
  // Click handler
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (showThumbnails || showSettings) return;
    
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('input') || 
      target.closest('select') || 
      target.closest('textarea') ||
      target.closest('.control-overlay')
    ) {
      return;
    }
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const tapZoneWidth = rect.width * TAP_ZONE_WIDTH;
    
    if (clickX < tapZoneWidth) {
      goToPreviousPage();
    } else if (clickX > rect.width - tapZoneWidth) {
      goToNextPage();
    } else {
      setShowControls(prev => !prev);
      resetControlTimeout();
    }
  }, [goToPreviousPage, goToNextPage, showThumbnails, showSettings, resetControlTimeout]);
  
  // Save progress
  useEffect(() => {
    if (comic?.id && numPages > 0) {
      const progress: ProgressData = {
        page: currentPage,
        timestamp: Date.now(),
        percentComplete: readingProgress
      };
      
      saveToStorage(`comic-${comic.id}-progress`, progress);
    }
  }, [currentPage, comic?.id, numPages, readingProgress, saveToStorage]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && (e.key === 'r' || e.key === 'R')) {
        return;
      }
      
      resetControlTimeout();
      
      const keyActions: Record<string, () => void> = {
        'ArrowLeft': () => { e.preventDefault(); goToPreviousPage(); },
        'ArrowUp': () => { e.preventDefault(); goToPreviousPage(); },
        'ArrowRight': () => { e.preventDefault(); goToNextPage(); },
        'ArrowDown': () => { e.preventDefault(); goToNextPage(); },
        ' ': () => { e.preventDefault(); goToNextPage(); },
        '+': () => { e.preventDefault(); handleZoomIn(); },
        '=': () => { e.preventDefault(); handleZoomIn(); },
        '-': () => { e.preventDefault(); handleZoomOut(); },
        '0': () => { e.preventDefault(); handleZoomReset(); },
        'r': () => { e.preventDefault(); handleRotate(); },
        'R': () => { e.preventDefault(); handleRotate(); },
        'f': () => { e.preventDefault(); void toggleFullscreen(); },
        'F': () => { e.preventDefault(); void toggleFullscreen(); },
        'b': () => { e.preventDefault(); toggleBookmark(); },
        'B': () => { e.preventDefault(); toggleBookmark(); },
        't': () => { e.preventDefault(); toggleViewMode(); },
        'T': () => { e.preventDefault(); toggleViewMode(); },
        'm': () => { e.preventDefault(); setShowThumbnails(prev => !prev); },
        'M': () => { e.preventDefault(); setShowThumbnails(prev => !prev); },
        'c': () => { e.preventDefault(); setShowControls(prev => !prev); },
        'C': () => { e.preventDefault(); setShowControls(prev => !prev); },
        'Escape': () => {
          if (showThumbnails) {
            setShowThumbnails(false);
          } else if (showSettings) {
            setShowSettings(false);
          } else if (isFullscreen) {
            void toggleFullscreen();
          }
        }
      };
      
      const action = keyActions[e.key];
      if (action) {
        action();
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
  
  // Cleanup timeouts
  useEffect(() => {
    resetControlTimeout();
    return () => {
      if (controlTimeoutRef.current) {
        clearTimeout(controlTimeoutRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      if (pageObserverRef.current) {
        pageObserverRef.current.disconnect();
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

  // Ref callback for page elements
  const setPageElementRef = useCallback((pageNumber: number) => (element: HTMLDivElement | null) => {
    if (element) {
      pageElementsRef.current.set(pageNumber, element);
      if (pageObserverRef.current && viewMode === 'continuous') {
        pageObserverRef.current.observe(element);
      }
    } else {
      pageElementsRef.current.delete(pageNumber);
    }
  }, [viewMode]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col select-none"
      onClick={handleClick}
      onMouseMove={resetControlTimeout}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar */}
      <div className={`
        bg-gradient-to-b from-black/95 via-black/90 to-transparent 
        backdrop-blur-xl border-b border-gray-800/50
        transition-all duration-300 px-2 sm:px-4 py-2 sm:py-3
        controls-overlay
        ${showControls && !isScrollingDown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-2">
          {/* Left: Title - Hide on small screens */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="max-w-xs">
              <h1 className="text-white font-semibold text-lg truncate">
                {comic?.title ?? 'Comic Reader'}
              </h1>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                {comic?.publisher && <span className="truncate">{comic.publisher}</span>}
                {comic?.issueNumber && <span>• Issue #{comic.issueNumber}</span>}
              </div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            onClick={handleClose}
            className="md:hidden p-2 hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Center: Navigation */}
          <div className="flex items-center gap-1 sm:gap-4 flex-1 justify-center md:flex-initial">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-900/50 backdrop-blur rounded-lg px-2 sm:px-3 py-1">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') return;
                  goToPage(parseInt(value, 10) || 1);
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    e.target.value = String(currentPage);
                  }
                }}
                className="w-8 sm:w-12 bg-transparent text-white text-center text-xs sm:text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min={1}
                max={numPages}
              />
              <span className="text-gray-400 text-xs sm:text-sm">/ {numPages}</span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Hide some buttons on mobile */}
            <button
              onClick={toggleBookmark}
              className={`hidden sm:block p-2 hover:bg-gray-800/50 rounded-lg transition ${
                bookmarks.includes(currentPage) 
                  ? 'text-yellow-500' 
                  : 'text-gray-300 hover:text-white'
              }`}
              aria-label="Bookmark"
            >
              <Bookmark 
                className="w-5 h-5" 
                fill={bookmarks.includes(currentPage) ? 'currentColor' : 'none'} 
              />
            </button>

            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-lg transition ${
                showThumbnails ? 'text-blue-500' : 'text-gray-300 hover:text-white'
              }`}
              aria-label="Thumbnails"
            >
              <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-1.5 sm:p-2 hover:bg-gray-800/50 rounded-lg transition ${
                showSettings ? 'text-blue-500' : 'text-gray-300 hover:text-white'
              }`}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="hidden sm:block w-px h-6 bg-gray-700 mx-1" />

            <button
              onClick={toggleViewMode}
              className="hidden sm:block p-2 hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white"
              aria-label="View mode"
            >
              {viewMode === 'single' && <BookOpen className="w-5 h-5" />}
              {viewMode === 'double' && <Columns className="w-5 h-5" />}
              {viewMode === 'continuous' && <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setScrollDirection(prev => prev === 'vertical' ? 'horizontal' : 'vertical')}
              className="hidden lg:block p-2 hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white"
              aria-label="Scroll direction"
            >
              {scrollDirection === 'vertical' ? <ArrowDown className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewer */}
      <div 
        ref={viewerRef}
        className="flex-1 overflow-auto bg-gray-950"
        onScroll={handleScroll}
      >
        <div className={`
          ${viewMode === 'continuous' ? 'py-8' : 'flex items-center justify-center min-h-full py-12'}
          ${viewMode === 'double' ? 'gap-4' : ''}
        `}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">Loading comic...</p>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md p-8">
                  <p className="text-red-400 mb-4 text-lg">Failed to load comic</p>
                  <p className="text-gray-400 mb-6">The PDF file could not be loaded. Please check the URL or try again later.</p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                ref={setPageElementRef(pageNumber)}
                data-page-number={pageNumber}
                className={`
                  ${viewMode === 'continuous' ? 'mb-8 last:mb-0 flex justify-center' : ''}
                  relative
                `}
              >
                <Page
                  pageNumber={pageNumber}
                  width={pageWidth}
                  scale={viewMode !== 'continuous' ? scale : undefined}
                  rotate={rotation}
                  loading={
                    <div className="w-full h-96 flex items-center justify-center bg-gray-900/50 rounded-lg">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                  className={`
                    shadow-2xl transition-all duration-300 rounded-lg
                    ${viewMode === 'continuous' ? 'mx-auto' : ''}
                    ${bookmarks.includes(pageNumber) ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900' : ''}
                  `}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
                
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                  {pageNumber}
                </div>
                
                {bookmarks.includes(pageNumber) && (
                  <div className="absolute top-4 right-4 bg-yellow-500/90 text-black text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Bookmark className="w-3 h-3" fill="currentColor" />
                    Bookmarked
                  </div>
                )}
              </div>
            ))}
            
            {viewMode === 'continuous' && isLoadingChunk && (
              <div className="flex justify-center py-8">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {viewMode === 'continuous' && 
            !isLoadingChunk && 
            (loadedPages[loadedPages.length - 1] ?? 0) >= (numPages ?? 0) && (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-lg">End of comic</p>
                  <p className="text-sm mt-2">You&apos;ve reached the last page</p>
                </div>
            )}
          </Document>
        </div>
      </div>

      {/* Thumbnails Panel */}
      {showThumbnails && (
        <div className="absolute left-0 top-0 bottom-0 w-48 sm:w-64 bg-black/95 backdrop-blur-xl border-r border-gray-800/50 overflow-y-auto z-50">
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Pages</h3>
              <button 
                onClick={() => setShowThumbnails(false)}
                className="p-1 hover:bg-gray-800/50 rounded transition"
                aria-label="Close thumbnails"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-80 bg-black/95 backdrop-blur-xl border-l border-gray-800/50 overflow-y-auto z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="p-1 hover:bg-gray-800/50 rounded transition"
                aria-label="Close settings"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Zoom */}
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-3">Zoom</h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleZoomOut}
                    disabled={scale <= MIN_ZOOM}
                    className="p-2 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30 flex-shrink-0"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <input
                      type="range"
                      min={MIN_ZOOM * 100}
                      max={MAX_ZOOM * 100}
                      value={scale * 100}
                      onChange={(e) => setScale(parseInt(e.target.value, 10) / 100)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      aria-label="Zoom level"
                    />
                  </div>
                  
                  <button
                    onClick={handleZoomIn}
                    disabled={scale >= MAX_ZOOM}
                    className="p-2 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30 flex-shrink-0"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-5 h-5" />
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

              {/* Bookmarks - Mobile only */}
              <div className="sm:hidden">
                <h4 className="text-gray-300 text-sm font-medium mb-3">Bookmarks</h4>
                <button
                  onClick={toggleBookmark}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    bookmarks.includes(currentPage)
                      ? 'bg-yellow-600/20 border-yellow-500 text-white' 
                      : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <span>Bookmark Current Page</span>
                  <Bookmark 
                    className="w-4 h-4" 
                    fill={bookmarks.includes(currentPage) ? 'currentColor' : 'none'} 
                  />
                </button>
                {bookmarks.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-400">{bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}</p>
                    <div className="flex flex-wrap gap-2">
                      {bookmarks.map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            goToPage(page);
                            setShowSettings(false);
                          }}
                          className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-300 hover:bg-yellow-500/30 transition"
                        >
                          Page {page}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View Mode Settings */}
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-3">View Mode</h4>
                <div className="grid grid-cols-1 gap-2">
                  {(['single', 'double', 'continuous'] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        viewMode === mode 
                          ? 'bg-blue-600/20 border-blue-500 text-white' 
                          : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:bg-gray-800/50'
                      }`}
                    >
                      <span className="capitalize">{mode} Page</span>
                      {mode === 'single' && <BookOpen className="w-4 h-4" />}
                      {mode === 'double' && <Columns className="w-4 h-4" />}
                      {mode === 'continuous' && <Menu className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Settings */}
              <div>
                <h4 className="text-gray-300 text-sm font-medium mb-3">Display</h4>
                <div className="space-y-3">
                  <button
                    onClick={toggleFullscreen}
                    className="w-full flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition"
                  >
                    <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleRotate}
                    className="w-full flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800/50 transition"
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

      {/* Bottom Progress Bar */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-40
        transition-all duration-300
        controls-overlay
        ${showControls && !isScrollingDown ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        <div className="h-1 w-full bg-gray-800/50">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <div className="bg-black/90 backdrop-blur-xl border-t border-gray-800/50 px-3 sm:px-6 py-2 sm:py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-white font-medium text-sm sm:text-base">{Math.round(readingProgress)}%</span>
                <span className="inline">completed</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
               {bookmarks.length > 0 && (
                 <div className="flex items-center -space-x-1">
                   {bookmarks.slice(-3).map((page) => (
                     <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500 border-2 border-black flex items-center justify-center text-[9px] sm:text-[10px] text-black font-bold hover:scale-110 transition"
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
      </div>
    </div>
  );
}