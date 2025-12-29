// lib/comics.ts
/**
 * Global comics service for retrieving, filtering, and managing comic data
 * This service acts as a data layer between the API and components
 */

import type { Comic } from '~/types/comics'

// Mock data - In production, this would come from a database
// TODO: Replace with database queries
const MOCK_COMICS: Comic[] = [
  {
    id: 1,
    slug: 'breach-issue-1',
    title: 'BREACH Issue #1',
    description: 'A cyberpunk thriller set in futuristic Lagos where a hacker discovers a conspiracy that threatens to unravel reality itself.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZClft5PAGpduc014aCIU9Zn5WhQOGosiJETqfK',
    category: 'Cyberpunk',
    rating: 4.8,
    pages: 48,
    readTime: '45 min',
    status: 'Completed',
    tags: ['Cyberpunk', 'Afrofuturism', 'Thriller'],
    featured: false,
    readers: 12500,
    views: 85000,
    publishedAt: '2025-08-22',
    issueNumber: '1',
    artist: 'Ayo Olojede',
    writer: 'Chizoba Ogbonna',
    genre: ['Cyberpunk', 'Thriller'],
    formats: {
      pdf: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCa9zS0SlcES6McQt13nVuRW8AxgHXpvBeqTk2',
      images: [],
    },
    preferredFormat: 'auto',
  },
  {
    id: 2,
    slug: 'swapped',
    title: 'Swapped',
    description: 'Two friends wake up in each other\'s bodies—confused, panicked, and realizing someone wanted this to happen. Now they must survive each other\'s lives while uncovering who switched them… and why.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCpOpQBDaFjWu0eatESN5X6Am9bofsQqiVhzHC',
    category: 'Fantasy',
    rating: 4.9,
    pages: 30,
    readTime: '20 min',
    status: 'Coming Soon',
    tags: ['Fantasy', 'Drama', 'Fiction', 'Romance'],
    featured: true,
    readers: 20,
    views: 500,
    publishedAt: '2024-02-01',
    artist: 'Zainab Adekunle',
    writer: 'Adeyemi Kolade',
    genre: ['Fantasy', 'Romance'],
    formats: {
      images: [],
    },
    preferredFormat: 'images',
  },
  {
    id: 3,
    slug: 'breach-issue-2',
    title: 'Breach Issue #2',
    description: 'Onari\'s journey continues into the Forsaken. still reluctant to join the fight, it is obvious something must be done to save the people',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCwVnJbzHX8cBAhqQlatjysEH4IeYN5Vodrvxb',
    category: 'Cyberpunk',
    rating: 4.8,
    pages: 48,
    readTime: '45 min',
    status: 'Ongoing',
    tags: ['Cyberpunk', 'Afrofuturism', 'Thriller'],
    featured: true,
    readers: 12500,
    views: 85000,
    publishedAt: '2025-10-03',
    artist: 'Ayo Olojede',
    writer: 'Chizoba Ogbonna',
    issueNumber: '2',
    series: 'BREACH',
    genre: ['Cyberpunk', 'Thriller'],
    formats: {
      pdf: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCXAOCS0n0VGIlgYxKZnju4WmB8wbyLo1TfkNF',
      images: [],
    },
    preferredFormat: 'auto',
  },
  {
    id: 11,
    slug: 'anansi-web',
    title: 'Anansi\'s Web',
    description: 'The trickster spider weaves tales of wisdom and mischief across the African diaspora in this stunning mythological collection.',
    image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&h=1200&fit=crop',
    category: 'Mythology',
    rating: 4.9,
    pages: 64,
    readTime: '60 min',
    status: 'Ongoing',
    tags: ['Mythology', 'Folklore', 'Fantasy'],
    featured: false,
    readers: 9800,
    views: 72000,
    publishedAt: '2024-01-20',
    artist: 'Kofi Asante',
    writer: 'Akosua Mensah',
    genre: ['Mythology', 'Fantasy'],
    formats: {
      images: [],
    },
    preferredFormat: 'images',
  },
  {
    id: 4,
    slug: 'queen-amina',
    title: 'Queen Amina',
    description: 'The epic story of the warrior queen of Zazzau who built an empire and defended her people against invaders.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCbEyDNLTjwQiehyaprgucNE83TskxCXJonmIZ',
    category: 'Historical',
    rating: 4.7,
    pages: 56,
    readTime: '52 min',
    status: 'Completed',
    tags: ['Historical', 'Biography', 'Action'],
    featured: false,
    readers: 11200,
    views: 68000,
    publishedAt: '2024-01-05',
    artist: 'Fatima Hassan',
    writer: 'Amara Okafor',
    genre: ['Historical', 'Biography'],
    formats: {
      images: [],
    },
    preferredFormat: 'images',
  },
  {
    id: 5,
    slug: 'sundiata-epic',
    title: 'Sundiata Epic',
    description: 'The legendary story of the King who founded the Mali Empire, told through breathtaking artwork.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZC1LKjpK0Pvwy56lfshgk8Vpqr3K9ZYtuG2jzb',
    category: 'Epic',
    rating: 4.6,
    pages: 72,
    readTime: '68 min',
    status: 'Completed',
    tags: ['Epic', 'Historical', 'Fantasy'],
    featured: false,
    readers: 8900,
    views: 55000,
    publishedAt: '2023-12-20',
    artist: 'Moussa Diallo',
    writer: 'Sekou Toure',
    genre: ['Epic', 'Historical'],
    formats: {
      images: [],
    },
    preferredFormat: 'images',
  },
  {
    id: 6,
    slug: 'underground',
    title: 'Underground',
    description: 'In a neon-drenched future Accra, a detective must solve a mystery that blurs the line between human and AI.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCGnfHoBkp2lSLbfzjw5TkVhnZ8qrN7eP3BKuQ',
    category: 'Cyberpunk',
    rating: 4.5,
    pages: 40,
    readTime: '38 min',
    status: 'Ongoing',
    tags: ['Cyberpunk', 'Noir', 'Mystery'],
    featured: false,
    readers: 7400,
    views: 42000,
    publishedAt: '2024-01-30',
    artist: 'Kwame Boateng',
    writer: 'Ama Asare',
    genre: ['Cyberpunk', 'Mystery'],
    formats: {
      images: [],
    },
    preferredFormat: 'auto',
  },
  {
    id: 7,
    slug: 'yoruba-pantheon',
    title: 'Yoruba Pantheon',
    description: 'Explore the rich mythology of Yoruba gods and goddesses in this visually stunning anthology.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCpClP0NaFjWu0eatESN5X6Am9bofsQqiVhzHC',
    category: 'Mythology',
    rating: 4.9,
    pages: 80,
    readTime: '75 min',
    status: 'Completed',
    tags: ['Mythology', 'Anthology', 'Fantasy'],
    featured: false,
    readers: 10200,
    views: 61000,
    publishedAt: '2024-01-10',
    artist: 'Femi Adewale',
    writer: 'Bisi Adeyemi',
    genre: ['Mythology', 'Fantasy'],
    formats: {
      images: [],
    },
    preferredFormat: 'images',
  },
  {
    id: 8,
    slug: 'death-metal',
    title: 'Death Metal',
    description: 'Modern-day griots use ancient magic to preserve stories in a world that has forgotten their power.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCz4fee9CPnOAdf5ZcQCVhPNT1g2Gt6LUlvIS3',
    category: 'Urban Fantasy',
    rating: 4.4,
    pages: 36,
    readTime: '35 min',
    status: 'Ongoing',
    tags: ['Urban Fantasy', 'Magic', 'Contemporary'],
    featured: false,
    readers: 6800,
    views: 38000,
    publishedAt: '2024-02-05',
    artist: 'Abena Mensah',
    writer: 'Kweku Sarpong',
    genre: ['Urban Fantasy'],
    formats: {
      images: [],
    },
    preferredFormat: 'images',
  },
  {
    id: 9,
    slug: 'saharan-nomads',
    title: 'Saharan Nomads',
    description: 'Follow the journey of Tuareg nomads across the Sahara in this beautifully illustrated travelogue comic.',
    image: 'https://velgg90lgs.ufs.sh/f/ymmBhW7qEDZCtD0SP2sTokwtWSCKHZy710dYzip9cuJgEVRa',
    category: 'Travel',
    rating: 4.7,
    pages: 44,
    readTime: '42 min',
    status: 'Completed',
    tags: ['Travel', 'Cultural', 'Adventure'],
    featured: false,
    readers: 5600,
    views: 32000,
    publishedAt: '2023-12-15',
    artist: 'Aisha Ag',
    writer: 'Ibrahim Maiga',
    genre: ['Travel', 'Adventure'],
    formats: {
      images: [],
    },
    preferredFormat: 'images',
  },
  {
    id: 10,
    slug: 'final-crisis',
    title: 'Final Crisis',
    description: 'A groundbreaking and thought-provoking event in the DC Universe, where Darkseid uses the Anti-Life Equation to remake heroes, villains, and everyday people in his image, threatening the fabric of reality itself.',
    image: 'https://m.media-amazon.com/images/I/61eKSjHGKsL._SY580_.jpg',
    category: 'Superhero',
    rating: 4.7,
    pages: 44,
    readTime: '42 min',
    status: 'Completed',
    tags: ['Superhero', 'Adventure'],
    featured: false,
    readers: 5600,
    views: 32000,
    publishedAt: '2024-01-25',
    artist: 'Artist Unknown',
    writer: 'Grant Morrison',
    genre: ['Superhero'],
    formats: {
      images: [],
    },
    preferredFormat: 'auto',
  },
]

