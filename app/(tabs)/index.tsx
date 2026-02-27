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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  activeAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  activeAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeAlertText: {
    marginLeft: 12,
  },
  activeAlertTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  activeAlertSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  statIcon: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  emptyState: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 22,
  },
  historyCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    fontSize: 14,
  },
  historyDetails: {
    fontSize: 14,
  }
});
