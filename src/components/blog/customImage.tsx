'use client'

import Image from "next/image";
import { useState } from "react";

interface CustomImageProps {
  src: string
  alt?: string
  width?: string
  height?: string
  className?: string
  caption?: string
  [key: string]: unknown
}

export default function CustomImage({
  src,
  alt = '',
  width: widthProp,
  height: heightProp,
  className = '',
  caption,
  ...props
}: CustomImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  
  // Parse width and height from props or extract from URL
  let width = 800
  let height = 600
  
  if (widthProp) {
    width = typeof widthProp === 'string' ? parseInt(widthProp) : widthProp
  }
  
  if (heightProp) {
    height = typeof heightProp === 'string' ? parseInt(heightProp) : heightProp
  }
  
  // Try to extract dimensions from Unsplash URLs
  if (src.includes('.com')) {
    const url = new URL(src)
    const w = url.searchParams.get('w')
    const h = url.searchParams.get('h')
    
    if (w) width = parseInt(w)
    if (h) height = parseInt(h)
  }

  // Validate dimensions
  if (isNaN(width) || width <= 0) width = 800
  if (isNaN(height) || height <= 0) height = 600

  return (
    <div className={`my-8 group ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`
            w-full h-auto transition-all duration-700
            ${isLoading ? 'scale-105 blur-sm' : 'scale-100 blur-0'}
          `}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          {...props}
        />
        
        {/* Loading shimmer */}
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
        )}
      </div>
      
      {caption && (
        <div className="mt-2 text-center text-sm text-slate-600 italic">
          {caption}
        </div>
      )}
    </div>
  )
}