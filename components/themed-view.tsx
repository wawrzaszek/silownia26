import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'background' | 'card';
};

/**
 * KOMPONENT THEMEDVIEW
 * Wrapper dla standardowego View, który automatycznie dobiera kolor tła z motywu.
 */
export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  type = 'background',
  ...otherProps 
}: ThemedViewProps) {
  // Pobieramy kolor tła (domyślnie 'background', opcjonalnie 'card')
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, type);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
