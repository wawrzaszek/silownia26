// ============================================================
// MOTYW KOLORYSTYCZNY — centralny plik z kolorami i czcionkami
// ============================================================
// Tutaj definiujemy wszystkie kolory używane w aplikacji.
// Dzięki temu zmiana koloru w jednym miejscu aktualizuje cały UI.
//
// Aplikacja obsługuje jasny (light) i ciemny (dark) tryb.
// Aktywny tryb jest wykrywany automatycznie przez system iOS/Android.
// ============================================================

import { Platform } from 'react-native';

// Kolor akcentu (przyciski, ikony, checkboxy) — osobny dla jasnego i ciemnego trybu
const tintColorLight = '#3B82F6'; // Czysty Niebieski Akcent (tryb jasny)
const tintColorDark = '#4A90E2';  // Jasny Morski/Błękit (tryb ciemny, styl Hevy)

// Eksportowany obiekt Colors — używamy go w komponentach jako:
// const theme = Colors[colorScheme ?? 'light'];
// a potem: theme.background, theme.text, theme.tint, itd.
export const Colors = {
  light: {
    text: '#111827',       // kolor tekstu głównego (bardzo ciemny szary)
    background: '#F9FAFB', // tło strony (jasna szarość)
    tint: tintColorLight,  // kolor akcentu (przyciski, zaznaczenia)
    icon: '#6B7280',       // kolor ikon i pomocniczego tekstu
    tabIconDefault: '#9CA3AF',  // kolor nieaktywnej ikony w tab-barze
    tabIconSelected: tintColorLight, // kolor aktywnej ikony w tab-barze
    card: '#FFFFFF',       // tło kart i paneli
    border: '#E5E7EB',     // kolor obramowań i separatorów
  },
  dark: {
    text: '#F9FAFB',       // kolor tekstu głównego w ciemnym trybie
    background: '#000000', // tło OLED Black (oszczędza baterię na ekranach OLED)
    tint: tintColorDark,   // kolor akcentu w ciemnym trybie
    icon: '#9CA3AF',       // kolor ikon w ciemnym trybie
    tabIconDefault: '#4B5563',  // nieaktywna ikona w tab-barze (ciemny tryb)
    tabIconSelected: tintColorDark, // aktywna ikona w tab-barze (ciemny tryb)
    card: '#1C1C1E',       // tło kart — natywny kolor kart iOS w Dark Mode
    border: '#2C2C2E',     // kolor separator — subtelna ciemna linia
  },
};

// Czcionki per platforma — używamy systemowych fontów iOS/Android dla natywnego odczucia
// Platform.select() zwraca odpowiednią wartość zależnie od systemu operacyjnego
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',   // San Francisco — domyślny font Apple
    serif: 'ui-serif',
    rounded: 'ui-rounded', // SF Pro Rounded — zaokrąglone cyfry i litery
    mono: 'ui-monospace',
  },
  default: {
    // Android lub inne systemy — standardowe fonty
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    // Wersja webowa (jeśli aplikacja działa w przeglądarce przez Expo Web)
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
