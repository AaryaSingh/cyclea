import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { theme } from '../../constants/theme';
import { DailyCheckIn } from '../../types';

const DailyCheckInScreen: React.FC = () => {
  const [pain, setPain] = useState(0);
  const [bloating, setBloating] = useState(0);
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [selectedMoodEmoji, setSelectedMoodEmoji] = useState('😊');
  const [notes, setNotes] = useState('');

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊', '😄', '🤩'];

  const handleSave = () => {
    const checkIn: Partial<DailyCheckIn> = {
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date(),
      gutHealth: {
        pain,
        bloating,
        symptoms: [],
      },
      mood,
      energy,
      moodEmoji: selectedMoodEmoji,
      notes: notes.trim() || undefined,
      tags: [],
    };

    // TODO: Save to Firebase
    console.log('Daily check-in:', checkIn);
    
    Alert.alert(
      'Check-in Saved! 🎉',
      'Your daily health data has been recorded.',
      [{ text: 'OK' }]
    );
  };

  const getSliderLabel = (value: number, type: string) => {
    switch (type) {
      case 'pain':
        if (value === 0) return 'No pain';
        if (value <= 3) return 'Mild pain';
        if (value <= 6) return 'Moderate pain';
        if (value <= 8) return 'Severe pain';
        return 'Extreme pain';
      case 'bloating':
        if (value === 0) return 'No bloating';
        if (value <= 3) return 'Mild bloating';
        if (value <= 6) return 'Moderate bloating';
        if (value <= 8) return 'Severe bloating';
        return 'Extreme bloating';
      case 'mood':
        if (value <= 2) return 'Very low';
        if (value <= 4) return 'Low';
        if (value <= 6) return 'Neutral';
        if (value <= 8) return 'Good';
        return 'Excellent';
      case 'energy':
        if (value <= 2) return 'Very low';
        if (value <= 4) return 'Low';
        if (value <= 6) return 'Moderate';
        if (value <= 8) return 'High';
        return 'Very high';
      default:
        return value.toString();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Daily Check-in</Text>
        <Text style={styles.subtitle}>
          How are you feeling today? {new Date().toLocaleDateString()}
        </Text>

        {/* Gut Health Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gut Health</Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Pain Level</Text>
            <View style={styles.sliderWrapper}>
              <Text style={styles.sliderValue}>{pain}/10</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                value={pain}
                onValueChange={setPain}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.grayDark}
                thumbStyle={styles.sliderThumb}
              />
            </View>
            <Text style={styles.sliderDescription}>
              {getSliderLabel(pain, 'pain')}
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Bloating</Text>
            <View style={styles.sliderWrapper}>
              <Text style={styles.sliderValue}>{bloating}/10</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                value={bloating}
                onValueChange={setBloating}
                minimumTrackTintColor={theme.colors.secondary}
                maximumTrackTintColor={theme.colors.grayDark}
                thumbStyle={styles.sliderThumb}
              />
            </View>
            <Text style={styles.sliderDescription}>
              {getSliderLabel(bloating, 'bloating')}
            </Text>
          </View>
        </View>

        {/* Mood Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood & Energy</Text>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Mood</Text>
            <View style={styles.sliderWrapper}>
              <Text style={styles.sliderValue}>{mood}/10</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={mood}
                onValueChange={setMood}
                minimumTrackTintColor={theme.colors.accent3}
                maximumTrackTintColor={theme.colors.grayDark}
                thumbStyle={styles.sliderThumb}
              />
            </View>
            <Text style={styles.sliderDescription}>
              {getSliderLabel(mood, 'mood')}
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Energy Level</Text>
            <View style={styles.sliderWrapper}>
              <Text style={styles.sliderValue}>{energy}/10</Text>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={energy}
                onValueChange={setEnergy}
                minimumTrackTintColor={theme.colors.success}
                maximumTrackTintColor={theme.colors.grayDark}
                thumbStyle={styles.sliderThumb}
              />
            </View>
            <Text style={styles.sliderDescription}>
              {getSliderLabel(energy, 'energy')}
            </Text>
          </View>

          {/* Mood Emoji Selection */}
          <View style={styles.emojiContainer}>
            <Text style={styles.emojiLabel}>How are you feeling?</Text>
            <View style={styles.emojiRow}>
              {moodEmojis.map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.emojiButton,
                    selectedMoodEmoji === emoji && styles.emojiButtonSelected,
                  ]}
                  onPress={() => setSelectedMoodEmoji(emoji)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="How was your day? Any symptoms or observations?"
            placeholderTextColor={theme.colors.textLight}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Icon name="save" size={20} color={theme.colors.white} />
          <Text style={styles.saveButtonText}>Save Check-in</Text>
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
  title: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  section: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  sliderContainer: {
    marginBottom: theme.spacing.lg,
  },
  sliderLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sliderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  sliderValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.colors.primary,
    minWidth: 30,
  },
  slider: {
    flex: 1,
    height: 40,
    marginLeft: theme.spacing.sm,
  },
  sliderThumb: {
    backgroundColor: theme.colors.primary,
    width: 20,
    height: 20,
  },
  sliderDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  emojiContainer: {
    marginTop: theme.spacing.lg,
  },
  emojiLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.gray,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.primary,
  },
  emoji: {
    fontSize: 24,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.grayDark,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
});

export default DailyCheckInScreen;
