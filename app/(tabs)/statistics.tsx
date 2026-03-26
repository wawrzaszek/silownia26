// ============================================================
// EKRAN STATYSTYK (STATISTICS) — Wizualizacja Progresu
// ============================================================
// Ten ekran generuje wykresy na podstawie historii sesji i diety.
// Używamy react-native-chart-kit do renderowania grafiki.
// ============================================================

import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LineChart } from 'react-native-chart-kit';
import { useWorkoutStore } from '@/store/workoutStore';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { translations } from '@/constants/translations';
import { BarChart2, TrendingUp, Zap } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { language, sessions, nutritionHistory } = useWorkoutStore();
    const t = translations[language];

    // --- PRZYGOTOWANIE DANYCH DO WYKRESÓW ---

    // 1. Objętość treningowa (Ostatnie 7 sesji)
    const lastSessions = sessions.slice(-7);
    const volumeData = {
        labels: lastSessions.map((_, i) => `T${i + 1}`),
        datasets: [{
            data: lastSessions.map(s => 
                s.exercises.reduce((acc, ex) => 
                    acc + ex.sets.reduce((sAcc, set) => sAcc + (set.completed ? set.weight * set.reps : 0), 0)
                , 0)
            )
        }]
    };

    // 2. Kalorie (Ostatnie 7 dni)
    const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
    
    const calorieData = {
        labels: last7Days.map(d => d.split('-')[2]), // tylko dzień
        datasets: [{
            data: last7Days.map(date => nutritionHistory[date]?.calories || 0)
        }]
    };

    const chartConfig = {
        backgroundColor: theme.card,
        backgroundGradientFrom: theme.card,
        backgroundGradientTo: theme.card,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(${theme.tint === '#007AFF' ? '0, 122, 255' : '239, 68, 68'}, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(${colorScheme === 'dark' ? '255, 255, 255' : '0, 0, 0'}, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: theme.tint
        }
    };

    return (
        <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                
                {/* NAGŁÓWEK */}
                <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.header}>
                    <Text style={[styles.title, { color: theme.text }]}>TWOJE POSTĘPY</Text>
                    <Text style={[styles.subtitle, { color: theme.icon }]}>Dane to klucz do lepszej formy.</Text>
                </Animated.View>

                {/* WYKRES 1: OBJĘTOŚĆ */}
                <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.chartHeader}>
                        <TrendingUp size={20} color={theme.tint} />
                        <Text style={[styles.chartTitle, { color: theme.text }]}>OBJĘTOŚĆ TRENINGOWA (KG)</Text>
                    </View>
                    {volumeData.datasets[0].data.length > 0 ? (
                        <LineChart
                            data={volumeData}
                            width={screenWidth - 64}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    ) : (
                        <View style={styles.emptyChart}>
                            <Text style={{ color: theme.icon }}>Ukończ pierwsze treningi, aby zobaczyć wykres.</Text>
                        </View>
                    )}
                </Animated.View>

                {/* WYKRES 2: KALORIE */}
                <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={styles.chartHeader}>
                        <Zap size={20} color="#F59E0B" />
                        <Text style={[styles.chartTitle, { color: theme.text }]}>SPOŻYCIE KALORII (KCAL)</Text>
                    </View>
                    <LineChart
                        data={calorieData}
                        width={screenWidth - 64}
                        height={220}
                        chartConfig={{...chartConfig, color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})` }}
                        bezier
                        style={styles.chart}
                    />
                </Animated.View>

                {/* STATYSTYKI SUMARYCZNE */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.statValue, { color: theme.tint }]}>{sessions.length}</Text>
                        <Text style={[styles.statLabel, { color: theme.text }]}>TRENINGI</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.statValue, { color: '#10B981' }]}>
                            {sessions.reduce((acc, s) => acc + s.exercises.length, 0)}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.text }]}>ĆWICZENIA</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1 },
    content: { padding: Spacing.lg, paddingBottom: 100 },
    header: { marginBottom: Spacing.xl, marginTop: Spacing.sm },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: 1.5 },
    subtitle: { fontSize: 13, marginTop: 8, fontWeight: '600' },
    chartCard: { borderRadius: Radius.xl, padding: 16, borderWidth: 1, marginBottom: 20 },
    chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    chartTitle: { fontSize: 13, fontWeight: '900', letterSpacing: 1 },
    chart: { marginVertical: 8, borderRadius: 16 },
    emptyChart: { height: 220, justifyContent: 'center', alignItems: 'center' },
    statsGrid: { flexDirection: 'row', gap: 16 },
    statBox: { flex: 1, padding: 20, borderRadius: Radius.xl, borderWidth: 1, alignItems: 'center' },
    statValue: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
    statLabel: { fontSize: 10, fontWeight: '800', opacity: 0.6 }
});
