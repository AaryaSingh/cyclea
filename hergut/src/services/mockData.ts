import { DailyCheckIn, UserStats, Badge, CommunityPost, Insight } from '../types';

// Mock user data
export const mockUser = {
  id: 'user-123',
  email: 'user@example.com',
  name: 'Wellness Warrior',
  createdAt: new Date('2024-01-01'),
  preferences: {
    trackingCategories: ['gut', 'cycle', 'mood', 'energy'] as const,
    notifications: true,
    privacyLevel: 'private' as const,
  },
};

// Mock daily check-ins
export const mockDailyCheckIns: DailyCheckIn[] = [
  {
    id: 'checkin-1',
    userId: 'user-123',
    date: '2024-01-15',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    gutHealth: {
      pain: 2,
      bloating: 3,
      symptoms: ['mild cramping'],
    },
    mood: 7,
    energy: 6,
    moodEmoji: '😊',
    notes: 'Feeling good today, had a light breakfast',
    tags: ['good-day'],
  },
  {
    id: 'checkin-2',
    userId: 'user-123',
    date: '2024-01-16',
    timestamp: new Date('2024-01-16T09:30:00Z'),
    gutHealth: {
      pain: 1,
      bloating: 2,
      symptoms: [],
    },
    mood: 8,
    energy: 7,
    moodEmoji: '😄',
    notes: 'Great energy today, went for a walk',
    tags: ['active'],
  },
];

// Mock user stats
export const mockUserStats: UserStats = {
  userId: 'user-123',
  xp: 1250,
  level: 5,
  streak: 12,
  badges: [
    {
      id: 'badge-1',
      name: 'First Steps',
      description: 'Completed your first check-in',
      icon: 'flag',
      earnedAt: new Date('2024-01-15'),
      category: 'tracking',
    },
    {
      id: 'badge-2',
      name: 'Week Warrior',
      description: '7-day check-in streak',
      icon: 'local-fire-department',
      earnedAt: new Date('2024-01-22'),
      category: 'streak',
    },
  ],
  lastCheckIn: new Date('2024-01-16T09:30:00Z'),
};

// Mock community posts
export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    userId: 'user-456',
    username: 'WellnessWarrior',
    content: 'Just discovered that my bloating is always worse 2 days before my period. Anyone else experience this? #GutCrew #CycleSync',
    hashtags: ['#GutCrew', '#CycleSync'],
    likes: 24,
    comments: 8,
    createdAt: new Date('2024-01-16T14:00:00Z'),
    isAnonymous: false,
  },
  {
    id: 'post-2',
    userId: 'user-789',
    username: 'Anonymous',
    content: 'Feeling grateful for this app helping me understand my body better. The insights are so helpful! 💕',
    hashtags: ['#WellnessJourney'],
    likes: 18,
    comments: 5,
    createdAt: new Date('2024-01-16T12:00:00Z'),
    isAnonymous: true,
  },
];

// Mock insights
export const mockInsights: Insight[] = [
  {
    id: 'insight-1',
    userId: 'user-123',
    type: 'cycle',
    title: 'Cycle Pattern Analysis',
    description: 'Your cycle has been consistent at 28-30 days over the last 3 months.',
    data: {
      averageCycleLength: 29,
      cycleVariance: 2,
      lastThreeCycles: [28, 29, 30],
    },
    generatedAt: new Date('2024-01-16T08:00:00Z'),
  },
  {
    id: 'insight-2',
    userId: 'user-123',
    type: 'gut',
    title: 'Gut Health Trends',
    description: 'Bloating tends to increase 2-3 days before your period.',
    data: {
      correlationStrength: 0.75,
      averageBloatingByCycleDay: {
        25: 6,
        26: 7,
        27: 5,
        28: 3,
      },
    },
    generatedAt: new Date('2024-01-16T08:00:00Z'),
  },
];

// Mock badges
export const mockBadges: Badge[] = [
  {
    id: 'badge-1',
    name: 'First Steps',
    description: 'Completed your first check-in',
    icon: 'flag',
    earnedAt: new Date('2024-01-15'),
    category: 'tracking',
  },
  {
    id: 'badge-2',
    name: 'Week Warrior',
    description: '7-day check-in streak',
    icon: 'local-fire-department',
    earnedAt: new Date('2024-01-22'),
    category: 'streak',
  },
  {
    id: 'badge-3',
    name: 'Gut Guardian',
    description: 'Tracked gut health for 30 days',
    icon: 'restaurant',
    earnedAt: new Date('2024-02-14'),
    category: 'tracking',
  },
  {
    id: 'badge-4',
    name: 'Mood Master',
    description: 'Tracked mood for 30 days',
    icon: 'mood',
    category: 'tracking',
    earnedAt: new Date('2024-02-14'),
  },
  {
    id: 'badge-5',
    name: 'Cycle Sage',
    description: 'Tracked cycle for 3 months',
    icon: 'favorite',
    category: 'tracking',
    earnedAt: new Date('2024-03-15'),
  },
  {
    id: 'badge-6',
    name: 'Data Detective',
    description: 'Viewed insights 10 times',
    icon: 'insights',
    category: 'milestone',
    earnedAt: new Date('2024-01-20'),
  },
];

// Helper functions for mock data
export const getMockUserStats = (): UserStats => mockUserStats;

export const getMockDailyCheckIns = (): DailyCheckIn[] => mockDailyCheckIns;

export const getMockCommunityPosts = (): CommunityPost[] => mockCommunityPosts;

export const getMockInsights = (): Insight[] => mockInsights;

export const getMockBadges = (): Badge[] => mockBadges;

export const getMockUser = () => mockUser;
