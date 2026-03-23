// ============================================================
// EKRAN ŻYWIENIA (FOOD) — Twój Dziennik Pokładowy
// ============================================================
// Ten ekran zawiera wybitny wizualnie formularz.
// Elementy Glasmorphismowe wjeżdżają dzięki react-native-reanimated.
// Po uzupełnieniu danych zjadamy haptic feedback i aktualizuje się Store.
// ============================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useWorkoutStore } from '@/store/workoutStore';
import { Activity, Flame, Footprints, Utensils } from 'lucide-react-native';

export default function FoodScreen() {
  const addMeal = useWorkoutStore(state => state.addMeal);
  
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  // Funkcja aktywowana przy próbie dodania posiłku
  const handleAddMeal = () => {
    if (!calories && !protein && !carbs && !fats) return;
    
    // Potężne powiadomienie z wibracji przypominające zapis cdaction
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Zapis w bazie danych aktualnego dnia
    const today = new Date().toISOString().split('T')[0];
    addMeal(
      today,
      parseInt(calories || '0', 10),
      parseInt(protein || '0', 10),
      parseInt(carbs || '0', 10),
      parseInt(fats || '0', 10)
    );

    // Czyszczenie i przygotowanie do następnego posiłku
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* KeyboardAvoidingView pomaga przesunąć ekran do góry kiedy klawiatura na iOS wjedzie z dołu */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        {/* NAGŁÓWEK z animacją wjazdu */}
        <Animated.View entering={FadeInDown.duration(400).springify()} style={styles.header}>
          <Text style={styles.title}>DODAJ POSIŁEK</Text>
          <Text style={styles.subtitle}>Zanotuj co zjadłeś, żeby utrzymać maszynę w ruchu. Podawaj czyste wartości.</Text>
        </Animated.View>

        {/* KARTA GŁÓWNA - GLASMORPHISM */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <LinearGradient colors={['#12121c', '#0a0a0f']} style={styles.card}>
            
            {/* Pole: Kalorie */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Flame size={18} color="#ff7a00" />
                <Text style={styles.label}>Kalorie (kcal)</Text>
              </View>
              <TextInput 
                style={styles.input} 
                placeholder="np. 450" 
                placeholderTextColor="#3a3a4c" 
                keyboardType="numeric" 
                value={calories}
                onChangeText={(cur) => {
                    Haptics.selectionAsync(); // lekka wibracja przy pisaniu
                    setCalories(cur);
                }}
              />
            </View>

            {/* Pole: Białko */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Activity size={18} color="#1ed760" />
                <Text style={styles.label}>Białko (g)</Text>
              </View>
              <TextInput 
                style={styles.input} 
                placeholder="np. 35" 
                placeholderTextColor="#3a3a4c" 
                keyboardType="numeric" 
                value={protein}
                onChangeText={(cur) => { Haptics.selectionAsync(); setProtein(cur); }}
              />
            </View>

            {/* Pole: Węglowodany */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Footprints size={18} color="#ff9d00" />
                <Text style={styles.label}>Węglowodany (g)</Text>
              </View>
              <TextInput 
                style={styles.input} 
                placeholder="np. 50" 
                placeholderTextColor="#3a3a4c" 
                keyboardType="numeric" 
                value={carbs}
                onChangeText={(cur) => { Haptics.selectionAsync(); setCarbs(cur); }}
              />
            </View>

            {/* Pole: Tłuszcze */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Utensils size={18} color="#4ea2ff" />
                <Text style={styles.label}>Tłuszcze (g)</Text>
              </View>
              <TextInput 
                style={styles.input} 
                placeholder="np. 15" 
                placeholderTextColor="#3a3a4c" 
                keyboardType="numeric" 
                value={fats}
                onChangeText={(cur) => { Haptics.selectionAsync(); setFats(cur); }}
              />
            </View>

            {/* Przycisk akcji (Submit) */}
            <TouchableOpacity 
              style={[
                styles.addButton, 
                // przycienienie przycisku kiedy nic wprowadzono
                (!calories && !protein && !carbs && !fats) && styles.addButtonDisabled
              ]} 
              activeOpacity={0.8} 
              onPress={handleAddMeal}
            >
              <LinearGradient 
                colors={['#1ed760', '#159e45']} 
                style={styles.addGradient}
                start={{x: 0, y: 0}} end={{x: 1, y: 1}}
              >
                <Text style={styles.addButtonText}>Zapisz w Dzienniku</Text>
              </LinearGradient>
            </TouchableOpacity>

          </LinearGradient>
        </Animated.View>

      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// STYLE & PREMIUM STYLING
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050508' },
  flex1: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 30, marginTop: 10 },
  title: { color: '#ffffff', fontSize: 32, fontWeight: '900', letterSpacing: 1.5 },
  subtitle: { color: '#888899', fontSize: 13, marginTop: 8, lineHeight: 20, fontWeight: '600' },
  card: { borderRadius: 28, padding: 24, borderWidth: 1, borderColor: '#1c1c26', shadowColor: '#000', shadowOpacity: 0.8, shadowRadius: 30, elevation: 15 },
  inputGroup: { marginBottom: 22 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
  label: { color: '#e0e0ef', fontSize: 13, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#0a0a0f', borderRadius: 16, color: '#fff', fontSize: 20, paddingHorizontal: 18, paddingVertical: 16, borderWidth: 1, borderColor: '#222233', fontWeight: '800' },
  addButton: { marginTop: 16, borderRadius: 18, overflow: 'hidden', shadowColor: '#1ed760', shadowOpacity: 0.4, shadowRadius: 15, elevation: 8 },
  addButtonDisabled: { opacity: 0.5, shadowOpacity: 0 },
  addGradient: { paddingVertical: 20, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 }
});
