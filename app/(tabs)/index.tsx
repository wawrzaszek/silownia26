import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutStore } from '@/store/workoutStore';
import { Activity, Flame, Footprints, Utensils, Play, Droplet, Plus } from 'lucide-react-native';
import { translations } from '@/constants/translations';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassView } from '@/components/ui/glass-view';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * GŁÓWNY EKRAN DASHBOARDU
 * Miejsce, gdzie użytkownik widzi swoje codzienne postępy, kalorie i szybkie akcje.
 */
export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  // Pobranie stanu aplikacji
  const { language, userProfile } = useWorkoutStore();
  const t = translations[language].dashboard;

  // Dzisiejsza data do pobierania statystyk
  const todayDateStr = new Date().toISOString().split('T')[0];
  const nutritionParams = useWorkoutStore((state) => state.nutritionHistory[todayDateStr]) || 
    { calories: 0, protein: 0, carbs: 0, fats: 0, waterIntake: 0 };

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const addWater = useWorkoutStore((state) => state.addWater);
  const handleAddWater = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    addWater(todayDateStr, 250);
  };

  return (
    <ThemedView style={styles.safe}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView 
          style={styles.container} 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* NAGŁÓWEK - Personalizowane powitanie */}
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
          <View>
            <ThemedText type="subtitle" style={styles.greeting}>{t.greeting},</ThemedText>
            <ThemedText type="title" style={styles.name}>
              {userProfile?.name?.split(' ')[0] || 'Atleta'}
            </ThemedText>
          </View>
          <TouchableOpacity style={[styles.streakBadge, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Flame size={20} color="#EF4444" />
            <ThemedText type="defaultSemiBold" style={styles.streakText}>4 {t.streak}</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* KARTA KALORII - Główny widget odżywiania (Premium Glassmorphism) */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/food')}>
            <GlassView style={styles.nutritionCard} intensity={25}>
              <View style={styles.cardHeader}>
                <ThemedText type="label">{t.calories}</ThemedText>
                <View style={styles.addMealBtn}>
                   <Plus size={16} color={theme.tint} />
                   <ThemedText style={{ color: theme.tint, fontWeight: '700' }}>{t.addMeal}</ThemedText>
                </View>
              </View>
              
              <View style={styles.caloriesRow}>
                <ThemedText style={styles.caloriesBig}>{nutritionParams.calories}</ThemedText>
                <ThemedText type="subtitle" style={styles.caloriesSmall}>/ 2880 kcal</ThemedText>
              </View>

              <View style={styles.macrosRow}>
                <MacroItem icon={<Activity size={18} color="#10B981" />} value={`${nutritionParams.protein}g`} label={t.protein} />
                <MacroItem icon={<Footprints size={18} color="#F59E0B" />} value={`${nutritionParams.carbs}g`} label={t.carbs} />
                <MacroItem icon={<Utensils size={18} color="#3B82F6" />} value={`${nutritionParams.fats}g`} label={t.fats} />
              </View>
            </GlassView>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.row}>
          {/* HYDRATACJA - Mniejszy widget */}
          <Animated.View entering={FadeInDown.delay(300).springify()} style={{ flex: 1 }}>
            <GlassView style={styles.waterCard} intensity={20}>
              <Droplet size={24} color="#3B82F6" style={{ marginBottom: Spacing.xs }} />
              <ThemedText type="caption">{t.waterTitle}</ThemedText>
              <ThemedText type="h2" style={{ color: '#3B82F6' }}>{(nutritionParams.waterIntake || 0)} ml</ThemedText>
              <TouchableOpacity style={[styles.waterBtn, { backgroundColor: theme.tint }]} onPress={handleAddWater}>
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
            </GlassView>
          </Animated.View>

          {/* PLACEHOLDER - Np. Kroki lub Sen */}
          <Animated.View entering={FadeInDown.delay(350).springify()} style={{ flex: 1 }}>
             <GlassView style={styles.stepsCard} intensity={20}>
                <Footprints size={24} color="#10B981" style={{ marginBottom: Spacing.xs }} />
                <ThemedText type="caption">KROKI</ThemedText>
                <ThemedText type="h2">8,432</ThemedText>
                <ThemedText type="caption" style={{ opacity: 0.5 }}>Cel: 10,000</ThemedText>
             </GlassView>
          </Animated.View>
        </View>

        {/* KARTA TRENINGOWA - Szybki start treningu */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/workout')}>
            <LinearGradient 
              colors={[theme.tint, theme.tint + 'CC']} 
              start={{x: 0, y: 0}} 
              end={{x: 1, y: 1}} 
              style={styles.workoutCard}
            >
              <View style={styles.workoutContent}>
                <ThemedText style={styles.workoutTitle}>{t.workout}</ThemedText>
                <ThemedText style={styles.workoutSubtitle}>Dzień 2: Klata i Barki</ThemedText>
              </View>
              <View style={styles.playBtn}>
                <Play fill="#fff" size={24} color="#fff" style={{marginLeft: 4}} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

/**
 * Pomocniczy komponent dla makroskładników
 */
function MacroItem({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <View style={styles.macroCol}>
      {icon}
      <ThemedText type="defaultSemiBold" style={{ marginTop: 4 }}>{value}</ThemedText>
      <ThemedText type="caption">{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
  },
  container: { 
    flex: 1 
  },
  content: { 
    padding: Spacing.lg, 
    paddingBottom: 100 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: Spacing.xl, 
    marginTop: Spacing.md 
  },
  greeting: { 
    opacity: 0.6 
  },
  // Usunięty ujemny margines (marginTop) by tekst "Cześć" i Imię się nie nakładały
  name: { 
    
  },
  streakBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: Spacing.md, 
    paddingVertical: Spacing.sm, 
    borderRadius: Radius.full, 
    borderWidth: 1,
    ...Shadows.small,
  },
  streakText: { 
    marginLeft: Spacing.xs 
  },
  
  nutritionCard: { 
    padding: Spacing.lg, 
    marginBottom: Spacing.md,
    ...Shadows.medium,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: Spacing.md 
  },
  addMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Aktualizacja wyrównania z 'baseline' do 'flex-end',
  // by gigantyczny font nie wypychał samej jedynki (odcięcie u góry elementu GlassView)
  caloriesRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginBottom: Spacing.lg, 
    justifyContent: 'center' 
  },
  caloriesBig: { 
    fontSize: 56, 
    fontWeight: '900', 
    letterSpacing: -2,
    lineHeight: 64 // Zmiana zapobiegająca ucinaniu górnej krawędzi dużych cyfr (0) przez ograniczający bounding-box textu na iOS
  },
  caloriesSmall: { 
    marginLeft: Spacing.xs,
    marginBottom: 8, // Dodany margines by wyrównać mały tekst optycznie na dół wobec większego bez użycia algorytmu 'baseline'
    opacity: 0.5,
  },
  macrosRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: Spacing.md, 
    borderRadius: Radius.md,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  macroCol: { 
    alignItems: 'center', 
    flex: 1 
  },
  
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  waterCard: { 
    padding: Spacing.md, 
    alignItems: 'center',
    height: 160,
    justifyContent: 'center',
  },
  waterBtn: { 
    position: 'absolute',
    bottom: -10,
    right: Spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  stepsCard: {
    padding: Spacing.md,
    alignItems: 'center',
    height: 160,
    justifyContent: 'center',
  },
  
  workoutCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: Spacing.xl, 
    borderRadius: Radius.xl, 
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  workoutContent: { 
    flex: 1 
  },
  workoutTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '900', 
    marginBottom: 4, 
    letterSpacing: -0.5 
  },
  workoutSubtitle: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  playBtn: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    alignItems: 'center', 
    justifyContent: 'center' 
  }
});
