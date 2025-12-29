export interface BlogPost {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  content: React.ReactNode;
  rawContent: string;
  readingTime?: number;
  wordCount?: number;
  published?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  }

  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  metaTitle?: string
  metaDescription?: string;
  likes: number;
  views: number;

  // Dates
  publishedAt?: string;
  scheduledAt?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  readingTime?: number;
  wordCount?: number;
}

export interface BlogFormData {
  slug: string;
  title: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  featured: boolean;
  content: string;
  // rawContent: string;
  readingTime?: number;
  wordCount?: number;
  published?: boolean;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  }

  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  metaTitle?: string
  metaDescription?: string;

  // Dates
  publishedAt?: string;
  scheduledAt?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface ApiBlogPostResponse {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  
  author: string;
  category: string;
  featuredImage?: string;
  readingTime?: number;
  
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  featured: boolean;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];

  likes: number;
  views: number;
  
  // Dates
  publishedAt?: Date;
  scheduledAt?: Date;
  deletedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogCategory {
  name: string;
  count: number;
  latest: string;
}

export interface LikeResponse {
  id: string;
  likes: number;
  liked?: boolean;
}

export interface LikeStatusResponse extends LikeResponse {
  hasLiked: boolean;
}

export interface ViewResponse {
  id: string;
  views: number;
}

export interface unlikeResponse extends LikeResponse {
  unliked: boolean;
}