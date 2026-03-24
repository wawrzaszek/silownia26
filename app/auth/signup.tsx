import React, { useState } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlassView } from '@/components/ui/glass-view';
import { Colors, Radius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';

/**
 * EKRAN REJESTRACJI (SIGNUP)
 * Pozwala nowym użytkownikom założyć konto przy użyciu emaila i hasła.
 * Wykorzystuje efekt Glassmorphism dla nowoczesnego wyglądu "Premium".
 */
export default function SignupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const loginUser = useWorkoutStore((state) => state.loginUser);

  // Stany formularza
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obsługa procesu rejestracji
   */
  const handleSignup = async () => {
    // Prosta walidacja pól
    if (!email || !password || !fullName) {
      setError('Wszystkie pola są wymagane');
      return;
    }

    setLoading(true);
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); // Wibracja przy kliknięciu

    try {
      // Wywołanie API backendowego (Rejestracja)
      const response = await fetch('http://192.168.0.123:4000/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Coś poszło nie tak');
      }

      // Sukces! Logujemy użytkownika w stanie aplikacji (Store)
      loginUser({ name: data.user.full_name, email: data.user.email }, data.accessToken, data.refreshToken);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Przekierowanie do kreatora celów (Onboarding)
      router.replace('/onboarding' as any);
    } catch (err: any) {
      setError(err.message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
            <ThemedText type="title">Twórz konto</ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Dołącz do społeczności Kuźni i zacznij swoją transformację.
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).springify()}>
            <GlassView style={styles.formCard} intensity={40}>
              <View style={styles.inputGroup}>
                <ThemedText type="label" style={styles.inputLabel}>Imię i nazwisko</ThemedText>
                <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <User size={20} color={theme.icon} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Jan Kowalski"
                    placeholderTextColor={theme.icon + '80'}
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="label" style={styles.inputLabel}>Email</ThemedText>
                <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Mail size={20} color={theme.icon} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="email@przyklad.pl"
                    placeholderTextColor={theme.icon + '80'}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText type="label" style={styles.inputLabel}>Hasło</ThemedText>
                <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                  <Lock size={20} color={theme.icon} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Min. 8 znaków"
                    placeholderTextColor={theme.icon + '80'}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
              </View>

              {error && (
                <Animated.View entering={FadeInDown} style={styles.errorContainer}>
                   <ThemedText style={styles.errorText}>{error}</ThemedText>
                </Animated.View>
              )}

              <TouchableOpacity
                style={[
                  styles.submitButton, 
                  { backgroundColor: theme.tint },
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <ThemedText style={styles.submitButtonText}>Załóż konto</ThemedText>
                    <ArrowRight size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </GlassView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.footer}>
            <ThemedText style={styles.footerText}>Masz już konto?</ThemedText>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
              <ThemedText type="link">Zaloguj się</ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 80,
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  subtitle: {
    marginTop: Spacing.xs,
  },
  formCard: {
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    marginBottom: Spacing.xs,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    opacity: 0.6,
  },
});
