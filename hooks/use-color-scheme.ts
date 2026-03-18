// ============================================================
// HOOK: useColorScheme — wykrywanie jasnego/ciemnego trybu
// ============================================================
// Na iOS/Android po prostu re-eksportujemy wbudowany hook
// z React Native, który automatycznie wykrywa schemat kolorów
// ustawiony przez użytkownika w systemie.
//
// Dla wersji WEB istnieje osobny plik: use-color-scheme.web.ts
// który obsługuje specyficzne zachowanie renderowania po stronie serwera.
// ============================================================

export { useColorScheme } from 'react-native';