// ============================================================================
// CORE RETRIEVAL FUNCTIONS
// ============================================================================

/**
 * Get all comics
 * @returns Promise<Comic[]> - Array of all comics
 */
export async function getAllComics(): Promise<Comic[]> {
  // TODO: Replace with database query
  // const response = await fetch(`${API_URL}/comics`);
  // return response.json();
  return MOCK_COMICS
}

/**
 * Get a single comic by ID
 * @param id - Comic ID
 * @returns Comic | null
 */
export async function getComicById(id: number): Promise<Comic | null> {
  // TODO: Replace with database query
  // const response = await fetch(`${API_URL}/comics/${id}`);
  // return response.json();
  return MOCK_COMICS.find(comic => comic.id === id) ?? null
}

/**
 * Get a single comic by slug
 * @param slug - Comic slug (URL-friendly identifier)
 * @returns Comic | null
 */
export async function getComicBySlug(slug: string): Promise<Comic | null> {
  // TODO: Replace with database query
  // const response = await fetch(`${API_URL}/comics/slug/${slug}`);
  // return response.json();
  return MOCK_COMICS.find(comic => comic.slug === slug) ?? null
}

// ============================================================================
// FILTERING FUNCTIONS
// ============================================================================

/**
 * Get all featured comics
 * @returns Comic[]
 */
