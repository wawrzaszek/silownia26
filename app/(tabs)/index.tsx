import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useWorkoutStore } from '@/store/workoutStore';
import { Activity, Flame, Footprints, Utensils, Play } from 'lucide-react-native';
import { translations } from '@/constants/translations';

export default function HomeScreen() {
  const router = useRouter();
  
  // Pobranie języka ze Store
  const { language } = useWorkoutStore();
  const t = translations[language].dashboard;

  // Pobranie kalorii i makrosów
  const todayDateStr = new Date().toISOString().split('T')[0];
  const nutritionParams = useWorkoutStore((state) => state.nutritionHistory[todayDateStr]) || 
    { calories: 0, protein: 0, carbs: 0, fats: 0 };

  const triggerHaptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const navToFood = () => { triggerHaptic(); router.push('/food'); };
  const navToWorkout = () => { triggerHaptic(); router.push('/workout'); };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* NAGŁÓWEK - Uproszczony Piekielny Design */}
        <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t.greeting},</Text>
            <Text style={styles.name}>SZYMON</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame size={20} color="#ff3333" />
            <Text style={styles.streakText}>4 {t.streak}</Text>
          </View>
        </Animated.View>

        {/* ZINTEGROWANY PANEL ODŻYWIANIA */}
        {/* Połączyliśmy 4 małe widgety w jeden, czytelny, gigantyczny komponent w stylu Glasmorphism */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity activeOpacity={0.9} onPress={navToFood}>
            <LinearGradient colors={['#12121a', '#0a0a0f']} style={styles.nutritionCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{t.calories}</Text>
                <Text style={styles.cardAction}>{t.addMeal}</Text>
              </View>
              
              <View style={styles.caloriesRow}>
                <Text style={styles.caloriesBig}>{nutritionParams.calories}</Text>
                <Text style={styles.caloriesSmall}>/ 2880 kcal</Text>
              </View>

              <View style={styles.macrosRow}>
                <View style={styles.macroCol}>
                  <Activity size={16} color="#1ed760" style={styles.macroIcon}/>
                  <Text style={styles.macroVal}>{nutritionParams.protein}g</Text>
                  <Text style={styles.macroLbl}>{t.protein}</Text>
                </View>
                <View style={styles.macroCol}>
                  <Footprints size={16} color="#ff9d00" style={styles.macroIcon}/>
                  <Text style={styles.macroVal}>{nutritionParams.carbs}g</Text>
                  <Text style={styles.macroLbl}>{t.carbs}</Text>
                </View>
                <View style={styles.macroCol}>
                  <Utensils size={16} color="#4ea2ff" style={styles.macroIcon}/>
                  <Text style={styles.macroVal}>{nutritionParams.fats}g</Text>
                  <Text style={styles.macroLbl}>{t.fats}</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* GŁÓWNA KARTA TRENINGOWA */}
        {/* Szybka akcja z potężnym gradientem, zamiast przeładowanego planu tygodnia */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <TouchableOpacity activeOpacity={0.9} onPress={navToWorkout}>
            <LinearGradient colors={['#1ed760', '#159e45']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={styles.workoutCard}>
              <View style={styles.workoutContent}>
                <Text style={styles.workoutTitle}>{t.workout}</Text>
                <Text style={styles.workoutSubtitle}>Dzień 2: Klata i Barki</Text>
              </View>
              <View style={styles.playBtn}>
                <Play fill="#fff" size={24} color="#fff" style={{marginLeft: 4}} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050508' },
  container: { flex: 1 },
  content: { padding: 24, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, marginTop: 10 },
  greeting: { fontSize: 24, color: 'rgba(255,255,255,0.7)', fontWeight: '800' },
  name: { fontSize: 36, color: '#fff', fontWeight: '900', letterSpacing: -1, marginTop: -2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1010', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#331111' },
  streakText: { color: '#ff3333', fontWeight: '900', fontSize: 13, marginLeft: 6 },
  
  nutritionCard: { padding: 24, borderRadius: 32, borderWidth: 1, borderColor: '#1c1c26', marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 30, elevation: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  cardAction: { color: '#1ed760', fontSize: 14, fontWeight: '800', textTransform: 'uppercase' },
  caloriesRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 24 },
  caloriesBig: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: -2 },
  caloriesSmall: { color: '#888', fontSize: 18, fontWeight: '600', marginLeft: 8 },
  macrosRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0a0a0f', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#1c1c26' },
  macroCol: { alignItems: 'center', flex: 1 },
  macroIcon: { marginBottom: 6 },
  macroVal: { color: '#fff', fontSize: 18, fontWeight: '800' },
  macroLbl: { color: '#888', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 2, letterSpacing: 0.5 },
  
  workoutCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 28, borderRadius: 32, shadowColor: '#1ed760', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  workoutContent: { flex: 1 },
  workoutTitle: { color: '#fff', fontSize: 26, fontWeight: '900', marginBottom: 6, letterSpacing: -0.5 },
  workoutSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '600' },
  playBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' }
});
