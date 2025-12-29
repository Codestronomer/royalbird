export interface ComicQuality {
  low: string[] // Mobile optimized (500px width)
  medium: string[] // Tablet optimized (900px width)
  high: string[] // Desktop optimized (1400px width)
}

export interface ComicFormats {
  pdf?: string // Full PDF for desktop reading
  images?: string[] // Image array for any device
  epub?: string // E-reader format
  cbz?: string // Comic book archive format
}

export interface Comic {
  // Core metadata
  id?: string;
  slug: string
  title: string
  description: string
  coverImage: string
  pages?: number
  readTime?: string
  availability: 'Completed' | 'Ongoing' | 'Coming Soon'
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  tags: string[]
  featured: boolean
  readers?: number
  views?: number
  likes?: number
  artist?: string
  writer?: string
  colorist?: string
  letterer?: string

  // Optional metadata
  rating?: number
  publisher?: string
  language?: string
  issueNumber?: number
  totalIssues?: number
  genres: ApiGenre[]
  ageRating?: string
  totalPages?: number

  preferredFormat?: 'pdf' | 'images' | 'auto' // 'auto' = choose based on device
  quality?: ComicQuality // Optional quality tiers

  // Preview/reading
  previewPages?: string[]

  format?: 'print' | 'digital' | 'both'
  contentType?: 'images' | 'pdf' | 'both'
  pdfUrl?: string
  images?: string[]

  updatedAt?: string;
  publishedAt?: string
  scheduledAt?: string;
}


export interface ApiComicResponse {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  shortDescription?: string;
  
  // Media
  coverImage: string;
  thumbnail?: string;
  bannerImage?: string;
  previewImages?: string[];
  pdfUrl?: string;
  images?: string[];
  
  // Content Configuration
  format: 'digital' | 'print' | 'both';
  contentType: 'images' | 'pdf' | 'both';
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  availability: 'Completed' | 'Ongoing' | 'Coming Soon'
  ageRating: 'ALL' | '13+' | '16+' | '18+';
  language: string;
  issueNumber: number;
  
  // Pricing
  isFree?: boolean;
  price?: number;
  currency?: string;
  formattedPrice?: string; // From virtuals
  
  // Statistics
  totalPages: number;
  estimatedReadTime?: string;
  views: number;
  readers: number;
  averageRating: number;
  ratingCount: number;
  likes: number;
  featured: boolean;
  
  // Metadata
  writer?: string;
  artist?: string;
  colorist?: string;
  letterer?: string;
  
  // Relations (Note: These might be IDs or populated objects)
  genres: ApiGenre[];
  tags: string[];
  chapters: string[];
  
  // Timestamps
  publishedAt?: string;
  scheduledAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiGenre {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  colorLight?: string; // From virtuals
  comicCount: number;
  featured: boolean;
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTag {
  _id: string;
  name: string;
  slug: string;
  description: string;
  comicCount: number;
  featured: boolean;
  type: 'genre' | 'theme' | 'character' | 'setting' | 'style' | 'audience' | 'format';
  createdAt: string;
  updatedAt: string;
}

export type CreateComicType = Omit<Comic, 'genres'> & {
  genres: string[];
}