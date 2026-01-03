"use client"
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Maximize2, Minimize2, Pause, Play } from 'lucide-react';

const comics = [
  {
    "name": "Royal Bird Studios",
    "key": "ymmBhW7qEDZCymb1j69qEDZC8Hw7eNgT4PLyuntVMO2khFcq",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCirLamEpXG9cToa4EOsCnyL3BVWvR1M0ZUd7e",
    "size": 2739392,
    "uploadedAt": "2025-11-16T01:26:34.000Z"
  },
  {
    "name": "Breach",
    "key": "ymmBhW7qEDZCtvvxhMsTokwtWSCKHZy710dYzip9cuJgEVRa",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCtvvxhMsTokwtWSCKHZy710dYzip9cuJgEVRa",
    "size": 192719,
    "uploadedAt": "2025-12-19T04:00:06.000Z"
  },
  {
    "name": "Breach Issue #1",
    "key": "ymmBhW7qEDZCiL1TlNpXG9cToa4EOsCnyL3BVWvR1M0ZUd7e",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCiL1TlNpXG9cToa4EOsCnyL3BVWvR1M0ZUd7e",
    "size": 8408734,
    "uploadedAt": "2025-11-16T01:26:34.000Z"
  },
  {
    "name": "IMG_6443.PNG",
    "key": "ymmBhW7qEDZCvujmmuwnr6QhBCf01XYDbMTEa2JVi8HIeFyL",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCvujmmuwnr6QhBCf01XYDbMTEa2JVi8HIeFyL",
    "size": 11693993,
    "uploadedAt": "2025-12-19T04:00:06.000Z"
  },
  {
    "name": "IMG_6444.PNG",
    "key": "ymmBhW7qEDZCNsk8BormyksCi7f4MLRxgTSruQ3hwIcJlj9V",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCNsk8BormyksCi7f4MLRxgTSruQ3hwIcJlj9V",
    "size": 15558907,
    "uploadedAt": "2025-12-19T04:00:06.000Z"
  },
  {
    "name": "Breach Issue #2",
    "key": "ymmBhW7qEDZCSES6AQ2TpkQoJyvDgn93mZwOBP6z7FRjVGil",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCk0hUKGVetT2M4N5FXZRKsny8JVLdw7rCjOS3",
    "size": 8408734,
    "uploadedAt": "2025-11-16T01:26:34.000Z"
  },
  {
    "name": "IMG_6445.PNG",
    "key": "ymmBhW7qEDZCOW7ejeydnSvhkqm0O9XUjIeaiTAs1W3LltbM",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCOW7ejeydnSvhkqm0O9XUjIeaiTAs1W3LltbM",
    "size": 12423945,
    "uploadedAt": "2025-12-19T04:00:05.000Z"
  },
  {
    "name": "IMG-20251120-WA0009.jpg",
    "key": "ymmBhW7qEDZCt0wwZmsTokwtWSCKHZy710dYzip9cuJgEVRa",
    "customId": null,
    "url": "https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCt0wwZmsTokwtWSCKHZy710dYzip9cuJgEVRa",
    "size": 631920,
    "uploadedAt": "2025-12-19T04:00:05.000Z"
  },
];

export default function ComicCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        next();
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, current]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % comics.length);
  const prev = () => setCurrent((prev) => (prev - 1 + comics.length) % comics.length);

  // Mobile Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Use optional chaining to safely get the clientX
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart(touch.clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return; // Strict check for null

    const touch = e.changedTouches[0];
    if (!touch) return; // Guard against undefined touch

    const touchEnd = touch.clientX;
    const distance = touchStart - touchEnd;

    if (distance > 50) next(); 
    if (distance < -50) prev(); 
    
    setTouchStart(null);
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      console.error(`Error attempting to toggle full-screen mode`);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 md:px-0">
      <div
          ref={containerRef}
          className="
    relative
    w-full
    aspect-video              /* landscape on mobile */
    md:aspect-auto
    md:h-[600px]               /* fixed height on desktop */
    bg-gray-900
    rounded-2xl
    overflow-hidden
    shadow-2xl
    touch-pan-y
          "
           onTouchStart={handleTouchStart}
           onTouchEnd={handleTouchEnd}
        >
        {/* Images */}
        {comics.map((comic, index) => (
          <div
            key={comic.key}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <Image
              src={comic.url}
              alt={comic.name}
              fill
              priority={index === 0}
              className="object-contain md:object-cover" // Contain on mobile to see full art, cover on desktop
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
          </div>
        ))}

        {/* Desktop Navigation Arrows (Hidden on Mobile) */}
        <button
          onClick={prev}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={next}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all"
        >
          <ArrowRight size={24} />
        </button>

        {/* Top Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black/40 backdrop-blur-md text-white p-3 rounded-xl hover:bg-black/60 transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-black/40 backdrop-blur-md text-white p-3 rounded-xl hover:bg-black/60 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Featured Release</span>
            <h3 className="text-2xl md:text-3xl font-black">{comics[current]?.name}</h3>
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex gap-1.5">
              {comics.map((_, index) => (
                <div 
                  key={index}
                  className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
                >
                  <div 
                    className={`h-full bg-blue-500 transition-all duration-[5000ms] ease-linear ${
                      index === current && isPlaying ? 'w-full' : index < current ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>
            <span className="text-xs font-mono opacity-60">
              {String(current + 1).padStart(2, '0')} / {String(comics.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint (Optional) */}
      <p className="text-center text-gray-500 text-xs mt-4 md:hidden">
        Swipe left or right to browse
      </p>
    </div>
  );
}