export async function getFeaturedComics(): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.featured)
}

/**
 * Get comics by category
 * @param category - Category name
 * @returns Comic[]
 */
export async function getComicsByCategory(category: string): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.category.toLowerCase() === category.toLowerCase())
}

/**
 * Get comics by status
 * @param status - Comic status (Completed, Ongoing, Coming Soon)
 * @returns Comic[]
 */
export async function getComicsByStatus(status: Comic['status']): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.status === status)
}

/**
 * Get comics by genre
 * @param genre - Genre name
 * @returns Comic[]
 */
export async function getComicsByGenre(genre: string): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
}

/**
 * Get comics by artist
 * @param artist - Artist name
 * @returns Comic[]
 */
export async function getComicsByArtist(artist: string): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.artist.toLowerCase() === artist.toLowerCase())
}

/**
 * Get comics by writer
 * @param writer - Writer name
 * @returns Comic[]
 */
export async function getComicsByWriter(writer: string): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.writer.toLowerCase() === writer.toLowerCase())
}

/**
 * Get comics by tag
 * @param tag - Tag name
 * @returns Comic[]
 */
export async function getComicsByTag(tag: string): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
}

/**
 * Get comics by series
 * @param series - Series name
 * @returns Comic[]
 */
export async function getComicsBySeries(series: string): Promise<Comic[]> {
  const comics = await getAllComics()
  return comics.filter(comic => comic.series?.toLowerCase() === series.toLowerCase())
}

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Search comics by title, description, or tags
 * @param query - Search query
 * @returns Comic[]
 */
