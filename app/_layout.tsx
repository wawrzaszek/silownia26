// ============================================================
// ROOT LAYOUT — główny szablon całej aplikacji
// ============================================================
// Ten plik jest ładowany jako pierwszy przez Expo Router.
// Definiuje wspólny "wrapper" dla wszystkich ekranów:
//   - ustawia motyw kolorystyczny (jasny/ciemny)
//   - konfiguruje nawigację (stack navigator)
//   - zarządza statusbarem na górze ekranu
// ============================================================

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated'; // biblioteka animacji — musi być zaimportowana na starcie

// Expo Router sprawdza ten export, żeby wiedzieć który tab jest "domyślny"
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Pobieramy aktualny schemat kolorów systemu: 'light' | 'dark' | null
  const colorScheme = useColorScheme();
  // Pobieramy nasz zestaw kolorów pasujący do schematu
  const theme = Colors[colorScheme ?? 'light'];

  // Tworzymy własny motyw jasny — nadpisujemy domyślne kolory React Navigation
  // naszymi kolorami z pliku theme.ts
  const CustomDefaultTheme = {
    ...DefaultTheme, // bierzemy wszystkie pola z domyślnego motywu...
    colors: {
      ...DefaultTheme.colors, // ...i nadpisujemy tylko kolory
      primary: theme.tint,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.tint,
    },
  };

  // To samo dla ciemnego motywu
  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.tint,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.tint,
    },
  };

  return (
    // ThemeProvider dostarcza motyw do wszystkich ekranów w aplikacji
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
      {/* Stack — nawigacja "stosem" (ekrany nakładają się na siebie jak karty) */}
      <Stack>
        {/* Ekran zakładek (tabs) — bez własnego nagłówka, ma swój własny tab-bar */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Ekran wyboru ćwiczenia — otwiera się jako modal (wyjeżdża od dołu) */}
        <Stack.Screen
          name="exercise-select"
          options={{
            presentation: 'modal',     // styl prezentacji: modal
            title: 'Wybierz ćwiczenie', // tytuł w nagłówku modala
            headerStyle: { backgroundColor: theme.card },
            headerTitleStyle: { color: theme.text, fontWeight: '800' },
            headerTintColor: theme.tint, // kolor przycisku "Wstecz"
          }}
        />
      </Stack>

      {/* StatusBar — pasek systemowy na górze ekranu (godzina, bateria itp.) */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
