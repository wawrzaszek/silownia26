// ============================================================
// TABS LAYOUT — konfiguracja dolnej belki nawigacyjnej (tab-bar)
// ============================================================
// Ten plik definiuje zakładki w dolnej belce aplikacji.
// Każdy <Tabs.Screen> odpowiada jednemu plikowi w folderze (tabs)/.
// Kolejność ekranów na liście = kolejność ikonek w tab-barze.
// ============================================================

import { Tabs } from 'expo-router';
import { Dumbbell, Home, User, Utensils } from 'lucide-react-native'; // ikony SVG
import React from 'react';
import { useWorkoutStore } from '@/store/workoutStore';
import { translations } from '@/constants/translations';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { language } = useWorkoutStore();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const t = translations[language].tabs;

  return (
    <Tabs
      screenOptions={{
        // Kolory ikonek: aktywna zakładka vs nieaktywna
        tabBarActiveTintColor: theme.tint,   // używamy koloru akcentu z motywu
        tabBarInactiveTintColor: theme.icon, // używamy koloru ikon z motywu
        headerShown: false,                 // ukrywamy domyślny header (każdy ekran rządzi swoim)
        tabBarStyle: {
          backgroundColor: theme.card, // używamy karty z motywu
          borderTopColor: theme.border,      // używamy koloru obramowania z motywu
          height: 82,                 // wysokość pasaka (większa z powodu iPhone Notch/Dynamic Island)
          paddingBottom: 9,           // padding na dole (miejsce na Home Indicator iPhone)
          paddingTop: 7,
        },
        tabBarLabelStyle: {
          fontSize: 10,      // mały tekst pod ikonkami
          fontWeight: '700',
          letterSpacing: 0.3,
        },
      }}>

      {/* Zakładka: Strona główna (Home) */}
      <Tabs.Screen
        name="index"                            // odpowiada plikowi app/(tabs)/index.tsx
        options={{
          title: t.home,
          tabBarIcon: ({ color }) => <Home size={20} color={color} />, // ikona domku
        }}
      />

      {/* Zakładka: Trening — ekran do zarządzania sesjami */}
      <Tabs.Screen
        name="workout"                          // odpowiada plikowi app/(tabs)/workout.tsx
        options={{
          title: t.trainer,
          tabBarIcon: ({ color }) => <Dumbbell size={20} color={color} />, // ikona hantli
        }}
      />

      {/* Zakładka: Jedzenie (dieta) — placeholder na przyszłość */}
      <Tabs.Screen
        name="food"                             // odpowiada plikowi app/(tabs)/food.tsx
        options={{
          title: t.food,
          tabBarIcon: ({ color }) => <Utensils size={20} color={color} />, // ikona sztućców
        }}
      />

      {/* Zakładka: Profil użytkownika */}
      <Tabs.Screen
        name="profile"                          // odpowiada plikowi app/(tabs)/profile.tsx
        options={{
          title: t.profile,
          tabBarIcon: ({ color }) => <User size={20} color={color} />, // ikona osoby
        }}
      />
    </Tabs>
  );
}
