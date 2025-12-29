import { clsx, type ClassValue } from "clsx"
import type { MDXComponents } from "mdx/types";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { twMerge } from "tailwind-merge"
import type { ApiBlogPostResponse, BlogMetadata, BlogPost } from "~/types/blog";
import type { ApiComicResponse, Comic } from "~/types/comics";
import { mdxComponents } from "./mdx-components";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// DEVICE DETECTION
// ============================================================================

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

interface DeviceInfo {
  type: DeviceType
  width: number
  height: number
  isTouchDevice: boolean
  isHighDpi: boolean
}

/**
 * Detect device type based on viewport width and capabilities
 */
export function detectDevice(width?: number): DeviceType {
  if (typeof window === 'undefined') return 'desktop'
  
  const viewportWidth = width ?? window.innerWidth
  
  if (viewportWidth < 768) return 'mobile'
  if (viewportWidth < 1024) return 'tablet'
  return 'desktop'
}

/**
 * Get comprehensive device information
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop',
      width: 1920,
      height: 1080,
      isTouchDevice: false,
      isHighDpi: false,
    }
  }

  const isTouchDevice = () => {
    return (
      navigator.maxTouchPoints > 0 ||
      ('ontouchstart' in window)
    )
  }

  return {
    type: detectDevice(),
    width: window.innerWidth,
    height: window.innerHeight,
    isTouchDevice: isTouchDevice(),
    isHighDpi: (window.devicePixelRatio || 1) > 1,
  }
}

// ============================================================================
// FORMAT SELECTION & FALLBACK LOGIC
// ============================================================================

/**
 * Determine the best format for a comic based on device and available formats
 * Handles fallbacks gracefully
 */
export function getBestFormat(
  comic: Comic,
  deviceType?: DeviceType
): { format: 'pdf' | 'images' | null; url?: string; images?: string[] } {
  const device = deviceType ?? detectDevice()
  let preferredFormat = comic.preferredFormat

  // Handle 'auto' preference based on device
  if (preferredFormat === 'auto') {
    preferredFormat = device === 'desktop' ? 'pdf' : 'images'
  }

  // Try to use preferred format first
  if (preferredFormat === 'pdf' && comic.pdfUrl) {
    return { format: 'pdf', url: comic.pdfUrl }
  }

  if (preferredFormat === 'images' && comic.images) {
    return { format: 'images', images: comic.images }
  }

  // Fallback chain based on device
  if (device === 'desktop') {
    // Desktop: prefer PDF, fallback to images
    if (comic.pdfUrl) return { format: 'pdf', url: comic.pdfUrl }
    if (comic.images) return { format: 'images', images: comic.images }
  } else {
    // Mobile/Tablet: prefer images, fallback to PDF
    if (comic.images) return { format: 'images', images: comic.images }
    if (comic.pdfUrl) return { format: 'pdf', url: comic.pdfUrl }
  }

  // Legacy support fallback
  if (comic.pdfUrl) return { format: 'pdf', url: comic.pdfUrl }
  if (comic.images) return { format: 'images', images: comic.images }

  return { format: null }
}

/**
 * Get quality-optimized images for the device
 */
export function getQualityImages(
  comic: Comic,
  deviceType?: DeviceType
): string[] {
  const device = deviceType ?? detectDevice()

  if (!comic.quality) {
    // No quality tiers, return raw images
    return getBestFormat(comic, device).images ?? []
  }

  switch (device) {
    case 'mobile':
      return comic.quality.low
    case 'tablet':
      return comic.quality.medium
    case 'desktop':
      return comic.quality.high
  }
}

/**
 * Determine if the comic should use lazy loading
 */
export function shouldUseLazyLoading(comic: Comic, deviceType?: DeviceType): boolean {
  const device = deviceType ?? detectDevice()
  const format = getBestFormat(comic, device).format

  // PDF on desktop = use lazy loading (PDF.js handles it)
  // Images on mobile/tablet = use lazy loading (performance)
  return (device === 'desktop' && format === 'pdf') || device !== 'desktop'
}

/**
 * Get recommended image dimensions based on device
 */
export function getImageDimensions(deviceType?: DeviceType): {
  width: number
  height: number
  quality: number
} {
  const device = deviceType ?? detectDevice()

  switch (device) {
    case 'mobile':
      return { width: 500, height: 750, quality: 0.7 }
    case 'tablet':
      return { width: 900, height: 1350, quality: 0.8 }
    case 'desktop':
      return { width: 1400, height: 2100, quality: 0.9 }
  }
}

// ============================================================================
// IMAGE OPTIMIZATION HELPERS
// ============================================================================

/**
 * Returns an optimized image URL by appending width and quality query params.
 * Many CDNs/asset hosts ignore unknown params, so this is a safe opt-in.
 */
