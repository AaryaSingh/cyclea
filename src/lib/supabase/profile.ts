import { supabase, isSupabaseConfigured } from '../supabase';
import type { UserData } from '../../types';
import type { CheckInData } from '../../components/DailyCheckIn';
import type { FoodEntry } from '../../components/FoodTracker';
import type { PeriodData } from '../../components/PeriodTracker';

const STORAGE_KEY = 'healthAppUserData';

// ---------- localStorage fallback (when Supabase not configured) ----------
export function loadFromLocalStorage(): UserData | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as UserData;
  } catch {
    return null;
  }
}

export function saveToLocalStorage(data: UserData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ---------- Supabase profile sync ----------
export async function fetchProfile(userId: string): Promise<UserData | null> {
  if (!supabase) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) return null;

  const { data: checkIns } = await supabase
    .from('check_ins')
    .select('data, created_at')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });

  const { data: foodEntries } = await supabase
    .from('food_entries')
    .select('*')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });

  const { data: periodRow } = await supabase
    .from('period_data')
    .select('*')
    .eq('profile_id', userId)
    .maybeSingle();

  return profileToUserData(profile, checkIns ?? [], foodEntries ?? [], periodRow);
}

function profileToUserData(
  profile: Record<string, unknown>,
  checkInRows: { data: unknown; created_at: string }[],
  foodRows: Record<string, unknown>[],
  periodRow: Record<string, unknown> | null
): UserData {
  const checkIns: CheckInData[] = checkInRows.map((r) => {
    const d = r.data as Record<string, unknown>;
    return {
      ...d,
      timestamp: d?.timestamp ?? r.created_at,
    } as CheckInData;
  });

  const foodEntries: FoodEntry[] = foodRows.map((r) => ({
    name: r.name as string,
    time: r.time as string,
    category: r.category as string,
    cuisine: (r.cuisine as string) || undefined,
    amount: (r.amount as string) || undefined,
  }));

  const periodData: PeriodData | null = periodRow
    ? {
        lastPeriodStart: periodRow.last_period_start as string,
        averageCycleLength: periodRow.average_cycle_length as number,
        periodLength: periodRow.period_length as number,
        isIrregular: (periodRow.is_irregular as boolean) ?? undefined,
        cycleVariability: (periodRow.cycle_variability as string) ?? undefined,
        periodDays: (periodRow.period_days as string[]) ?? undefined,
      }
    : null;

  const lastCheckIn =
    checkIns.length > 0
      ? new Date((checkIns[0].timestamp as string) || checkIns[0].timestamp).toDateString()
      : null;

  return {
    categories: (profile.categories as string[]) ?? [],
    streak: (profile.streak as number) ?? 0,
    xp: (profile.xp as number) ?? 0,
    badges: (profile.badges as string[]) ?? [],
    checkIns,
    lastCheckIn,
    foodEntries,
    periodData,
    currentLeague: profile.current_league as UserData['currentLeague'],
    leagueXP: (profile.league_xp as number) ?? 0,
    hasLeftLeague: (profile.has_left_league as boolean) ?? false,
    ageRange: (profile.age_range as string) ?? undefined,
    cycleStatus: (profile.cycle_status as string) ?? undefined,
    birthControl: (profile.birth_control as string) ?? undefined,
    diagnosedConditions: (profile.diagnosed_conditions as string[]) ?? undefined,
    medications: (profile.medications as string) ?? undefined,
    giPriorities: (profile.gi_priorities as string[]) ?? undefined,
    mentalHealthFocus: (profile.mental_health_focus as string[]) ?? undefined,
    goals: (profile.goals as string[]) ?? undefined,
    educationPreference: (profile.education_preference as UserData['educationPreference']) ?? undefined,
    accessibilityPrefs: (profile.accessibility_prefs as UserData['accessibilityPrefs']) ?? undefined,
    consentAnalytics: (profile.consent_analytics as boolean) ?? true,
    consentResearch: (profile.consent_research as boolean) ?? false,
    completedLessons: (profile.completed_lessons as string[]) ?? [],
    unlockedLessons: (profile.unlocked_lessons as string[]) ?? ['intro-hormones', 'gut-brain-axis'],
    isPregnant: (profile.is_pregnant as boolean) ?? undefined,
    pregnancyMode: (profile.pregnancy_mode as boolean) ?? undefined,
    adaptiveMode: (profile.adaptive_mode as boolean) ?? undefined,
  };
}

