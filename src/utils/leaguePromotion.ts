export type League = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export const LEAGUE_INFO: Record<
  League,
  { name: string; color: string; minXP: number; emoji: string }
> = {
  bronze: { name: 'Bronze', color: '#CD7F32', minXP: 0, emoji: '🥉' },
  silver: { name: 'Silver', color: '#C0C0C0', minXP: 250, emoji: '🥈' },
  gold: { name: 'Gold', color: '#FFD700', minXP: 500, emoji: '🥇' },
  platinum: { name: 'Platinum', color: '#E5E4E2', minXP: 750, emoji: '💎' },
  diamond: { name: 'Diamond', color: '#B9F2FF', minXP: 1000, emoji: '👑' },
};

/**
 * Get league tier for a given XP total (used when rejoining).
 */
export function getLeagueForXP(xp: number): League {
  if (xp >= 1000) return 'diamond';
  if (xp >= 750) return 'platinum';
  if (xp >= 500) return 'gold';
  if (xp >= 250) return 'silver';
  return 'bronze';
}

/**
 * Get promoted league when XP increases, or current league if no promotion.
 */
export function getPromotedLeague(
  currentLeague: League | null,
  newXp: number,
  hasLeftLeague: boolean
): League | null {
  if (hasLeftLeague || !currentLeague) return currentLeague;
  if (newXp >= 1000 && currentLeague !== 'diamond') return 'diamond';
  if (newXp >= 750 && currentLeague === 'gold') return 'platinum';
  if (newXp >= 500 && currentLeague === 'silver') return 'gold';
  if (newXp >= 250 && currentLeague === 'bronze') return 'silver';
  return currentLeague;
}
