// ============================================================
// EKRAN JEDZENIA — dziennik posiłków i makroskładników
// ============================================================
// Ten ekran służy do śledzenia spożytych kalorii i makro (B/W/T).
// Jest to miejsce, gdzie użytkownik planuje swoją dietę.
// ============================================================

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FoodScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>JEDZENIE</Text>
      <Text style={styles.subtitle}>Tutaj będziesz logować swoje posiłki.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#f5f5fb',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8f8fa1',
    fontSize: 14,
  },
});
