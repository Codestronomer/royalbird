import type { ApiResponse, ApiStatsResponse } from "~/types/api";
import type { ApiBlogPostResponse, BlogCategory, BlogPost, LikeResponse, LikeStatusResponse, unlikeResponse, ViewResponse } from "~/types/blog";
import type { ApiSubscriberResponse, PreferenceType, SubscriberStats } from "~/types/subscriber";
import { v4 as uuidv4 } from 'uuid';
import type { ApiComicResponse, ApiGenre, ApiTag, CreateComicType } from "~/types/comics";
import type { AuthResponse, EmailChangeDto, PasswordChangeDto, User, UserLoginDto, UserRegistrationDto, UserUpdateDto } from "~/types/user";
import type { ApiDashboardOverviewResponse, ApiRealtimeResponse, AudienceInsights, ContentPerformance, EngagementMetricsResponse } from "~/types/analytics";

// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ApiError {
  message: string;
  details?: unknown;
  statusCode?: number;
}

class ApiClient {
  private token: string | null = null;
  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  private getUserId(): string {
    if (typeof window === 'undefined') return '';
    
    // Get or create user ID
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = uuidv4();
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private async getUserFingerprint(): Promise<string> {
    if (typeof window === 'undefined') return '';
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
    };
    
    return btoa(JSON.stringify(fingerprint)).substring(0, 32);
  }

  private async getUserIdentifier(): Promise<string> {
    const userId = this.getUserId();
    const sessionId = this.getSessionId();
    const fingerprint = await this.getUserFingerprint();
    
    // Combine multiple identifiers for better uniqueness
    return `${userId}_${sessionId}_${fingerprint}`;
  }

  constructor() {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Add auth token if exists
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.headers = {
          ...this.headers,
          'Authorization': `Bearer ${token}`,
        };
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.headers,
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
  
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
      // credentials: 'include', // For cookies if using HTTP-only tokens
    };