export function getOptimizedImageUrl(url: string, deviceType?: DeviceType, widthOverride?: number, qualityOverride?: number): string {
  const { width, quality } = getImageDimensions(deviceType)
  const w = widthOverride ?? width
  const q = Math.round((qualityOverride ?? quality) * 100)

  try {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}w=${w}&q=${q}`
  } catch {
    return url
  }
}

/**
 * Preload an image into the browser cache. Resolves on load or error.
 */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = url
      // If cached, onload may not fire in some old browsers, so resolve quickly
      if (img.complete) resolve()
    } catch {
      resolve()
    }
  })
}

/**
 * Prepare a comic's image list into optimized URLs for the target device.
 * This helper is useful for build-time preprocessing or server-side transforms.
 */
export function preprocessComicImages(comic: Comic, deviceType?: DeviceType): string[] {
  const images = (comic.quality ? getQualityImages(comic, deviceType) : (comic.images ?? comic.images ?? []))
  return images.map(img => getOptimizedImageUrl(img, deviceType))
}

// ============================================================================
// LEGACY SUPPORT (DEPRECATED)
// ============================================================================

/**
 * @deprecated Use getBestFormat instead
 */
export function getReaderComponent(comic: Comic): 'pdf' | 'image' {
  const bestFormat = getBestFormat(comic)
  return bestFormat.format === 'pdf' ? 'pdf' : 'image'
}

export function formatDate(dateValue?: string | Date): string {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (isNaN(d.getTime())) return '';

  const isoString: string = d.toISOString();
  return isoString.split('T')[0] ?? '';
}

export function debounce<T extends (...args: never[]) => unknown>(callback: T, delay: number) {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => callback(...args), delay);
  };
}

export const transformPost = (apiPost: ApiBlogPostResponse): BlogPost => ({
  slug: apiPost.slug ?? apiPost._id ?? '',
  title: apiPost.title ?? '',
  description: apiPost.description ?? apiPost.metaDescription ?? '',
  image: apiPost.featuredImage ?? 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCQPFe4NSHnf78926VZhOJkgbztoGBvpIKa0WE',
  category: apiPost.category ?? 'Uncategorized',
  author: apiPost.author ?? '',
  date: apiPost.publishedAt ? formatDate(apiPost.publishedAt) : '',
  tags: apiPost.tags ?? [],
  featured: apiPost.featured ?? false,
  content: parseMdxContent(apiPost.content ?? ''),
  rawContent: apiPost.content ?? '',
  readingTime: apiPost.readingTime ?? 5,
  wordCount: apiPost.content?.split(/\s+/).length ?? 0,
  published: apiPost.status === 'published',
  seo: {
    title: apiPost.metaTitle ?? apiPost.title,
    description: apiPost.metaDescription ?? apiPost.description,
    keywords: apiPost.tags,
    ogImage: apiPost.featuredImage
  },
  likes: apiPost.likes ?? 0,
  views: apiPost.views ?? 0,
  id: apiPost._id ?? apiPost.id,
  status: apiPost.status,
  createdAt: apiPost.createdAt,
  updatedAt: apiPost.updatedAt,
});

export async function parseMdxContent(unParsedContent: string): Promise<React.ReactElement | string> {
  try {
    const { content: mdxContent } = await compileMDX<BlogMetadata>({
      source: unParsedContent,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap'}],
            rehypeKatex,
          ],
        },
      },
      components: mdxComponents as MDXComponents,
    });
    
    return mdxContent;
  } catch (error) {
    console.error(`Error parsing blog content:`, error);
    return unParsedContent;
  }
}

export const transformComic = (apiComic: ApiComicResponse): Comic => {

  return {
    id: apiComic._id ? apiComic._id.toString() : '',
    slug: apiComic.slug,
    title: apiComic.title,
    description: apiComic.description,
    coverImage: apiComic.coverImage,
    totalPages: apiComic.totalPages,
    readTime: apiComic.estimatedReadTime ?? 'N/A',
    issueNumber: apiComic.issueNumber,
    status: apiComic.status,
    availability: apiComic.availability,
    likes: apiComic.likes,
            
    tags: apiComic.tags,
    featured: apiComic.featured,
    readers: apiComic.readers,
    views: apiComic.views,
    publishedAt: apiComic.publishedAt ?? apiComic.createdAt,
    artist: apiComic.artist ?? 'Unknown Artist',
    writer: apiComic.writer ?? 'Unknown Writer',

    // Optional/Secondary metadata
    rating: apiComic.averageRating,
    language: apiComic.language,
    ageRating: apiComic.ageRating,
    genres: apiComic.genres,
    
    // Format management
    format: apiComic.format,
    contentType: apiComic.contentType,
    pdfUrl: apiComic.pdfUrl,
    images: apiComic.images,
    preferredFormat: 'auto',
    
    // Preview pages
    previewPages: apiComic.previewImages ?? [],
  };
};