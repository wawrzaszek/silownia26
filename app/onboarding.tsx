import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useWorkoutStore } from '../store/workoutStore';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Check } from 'lucide-react-native';

const GOALS = [
  { id: 'lose_weight', label: 'Schudnąć', icon: '🔥' },
  { id: 'build_muscle', label: 'Zbudować mięśnie', icon: '💪' },
  { id: 'increase_strength', label: 'Zwiększyć siłę', icon: '🏋️' },
  { id: 'improve_fitness', label: 'Poprawić kondycję', icon: '🏃' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useWorkoutStore((state) => state.completeOnboarding);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleSelectGoal = (id: string) => {
    Haptics.selectionAsync();
    setSelectedGoal(id);
  };

  const handleFinish = () => {
    if (selectedGoal) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      completeOnboarding(selectedGoal);
      router.replace('/(tabs)');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
          <ThemedText type="title">Witaj w Kuźni!</ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Wybierz swój cel główny, abyśmy mogli spersonalizować Twoje doświadczenie.
          </ThemedText>
        </Animated.View>

        <View style={styles.goalsContainer}>
          {GOALS.map((goal, index) => {
            const isSelected = selectedGoal === goal.id;
            return (
              <Animated.View 
                key={goal.id} 
                entering={FadeInDown.delay(400 + index * 100).springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.goalCard,
                    { 
                      backgroundColor: theme.card,
                      borderColor: isSelected ? theme.tint : theme.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                    isSelected && Shadows.small
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handleSelectGoal(goal.id)}
                >
                  <ThemedText style={styles.goalIcon}>{goal.icon}</ThemedText>
                  <ThemedText type="h2" style={styles.goalLabel}>{goal.label}</ThemedText>
                  {isSelected && (
                    <Animated.View entering={FadeInDown}>
                      <Check size={24} color={theme.tint} />
                    </Animated.View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { 
                backgroundColor: selectedGoal ? theme.tint : theme.border,
                opacity: selectedGoal ? 1 : 0.6 
              }
            ]}
            disabled={!selectedGoal}
            onPress={handleFinish}
          >
            <ThemedText style={styles.continueButtonText}>Zaczynamy!</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 80,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    marginBottom: Spacing.xl,
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  goalsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderCurve: 'continuous',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  goalLabel: {
    flex: 1,
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
  continueButton: {
    width: '100%',
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
