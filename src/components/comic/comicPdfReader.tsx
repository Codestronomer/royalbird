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
  ArrowRight
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
const TAP_ZONE_WIDTH = 0.33;

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
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const controlTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollPositionRef = useRef<number>(0);
  const scrollDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingProgrammaticallyRef = useRef<boolean>(false);
  
  // Auto-hide controls with proper cleanup
  const resetControlTimeout = useCallback(() => {
    if (showThumbnails || showSettings) {
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
  }, [showThumbnails, showSettings]);
  
  // Calculate visible pages with proper memoization
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
    
    // Continuous view - show from current page to end for proper scrolling
    const pages: number[] = [];
    const startPage = currentPage;
    // Show more pages to ensure smooth scrolling
    const endPage = Math.min(numPages, currentPage + 10);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, numPages, viewMode]);
  
  // Calculate page width for continuous mode to prevent white space on right
  const pageWidth = useMemo(() => {
    if (viewMode === 'continuous' && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      // Ensure pages are centered and properly scaled
      return Math.min(containerWidth * 0.9, 1000) * scale;
    }
    return undefined;
  }, [viewMode, scale]);
  
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
  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    
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
          if (progress.page > 0 && progress.page <= numPages) {
            setCurrentPage(progress.page);
            setReadingTime(progress.readingTime ?? 0);
          }
        }
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, [comic?.id]);
  
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
      
      // Reset scroll position for continuous mode
      if (viewMode === 'continuous' && viewerRef.current) {
        isScrollingProgrammaticallyRef.current = true;
        viewerRef.current.scrollTop = 0;
        setTimeout(() => {
          isScrollingProgrammaticallyRef.current = false;
        }, 100);
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
    setScale(1.0);
    resetControlTimeout();
  }, [resetControlTimeout]);
  
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
    // Reset scroll when changing view modes
    if (viewerRef.current) {
      viewerRef.current.scrollTop = 0;
    }
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
        localStorage.setItem(`comic-${comic.id}-bookmarks`, JSON.stringify(newBookmarks));
      }
      
      return newBookmarks;
    });
    resetControlTimeout();
  }, [currentPage, comic?.id, resetControlTimeout]);
  
  // Tap navigation
  const handleTapNavigation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (showThumbnails || showSettings) return;
    
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('input') || 
      target.closest('select') || 
      target.closest('textarea') ||
      target.closest('.react-pdf__Page')
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
    }
  }, [goToPreviousPage, goToNextPage, showThumbnails, showSettings]);
  
  // Improved scroll handler for continuous mode
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!viewerRef.current || isScrollingProgrammaticallyRef.current) return;
    
    const element = viewerRef.current;
    const currentScrollPos = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Update last scroll position
    lastScrollPositionRef.current = currentScrollPos;
    
    if (scrollDirection === 'vertical' && viewMode === 'continuous') {
      // Clear any existing debounce
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
      
      scrollDebounceRef.current = setTimeout(() => {
        // Calculate how far we've scrolled as a percentage
        const scrollPercentage = (currentScrollPos + clientHeight) / scrollHeight;
        
        // If we're near the bottom (95%), load next pages
        if (scrollPercentage > 0.95 && currentPage < numPages) {
          // Instead of immediately jumping to next page, we'll load more pages
          // This creates a true infinite scroll experience
          if (currentPage + 10 > numPages) {
            // If we're near the end, just go to next page
            goToNextPage();
          }
          // Otherwise, the visiblePages memo will handle loading more pages
          // since it shows currentPage + 10 pages
        }
        
        // Also check if we're scrolling up to previous content
        if (scrollPercentage < 0.1 && currentPage > 1) {
          // Load previous pages if needed
          goToPage(Math.max(1, currentPage - 1));
        }
      }, 200); // Increased debounce for smoother scrolling
    }
    
    resetControlTimeout();
  }, [scrollDirection, viewMode, currentPage, numPages, goToNextPage, goToPage, resetControlTimeout]);
  
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
  
  // Reset zoom when changing view modes
  useEffect(() => {
    if (viewMode === 'continuous') {
      // Reset to optimal zoom for continuous reading
      setScale(1.0);
    }
  }, [viewMode]);
  
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
  
  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col select-none"
      onClick={handleTapNavigation}
      onMouseMove={resetControlTimeout}
    >
      {/* Top Bar */}
      <div className={`
        bg-gradient-to-b from-black/95 via-black/90 to-transparent 
        backdrop-blur-xl border-b border-gray-800/50
        transition-all duration-300 px-4 py-3
        ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Title */}
          <div className="flex items-center gap-4">
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
                {showReadingProgress && estimatedRemainingTime && (
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    {formatTime(estimatedRemainingTime)} left
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage <= 1}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur rounded-lg px-3 py-1">
              <input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-12 bg-transparent text-white text-center text-sm focus:outline-none"
                min={1}
                max={numPages}
              />
              <span className="text-gray-400 text-sm">/ {numPages}</span>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className={`p-2 hover:bg-gray-800/50 rounded-lg transition ${
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
              className={`p-2 hover:bg-gray-800/50 rounded-lg transition ${
                showThumbnails ? 'text-blue-500' : 'text-gray-300 hover:text-white'
              }`}
              aria-label="Thumbnails"
            >
              <Grid className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 hover:bg-gray-800/50 rounded-lg transition ${
                showSettings ? 'text-blue-500' : 'text-gray-300 hover:text-white'
              }`}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="w-px h-6 bg-gray-700 mx-1" />

            <button
              onClick={toggleViewMode}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white"
              aria-label="View mode"
            >
              {viewMode === 'single' && <BookOpen className="w-5 h-5" />}
              {viewMode === 'double' && <Columns className="w-5 h-5" />}
              {viewMode === 'continuous' && <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setScrollDirection(prev => prev === 'vertical' ? 'horizontal' : 'vertical')}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition text-gray-300 hover:text-white"
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
          </Document>
        </div>
      </div>

      {/* Thumbnails Panel */}
      {showThumbnails && (
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-black/95 backdrop-blur-xl border-r border-gray-800/50 overflow-y-auto z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Pages</h3>
              <button 
                onClick={() => setShowThumbnails(false)}
                className="p-1 hover:bg-gray-800/50 rounded transition"
                aria-label="Close thumbnails"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
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
                    <span className="text-gray-400 text-sm">{pageNum}</span>
                  </div>
                  {bookmarks.includes(pageNum) && (
                    <div className="absolute top-1 right-1">
                      <Bookmark className="w-4 h-4 text-yellow-500" fill="currentColor" />
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
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur-xl border-l border-gray-800/50 overflow-y-auto z-50">
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
                    className="p-2 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-5 h-5" />
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
                    className="p-2 bg-gray-800/50 rounded-lg text-gray-300 hover:text-white disabled:opacity-30"
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
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-400 group-hover:text-gray-300 transition">Show Progress Bar</span>
                    <input 
                      type="checkbox" 
                      checked={showReadingProgress}
                      onChange={(e) => setShowReadingProgress(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                  </label>
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
        ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        {/* Progress Rail */}
        <div className="h-1 w-full bg-gray-800/50">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Info Bar */}
        <div className="bg-black/90 backdrop-blur-xl border-t border-gray-800/50 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">{Math.round(readingProgress)}%</span>
                <span>completed</span>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(readingTime)} reading</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
               {bookmarks.length > 0 && (
                 <div className="flex items-center -space-x-1">
                   {bookmarks.slice(-3).map((page) => (
                     <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-black flex items-center justify-center text-[10px] text-black font-bold hover:scale-110 transition"
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