export interface DashboardOverviewData {
  overview: {
    totalComics: number;
    totalBlogs: number;
    totalSubscribers: number;
    totalUsers: number;
    totalViews: number;
    totalLikes: number;
    activeUsers: number;
  };
  trends: {
    comicGrowth: number;
    blogGrowth: number;
    subscriberGrowth: number;
    viewGrowth: number;
    engagementRate: number;
  };
  charts: {
    dailyViews: Array<{ date: string; value: number }>;
    userGrowth: Array<{ date: string; value: number }>;
    contentPublished: Array<{ date: string; comics: number; blogs: number }>;
  };
  popular: {
    topComics: Array<{
      _id: string;
      title: string;
      views: number;
      likes: number;
      slug: string;
    }>;
    topBlogs: Array<{
      _id: string;
      title: string;
      views: number;
      likes: number;
      slug: string;
    }>;
  };
  insights: Array<{
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    action: string;
  }>;
}

export interface GrowthTrendData {
  dailyViews: Array<{ date: string; value: number }>;
  userGrowth: Array<{ date: string; value: number }>;
  contentPublished: Array<{ date: string; comics: number; blogs: number }>;
}

export interface ContentPerformance {
  id: string;
  title: string;
  type: 'comic' | 'blog';
  views: number;
  likes: number;
  comments: number;
  engagementRate: number;
  publishedDate: string;
  author: string;
}

export interface EngagementMetricsResponse {
  metrics: {
    totalEngagement: number;
    totalViews: number;
    totalLikes: number;
    avgEngagementPerUser: number;
    peakEngagementTime: PeakHourData;
    mostEngagedContent: MostEngagedContent;
  };
  trends: EngagementTrend[];
}

export interface PeakHourData {
  hour: number;     // 0-23
  label: string;    // e.g., "2:00 PM"
}

export interface ContentEngagementItem {
  _id: string;      // Converted from ObjectId
  title: string;
  views: number;
  likes: number;
  score: number;
}

export interface MostEngagedContent {
  topComics: ContentEngagementItem[];
  topBlogs: ContentEngagementItem[];
}

export interface EngagementTrend {
  date: string;     // Format: "YYYY-MM-DD"
  likes: number;
  views: number;
  shares: number;   // Calculated derived metric
  saves: number;    // Calculated derived metric
}

export interface TrendData {
  value: number;
  trend: number; // Percentage change (e.g., 12.5)
}

// Data point for daily growth charts
export interface ChartDataPoint {
  date: string;
  value: number;
}

// Response for /admin/analytics/dashboard
export interface ApiDashboardOverviewResponse {
  overview: {
    totalComics: number;
    totalBlogs: number;
    totalSubscribers: number;
    totalUsers: number;
    totalViews: number;
    totalLikes: number;
    activeUsers: number;
  };
  trends: {
    comicGrowth: number;
    blogGrowth: number;
    subscriberGrowth: number;
    viewGrowth: number;
    engagementRate: number;
  };
  charts: {
    dailyViews: ChartDataPoint[];
    userGrowth: ChartDataPoint[];
    contentPublished: {
      date: string;
      comics: number;
      blogs: number;
    }[];
  };
  popular: {
    topComics: ContentSummary[];
    topBlogs: ContentSummary[];
  };
  insights: DashboardInsight[];
}

export interface ContentSummary {
  _id: string;
  title: string;
  slug: string;
  views: number;
  likes: number;
  category: string;
  featuredImage?: string;
}

export interface DashboardInsight {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  action: string;
}

export interface ApiRealtimeResponse {
  metrics: {
    activeUsers: number;
    currentViews: number;
    viewsPerMinute: number;
    concurrentSessions: number;
    responseTime: string; // e.g., "142ms"
    errorRate: string;    // e.g., "0.02%"
  };
  activity: {
    liveUsers: number;
    recentContent: ContentSummary[];
    trendingNow: {
      comics: Partial<ContentSummary>[];
      blogs: Partial<ContentSummary>[];
    };
  };
  traffic: {
    sources: Record<string, number>;
    geographic: { country: string; count: number }[];
    devices: Record<string, number>;
  };
  timestamp: string;
}

export type TimeRange = '7d' | '30d' | '90d' | '1y';

// Type definitions matching the updated backend
export interface DashboardOverviewData {
  overview: {
    totalComics: number;
    totalBlogs: number;
    totalSubscribers: number;
    totalUsers: number;
    totalViews: number;
    totalLikes: number;
    activeUsers: number;
  };
  trends: {
    comicGrowth: number;
    blogGrowth: number;
    subscriberGrowth: number;
    viewGrowth: number;
    engagementRate: number;
  };
  charts: {
    dailyViews: Array<{ date: string; value: number }>;
    userGrowth: Array<{ date: string; value: number }>;
    contentPublished: Array<{ date: string; comics: number; blogs: number }>;
  };
  popular: {
    topComics: Array<{
      _id: string;
      title: string;
      views: number;
      likes: number;
      slug: string;
    }>;
    topBlogs: Array<{
      _id: string;
      title: string;
      views: number;
      likes: number;
      slug: string;
    }>;
  };
  insights: Array<{
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    message: string;
    action: string;
  }>;
}

export interface ContentPerformance {
  id: string;
  title: string;
  type: 'comic' | 'blog';
  views: number;
  likes: number;
  engagementRate: number;
  publishedDate: string;
  author: string;
}

export interface AudienceInsights {
  demographics: {
    ageGroups: Array<{ range: string; percentage: number }>;
    location: Array<{ country: string; users: number }>;
  };
  behavior: {
    avgSessionDuration: number;
    pagesPerSession: number;
    bounceRate: number;
    peakHours: Array<{ hour: number; activity: number }>;
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  retention: {
    retentionRate: string;
    churnRate: string;
    activeUsers: number;
    returningUsers: number;
  };
}