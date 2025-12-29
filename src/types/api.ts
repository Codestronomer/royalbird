export interface ApiResponse<T> {
  success: boolean,
  count: number;
  total: number;
  pagination: {
    page: number;
    limit: number;
    pages: number;
    total: number;
  };
  data: T;
  message?: string;
}

export interface ApiStatsResponse {
  // Main totals
  totalComics: number;
  totalBlogs: number;
  totalSubscribers: number;
  totalViews: number;
  totalLikes: number;

  // Comparative Trends (Percentage change vs. previous 30 days)
  comicTrend: number;
  blogTrend: number;
  subscriberTrend: number;
  viewsTrend: number;
  likesTrend: number;

  // Legacy/Compatibility fields
  growthRate: number;   // Maps to subscriberTrend
  growthTrend: number;  // Maps to net current period growth (new signups)
  
  // Optional: metadata for the period
  periodDays?: number;
}