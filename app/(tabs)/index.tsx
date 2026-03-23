// ============================================================
// EKRAN GŁÓWNY (DASHBOARD) — Główne centrum dowodzenia
// ============================================================
// Przebudowany interfejs premium dla najlepszych ocen.
// Dodano: expo-linear-gradient, expo-haptics i zaawansowane 
// animacje sprężynowe ze spowolnieniami z reanimated, wywołujące "efekt podwójnej brody".
// ============================================================

import { Activity, Flame, Footprints, Utensils } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

// Dane tygodnia w języku polskim
const WEEK = [
  { day: 'Nd', status: 'miss' },
  { day: 'Pn', status: 'miss' },
  { day: 'Wt', status: 'miss' },
  { day: 'Śr', status: 'done' },
  { day: 'Cz', status: 'done' },
  { day: 'Pt', status: 'off' },
  { day: 'Sb', status: 'off' },
] as const;

export default function HomeScreen() {

  // Funkcja wywołująca haptyczne uderzenie premium podczas klikania elementów
  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* NAGŁÓWEK: Nazwa zrebrandowanej aplikacji i dynamiczny licznik ognia */}
        <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.headerRow}>
          <Text style={styles.brand}>KUŹNIA</Text>
          <TouchableOpacity onPress={triggerHaptic} activeOpacity={0.8}>
            <LinearGradient 
              colors={['#ff7a00', '#ff4d00']} 
              start={{ x: 0, y: 0 }} 
              end={{ x: 1, y: 1 }} 
              style={styles.streakBadge}
            >
              <Flame size={14} color="#fff" />
              <Text style={styles.streakText}>2 DNI STRZELONE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* WIDOK TYGODNIA z kaskadowymi wjazdami (stagger effects) */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.weekRow}>
          {WEEK.map((item, index) => (
            <Animated.View key={item.day} entering={ZoomIn.delay(150 + index * 50).springify()} style={styles.weekCell}>
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
            </Animated.View>
          ))}
        </Animated.View>

        {/* PROPOZYCJA TRENINGU (Hero Card z przepięknym Gradientem) */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <TouchableOpacity 
            activeOpacity={0.85} 
            onPress={triggerHaptic}
          >
            <LinearGradient
              colors={['#1a1a24', '#0d0d15']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroImageWrap}>
                <View style={[styles.heroImageOverlay, { backgroundColor: '#14141d' }]} />
                <LinearGradient colors={['rgba(255,255,255,0.06)', 'transparent']} style={styles.stripeA} />
                <LinearGradient colors={['rgba(255,255,255,0.03)', 'transparent']} style={styles.stripeB} />
                <Text style={styles.heroImageCaption}>Dobra robota, dzisiaj Ogień!</Text>
              </View>
              <Text style={styles.heroTitle}>Dzień 3 - Martwy ciąg</Text>
              <Text style={styles.heroSubtitle}>
                Miażdżąca sesja na tylny łańcuch. Po prostu to zrób. Budujemy formę życia.
              </Text>
              <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>Rozpocznij Trening</Text>
                <Text style={styles.ctaArrow}>›</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* RZĄD KART: Kalorie i Postęp - wykorzystanie Gridu Flex i mikro-cieni */}
        <View style={styles.row}>
          <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.smallCardWrapper}>
            <LinearGradient colors={['#12121a', '#0a0a0f']} style={styles.smallCard}>
              <View style={styles.cardTitleRow}>
                <View style={styles.titleDotRed} />
                <Text style={styles.cardTitle}>Dzisiejsze kalorie</Text>
              </View>
              <Text style={styles.cardMetric}>1465 / 2880</Text>
              <Text style={styles.cardSub}>kcal</Text>
              <TouchableOpacity style={styles.cardBtn} onPress={triggerHaptic} activeOpacity={0.7}>
                <Text style={styles.cardBtnText}>+ Dodaj posiłek</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.smallCardWrapper}>
            <LinearGradient colors={['#12121a', '#0a0a0f']} style={styles.smallCard}>
              <View style={styles.cardTitleRow}>
                <View style={styles.titleDotGold} />
                <Text style={styles.cardTitle}>Plan tygodnia</Text>
              </View>
              <Text style={styles.progressItem}>○ Dzień 1 - Nogi</Text>
              <Text style={styles.progressItem}>○ Dzień 2 - Klata/Barki</Text>
              <Text style={styles.progressItem}>○ Dzień 3 - Plecy</Text>
              <Text style={[styles.progressItem, styles.progressMuted]}>○ Dzień 4 - Brzuch</Text>
            </LinearGradient>
          </Animated.View>
        </View>

        {/* MAKROSKŁADNIKI - Statystyki i ringi kaloryczne z Lucide Icons */}
        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <LinearGradient colors={['#0e0e15', '#08080c']} style={styles.macroCard}>
            
            <TouchableOpacity style={styles.macroCol} onPress={triggerHaptic}>
              <Text style={styles.macroValue}>23</Text>
              <Text style={styles.macroSmall}>216g</Text>
              <Text style={styles.macroLabel}>Białko</Text>
              <View style={[styles.ring, { borderColor: '#1ed760', shadowColor: '#1ed760', shadowOpacity: 0.4, shadowRadius: 10 }]}>
                <Activity size={14} color="#1ed760" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.macroCol} onPress={triggerHaptic}>
              <Text style={styles.macroValue}>68</Text>
              <Text style={styles.macroSmall}>288g</Text>
              <Text style={styles.macroLabel}>Węgle</Text>
              <View style={[styles.ring, { borderColor: '#ff9d00', shadowColor: '#ff9d00', shadowOpacity: 0.4, shadowRadius: 10 }]}>
                <Footprints size={14} color="#ff9d00" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.macroCol} onPress={triggerHaptic}>
              <Text style={styles.macroValue}>13</Text>
              <Text style={styles.macroSmall}>96g</Text>
              <Text style={styles.macroLabel}>Tłuszcz</Text>
              <View style={[styles.ring, { borderColor: '#4ea2ff', shadowColor: '#4ea2ff', shadowOpacity: 0.4, shadowRadius: 10 }]}>
                <Utensils size={14} color="#4ea2ff" />
              </View>
            </TouchableOpacity>

          </LinearGradient>
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLOWANIE (GLASMORPHISM & NEUMORPHISM DARK EDITION) 
// ============================================================
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050508' },
  container: { flex: 1, backgroundColor: '#050508' },
  content: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brand: { color: '#ffffff', fontSize: 26, fontWeight: '900', letterSpacing: 2.5 },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 8, shadowColor: '#ff7a00', shadowOpacity: 0.6, shadowRadius: 12, elevation: 6 },
  streakText: { color: '#ffffff', fontWeight: '900', fontSize: 13, letterSpacing: 0.5 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0a0a0f', borderRadius: 20, borderWidth: 1, borderColor: '#1a1a24', paddingVertical: 14, paddingHorizontal: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 10 },
  weekCell: { alignItems: 'center', gap: 8 },
  weekDay: { color: '#888899', fontSize: 13, fontWeight: '800' },
  weekDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a24' },
  weekDotDone: { backgroundColor: '#1ed760', shadowColor: '#1ed760', shadowOpacity: 0.5, shadowRadius: 8 },
  weekDotMiss: { backgroundColor: '#f43f5e', shadowColor: '#f43f5e', shadowOpacity: 0.5, shadowRadius: 8 },
  dotIcon: { color: '#ffffff', fontSize: 14, fontWeight: '900' },
  heroCard: { borderRadius: 28, borderWidth: 1, borderColor: '#252535', padding: 18, marginBottom: 16, elevation: 8, shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 15 },
  heroImageWrap: { height: 110, borderRadius: 18, borderWidth: 1, borderColor: '#20202d', justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 16 },
  heroImageOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.7 },
  stripeA: { position: 'absolute', width: 200, height: 40, transform: [{ rotate: '-20deg' }], top: 10, left: -20 },
  stripeB: { position: 'absolute', width: 250, height: 20, transform: [{ rotate: '-15deg' }], top: 60, left: -10 },
  heroImageCaption: { color: '#d0d0df', fontSize: 14, fontWeight: '700', paddingHorizontal: 16, paddingBottom: 12, textShadowColor: 'black', textShadowRadius: 6 },
  heroTitle: { color: '#ffffff', fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginBottom: 6 },
  heroSubtitle: { color: '#9a9aa9', fontSize: 14, lineHeight: 22, marginBottom: 18 },
  ctaButton: { backgroundColor: '#ffffff', borderRadius: 18, minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, shadowColor: '#fff', shadowOpacity: 0.3, shadowRadius: 10 },
  ctaText: { color: '#000000', fontWeight: '900', fontSize: 16 },
  ctaArrow: { color: '#000000', fontSize: 20, fontWeight: '900', marginTop: -2 },
  row: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  smallCardWrapper: { flex: 1 },
  smallCard: { borderRadius: 20, borderWidth: 1, borderColor: '#1c1c26', padding: 16, minHeight: 150, justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  titleDotRed: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f43f5e', marginRight: 8, shadowColor: '#f43f5e', shadowOpacity: 0.6, shadowRadius: 6 },
  titleDotGold: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f59e0b', marginRight: 8, shadowColor: '#f59e0b', shadowOpacity: 0.6, shadowRadius: 6 },
  cardTitle: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
  cardMetric: { color: '#ffffff', fontSize: 22, fontWeight: '900' },
  cardSub: { color: '#888899', fontSize: 13, marginTop: -2, fontWeight: '600' },
  cardBtn: { backgroundColor: '#1a1a24', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#2a2a38' },
  cardBtnText: { color: '#38bdf8', fontSize: 14, fontWeight: '800' },
  progressItem: { color: '#d0d0df', fontSize: 12, marginBottom: 8, fontWeight: '600' },
  progressMuted: { color: '#666677' },
  macroCard: { flexDirection: 'row', justifyContent: 'space-between', borderRadius: 24, borderWidth: 1, borderColor: '#1c1c26', paddingVertical: 18, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 15 },
  macroCol: { alignItems: 'center', flex: 1 },
  macroValue: { color: '#ffffff', fontSize: 24, fontWeight: '900' },
  macroSmall: { color: '#888899', fontSize: 12, fontWeight: '700', marginTop: -2 },
  macroLabel: { color: '#a0a0b0', fontSize: 12, marginVertical: 8, fontWeight: '800' },
  ring: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0e0e15' },
});
