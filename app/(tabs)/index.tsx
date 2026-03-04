import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Activity, CalendarDays, ChevronRight, TrendingUp } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const sessions = useWorkoutStore((state) => state.sessions);
  const activeSession = useWorkoutStore((state) => state.activeSession);

  // Simple stats
  const totalWorkouts = sessions.length;

  // Calculate total volume (weight * reps)
  const totalVolume = sessions.reduce((acc, session) => {
    let sessionVolume = 0;
    session.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.completed && set.weight && set.reps) {
          sessionVolume += (set.weight * set.reps);
        }
      });
    });
    return acc + sessionVolume;
  }, 0);

  // Pulse animation for active session
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (activeSession) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [activeSession, pulse]);

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handlePress = (target: string) => {
    if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(target as any);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Witaj!</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Gotowy na kolejny trening?</Text>
      </Animated.View>

      {/* Active Session Alert */}
      {activeSession && (
        <Animated.View style={animatedPulse}>
          <TouchableOpacity
            style={[styles.activeAlert, { backgroundColor: theme.tint, borderColor: theme.tint }]}
            onPress={() => handlePress('/workout')}
          >
            <View style={styles.activeAlertContent}>
              <Activity color={theme.background} size={24} />
              <View style={styles.activeAlertText}>
                <Text style={styles.activeAlertTitle}>Trwa trening</Text>
                <Text style={styles.activeAlertSubtitle}>Kliknij, aby wrócić do ćwiczeń</Text>
              </View>
            </View>
            <ChevronRight color={theme.background} size={20} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <Animated.Text entering={FadeInDown.delay(200)} style={[styles.sectionTitle, { color: theme.text }]}>
        TWOJE PODSUMOWANIE
      </Animated.Text>

      <View style={styles.statsGrid}>
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <CalendarDays color={theme.tint} size={24} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>{totalWorkouts}</Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Treningów</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          <TrendingUp color="#10B981" size={24} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume}
          </Text>
          <Text style={[styles.statLabel, { color: theme.text }]}>Objętość kg</Text>
        </Animated.View>
      </View>

      {/* Volume Visualizer */}
      <Animated.View
        entering={FadeInDown.delay(500).duration(600)}
        style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}
      >
        <Text style={[styles.chartTitle, { color: theme.text }]}>OBJĘTOŚĆ TYGODNIOWA</Text>
        <View style={styles.chartBarContainer}>
          {[40, 70, 45, 90, 65, 30, 85].map((val, i) => (
            <View key={i} style={styles.chartCol}>
              <Animated.View
                entering={FadeInDown.delay(600 + (i * 50)).duration(1000)}
                style={[styles.chartBar, { height: val, backgroundColor: i === 6 ? theme.tint : 'rgba(255,255,255,0.1)' }]}
              />
              <Text style={[styles.chartDay, { color: theme.text }]}>{['P', 'W', 'Ś', 'C', 'P', 'S', 'N'][i]}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      <Animated.Text entering={FadeInDown.delay(700)} style={[styles.sectionTitle, { color: theme.text, marginTop: 40 }]}>
        OSTATNIE AKTYWNOŚCI
      </Animated.Text>

      {sessions.length === 0 ? (
        <Animated.View entering={FadeInDown.delay(600)} style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyText, { color: theme.text }]}>Brak zarejestrowanych treningów. Przejdź do zakładki TRENING, aby zacząć!</Text>
        </Animated.View>
      ) : (
        sessions.slice().reverse().map((session, i) => {
          const date = new Date(session.startTime).toLocaleDateString();
          const durationMins = session.endTime
            ? Math.round((session.endTime - session.startTime) / 60000)
            : 0;

          return (
            <Animated.View
              key={session.id}
              entering={FadeInDown.delay(600 + (i * 100)).duration(600)}
              style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: theme.text }]}>
                  {session.planId ? 'TRENING Z PLANU' : 'SZYBKI TRENING'}
                </Text>
                <Text style={[styles.historyDate, { color: theme.text }]}>{date}</Text>
              </View>
              <Text style={[styles.historyDetails, { color: theme.text }]}>
                {durationMins} MIN • {session.exercises.length} ĆWICZENIA
              </Text>
            </Animated.View>
          );
        })
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -2,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.7,
  },
  activeAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 32,
    marginBottom: 40,
    borderWidth: 2,
    // Note: React Native doesn't support spread shadow well without specialized libs, 
    // but the high contrast border + neon background will provide the 'pop'.
  },
  activeAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeAlertText: {
    marginLeft: 16,
  },
  activeAlertTitle: {
    color: '#09090B',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  activeAlertSubtitle: {
    color: 'rgba(9,9,11,0.8)',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  statIcon: {
    marginBottom: 20,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  emptyState: {
    padding: 40,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
  },
  historyCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.6,
  },
  historyDetails: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.8,
  },
  chartCard: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1.5,
    marginTop: 16,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 24,
    opacity: 0.6,
  },
  chartBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    paddingHorizontal: 10,
  },
  chartCol: {
    alignItems: 'center',
    width: 20,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  chartDay: {
    fontSize: 10,
    fontWeight: '900',
    opacity: 0.4,
  }
});
