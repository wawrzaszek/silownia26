import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Radius } from '@/constants/theme';

interface GlassViewProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children?: React.ReactNode;
}

export function GlassView({ 
  intensity = 50, 
  tint, 
  style, 
  children, 
  ...props 
}: GlassViewProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  
  const defaultTint = colorScheme === 'dark' ? 'dark' : 'light';
  const selectedTint = tint || defaultTint;

  // On Web, BlurView might not work perfectly, fallback to semi-transparent view
  if (Platform.OS === 'web') {
    return (
      <View 
        style={[
          styles.glass, 
          { 
            backgroundColor: theme.glass,
            borderColor: theme.glassBorder,
          }, 
          style
        ]} 
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView 
      intensity={intensity} 
      tint={selectedTint} 
      style={[
        styles.glass, 
        { 
          borderColor: theme.glassBorder,
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  glass: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