    try {
      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized (token expired)
      if (response.status === 401) {
        try {
          // Retry original request with new token
          return this.request(endpoint, options);
        } catch {
          this.clearAuthTokens();
          this.clearCurrentUser();
          // Redirect to login or show auth modal
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('auth-expired'));
          }
          throw new Error('Session expired. Please login again.');
        }
      }

      const data = await response.json() as ApiResponse<T>;

      if (!response.ok) {
        const error: ApiError = {
          message: data.message ?? 'Something went wrong',
          statusCode: response.status,
        };
        
        // Handle specific error cases
        if (response.status === 403) {
          error.message = 'You do not have permission to perform this action';
        } else if (response.status === 404) {
          error.message = 'Resource not found';
        } else if (response.status >= 500) {
          error.message = 'Server error. Please try again later.';
        }
        
        throw error as Error;
      }

      return data;
    } catch (error: unknown) {
      // Handle network errors
      if (error instanceof TypeError && error?.message === 'Failed to fetch') {
        throw {
          message: 'Unable to connect to server. Please check your connection.',
          statusCode: 0,
          name: 'Network Error'
        } as Error;
      }
      throw error;
    }
  }

  getComics(params?: Record<string, string>): Promise<ApiResponse<ApiComicResponse[]>> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<ApiComicResponse[]>(`/comics${queryString}`);
  }

  // Returns a single detailed comic
  getComic(slug: string): Promise<ApiResponse<ApiComicResponse>> {
    return this.request<ApiComicResponse>(`/comics/${slug}`);
  }

  // Returns featured comics list
  getFeaturedComics(): Promise<ApiResponse<ApiComicResponse[]>> {
    return this.request<ApiComicResponse[]>('/comics/featured');
  }

  // Returns taxonomy data
  getComicGenres(): Promise<ApiResponse<ApiGenre[]>> {
    return this.request<ApiGenre[]>('/genres');
  }

  getComicTags(): Promise<ApiResponse<ApiTag[]>> {
    return this.request<ApiTag[]>('/tags');
  }

  // Blog API
  async getBlogPosts(params?: Record<string, string>): Promise<ApiResponse<ApiBlogPostResponse[]>> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    const response: ApiResponse<ApiBlogPostResponse[]> = await this.request(`/blogs${queryString}`);

    return response;
  }

  async getBlogPost(slug: string) {
    const response: ApiResponse<ApiBlogPostResponse> = await this.request(`/blogs/${slug}`);
    return response;
  }

  async getBlogCategories(): Promise<ApiResponse<BlogCategory[]>> {
    const response: ApiResponse<BlogCategory[]> = await this.request('/blogs/categories');
    return response;
  }

  async getFeaturedBlogPosts(limit = 5): Promise<ApiResponse<ApiBlogPostResponse[]>> {
    const response: ApiResponse<ApiBlogPostResponse[]> = await this.request(`/blogs/featured?limit=${limit}`);
    return response;
  }

  async searchBlogPosts(query: string, limit = 10) {
    const response: ApiResponse<ApiBlogPostResponse[]> = await this.request(`/blogs/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response;
  }

  async incrementBlogViews(id: string) {
    const identifier = await this.getUserIdentifier();
    
    const response: ApiResponse<ViewResponse> = await this.request(`/blogs/${id}/view`, {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
    return response;
  }

  async likeBlogPost(id: string, identifier?: string) {
    const userIdentifier = identifier ?? await this.getUserIdentifier();
    
    const response: ApiResponse<LikeResponse> = await this.request(`/blogs/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ 
        userId: userIdentifier,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      })
    });

    return response;
  }

  async unlikeBlogPost(id: string, identifier?: string) {
    const userIdentifier = identifier ?? await this.getUserIdentifier();
    
    const response: ApiResponse<unlikeResponse> = await this.request(`/blogs/${id}/unlike`, {
      method: 'POST',
      body: JSON.stringify({ 
        userId: userIdentifier,
        timestamp: new Date().toISOString()
      })
    });
    return response;
  }

  async checkLikeStatus(id: string, identifier?: string) {
    const userIdentifier = identifier ?? await this.getUserIdentifier();
    
    const response: ApiResponse<LikeStatusResponse> = await this.request(`/blogs/${id}/like-status?userId=${encodeURIComponent(userIdentifier)}`);
    return response;
  }


  getPopularPosts(limit = 10, period: 'day' | 'week' | 'month' | 'all' = 'week') {
    return this.request(`/blogs/popular?limit=${limit}&period=${period}`);
  }

  getTrendingPosts(limit= 10, period: 'day' | 'week' | 'month' | 'all' = 'week') {
    return this.request(`/blogs/trending?limit=${limit}&period=${period}`);
  }

  async getUserBookmarkedPosts() {
    // This would be server-side if you want to sync bookmarks
    // For now, just return localStorage data
    if (typeof window === 'undefined') return { success: true, data: [] };
    
    const bookmarkedSlugs = JSON.parse(localStorage.getItem('bookmarked_posts') ?? '[]') as string[];
    return { success: true, data: bookmarkedSlugs };
  }

  async getUserLikedPosts(identifier?: string) {
    const userIdentifier = identifier ?? await this.getUserIdentifier();
    
    return this.request(`/blogs/user/${userIdentifier}/liked-posts`);
  }

  // Subscribers API
  subscribe(email: string, name?: string, preferences?: PreferenceType) {
    return this.request('/subscribers', {
      method: 'POST',
      body: JSON.stringify({ 
        email, 
        name, 
        preferences: preferences ?? {
          comics: true,
          blog: true,
          announcements: true,
          weeklyDigest: true,
        }
      }),
    });
  }

  unsubscribe(token: string) {
    return this.request(`/subscribers/unsubscribe/${token}`);
  }

  verifyEmail(token: string) {
    return this.request(`/subscribers/verify/${token}`);
  }

  createBlogPost(post: {
    title: string;
    content: string;
    author: string;
    category: string;
    excerpt?: string;
    featuredImage?: string;
    status?: 'draft' | 'published' | 'scheduled' | 'archived';
    featured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
  }) {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify(post)
    })
  }

  async adminLogin(email: string, password: string): Promise<AuthResponse> {
    const response: AuthResponse = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
      this.setCurrentUser(response.data.user);
    }

    return response;
  }

  async createComic(comicData: Partial<CreateComicType>) {
    return this.request('/comics', {
      method: 'POST',
      body: JSON.stringify(comicData)
    });
  }

  async updateComic(id: string, comicData: Partial<CreateComicType>) {
    return this.request(`/comics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(comicData)
    });
  }

  async deleteComic(id: string) {
    return this.request(`/comics/${id}`, {
      method: 'DELETE'
    });
  }

  async incrementComicViews(id: string) {
    const identifier = await this.getUserIdentifier();
    
    const response: ApiResponse<ViewResponse> = await this.request(`/comics/${id}/view`, {
      method: 'POST',
      body: JSON.stringify({ identifier })
    });
    return response;
  }

  async likeComic(id: string, identifier?: string) {
    const userIdentifier = identifier ?? await this.getUserIdentifier();
    
    const response: ApiResponse<LikeResponse> = await this.request(`/comics/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ 
        userId: userIdentifier,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      })
    });

    return response;
  }

  async unlikeComic(id: string, identifier?: string) {
    const userIdentifier = identifier ?? await this.getUserIdentifier();
    
    const response: ApiResponse<unlikeResponse> = await this.request(`/comics/${id}/unlike`, {
      method: 'POST',
      body: JSON.stringify({ 
        userId: userIdentifier,
        timestamp: new Date().toISOString()
      })
    });
    return response;
  }

  async checkComicLikeStatus(id: string, identifier?: string) {
    const userIdentifier = identifier ?? await this.getUserIdentifier();
    
    const response: ApiResponse<LikeStatusResponse> = await this.request(`/comics/${id}/like-status?userId=${encodeURIComponent(userIdentifier)}`);
    return response;
  }

  async updateBlogPost(id: string, blogData: Partial<BlogPost>) {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    });
  }

  async deleteBlogPost(id: string) {
    return this.request(`/blogs/${id}`, {
      method: 'DELETE'
    });
  }

  async getSubscriberDetails(id: string): Promise<ApiResponse<ApiSubscriberResponse>> {
    return this.request(`/subscribers/${id}`);
  }

  async getSubscribers(params?: Record<string, string>): Promise<ApiResponse<ApiSubscriberResponse[]>> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/subscribers${queryString}`);
  }

  async exportSubscribers() {
    return this.request('/admin/subscribers/export');
  }

  async getSubscriberStats(days = 30): Promise<ApiResponse<SubscriberStats>> {
    return this.request(`/subscribers/stats?days=${days}`);
  }

  /**
   * Delete subscriber
   */
  async deleteSubscriber(id: string) {
    return this.request(`/admin/subscribers/${id}`, {
      method: 'DELETE'
    });
  }
  // ========== AUTHENTICATION METHODS ==========

  /**
   * Register a new user
   */
  async register(userData: UserRegistrationDto): Promise<AuthResponse> {
    const response: AuthResponse = await this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
      this.setCurrentUser(response.data.user);
    }

    return response;
  }

  /**
   * Login user
   */
  async login(credentials: UserLoginDto): Promise<AuthResponse> {
    const response: AuthResponse = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
      this.setCurrentUser(response.data.user);
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      await this.request('/users/logout', { method: 'POST' });
    } finally {
      this.clearAuthTokens();
      this.clearCurrentUser();
    }
  }

  /**
   * Verify email with token
   */
  async verifyUserEmail(token: string) {
    return this.request(`/users/verify-email/${token}`, {
      method: 'POST'
    });
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail() {
    return this.request('/users/resend-verification', {
      method: 'POST'
    });
  }

  /**
   * Forgot password - request reset link
   */
  async forgotPassword(email: string) {
    return this.request('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string, confirmPassword: string) {
    return this.request(`/users/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password, confirmPassword })
    });
  }

  // ========== USER PROFILE METHODS ==========

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/users/profile');
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: UserUpdateDto): Promise<AuthResponse> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  /**
   * Change password
   */
  async changePassword(passwordData: PasswordChangeDto) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
  }

  /**
   * Change email
   */
  async changeEmail(emailData: EmailChangeDto) {
    return this.request('/users/change-email', {
      method: 'POST',
      body: JSON.stringify(emailData)
    });
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.request('/users/avatar', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    });
  }

  /**
   * Delete user account
   */
  async deleteAccount(password: string) {
    const response = await this.request('/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ password })
    });

    if (response.success) {
      this.clearAuthTokens();
      this.clearCurrentUser();
    }

    return response;
  }

  /**
   * Deactivate account (soft delete)
   */
  async deactivateAccount(reason?: string) {
    return this.request('/users/deactivate', {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  /**
   * Reactivate account
   */
  async reactivateAccount() {
    return this.request('/users/reactivate', {
      method: 'POST'
    });
  }

  // ========== USER CONTENT METHODS ==========

  /**
   * Get user's bookmarked comics
   */
  async getBookmarkedComics(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/bookmarks/comics${queryString}`);
  }

  /**
   * Get user's bookmarked blogs
   */
  async getBookmarkedBlogs(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/bookmarks/blogs${queryString}`);
  }

  /**
   * Get user's liked comics
   */
  async getLikedComics(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/likes/comics${queryString}`);
  }

  /**
   * Get user's liked blogs
   */
  async getLikedBlogs(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/likes/blogs${queryString}`);
  }

  /**
   * Get user's reading history
   */
  async getReadingHistory(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/history${queryString}`);
  }

  /**
   * Clear reading history
   */
  async clearReadingHistory() {
    return this.request('/users/history/clear', {
      method: 'DELETE'
    });
  }

  /**
   * Toggle bookmark for content
   */
  async toggleBookmark(contentId: string, contentType: 'comic' | 'blog') {
    return this.request('/users/bookmarks/toggle', {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType })
    });
  }

  /**
   * Toggle like for content
   */
  async toggleLike(contentId: string, contentType: 'comic' | 'blog') {
    return this.request('/users/likes/toggle', {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType })
    });
  }

  /**
   * Update reading progress
   */
  async updateReadingProgress(
    contentId: string,
    contentType: 'comic' | 'blog',
    progress: number,
    lastPage?: number
  ) {
    return this.request('/users/reading-progress', {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType, progress, lastPage })
    });
  }
// ========== USER STATS METHODS ==========

  /**
   * Get user stats
   */
  async getUserStats() {
    return this.request('/users/stats');
  }

  /**
   * Get reading statistics
   */
  async getReadingStats(period: 'week' | 'month' | 'year' = 'month') {
    return this.request(`/users/stats/reading?period=${period}`);
  }

  /**
   * Get activity timeline
   */
  async getActivityTimeline(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/activity${queryString}`);
  }

  // ========== NOTIFICATION METHODS ==========

  /**
   * Get user notifications
   */
  async getNotifications(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/users/notifications${queryString}`);
  }

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(notificationId: string) {
    return this.request(`/users/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
  }

  /**
   * Mark all notifications as read
   */
  async markAllNotificationsAsRead() {
    return this.request('/users/notifications/read-all', {
      method: 'POST'
    });
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(preferences: PreferenceType) {
    return this.request('/users/notification-preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // ========== ADMIN USER METHODS ==========

  /**
   * Get all users (admin only)
   */
  async getAllUsers(params?: Record<string, string>) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/admin/users${queryString}`);
  }

  /**
   * Get user by ID (admin only)
   */
  async getUserById(userId: string) {
    return this.request(`/admin/users/${userId}`);
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(userId: string, role: string) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  }

  /**
   * Update user status (admin only)
   */
  async updateUserStatus(userId: string, status: string) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId: string) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Export users data (admin only)
   */
  async exportUsers(format: 'csv' | 'json' = 'csv') {
    return this.request(`/admin/users/export?format=${format}`);
  }

  async getAdminStats(): Promise<ApiResponse<ApiStatsResponse>> {
    return this.request(`/admin/analytics/dashboard`);
  }

  /**
   * Fetches the primary dashboard overview (Totals and Trends)
   */
  async getDashboardOverview(days = 30): Promise<ApiResponse<ApiDashboardOverviewResponse>> {
    return this.request(`/admin/analytics/?days=${days}`);
  }

  /**
   * Fetches detailed engagement metrics and daily trends
   */
  async getEngagementMetrics(startDate?: string, endDate?: string): Promise<ApiResponse<EngagementMetricsResponse>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return this.request(`/admin/analytics/engagement?${params.toString()}`);
  }

  /**
   * Fetches content ranking based on engagement performance
   */
  async getContentPerformance(type?: 'comic' | 'blog', limit = 10): Promise<ApiResponse<ContentPerformance[]>> {
    const path = `/admin/analytics/content-performance?limit=${limit}${type ? `&type=${type}` : ''}`;
    return this.request(path);
  }

  /**
   * Fetches audience demographics and behavioral data
   */
  async getAudienceInsights(): Promise<ApiResponse<AudienceInsights>> {
    return this.request(`/admin/analytics/audience`);
  }

  /**
   * Fetches real-time activity and system health
   */
  async getRealtimeStats(): Promise<ApiResponse<ApiRealtimeResponse>> {
    return this.request(`/admin/analytics/realtime`);
  }

  /**
   * Fetches daily growth trends for charts
   */
  async getGrowthTrends(days = 30): Promise<ApiResponse<ApiDashboardOverviewResponse['charts']>> {
    return this.request(`/admin/analytics/growth-trends?days=${days}`);
  }

  async createGenre(payload: Partial<ApiGenre>): Promise<ApiResponse<ApiGenre>> {
    return this.request(`/genres`, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  // ========== HELPER METHODS ==========

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.token;
  }

  /**
   * Get current user ID
   */
  getCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_id');
  }

  /**
   * Get current user role
   */
  getCurrentUserRole(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('user_role');
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  // ========== PRIVATE METHODS ==========

  private setAuthToken(token: string) {
    this.token = token;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearAuthTokens() {
    this.token = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private setCurrentUser(user: User) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  private clearCurrentUser() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_data');
    }
  }

  // Upload API
  uploadFile(file: File, type: 'image' | 'pdf' | 'comic') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  // Analytics
  trackPageView(data: {
    pageType: string;
    pageId?: string;
    sessionId: string;
    referrer?: string;
  }) {
    return this.request('/analytics/pageview', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const api = new ApiClient();