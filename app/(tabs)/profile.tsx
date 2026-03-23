import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { Bell, Settings, UserCircle, LogOut } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useWorkoutStore } from '@/store/workoutStore';
import { translations } from '@/constants/translations';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // Pobieramy dane ze store'a
    const { language, setLanguage, sessions, userProfile, loginUser, logoutUser } = useWorkoutStore();
    const t = translations[language].profile;

    const [nickname, setNickname] = useState('');
    const [pushEnabled, setPushEnabled] = useState(false);

    // Rejestracja
    const handleLogin = () => {
        if (!nickname.trim()) return;
        if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        loginUser({ name: nickname.trim() }, '', '');
    };

    const handleLogout = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        logoutUser();
    };

    const toggleLanguage = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.selectionAsync();
        setLanguage(language === 'pl' ? 'en' : 'pl');
    };

    const triggerMenuHaptic = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // ===================================
    // WIDOK REJESTRACJI (Gość / Niezalogowany)
    // ===================================
    if (!userProfile) {
        return (
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: theme.background }}>
                <View style={styles.loginContainer}>
                    <Animated.Text entering={FadeInDown.duration(600)} style={[styles.loginHero, { color: theme.text }]}>
                        {t.loginTitle}
                    </Animated.Text>
                    <Animated.Text entering={FadeInDown.delay(100)} style={[styles.loginSub, { color: theme.icon }]}>
                        {t.loginSubtitle}
                    </Animated.Text>

                    <Animated.View entering={FadeInDown.delay(200)} style={{ width: '100%', marginTop: 40, marginBottom: 20 }}>
                        <TextInput 
                            style={[styles.loginInput, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                            placeholder="..."
                            placeholderTextColor={theme.icon}
                            value={nickname}
                            onChangeText={setNickname}
                            autoCorrect={false}
                            maxLength={15}
                        />
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300)} style={{ width: '100%' }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={handleLogin} disabled={!nickname.trim()}>
                            <LinearGradient 
                                colors={nickname.trim() ? [theme.tint, theme.tint + 'CC'] : [theme.border, theme.card]} 
                                start={{x:0, y:0}} end={{x:1, y:1}} 
                                style={[styles.loginButton, { opacity: nickname.trim() ? 1 : 0.5, shadowColor: theme.tint }]}
                            >
                                <Text style={styles.loginButtonText}>{t.loginButton}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        );
    }

    // ===================================
    // WIDOK ZALOGOWANEGO UŻYTKOWNIKA
    // ===================================
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
            {/* TYTUŁ EKRANU */}
            <Animated.Text entering={FadeInDown.duration(600)} style={[styles.title, { color: theme.text }]}>{t.title}</Animated.Text>

            {/* NAGŁÓWEK PROFILU */}
            <Animated.View entering={FadeInDown.delay(100).duration(600)} style={[styles.profileHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.tint }]}>
                    <UserCircle size={40} color="#FFFFFF" />
                </View>
                <View style={styles.profileInfo}>
                    <Text style={[styles.profileName, { color: theme.text }]}>{userProfile.name.toUpperCase()}</Text>
                    <Text style={[styles.profileSubtitle, { color: theme.tint }]}>{t.status}</Text>
                </View>
            </Animated.View>

            {/* SEKCJA KONTO */}
            <Animated.Text entering={FadeInDown.delay(200)} style={[styles.sectionTitle, { color: theme.text }]}>{t.account}</Animated.Text>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                
                {/* 1. Preferencje -> nic jeszcze nie robi (Placeholder UI) */}
                <TouchableOpacity onPress={triggerMenuHaptic} style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
                    <View style={styles.menuIconContainer}>
                        <Settings size={24} color={theme.icon} />
                    </View>
                    <Text style={[styles.menuItemText, { color: theme.text }]}>{t.preferences}</Text>
                </TouchableOpacity>

                {/* 2. Powiadomienia -> Funkcjonalny Toggle */}
                <View style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: theme.border, paddingVertical: 12 }]}>
                    <View style={styles.menuIconContainer}>
                        <Bell size={24} color={theme.icon} />
                    </View>
                    <Text style={[styles.menuItemText, { color: theme.text, flex: 1 }]}>{t.pushNotifications}</Text>
                    <Switch 
                        value={pushEnabled} 
                        onValueChange={(val) => {
                            if (Platform.OS === 'ios') Haptics.selectionAsync();
                            setPushEnabled(val);
                        }} 
                        trackColor={{ false: theme.border, true: theme.tint }}
                    />
                </View>

                {/* 3. Wyloguj Się -> Funkcjonalny Logout */}
                <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
                    <View style={styles.menuIconContainer}>
                        <LogOut size={24} color={theme.notification} />
                    </View>
                    <Text style={[styles.menuItemText, { color: theme.notification }]}>{t.logout}</Text>
                </TouchableOpacity>
                
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

            {/* HISTORIA TRENINGÓW */}
            <Animated.Text entering={FadeInDown.delay(600)} style={[styles.sectionTitle, { color: theme.text, marginTop: 32 }]}>
                {t.history}
            </Animated.Text>
            
            {sessions.length === 0 ? (
                <Animated.View entering={FadeInDown.delay(700)}>
                    <Text style={{ color: theme.icon, marginLeft: 16, marginBottom: 40, fontWeight: '600' }}>{t.emptyHistory}</Text>
                </Animated.View>
            ) : (
                <Animated.View entering={FadeInDown.delay(700)} style={{ marginBottom: 40 }}>
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
        padding: Spacing.lg,
        paddingTop: 60,
    },
    // Login Screen styles
    loginContainer: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginHero: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: -1,
    },
    loginSub: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    loginInput: {
        height: 64,
        borderWidth: 1,
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.lg,
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center'
    },
    loginButton: {
        height: 64,
        borderRadius: Radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '900',
    },

    // Profile Screen styles
    title: {
        fontSize: 34,
        fontWeight: '900',
        marginBottom: 24,
        letterSpacing: -1,
        textAlign: 'center',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
        borderRadius: Radius.xl,
        borderWidth: 1,
        marginBottom: Spacing.xl,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
    },
    profileSubtitle: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        marginLeft: Spacing.md,
        marginBottom: Spacing.sm,
        opacity: 0.5,
        letterSpacing: 1,
    },
    menuContainer: {
        borderRadius: Radius.xl,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: Spacing.xl,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    menuIconContainer: {
        marginRight: 16,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '800',
    },
    languageBadge: {
        fontSize: 16,
        fontWeight: '900',
    },
    sessionCard: {
        padding: Spacing.lg,
        borderRadius: Radius.xl,
        borderWidth: 2,
        marginBottom: Spacing.md,
    },
    sessionDate: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 6,
    },
    sessionDetail: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.8
    }
});
