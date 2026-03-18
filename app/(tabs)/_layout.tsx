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

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Kolory ikonek: aktywna zakładka vs nieaktywna
        tabBarActiveTintColor: '#f5f5fb',   // prawie biały — aktywna zakładka
        tabBarInactiveTintColor: '#696978', // szary — nieaktywna zakładka
        headerShown: false,                 // ukrywamy domyślny header (każdy ekran rządzi swoim)
        tabBarStyle: {
          backgroundColor: '#0b0b10', // bardzo ciemne tło tab-bara
          borderTopColor: '#191926',  // subtelna linia u góry tab-bara
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
          title: 'HOME',
          tabBarIcon: ({ color }) => <Home size={20} color={color} />, // ikona domku
        }}
      />

      {/* Zakładka: Trening — ekran do zarządzania sesjami */}
      <Tabs.Screen
        name="workout"                          // odpowiada plikowi app/(tabs)/workout.tsx
        options={{
          title: 'TRAINER',
          tabBarIcon: ({ color }) => <Dumbbell size={20} color={color} />, // ikona hantli
        }}
      />

      {/* Zakładka: Jedzenie (dieta) — placeholder na przyszłość */}
      <Tabs.Screen
        name="food"                             // odpowiada plikowi app/(tabs)/food.tsx
        options={{
          title: 'FOOD',
          tabBarIcon: ({ color }) => <Utensils size={20} color={color} />, // ikona sztućców
        }}
      />

      {/* Zakładka: Profil użytkownika */}
      <Tabs.Screen
        name="profile"                          // odpowiada plikowi app/(tabs)/profile.tsx
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => <User size={20} color={color} />, // ikona osoby
        }}
      />
    </Tabs>
  );
}
