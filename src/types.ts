import type { CheckInData } from './components/DailyCheckIn';
import type { PeriodData } from './components/PeriodTracker';

export interface FoodEntry {
  name: string;
  time: string;
  category: string;
  cuisine?: string;
  amount?: string;
}

export interface UserData {
  categories: string[];
  streak: number;
  xp: number;
  badges: string[];
  checkIns: CheckInData[];
  lastCheckIn: string | null;
  foodEntries: FoodEntry[];
  periodData: PeriodData | null;
  currentLeague: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | null;
  leagueXP: number;
  hasLeftLeague: boolean;
  ageRange?: string;
  cycleStatus?: string;
  birthControl?: string;
  diagnosedConditions?: string[];
  medications?: string;
  giPriorities?: string[];
  mentalHealthFocus?: string[];
  goals?: string[];
  educationPreference?: 'quick' | 'deep';
  accessibilityPrefs?: {
    textSize?: 'normal' | 'large' | 'xlarge';
    reduceMotion?: boolean;
    dyslexiaFont?: boolean;
  };
  consentAnalytics?: boolean;
  consentResearch?: boolean;
  completedLessons?: string[];
  unlockedLessons?: string[];
  isPregnant?: boolean;
  pregnancyMode?: boolean;
  adaptiveMode?: boolean;
}

export const INITIAL_USER_DATA: UserData = {
  categories: [],
  streak: 0,
  xp: 0,
  badges: [],
  checkIns: [],
  lastCheckIn: null,
  foodEntries: [],
  periodData: null,
  currentLeague: 'bronze',
  leagueXP: 0,
  hasLeftLeague: false,
  accessibilityPrefs: {
    textSize: 'normal',
    reduceMotion: false,
    dyslexiaFont: false,
  },
  consentAnalytics: true,
  consentResearch: false,
  completedLessons: [],
  unlockedLessons: ['intro-hormones', 'gut-brain-axis'],
};
