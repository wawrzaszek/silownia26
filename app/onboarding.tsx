// ============================================================
// KREATOR POWITALNY (ONBOARDING)
// ============================================================
// Ekran wyświetlany tylko przy pierwszym uruchomieniu aplikacji.
// Służy do zebrania głównego celu użytkownika ("userGoal").
// Używamy "react-native-reanimated", żeby dodać płynne, nowoczesne animacje
// (np. pojawianie się elementów od dołu/góry z efektem sprężyny - springify).
// ============================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useWorkoutStore } from '../store/workoutStore';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Dostępne cele do wyboru
const GOALS = [
  { id: 'lose_weight', label: 'Schudnąć', icon: '🔥' },
  { id: 'build_muscle', label: 'Zbudować mięśnie', icon: '💪' },
  { id: 'increase_strength', label: 'Zwiększyć siłę', icon: '🏋️' },
  { id: 'improve_fitness', label: 'Poprawić kondycję', icon: '🏃' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  
  // Pobieramy akcję z naszego store'a Zustand
  const completeOnboarding = useWorkoutStore((state) => state.completeOnboarding);
  
  // Wsparcie dla Dark Mode
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  // Lokalny stan przechowujący wybrany cel przed zatwierdzeniem
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleSelectGoal = (id: string) => {
    Haptics.selectionAsync(); // Delikatna wibracja przy wyborze opcji
    setSelectedGoal(id);
  };

  // Funkcja uruchamiana po kliknięciu "Zaczynamy!"
  const handleFinish = () => {
    if (selectedGoal) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Mocniejsze tąpnięcie zatwierdzające
      // Zapisujemy w store i przemieszczamy użytkownika do głównych zakładek aplikacji
      completeOnboarding(selectedGoal);
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Nagłówek animowany od góry dla dodania atrakcyjności wizualnej (Premium UI) */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Witaj w Kuźni!</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Wybierz swój cel główny, abyśmy mogli spersonalizować Twoje doświadczenie.</Text>
      </Animated.View>

      {/* Lista celów, każdy pojawia się jeden po drugim animowany z dołu */}
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
                  }
                ]}
                activeOpacity={0.7}
                onPress={() => handleSelectGoal(goal.id)} // Ustawia aktualny klocek jako aktywny + haptics
              >
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={[styles.goalLabel, { color: theme.text }]}>{goal.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {/* Przycisk akcji na samym dole ekranu, również aktywowany gdy mamy wybrany cel */}
      <Animated.View entering={FadeInDown.delay(1000).springify()} style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { 
              backgroundColor: selectedGoal ? theme.tint : theme.border,
              opacity: selectedGoal ? 1 : 0.6 
            }
          ]}
          disabled={!selectedGoal} // Zablokowany póki użytkownik nie wybierze opcji
          onPress={handleFinish}
        >
          <Text style={styles.continueButtonText}>Zaczynamy!</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// Style - czysty, wyrafinowany i uporządkowany wygląd
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.8,
    lineHeight: 24,
  },
  goalsContainer: {
    flex: 1,
    gap: 16,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderCurve: 'continuous', // Nowa funkcja React Native dla lepszych iOS krawędzi (Squircle)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 40,
  },
  continueButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 100, // Mocno okrągły przycisk dla nowoczesnego vibe'u
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
