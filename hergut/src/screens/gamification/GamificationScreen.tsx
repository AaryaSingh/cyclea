import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { theme } from '../../constants/theme';

// Mock data for demonstration
const mockUserStats = {
  xp: 1250,
  level: 5,
  streak: 12,
  nextLevelXp: 1500,
  levelProgress: 0.83,
};

const mockBadges = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first check-in',
    icon: 'flag',
    earned: true,
    earnedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Week Warrior',
    description: '7-day check-in streak',
    icon: 'local-fire-department',
    earned: true,
    earnedAt: new Date('2024-01-22'),
  },
  {
    id: '3',
    name: 'Gut Guardian',
    description: 'Tracked gut health for 30 days',
    icon: 'restaurant',
    earned: true,
    earnedAt: new Date('2024-02-14'),
  },
  {
    id: '4',
    name: 'Mood Master',
    description: 'Tracked mood for 30 days',
    icon: 'mood',
    earned: false,
  },
  {
    id: '5',
    name: 'Cycle Sage',
    description: 'Tracked cycle for 3 months',
    icon: 'favorite',
    earned: false,
  },
  {
    id: '6',
    name: 'Data Detective',
    description: 'Viewed insights 10 times',
    icon: 'insights',
    earned: false,
  },
];

const GamificationScreen: React.FC = () => {
  const getLevelColor = (level: number) => {
    if (level >= 10) return theme.colors.accent3; // Gold
    if (level >= 5) return theme.colors.secondary; // Purple
    return theme.colors.primary; // Pink
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "🔥 You're on fire!";
    if (streak >= 14) return "💪 Amazing consistency!";
    if (streak >= 7) return "⭐ Great job!";
    return "🌱 Keep it up!";
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Stats */}
        <View style={styles.headerCard}>
          <View style={styles.levelContainer}>
            <View style={[styles.levelCircle, { backgroundColor: getLevelColor(mockUserStats.level) }]}>
              <Text style={styles.levelText}>{mockUserStats.level}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Level {mockUserStats.level}</Text>
              <Text style={styles.xpText}>{mockUserStats.xp} XP</Text>
            </View>
          </View>

          <View style={styles.streakContainer}>
            <Icon name="local-fire-department" size={32} color={theme.colors.warning} />
            <Text style={styles.streakNumber}>{mockUserStats.streak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
            <Text style={styles.streakMessage}>
              {getStreakMessage(mockUserStats.streak)}
            </Text>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress to Level {mockUserStats.level + 1}</Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${mockUserStats.levelProgress * 100}%`,
                  backgroundColor: getLevelColor(mockUserStats.level),
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {mockUserStats.nextLevelXp - mockUserStats.xp} XP to go
          </Text>
        </View>

        {/* Recent Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementList}>
            {mockBadges.filter(badge => badge.earned).slice(0, 3).map((badge) => (
              <View key={badge.id} style={styles.achievementItem}>
                <View style={styles.achievementIcon}>
                  <Icon name={badge.icon} size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementName}>{badge.name}</Text>
                  <Text style={styles.achievementDescription}>{badge.description}</Text>
                  <Text style={styles.achievementDate}>
                    Earned {badge.earnedAt?.toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* All Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Badges</Text>
          <View style={styles.badgesGrid}>
            {mockBadges.map((badge) => (
              <TouchableOpacity
                key={badge.id}
                style={[
                  styles.badgeCard,
                  !badge.earned && styles.badgeCardLocked,
                ]}
              >
                <View style={[
                  styles.badgeIcon,
                  !badge.earned && styles.badgeIconLocked,
                ]}>
                  <Icon 
                    name={badge.icon} 
                    size={32} 
                    color={badge.earned ? theme.colors.primary : theme.colors.grayText} 
                  />
                  {!badge.earned && (
                    <View style={styles.lockOverlay}>
                      <Icon name="lock" size={16} color={theme.colors.white} />
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.badgeName,
                  !badge.earned && styles.badgeNameLocked,
                ]}>
                  {badge.name}
                </Text>
                <Text style={[
                  styles.badgeDescription,
                  !badge.earned && styles.badgeDescriptionLocked,
                ]}>
                  {badge.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* XP Sources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn XP</Text>
          <View style={styles.xpSourcesList}>
            <View style={styles.xpSourceItem}>
              <Icon name="today" size={20} color={theme.colors.success} />
              <Text style={styles.xpSourceText}>Daily check-in: +50 XP</Text>
            </View>
            <View style={styles.xpSourceItem}>
              <Icon name="local-fire-department" size={20} color={theme.colors.warning} />
              <Text style={styles.xpSourceText}>7-day streak: +100 XP</Text>
            </View>
            <View style={styles.xpSourceItem}>
              <Icon name="insights" size={20} color={theme.colors.info} />
              <Text style={styles.xpSourceText}>View insights: +25 XP</Text>
            </View>
            <View style={styles.xpSourceItem}>
              <Icon name="people" size={20} color={theme.colors.secondary} />
              <Text style={styles.xpSourceText}>Community post: +30 XP</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  headerCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...theme.shadows.medium,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  levelText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  levelInfo: {
    flex: 1,
  },
  levelLabel: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  xpText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  streakContainer: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.colors.warning,
    marginTop: theme.spacing.xs,
  },
  streakLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  streakMessage: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  progressCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  progressTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.grayDark,
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  achievementList: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  achievementDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  achievementDate: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  badgeCardLocked: {
    opacity: 0.6,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  badgeIconLocked: {
    backgroundColor: theme.colors.grayDark,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeName: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  badgeNameLocked: {
    color: theme.colors.textLight,
  },
  badgeDescription: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  badgeDescriptionLocked: {
    color: theme.colors.textLight,
  },
  xpSourcesList: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  xpSourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  xpSourceText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
});

export default GamificationScreen;
