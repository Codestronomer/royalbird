

// src/types/user.ts
export interface User{
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'deactivated' | 'pending';
  emailVerified: boolean;
  
  // Stats
  stats: {
    comicViews: number;
    blogViews: number;
    comments: number;
    likesGiven: number;
    readingTime: number;
    lastActive: Date;
  };
  
  // Preferences
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
    newsletter: boolean;
    comicUpdates: boolean;
    blogUpdates: boolean;
  };
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserRegistrationDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  agreeToTerms: boolean;
  newsletter?: boolean;
}

export interface UserLoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  preferences?: Partial<User['preferences']>;
}

export interface PasswordChangeDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EmailChangeDto {
  newEmail: string;
  password: string;
}

export interface SocialLoginDto {
  provider: 'google' | 'github' | 'twitter' | 'discord';
  token: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface BookmarkItem {
  id: string;
  title: string;
  slug: string;
  image?: string;
  description?: string;
  category?: string;
  bookmarkedAt: Date;
}

export interface LikeItem {
  id: string;
  title: string;
  slug: string;
  image?: string;
  likedAt: Date;
}

export interface ReadingHistoryItem {
  id: string;
  contentId: string;
  contentType: 'comic' | 'blog';
  title: string;
  slug: string;
  image?: string;
  progress: number;
  lastPage?: number;
  lastReadAt: Date;
}

export interface UserStats {
  totalComicsRead: number;
  totalBlogsRead: number;
  totalReadingTime: number; // in minutes
  averageReadingTime: number;
  favoriteCategory?: string;
  streakDays: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  }>;
}