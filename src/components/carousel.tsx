"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowLeft, Pause, Play, ZoomIn } from 'lucide-react';

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

  useEffect(() => {
    if (!isPlaying) return;

  const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % comics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const next = () => setCurrent((prev) => (prev + 1) % comics.length);
  const prev = () => setCurrent((prev) => (prev - 1 + comics.length) % comics.length);

  const goToSlide = (index: number) => setCurrent(index);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto group">
      {/* Main carousel container */}
      <div className="relative h-[600px] bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
        <div className="relative w-full h-full">
          {comics.map((comic, index) => (
            <div
            key={comic.key}
            className={`absolute inset-0 transition-opacity duration-500 ${index === current ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={comic.url}
                alt={comic.name}
                fill
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,..."
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width:1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ArrowLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <ArrowLeft size={24} className="rotate-180" />
        </button>

        {/* Top controls */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
          >
            <ZoomIn size={20} />
          </button>
        </div>

        {/* Bottom Info and indicators */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">{comics[current]?.name}</h3>
            {/* <p className="text-sm opacity-90">{current + 1} / {comics.length}</p> */}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-4">
            {comics.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === current
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Thumbnail strip */}
          {/* <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {comics.map((comic, index) => (
              <button
                key={comic.key}
                onClick={() => goToSlide(index)}
                className={`flex-shrink-0 w-5 h-8 border-2 rounded transition-all ${
                  index === current
                    ? 'border-white scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
              >
                <Image
                  src={comic.url}
                  alt={comic.name}
                  fill
                  // width={40}
                  // height={40}
                  className="object-cover max-h-8 rounded"
                />
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div
        tabIndex={0}
        className='outline-none'
        onKeyDown={async (e) => {
          if (e.key === 'ArrowLeft') prev();
          if (e.key === 'ArrowRight') next();
          if (e.key === ' ') setIsPlaying(!isPlaying);
          if (e.key === 'Escape' && isFullscreen) await toggleFullscreen();
        }}
      />
    </div>

  )
}

