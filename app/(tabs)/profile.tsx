// ============================================================
// EKRAN PROFILU — informacje o użytkowniku i ustawienia
// ============================================================
// Tutaj użytkownik może zarządzać swoim kontem, ustawieniami
// powiadomień i preferencjami treningowymi.
// ============================================================

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { Bell, CircleHelp, Settings, UserCircle } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useWorkoutStore } from '@/store/workoutStore';
import { translations } from '@/constants/translations';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // Pobieramy dane ze store'a
    const { language, setLanguage, sessions } = useWorkoutStore();
    const t = translations[language].profile;

    // Funkcja do płynnego przełączania języków za pomocą Haptics
    const toggleLanguage = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.selectionAsync();
        setLanguage(language === 'pl' ? 'en' : 'pl');
    };

    // Lista elementów menu używająca słownika
    const menuItems = [
        { title: t.settings, icon: <UserCircle size={24} color={theme.icon} /> },
        { title: t.notifications, icon: <Bell size={24} color={theme.icon} /> },
        { title: t.preferences, icon: <Settings size={24} color={theme.icon} /> },
        { title: t.help, icon: <CircleHelp size={24} color={theme.icon} /> },
    ];

    // Funkcja wywoływana po kliknięciu elementu menu (wibracja iOS)
    const handleMenuPress = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
            {/* TYTUŁ EKRANU Z TŁUMACZENIa */}
            <Animated.Text entering={FadeInDown.duration(600)} style={[styles.title, { color: theme.text }]}>{t.title}</Animated.Text>

            {/* NAGŁÓWEK PROFILU: Avatar, Nazwa, Status */}
            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.profileHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>S</Text>
                </View>
                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: theme.text }]}>SZYMON</Text>
                    <Text style={[styles.profileSubtitle, { color: theme.text, opacity: 0.6 }]}>{t.beginner}</Text>
                </View>
            </Animated.View>

            {/* SEKCJA KONTO */}
            <Animated.Text entering={FadeInDown.delay(200)} style={[styles.sectionTitle, { color: theme.text }]}>{t.account}</Animated.Text>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={item.title}
                        onPress={handleMenuPress}
                        style={[
                            styles.menuItem,
                            // Ostatni element nie ma dolnego obramowania
                            index !== menuItems.length - 1 && { borderBottomWidth: 1.5, borderBottomColor: theme.border }
                        ]}
                    >
                        <View style={styles.menuItemIcon}>{item.icon}</View>
                        <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </Animated.View>

            {/* USTAWIENIA JĘZYKA */}
            <Animated.Text entering={FadeInDown.delay(400)} style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>
                {language === 'pl' ? 'JĘZYK' : 'LANGUAGE'}
            </Animated.Text>

            <Animated.View entering={FadeInDown.delay(500).duration(600)} style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <TouchableOpacity onPress={toggleLanguage} style={styles.menuItem}>
                    <Text style={[styles.menuItemText, { color: theme.text, flex: 1 }]}>{t.language}</Text>
                    <Text style={[styles.languageBadge, { color: theme.tint }]}>{language.toUpperCase()}</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* HISTORIA TRENINGÓW (DOWÓD POSTĘPÓW) */}
            <Animated.Text entering={FadeInDown.delay(600)} style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>
                {t.history}
            </Animated.Text>
            
            {sessions.length === 0 ? (
                <Animated.View entering={FadeInDown.delay(700)}>
                    <Text style={{ color: theme.icon, marginLeft: 16, marginBottom: 40, fontWeight: '600' }}>{t.emptyHistory}</Text>
                </Animated.View>
            ) : (
                <Animated.View entering={FadeInDown.delay(700)} style={{ marginBottom: 40 }}>
                    {/* Renderujemy historię odbytych treningów pobranych ze Store'a */}
                    {sessions.map((session) => {
                        const dateObj = new Date(session.startTime);
                        const dateString = `${dateObj.getDate()}.${dateObj.getMonth() + 1}.${dateObj.getFullYear()}`;
                        return (
                            <View key={session.id} style={[styles.sessionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <Text style={[styles.sessionDate, { color: theme.tint }]}>{dateString}</Text>
                                <Text style={[styles.sessionDetail, { color: theme.text }]}>
                                    {language === 'pl' ? 'Wykonanych ćwiczeń: ' : 'Exercises completed: '}{session.exercises.length}
                                </Text>
                            </View>
                        );
                    })}
                </Animated.View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        paddingTop: 60,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        marginBottom: 32,
        letterSpacing: -2,
        textTransform: 'uppercase',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 32,
        borderRadius: 32,
        borderWidth: 2,
        marginBottom: 40,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#3B82F6', // changed from yellow to blue accent
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#09090B',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
    },
    profileInfo: {
        marginLeft: 24,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
        letterSpacing: -1,
        textTransform: 'uppercase',
    },
    profileSubtitle: {
        fontSize: 16,
        fontWeight: '700',
        opacity: 0.7,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 20,
        marginLeft: 12,
        opacity: 0.6,
    },
    menuContainer: {
        borderRadius: 32,
        borderWidth: 2,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    menuItemIcon: {
        marginRight: 20,
    },
    menuItemText: {
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    // Dodane nowe style premium dla Modułu Historii
    languageBadge: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2
    },
    sessionCard: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 2,
        marginBottom: 16,
    },
    sessionDate: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    sessionDetail: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.8
    }
});