export async function searchComics(query: string): Promise<Comic[]> {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  const comics = await getAllComics()

  return comics.filter(comic => 
    comic.title.toLowerCase().includes(lowerQuery) ||
    comic.description.toLowerCase().includes(lowerQuery) ||
    comic.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    comic.artist.toLowerCase().includes(lowerQuery) ||
    comic.writer.toLowerCase().includes(lowerQuery)
  )
}

// ============================================================================
// SORTING FUNCTIONS
// ============================================================================

export type SortOption = 'popularity' | 'newest' | 'rating' | 'views' | 'alphabetical' | 'reads'

/**
 * Sort comics by specified criteria
 * @param comics - Array of comics to sort
 * @param sortBy - Sort criteria
 * @returns Comic[] - Sorted comics
 */
export function sortComics(comics: Comic[], sortBy: SortOption = 'popularity'): Comic[] {
  const sorted = [...comics]

  switch (sortBy) {
    case 'popularity':
      return sorted.sort((a, b) => (b.readers ?? 0) - (a.readers ?? 0))

    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )

    case 'rating':
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

    case 'views':
      return sorted.sort((a, b) => (b.views ?? 0) - (a.views ?? 0))

    case 'reads':
      return sorted.sort((a, b) => (b.readers ?? 0) - (a.readers ?? 0))

    case 'alphabetical':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))

    default:
      return sorted
  }
}

// ============================================================================
// PAGINATION
// ============================================================================

interface PaginationOptions {
  page?: number
  limit?: number
}

interface PaginatedResult<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

/**
 * Get paginated comics
 * @param comics - Array of comics to paginate
 * @param options - Pagination options
 * @returns PaginatedResult
 */
export function paginateComics(
  comics: Comic[],
  options: PaginationOptions = {}
): PaginatedResult<Comic> {
  const page = options.page ?? 1
  const limit = options.limit ?? 12

  const start = (page - 1) * limit
  const end = start + limit
  const data = comics.slice(start, end)
  const total = comics.length
  const totalPages = Math.ceil(total / limit)

  return {
    data,
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  }
}

// ============================================================================
// ADVANCED FILTERING
// ============================================================================

interface FilterOptions {
  category?: string
  status?: Comic['status']
  genres?: string[]
  minRating?: number
  maxRating?: number
  featured?: boolean
  search?: string
  sortBy?: SortOption
}

/**
 * Advanced filtering with multiple criteria
 * @param options - Filter options
 * @returns Comic[]
 */
export async function filterComics(options: FilterOptions): Promise<Comic[]> {
  let comics = await getAllComics()

  // Category filter
  if (options.category) {
    comics = comics.filter(comic => comic.category.toLowerCase() === options.category!.toLowerCase())
  }

  // Status filter
  if (options.status) {
    comics = comics.filter(comic => comic.status === options.status)
  }

  // Genre filter
  if (options.genres && options.genres.length > 0) {
    comics = comics.filter(comic =>
      comic.genre.some(g => options.genres!.some(og => og.toLowerCase() === g.toLowerCase()))
    )
  }

  // Rating filter
  if (options.minRating !== undefined) {
    comics = comics.filter(comic => (comic.rating ?? 0) >= options.minRating!)
  }
  if (options.maxRating !== undefined) {
    comics = comics.filter(comic => (comic.rating ?? 0) <= options.maxRating!)
  }

  // Featured filter
  if (options.featured !== undefined) {
    comics = comics.filter(comic => comic.featured === options.featured)
  }

  // Search filter
  if (options.search) {
    const lowerSearch = options.search.toLowerCase()
    comics = comics.filter(comic =>
      comic.title.toLowerCase().includes(lowerSearch) ||
      comic.description.toLowerCase().includes(lowerSearch) ||
      comic.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
    )
  }

  // Sorting
  if (options.sortBy) {
    comics = sortComics(comics, options.sortBy)
  }

  return comics
}

// ============================================================================
// STATISTICS & METADATA
// ============================================================================

/**
 * Get unique categories
 * @returns string[]
 */
export async function getCategories(): Promise<string[]> {
  const comics = await getAllComics()
  const categories = new Set(comics.map(comic => comic.category))
  return Array.from(categories).sort()
}

