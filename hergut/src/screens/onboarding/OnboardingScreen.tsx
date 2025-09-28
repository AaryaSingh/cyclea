import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { theme } from '../../constants/theme';
import { RootStackParamList, TrackingCategory } from '../../types';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [selectedCategories, setSelectedCategories] = useState<TrackingCategory[]>([]);

  const trackingOptions: { category: TrackingCategory; title: string; description: string; icon: string }[] = [
    {
      category: 'gut',
      title: 'Gut Health',
      description: 'Track digestive symptoms, bloating, and gut wellness',
      icon: 'restaurant',
    },
    {
      category: 'cycle',
      title: 'Menstrual Cycle',
      description: 'Monitor your cycle, flow, and related symptoms',
      icon: 'favorite',
    },
    {
      category: 'mood',
      title: 'Mood & Emotions',
      description: 'Log daily mood patterns and emotional wellbeing',
      icon: 'mood',
    },
    {
      category: 'energy',
      title: 'Energy Levels',
      description: 'Track your daily energy and fatigue patterns',
      icon: 'battery-full',
    },
    {
      category: 'misc',
      title: 'Other Health',
      description: 'Track sleep, exercise, and other wellness metrics',
      icon: 'fitness-center',
    },
  ];

  const toggleCategory = (category: TrackingCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one category to track.');
      return;
    }

    // TODO: Save preferences to Firebase
    console.log('Selected categories:', selectedCategories);
    
    // Navigate to main app
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to HerGut</Text>
          <Text style={styles.subtitle}>Your health. Your data. Private, always.</Text>
        </View>

        {/* Privacy Message */}
        <View style={styles.privacyCard}>
          <Icon name="security" size={32} color={theme.colors.primary} />
          <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
          <Text style={styles.privacyText}>
            We will never sell your data. Not to advertisers, not to governments. 
            Your health information stays private and secure.
          </Text>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What do you want to track?</Text>
          <Text style={styles.sectionSubtitle}>
            Select the areas you'd like to monitor. You can always change this later.
          </Text>

          {trackingOptions.map((option) => (
            <TouchableOpacity
              key={option.category}
              style={[
                styles.optionCard,
                selectedCategories.includes(option.category) && styles.optionCardSelected,
              ]}
              onPress={() => toggleCategory(option.category)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionIcon}>
                  <Icon 
                    name={option.icon} 
                    size={24} 
                    color={selectedCategories.includes(option.category) 
                      ? theme.colors.white 
                      : theme.colors.primary
                    } 
                  />
                </View>
                <View style={styles.optionText}>
                  <Text style={[
                    styles.optionTitle,
                    selectedCategories.includes(option.category) && styles.optionTitleSelected,
                  ]}>
                    {option.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    selectedCategories.includes(option.category) && styles.optionDescriptionSelected,
                  ]}>
                    {option.description}
                  </Text>
                </View>
                <View style={[
                  styles.checkbox,
                  selectedCategories.includes(option.category) && styles.checkboxSelected,
                ]}>
                  {selectedCategories.includes(option.category) && (
                    <Icon name="check" size={16} color={theme.colors.white} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedCategories.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={selectedCategories.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue to Dashboard
          </Text>
          <Icon name="arrow-forward" size={20} color={theme.colors.white} />
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  privacyCard: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.small,
  },
  privacyTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  privacyText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  optionCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.grayDark,
    ...theme.shadows.small,
  },
  optionCardSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primaryDark,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  optionTitleSelected: {
    color: theme.colors.white,
  },
  optionDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  optionDescriptionSelected: {
    color: theme.colors.white,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.grayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.grayDark,
  },
  continueButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
});

export default OnboardingScreen;
