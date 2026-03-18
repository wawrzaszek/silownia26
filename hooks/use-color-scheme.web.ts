// ============================================================
// HOOK: useColorScheme (wersja WEB) — obsługa trybu kolorów w przeglądarce
// ============================================================
// Ten plik jest automatycznie wybierany zamiast use-color-scheme.ts
// gdy aplikacja działa w przeglądarce (Expo Web).
//
// Problem do rozwiązania: przy renderowaniu po stronie serwera (SSR),
// motyw jest zawsze 'light' — dopiero po załadowaniu strony przez przeglądarkę
// (hydration) możemy sprawdzić prawdziwy motyw systemu użytkownika.
//
// Bez tego rozwiązania mogłoby dojść do "flash" — chwilowego przełączenia
// z jasnego na ciemny motyw po załadowaniu strony.
// ============================================================

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme() {
  // Stan informujący, czy strona już się załadowała w przeglądarce
  const [hasHydrated, setHasHydrated] = useState(false);

  // useEffect uruchamia się tylko po stronie przeglądarki (nie na serwerze)
  useEffect(() => {
    setHasHydrated(true); // teraz wiemy, że jesteśmy w kliencie
  }, []);

  // Pobieramy motyw z systemu operacyjnego
  const colorScheme = useRNColorScheme();

  // Jeśli strona jest już załadowana — zwracamy prawdziwy motyw systemu
  if (hasHydrated) {
    return colorScheme;
  }

  // Przed załadowaniem (SSR) — domyślnie zwracamy jasny motyw,
  // żeby uniknąć niespójności przy renderowaniu serwer vs klient
  return 'light';
}
