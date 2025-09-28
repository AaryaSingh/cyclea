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

const PrivacyScreen: React.FC = () => {
  const privacyFeatures = [
    {
      icon: 'security',
      title: 'End-to-End Encryption',
      description: 'Your health data is encrypted and only you can access it.',
    },
    {
      icon: 'no-accounts',
      title: 'No Data Selling',
      description: 'We will never sell your personal health information to third parties.',
    },
    {
      icon: 'visibility-off',
      title: 'Anonymous Options',
      description: 'Share in the community without revealing your identity.',
    },
    {
      icon: 'delete-forever',
      title: 'Data Control',
      description: 'Delete your data anytime with a single tap.',
    },
    {
      icon: 'lock',
      title: 'Local Storage',
      description: 'Sensitive data is stored locally on your device when possible.',
    },
    {
      icon: 'verified-user',
      title: 'HIPAA Compliant',
      description: 'We follow healthcare privacy standards and regulations.',
    },
  ];

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Export data requested');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log('Delete account requested');
  };

  const handlePrivacySettings = () => {
    // TODO: Navigate to privacy settings
    console.log('Privacy settings requested');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.lockIconContainer}>
            <Icon name="security" size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Your Privacy is Sacred</Text>
          <Text style={styles.subtitle}>
            We will never sell your data. Not to advertisers, not to governments.
          </Text>
        </View>

        {/* Main Privacy Statement */}
        <View style={styles.privacyStatement}>
          <Text style={styles.statementTitle}>Our Privacy Promise</Text>
          <Text style={styles.statementText}>
            At HerGut, we believe your health data belongs to you and you alone. 
            We've built this app with privacy-first principles, ensuring that your 
            most personal information stays private and secure.
          </Text>
          <Text style={styles.statementText}>
            We use your data only to provide you with insights about your health 
            patterns and to improve your experience with our app. Nothing more, 
            nothing less.
          </Text>
        </View>

        {/* Privacy Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>How We Protect You</Text>
          {privacyFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Icon name={feature.icon} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Data Usage */}
        <View style={styles.dataUsageCard}>
          <Text style={styles.dataUsageTitle}>What We Do With Your Data</Text>
          <View style={styles.dataUsageList}>
            <View style={styles.dataUsageItem}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.dataUsageText}>
                Generate personalized health insights
              </Text>
            </View>
            <View style={styles.dataUsageItem}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.dataUsageText}>
                Help you track patterns and trends
              </Text>
            </View>
            <View style={styles.dataUsageItem}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.dataUsageText}>
                Improve app functionality and features
              </Text>
            </View>
            <View style={styles.dataUsageItem}>
              <Icon name="cancel" size={20} color={theme.colors.error} />
              <Text style={styles.dataUsageText}>
                Sell to advertisers or third parties
              </Text>
            </View>
            <View style={styles.dataUsageItem}>
              <Icon name="cancel" size={20} color={theme.colors.error} />
              <Text style={styles.dataUsageText}>
                Share with government agencies
              </Text>
            </View>
            <View style={styles.dataUsageItem}>
              <Icon name="cancel" size={20} color={theme.colors.error} />
              <Text style={styles.dataUsageText}>
                Use for marketing without consent
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handlePrivacySettings}
          >
            <Icon name="settings" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Privacy Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleExportData}
          >
            <Icon name="download" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>Export My Data</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Questions About Privacy?</Text>
          <Text style={styles.contactText}>
            We're here to help. Contact our privacy team at:
          </Text>
          <Text style={styles.contactEmail}>privacy@hergut.app</Text>
        </View>

        {/* Warning for Account Deletion */}
        <View style={styles.warningCard}>
          <Icon name="warning" size={24} color={theme.colors.warning} />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Delete Account</Text>
            <Text style={styles.warningText}>
              This will permanently delete all your data and cannot be undone.
            </Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Delete My Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          Privacy Policy last updated: January 2024
        </Text>
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
  lockIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.large,
  },
  title: {
    fontSize: theme.fontSizes.xxl,
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
    lineHeight: 24,
  },
  privacyStatement: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  statementTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  statementText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  featuresSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  featureCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  featureDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  dataUsageCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  dataUsageTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  dataUsageList: {
    gap: theme.spacing.sm,
  },
  dataUsageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataUsageText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
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
  contactCard: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  contactTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  contactText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  contactEmail: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  warningCard: {
    backgroundColor: theme.colors.warning,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  warningContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  warningTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  warningText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  deleteButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PrivacyScreen;
