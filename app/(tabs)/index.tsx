// ============================================================
// EKRAN GŁÓWNY (DASHBOARD) — podsumowanie aktywności
// ============================================================
// Ten ekran to centrum dowodzenia użytkownika. Wyświetlamy tutaj:
//   - Statystyki tygodniowe (dni treningowe)
//   - Dzisiejsze kalorie i makroskładniki
//   - Proponowany trening na dziś
//   - Postępy w bieżącym tygodniu
// ============================================================

import { Activity, Flame, Footprints, Utensils } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Danych statycznych używamy do wypełnienia interfejsu (placeholder)
const WEEK = [
  { day: 'Sun', status: 'miss' },
  { day: 'Mon', status: 'miss' },
  { day: 'Tue', status: 'miss' },
  { day: 'Wed', status: 'done' },
  { day: 'Thu', status: 'done' },
  { day: 'Fri', status: 'off' },
  { day: 'Sat', status: 'off' },
] as const;

export default function HomeScreen() {
  return (
    // SafeAreaView zapewnia, że treść nie "wjeżdża" pod notch w iPhone
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* NAGŁÓWEK: Nazwa marki i licznik serii (streak) */}
        <Animated.View entering={FadeInDown.duration(380)} style={styles.headerRow}>
          <Text style={styles.brand}>SLOPAX</Text>
          <View style={styles.streakBadge}>
            <Flame size={13} color="#ff7a00" />
            <Text style={styles.streakText}>2</Text>
          </View>
        </Animated.View>

        {/* WIDOK TYGODNIA: Pokazuje minione dni i ich status (odbyty/opuszczony/wolny) */}
        <Animated.View entering={FadeInDown.delay(50).duration(380)} style={styles.weekRow}>
          {WEEK.map((item) => (
            <View key={item.day} style={styles.weekCell}>
              <Text style={styles.weekDay}>{item.day}</Text>
              <View
                style={[
                  styles.weekDot,
                  item.status === 'done' && styles.weekDotDone,
                  item.status === 'miss' && styles.weekDotMiss,
                ]}
              >
                {item.status === 'done' && <Text style={styles.dotIcon}>✓</Text>}
                {item.status === 'miss' && <Text style={styles.dotIcon}>✕</Text>}
              </View>
            </View>
          ))}
        </Animated.View>

        {/* PROPOZYCJA TRENINGU (Hero Card) */}
        <Animated.View entering={FadeInDown.delay(100).duration(390)} style={styles.heroCard}>
          <View style={styles.heroImageWrap}>
            <View style={styles.heroImageOverlay} />
            <View style={styles.stripeA} />
            <View style={styles.stripeB} />
            <Text style={styles.heroImageCaption}>Dobra robota, odpocznij!</Text>
          </View>
          <Text style={styles.heroTitle}>Dzień 3 - Martwy ciąg i Plecy</Text>
          <Text style={styles.heroSubtitle}>
            Nacisk na martwy ciąg i dużą objętość tylnego łańcucha z przyciąganiem horyzontalnym i wertykalnym.
          </Text>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
            <Text style={styles.ctaText}>Zobacz szczegóły</Text>
            <Text style={styles.ctaArrow}>›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* RZĄD KART: Kalorie i Postęp tygodniowy */}
        <View style={styles.row}>
          {/* Karta kalorii */}
          <Animated.View entering={FadeInDown.delay(160).duration(390)} style={styles.smallCard}>
            <View style={styles.cardTitleRow}>
              <View style={styles.titleDotRed} />
              <Text style={styles.cardTitle}>Dzisiejsze kalorie</Text>
            </View>
            <Text style={styles.cardMetric}>465/2880</Text>
            <Text style={styles.cardSub}>kcal</Text>
            <TouchableOpacity style={styles.cardBtn}>
              <Text style={styles.cardBtnText}>Dodaj posiłek</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Karta postępów tygodniowych */}
          <Animated.View entering={FadeInDown.delay(220).duration(390)} style={styles.smallCard}>
            <View style={styles.cardTitleRow}>
              <View style={styles.titleDotGold} />
              <Text style={styles.cardTitle}>Postęp w tym tygodniu</Text>
            </View>
            <Text style={styles.progressItem}>○ Dzień 1 - Przysiad & Dół...</Text>
            <Text style={styles.progressItem}>○ Dzień 2 - Wyciskanie & Barki...</Text>
            <Text style={styles.progressItem}>○ Dzień 3 - Martwy & Plecy</Text>
            <Text style={[styles.progressItem, styles.progressMuted]}>○ Dzień 4 - Góra hipertrofia...</Text>
          </Animated.View>
        </View>

        {/* MAKROSKŁADNIKI: Białko, Węglowodany, Tłuszcze */}
        <Animated.View entering={FadeInDown.delay(280).duration(390)} style={styles.macroCard}>
          {/* Białko */}
          <View style={styles.macroCol}>
            <Text style={styles.macroValue}>23</Text>
            <Text style={styles.macroSmall}>216g</Text>
            <Text style={styles.macroLabel}>Białko</Text>
            <View style={[styles.ring, { borderColor: '#1ed760' }]}>
              <Activity size={14} color="#1ed760" />
            </View>
          </View>

          {/* Węglowodany */}
          <View style={styles.macroCol}>
            <Text style={styles.macroValue}>68</Text>
            <Text style={styles.macroSmall}>288g</Text>
            <Text style={styles.macroLabel}>Węgle</Text>
            <View style={[styles.ring, { borderColor: '#ff9d00' }]}>
              <Footprints size={14} color="#ff9d00" />
            </View>
          </View>

          {/* Tłuszcze */}
          <View style={styles.macroCol}>
            <Text style={styles.macroValue}>13</Text>
            <Text style={styles.macroSmall}>96g</Text>
            <Text style={styles.macroLabel}>Tłuszcz</Text>
            <View style={[styles.ring, { borderColor: '#4ea2ff' }]}>
              <Utensils size={14} color="#4ea2ff" />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// STYLE CSS-in-JS
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a0c',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
  },
  content: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 120, // miejsce na tab-bar na dole
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  brand: {
    color: '#f7f7f8',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#181820',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2e2e38',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    color: '#f3f3f8',
    fontWeight: '700',
    fontSize: 12,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#101015',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f1f2a',
    paddingVertical: 11,
    paddingHorizontal: 9,
    marginBottom: 12,
  },
  weekCell: {
    alignItems: 'center',
    gap: 7,
  },
  weekDay: {
    color: '#9a9aa9',
    fontSize: 11,
    fontWeight: '600',
  },
  weekDot: {
    width: 21,
    height: 21,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3a40',
  },
  weekDotDone: {
    backgroundColor: '#24d566',
  },
  weekDotMiss: {
    backgroundColor: '#f43f5e',
  },
  dotIcon: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
  },
  heroCard: {
    backgroundColor: '#111117',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#232333',
    padding: 9,
    marginBottom: 12,
  },
  heroImageWrap: {
    height: 104,
    borderRadius: 11,
    backgroundColor: '#09090c',
    borderWidth: 1,
    borderColor: '#1d1d27',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 10,
  },
  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.6,
  },
  stripeA: {
    position: 'absolute',
    width: 160,
    height: 2,
    backgroundColor: '#1f1f2a',
    transform: [{ rotate: '-10deg' }],
    top: 24,
    left: -8,
    opacity: 0.6,
  },
  stripeB: {
    position: 'absolute',
    width: 180,
    height: 2,
    backgroundColor: '#252536',
    transform: [{ rotate: '-8deg' }],
    top: 46,
    left: -2,
    opacity: 0.45,
  },
  heroImageCaption: {
    color: '#b9b9c8',
    fontSize: 11,
    paddingHorizontal: 8,
    paddingBottom: 7,
  },
  heroTitle: {
    color: '#f5f5fa',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.9,
    lineHeight: 33,
  },
  heroSubtitle: {
    color: '#afafbc',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#f4f4f6',
    borderRadius: 11,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  ctaText: {
    color: '#0f0f12',
    fontWeight: '700',
    fontSize: 15,
  },
  ctaArrow: {
    color: '#0f0f12',
    fontSize: 18,
    marginTop: -2,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  smallCard: {
    flex: 1,
    backgroundColor: '#101018',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#222233',
    padding: 10,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleDotRed: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    marginRight: 5,
  },
  titleDotGold: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#f59e0b',
    marginRight: 5,
  },
  cardTitle: {
    color: '#efeff6',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMetric: {
    color: '#fafaff',
    fontSize: 16,
    fontWeight: '800',
  },
  cardSub: {
    color: '#8f8fa1',
    fontSize: 11,
    marginBottom: 10,
  },
  cardBtn: {
    backgroundColor: '#181828',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#2a2a38',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBtnText: {
    color: '#9c6cff',
    fontSize: 12,
    fontWeight: '700',
  },
  progressItem: {
    color: '#d4d4dd',
    fontSize: 11,
    marginBottom: 6,
  },
  progressMuted: {
    color: '#6e6e7b',
  },
  macroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#101018',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#222233',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  macroCol: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    color: '#f5f5fb',
    fontSize: 18,
    fontWeight: '700',
  },
  macroSmall: {
    color: '#8f8fa0',
    fontSize: 10,
    marginTop: -1,
  },
  macroLabel: {
    color: '#8f8fa0',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 8,
  },
  ring: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
