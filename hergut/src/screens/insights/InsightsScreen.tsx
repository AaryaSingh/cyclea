import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { theme } from '../../constants/theme';

const { width } = Dimensions.get('window');

// Mock data for demonstration
const mockInsights = [
  {
    id: '1',
    type: 'cycle',
    title: 'Cycle Pattern Analysis',
    description: 'Your cycle has been consistent at 28-30 days over the last 3 months.',
    trend: 'stable',
    data: [28, 29, 28, 30, 28, 29, 28],
  },
  {
    id: '2',
    type: 'gut',
    title: 'Gut Health Trends',
    description: 'Bloating tends to increase 2-3 days before your period.',
    trend: 'correlation',
    data: [2, 3, 4, 6, 5, 3, 2],
  },
  {
    id: '3',
    type: 'mood',
    title: 'Mood Patterns',
    description: 'Your mood is generally higher during the first half of your cycle.',
    trend: 'positive',
    data: [8, 7, 8, 6, 5, 7, 8],
  },
];

const mockMonthlyStory = {
  title: "Your January Health Story",
  content: `This month, you showed incredible consistency in tracking your health! 🌟

Your cycle remained stable at 28-30 days, and you've been particularly mindful of your gut health. We noticed that your bloating tends to peak around day 25-26 of your cycle, which is completely normal.

Your mood has been generally positive, with an average rating of 7.2/10. You seem to feel your best during the first two weeks of your cycle, which aligns with typical hormonal patterns.

Keep up the great work! Your dedication to tracking is helping you understand your body better. 💪`,
  insights: [
    "You tracked 28 out of 31 days this month",
    "Your gut health improved by 15% compared to last month",
    "You discovered a correlation between stress and bloating",
  ],
};

const InsightsScreen: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive':
        return { name: 'trending-up', color: theme.colors.success };
      case 'negative':
        return { name: 'trending-down', color: theme.colors.error };
      case 'stable':
        return { name: 'trending-flat', color: theme.colors.info };
      case 'correlation':
        return { name: 'link', color: theme.colors.secondary };
      default:
        return { name: 'help', color: theme.colors.grayText };
    }
  };

  const renderSimpleChart = (data: number[], color: string) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {data.map((value, index) => {
            const height = ((value - minValue) / range) * 60;
            return (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.chartBarFill,
                    {
                      height: Math.max(height, 4),
                      backgroundColor: color,
                    },
                  ]}
                />
                <Text style={styles.chartLabel}>{index + 1}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Timeframe Selector */}
        <View style={styles.timeframeSelector}>
          {(['week', 'month', 'quarter'] as const).map((timeframe) => (
            <TouchableOpacity
              key={timeframe}
              style={[
                styles.timeframeButton,
                selectedTimeframe === timeframe && styles.timeframeButtonSelected,
              ]}
              onPress={() => setSelectedTimeframe(timeframe)}
            >
              <Text
                style={[
                  styles.timeframeButtonText,
                  selectedTimeframe === timeframe && styles.timeframeButtonTextSelected,
                ]}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Monthly Story */}
        <View style={styles.storyCard}>
          <View style={styles.storyHeader}>
            <Icon name="auto-stories" size={24} color={theme.colors.primary} />
            <Text style={styles.storyTitle}>{mockMonthlyStory.title}</Text>
          </View>
          <Text style={styles.storyContent}>{mockMonthlyStory.content}</Text>
          
          <View style={styles.insightsList}>
            <Text style={styles.insightsTitle}>Key Insights:</Text>
            {mockMonthlyStory.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Icon name="lightbulb" size={16} color={theme.colors.accent3} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Individual Insights */}
        {mockInsights.map((insight) => {
          const trendIcon = getTrendIcon(insight.trend);
          const chartColor = insight.type === 'cycle' 
            ? theme.colors.primary 
            : insight.type === 'gut' 
            ? theme.colors.secondary 
            : theme.colors.accent3;

          return (
            <View key={insight.id} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightTitleContainer}>
                  <Text style={styles.insightCardTitle}>{insight.title}</Text>
                  <View style={styles.trendContainer}>
                    <Icon 
                      name={trendIcon.name} 
                      size={16} 
                      color={trendIcon.color} 
                    />
                    <Text style={[styles.trendText, { color: trendIcon.color }]}>
                      {insight.trend}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.insightCardDescription}>
                {insight.description}
              </Text>
              
              {renderSimpleChart(insight.data, chartColor)}
            </View>
          );
        })}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Share Insights</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="download" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Export Data</Text>
          </TouchableOpacity>
        </View>

        {/* Coming Soon */}
        <View style={styles.comingSoonCard}>
          <Icon name="psychology" size={32} color={theme.colors.textLight} />
          <Text style={styles.comingSoonTitle}>AI-Powered Insights</Text>
          <Text style={styles.comingSoonText}>
            Soon you'll get personalized health recommendations and predictions based on your data patterns.
          </Text>
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
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  timeframeButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  timeframeButtonText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  timeframeButtonTextSelected: {
    color: theme.colors.white,
  },
  storyCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  storyTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  storyContent: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  insightsList: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  insightsTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  insightText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  insightCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  insightHeader: {
    marginBottom: theme.spacing.md,
  },
  insightTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightCardTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  insightCardDescription: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 80,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.spacing.sm,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarFill: {
    width: 12,
    borderRadius: 6,
    marginBottom: theme.spacing.xs,
  },
  chartLabel: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    flex: 0.45,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  comingSoonCard: {
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    opacity: 0.7,
  },
  comingSoonTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  comingSoonText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default InsightsScreen;