export async function upsertProfile(userId: string, userData: UserData): Promise<boolean> {
  if (!supabase) return false;

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      categories: userData.categories,
      streak: userData.streak,
      xp: userData.xp,
      badges: userData.badges,
      current_league: userData.currentLeague,
      league_xp: userData.leagueXP,
      has_left_league: userData.hasLeftLeague,
      age_range: userData.ageRange ?? null,
      cycle_status: userData.cycleStatus ?? null,
      birth_control: userData.birthControl ?? null,
      diagnosed_conditions: userData.diagnosedConditions ?? null,
      medications: userData.medications ?? null,
      gi_priorities: userData.giPriorities ?? null,
      mental_health_focus: userData.mentalHealthFocus ?? null,
      goals: userData.goals ?? null,
      education_preference: userData.educationPreference ?? null,
      accessibility_prefs: userData.accessibilityPrefs ?? null,
      consent_analytics: userData.consentAnalytics ?? true,
      consent_research: userData.consentResearch ?? false,
      completed_lessons: userData.completedLessons ?? [],
      unlocked_lessons: userData.unlockedLessons ?? ['intro-hormones', 'gut-brain-axis'],
      is_pregnant: userData.isPregnant ?? null,
      pregnancy_mode: userData.pregnancyMode ?? null,
      adaptive_mode: userData.adaptiveMode ?? null,
    },
    { onConflict: 'id' }
  );

  if (profileError) {
    console.error('Profile upsert error:', profileError);
    return false;
  }

  // Sync check-ins (replace all for simplicity - could optimize with incremental)
  const { data: existing } = await supabase
    .from('check_ins')
    .select('id')
    .eq('profile_id', userId);

  if (existing?.length) {
    await supabase.from('check_ins').delete().eq('profile_id', userId);
  }

  if (userData.checkIns.length > 0) {
    const rows = userData.checkIns.map((c) => ({
      profile_id: userId,
      data: c as object,
    }));
    await supabase.from('check_ins').insert(rows);
  }

  // Sync food entries
  const { data: existingFood } = await supabase
    .from('food_entries')
    .select('id')
    .eq('profile_id', userId);

  if (existingFood?.length) {
    await supabase.from('food_entries').delete().eq('profile_id', userId);
  }

  if (userData.foodEntries.length > 0) {
    const rows = userData.foodEntries.map((f) => ({
      profile_id: userId,
      name: f.name,
      time: f.time,
      category: f.category,
      cuisine: f.cuisine ?? null,
      amount: f.amount ?? null,
    }));
    await supabase.from('food_entries').insert(rows);
  }

  // Sync period data
  if (userData.periodData) {
    await supabase.from('period_data').upsert(
      {
        profile_id: userId,
        last_period_start: userData.periodData.lastPeriodStart,
        average_cycle_length: userData.periodData.averageCycleLength,
        period_length: userData.periodData.periodLength,
        is_irregular: userData.periodData.isIrregular ?? null,
        cycle_variability: userData.periodData.cycleVariability ?? null,
        period_days: userData.periodData.periodDays ?? null,
      },
      { onConflict: 'profile_id' }
    );
  } else {
    await supabase.from('period_data').delete().eq('profile_id', userId);
  }

  return true;
}

export function getStorageStrategy(): 'supabase' | 'localStorage' {
  return isSupabaseConfigured() ? 'supabase' : 'localStorage';
}
