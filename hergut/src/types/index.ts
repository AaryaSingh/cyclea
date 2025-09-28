// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  trackingCategories: TrackingCategory[];
  notifications: boolean;
  privacyLevel: 'private' | 'friends' | 'public';
}

// Tracking Categories
export type TrackingCategory = 'gut' | 'cycle' | 'mood' | 'energy' | 'misc';

// Daily Check-in Types
export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  timestamp: Date;
  
  // Gut Health
  gutHealth?: {
    pain: number; // 0-10 scale
    bloating: number; // 0-10 scale
    symptoms: string[];
  };
  
  // Cycle Tracking
  cycleData?: {
    flow: 'none' | 'light' | 'medium' | 'heavy';
    symptoms: string[];
    mood: string;
  };
  
  // Mood and Energy
  mood?: number; // 0-10 scale
  energy?: number; // 0-10 scale
  moodEmoji?: string;
  
  // General
  notes?: string;
  tags: string[];
}

// Gamification Types
export interface UserStats {
  userId: string;
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
  lastCheckIn: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'streak' | 'tracking' | 'community' | 'milestone';
}

// Insights Types
export interface Insight {
  id: string;
  userId: string;
  type: 'cycle' | 'gut' | 'mood' | 'energy' | 'correlation';
  title: string;
  description: string;
  data: any; // Chart data or analysis results
  generatedAt: Date;
}

// Community Types
export interface CommunityPost {
  id: string;
  userId: string;
  username: string;
  content: string;
  hashtags: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  isAnonymous: boolean;
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: Date;
  isAnonymous: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Daily: undefined;
  Gamification: undefined;
  Insights: undefined;
  Community: undefined;
  Privacy: undefined;
};

// Firebase Types
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
