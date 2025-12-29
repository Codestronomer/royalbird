export interface PreferenceType {
  comic: boolean
  blog: boolean
  announcements: boolean
  weeklyDigest: boolean
}

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  isVerified: boolean;
  isSubscribed?: boolean;
  preferences: PreferenceType;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSubscriberResponse {
  _id?: string;
  id: string;
  email: string;
  name?: string;
  isVerified: boolean;
  isSubscribed?: boolean;
  preferences: PreferenceType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SubscriberStats {
  total: number;
  newSignups: number;
  unsubscribes: number;
  netGrowth: number;        // The "+124" value
  growthPercentage: string; // The "12.4%" value
  periodDays: number;
}