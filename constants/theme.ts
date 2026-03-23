// ============================================================
// MOTYW KOLORYSTYCZNY — centralny plik z kolorami i czcionkami
// ============================================================

import { Platform } from 'react-native';

/**
 * MOTYW WIZUALNY APLIKACJI (DESIGN SYSTEM)
 * Definiuje kolory, odstępy, zaokrąglenia i inne stałe wizualne dla trybu jasnego i ciemnego.
 */

// Główne kolory akcentowe
const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',              // Kolor głównego tekstu
    background: '#F9FAFB',        // Tło aplikacji
    tint: '#3B82F6',              // Kolor akcentu (linki, przyciski)
    icon: '#687076',              // Kolor ikon
    tabIconDefault: '#687076',
    tabIconSelected: '#3B82F6',
    card: '#FFFFFF',              // Tło kart i paneli
    border: '#E5E7EB',            // Kolor obramowań
    notification: '#EF4444',      // Kolor powiadomień/błędów
    glass: 'rgba(255, 255, 255, 0.7)', // Tło efektu szkła
    glassBorder: 'rgba(255, 255, 255, 0.5)',
  },
  dark: {
    text: '#ECEDEE',
    background: '#050508',
    tint: '#3B82F6',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#3B82F6',
    card: '#12121A',
    border: '#1C1C26',
    notification: '#F87171',
    glass: 'rgba(18, 18, 26, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  },
};

// Standardowe odstępy w całej aplikacji
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Zaokrąglenia krawędzi
export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 32,
  full: 999,
};

// Presety cieni (Shadows) dla nadania głębi
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System', 
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'sans-serif',
    serif: 'serif',
    rounded: 'sans-serif',
    mono: 'monospace',
  },
});