/**
 * Get unique genres
 * @returns string[]
 */
export async function getGenres(): Promise<string[]> {
  const comics = await getAllComics()
  const genres = new Set<string>()
  comics.forEach(comic => comic.genre.forEach(g => genres.add(g)))
  return Array.from(genres).sort()
}

/**
 * Get unique tags
 * @returns string[]
 */
export async function getTags(): Promise<string[]> {
  const comics = await getAllComics()
  const tags = new Set<string>()
  comics.forEach(comic => comic.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
}

/**
 * Get all artists
 * @returns string[]
 */
export async function getArtists(): Promise<string[]> {
  const comics = await getAllComics()
  const artists = new Set(comics.map(comic => comic.artist))
  return Array.from(artists).sort()
}

/**
 * Get all writers
 * @returns string[]
 */
export async function getWriters(): Promise<string[]> {
  const comics = await getAllComics()
  const writers = new Set(comics.map(comic => comic.writer))
  return Array.from(writers).sort()
}

/**
 * Get statistics about comics collection
 */
export async function getComicsStats() {
  const comics = await getAllComics()

  return {
    total: comics.length,
    completed: comics.filter(c => c.status === 'Completed').length,
    ongoing: comics.filter(c => c.status === 'Ongoing').length,
    comingSoon: comics.filter(c => c.status === 'Coming Soon').length,
    featured: comics.filter(c => c.featured).length,
    totalReaders: comics.reduce((sum, c) => sum + (c.readers ?? 0), 0),
    totalViews: comics.reduce((sum, c) => sum + (c.views ?? 0), 0),
    averageRating: comics.length > 0
      ? comics.reduce((sum, c) => sum + (c.rating ?? 0), 0) / comics.length
      : 0,
  }
}

// ============================================================================
// RELATED COMICS
// ============================================================================

/**
 * Get comics similar to a given comic
 * @param comic - Reference comic
 * @param limit - Number of related comics to return
 * @returns Comic[]
 */
export async function getRelatedComics(comic: Comic, limit = 4): Promise<Comic[]> {
  const allComics = await getAllComics()

  // Filter out the current comic and comics that share categories, genres, or tags
  const related = allComics.filter(c => 
    c.id !== comic.id && (
      c.category === comic.category ||
      c.genre.some(g => comic.genre.includes(g)) ||
      c.tags.some(t => comic.tags.includes(t))
    )
  )

  // Sort by relevance (number of matches)
  return related
    .sort((a, b) => {
      const scoreA = 
        (a.category === comic.category ? 2 : 0) +
        a.genre.filter(g => comic.genre.includes(g)).length +
        a.tags.filter(t => comic.tags.includes(t)).length

      const scoreB = 
        (b.category === comic.category ? 2 : 0) +
        b.genre.filter(g => comic.genre.includes(g)).length +
        b.tags.filter(t => comic.tags.includes(t)).length

      return scoreB - scoreA
    })
    .slice(0, limit)
}

// ============================================================================
// SERIES HANDLING
// ============================================================================

/**
 * Get all comics in a series
 * @param series - Series name
 * @returns Comic[]
 */
export async function getSeriesComics(series: string): Promise<Comic[]> {
  const comics = await getComicsBySeries(series)
  return comics.sort((a, b) => (a.issueNumber ?? 0) - (b.issueNumber ?? 0))
}

/**
 * Get next issue in series
 * @param comic - Current comic
 * @returns Comic | null
 */
export async function getNextInSeries(comic: Comic): Promise<Comic | null> {
  if (!comic.series) return null

  const seriesComics = await getSeriesComics(comic.series)
  const currentIndex = seriesComics.findIndex(c => c.id === comic.id)

  return currentIndex < seriesComics.length - 1 ? seriesComics[currentIndex + 1] : null
}

/**
 * Get previous issue in series
 * @param comic - Current comic
 * @returns Comic | null
 */
export async function getPreviousInSeries(comic: Comic): Promise<Comic | null> {
  if (!comic.series) return null

  const seriesComics = await getSeriesComics(comic.series)
  const currentIndex = seriesComics.findIndex(c => c.id === comic.id)

  return currentIndex > 0 ? seriesComics[currentIndex - 1] : null
}
