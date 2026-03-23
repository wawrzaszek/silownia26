import React from 'react';
import { StyleSheet, View, Platform, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface GlassViewProps extends ViewProps {
  intensity?: number;  // Intensywność rozmycia (0-100)
  tint?: 'light' | 'dark' | 'extraLight'; // Odcień rozmycia
  children: React.ReactNode;
}

/**
 * KOMPONENT GLASSVIEW (Glassmorphism)
 * Tworzy efekt półprzezroczystego, rozmytego szkła. 
 * Na iOS i Android używa BlurView, na Web używa fallbacku z kolorem półprzezroczystym.
 */
export function GlassView({ 
  children, 
  style, 
  intensity = 50, 
  tint,
  ...props 
}: GlassViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  // Domyślny odcień dopasowany do systemu
  const finalTint = tint || (colorScheme === 'dark' ? 'dark' : 'light');

  return (
    <View 
      style={[
        styles.container, 
        { borderColor: theme.glassBorder, backgroundColor: theme.glass }, 
        style
      ]} 
      {...props}
    >
      {Platform.OS !== 'web' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          intensity={intensity}
          tint={finalTint}
        />
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
});
