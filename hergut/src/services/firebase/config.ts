// Firebase configuration
// Note: Replace these with your actual Firebase project credentials
export const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};

// Database paths
export const DB_PATHS = {
  USERS: 'users',
  DAILY_CHECK_INS: 'dailyCheckIns',
  USER_STATS: 'userStats',
  BADGES: 'badges',
  COMMUNITY_POSTS: 'communityPosts',
  COMMUNITY_COMMENTS: 'communityComments',
  INSIGHTS: 'insights',
} as const;

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  DAILY_CHECK_INS: 'dailyCheckIns',
  USER_STATS: 'userStats',
  BADGES: 'badges',
  COMMUNITY_POSTS: 'communityPosts',
  COMMUNITY_COMMENTS: 'communityComments',
  INSIGHTS: 'insights',
} as const;
