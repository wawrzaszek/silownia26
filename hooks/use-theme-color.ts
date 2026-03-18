// ============================================================
// HOOK: useThemeColor — pobieranie koloru pasującego do aktualnego motywu
// ============================================================
// Używamy tego hooka w komponentach, które muszą się dostosować
// do jasnego lub ciemnego trybu.
//
// PRZYKŁAD UŻYCIA:
//   const bgColor = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
//   // zwróci '#fff' w jasnym trybie, lub '#000' w ciemnym
//
// Jeśli nie podasz własnych kolorów w props, hook pobierze domyślny
// kolor z pliku theme.ts (Colors.light lub Colors.dark).
// ============================================================

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string }, // opcjonalne nadpisanie koloru per tryb
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark // nazwa koloru z theme.ts
) {
  // Pobieramy aktualny tryb ('light' lub 'dark'), domyślnie 'light'
  const theme = useColorScheme() ?? 'light';

  // Sprawdzamy, czy komponent przekazał własny kolor dla tego trybu
  const colorFromProps = props[theme];

  if (colorFromProps) {
    // Jeśli tak — używamy koloru z propsów (nadpisanie)
    return colorFromProps;
  } else {
    // Jeśli nie — używamy domyślnego koloru z theme.ts
    return Colors[theme][colorName];
  }
}
