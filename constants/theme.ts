// ============================================================
// MOTYW KOLORYSTYCZNY — centralny plik z kolorami i czcionkami
// ============================================================

import { Platform } from 'react-native';

// Kolor akcentu — progresywne, żywe kolory
const tintColorLight = '#2563EB'; // Royal Blue
const tintColorDark = '#3B82F6';  // Bright Azure

export const Colors = {
  light: {
    text: '#0F172A',       // Slate 900
    background: '#FFFFFF', 
    tint: tintColorLight,
    icon: '#64748B',       // Slate 500
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    card: '#F8FAFC',       // Slate 50
    border: '#E2E8F0',     // Slate 200
    notification: '#EF4444',
    // Premium Glass Effect Tokens
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
  },
  dark: {
    text: '#F8FAFC',       // Slate 50
    background: '#020617', // Slate 950 (Deep Night)
    tint: tintColorDark,
    icon: '#94A3B8',       // Slate 400
    tabIconDefault: '#334155',
    tabIconSelected: tintColorDark,
    card: '#0F172A',       // Slate 900
    border: '#1E293B',     // Slate 800
    notification: '#F87171',
    // Premium Glass Effect Tokens
    glass: 'rgba(15, 23, 42, 0.7)',
    glassBorder: 'rgba(30, 41, 59, 0.5)',
  },
};

// Layout constants for premium feel
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  full: 9999,
  // Apple's "Continuous" curve equivalent
  continuous: 22,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
