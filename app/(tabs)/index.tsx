import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';
import { router } from 'expo-router';
import { Activity, CalendarDays, ChevronRight, TrendingUp } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Witaj!</Text>
        <Text style={[styles.subtitle, { color: theme.icon }]}>Gotowy na kolejny trening?</Text>
      </View>

      {/* Active Session Alert */}
      {activeSession && (
        <TouchableOpacity
          style={[styles.activeAlert, { backgroundColor: theme.tint }]}
          onPress={() => router.push('/workout')}
        >
          <View style={styles.activeAlertContent}>
            <Activity color="#ffffff" size={24} />
            <View style={styles.activeAlertText}>
              <Text style={styles.activeAlertTitle}>Trwa trening</Text>
              <Text style={styles.activeAlertSubtitle}>Kliknij, aby wrócić do ćwiczeń</Text>
            </View>
          </View>
          <ChevronRight color="#ffffff" size={20} />
        </TouchableOpacity>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Twoje podsumowanie</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <CalendarDays color={theme.tint} size={24} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>{totalWorkouts}</Text>
          <Text style={[styles.statLabel, { color: theme.icon }]}>Treningów</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <TrendingUp color="#10B981" size={24} style={styles.statIcon} />
          <Text style={[styles.statValue, { color: theme.text }]}>
            {totalVolume > 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume}
          </Text>
          <Text style={[styles.statLabel, { color: theme.icon }]}>Przerzuconych kg</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>Ostatnie aktywności</Text>

      {sessions.length === 0 ? (
        <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.emptyText, { color: theme.icon }]}>Brak zarejestrowanych treningów. Przejdź do zakładki Trening, aby zacząć!</Text>
        </View>
      ) : (
        sessions.slice().reverse().map((session, i) => {
          const date = new Date(session.startTime).toLocaleDateString();
          const durationMins = session.endTime
            ? Math.round((session.endTime - session.startTime) / 60000)
            : 0;

          return (
            <View key={session.id} style={[styles.historyCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.historyHeader}>
                <Text style={[styles.historyTitle, { color: theme.text }]}>
                  {session.planId ? 'Trening z planu' : 'Szybki trening'}
                </Text>
                <Text style={[styles.historyDate, { color: theme.icon }]}>{date}</Text>
              </View>
              <Text style={[styles.historyDetails, { color: theme.icon }]}>
                {durationMins} min • {session.exercises.length} ćwiczeń
              </Text>
            </View>
          );
        })
      )}

      <View style={{ height: 40 }} />
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
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  activeAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 24,
    marginBottom: 32,
  },
  activeAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeAlertText: {
    marginLeft: 16,
  },
  activeAlertTitle: {
    color: '#09090B', // Keep this text purely dark, regardless of light/dark background tint, assuming tint is dark in light mode and volt in dark mode
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  activeAlertSubtitle: {
    color: 'rgba(9,9,11,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  statIcon: {
    marginBottom: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  emptyState: {
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 15,
  },
  historyCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
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
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyDetails: {
    fontSize: 15,
    fontWeight: '500',
  }
});
