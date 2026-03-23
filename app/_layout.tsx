// ============================================================
// ROOT LAYOUT — główny szablon całej aplikacji
// ============================================================

import { useEffect, useState } from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWorkoutStore } from '@/store/workoutStore';
import 'react-native-reanimated';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const router = useRouter();
  const { hasCompletedOnboarding, accessToken } = useWorkoutStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Auth & Onboarding Logic
    const timer = setTimeout(() => {
      if (!accessToken) {
        router.replace('/auth/signup');
      } else if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)');
      }
    }, 10);
    
    return () => clearTimeout(timer);
  }, [accessToken, hasCompletedOnboarding, isMounted, router]);

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const CustomDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.tint,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.notification,
    },
  };

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.tint,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.notification,
    },
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="exercise-select"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Wybierz ćwiczenie',
            headerStyle: { backgroundColor: theme.card },
            headerTitleStyle: { color: theme.text, fontWeight: '800' },
            headerTintColor: theme.tint,
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
