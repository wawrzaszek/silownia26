import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { Bell, Settings, UserCircle, LogOut, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Switch, KeyboardAvoidingView, Platform, Modal, Share, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useWorkoutStore } from '@/store/workoutStore';
import { translations } from '@/constants/translations';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // Pobieramy dane ze store'a
    const { language, setLanguage, sessions, userProfile, loginUser, logoutUser, xp, level, achievements } = useWorkoutStore();
    const t = translations[language].profile;

    const [nickname, setNickname] = useState('');
    const [pushEnabled, setPushEnabled] = useState(false);

    // --- Preferencje ---
    const { preferences, setPreferences } = useWorkoutStore();
    const [isPrefsVisible, setIsPrefsVisible] = useState(false);
    const [tempRest, setTempRest] = useState(preferences.defaultRestTime.toString());
    const [tempGoal, setTempGoal] = useState(preferences.weeklyWorkoutGoal.toString());
    const [tempUnit, setTempUnit] = useState(preferences.weightUnit);
    const [tempTimer, setTempTimer] = useState(preferences.showTimer);

    // --- Import / Export ---
    const [isImportVisible, setIsImportVisible] = useState(false);
    const [importData, setImportData] = useState('');

    const handleExportData = async () => {
        try {
            const state = useWorkoutStore.getState();
            const stateToExport = {
                exercises: state.exercises,
                plans: state.plans,
                sessions: state.sessions,
                nutritionHistory: state.nutritionHistory,
                personalRecords: state.personalRecords,
                weightHistory: state.weightHistory,
                achievements: state.achievements,
                streak: state.streak,
                xp: state.xp,
                level: state.level,
                preferences: state.preferences,
                nutritionGoals: state.nutritionGoals,
                hasCompletedOnboarding: state.hasCompletedOnboarding,
                userGoal: state.userGoal,
            };
            const jsonString = JSON.stringify(stateToExport);
            await Share.share({
                message: jsonString,
                title: 'Forge Workout Backup',
            });
            if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    const handleImportData = () => {
        try {
            if (!importData.trim()) return;
            const parsed = JSON.parse(importData);
            
            if (parsed && typeof parsed === 'object') {
                useWorkoutStore.setState(parsed);
                Alert.alert("Sukces", t.importSuccess);
                setIsImportVisible(false);
                setImportData('');
                if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } else {
                throw new Error("Invalid format");
            }
        } catch (error) {
            Alert.alert("Błąd", t.importError);
            if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

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

    const openPrefs = () => {
        setTempRest(preferences.defaultRestTime.toString());
        setTempGoal(preferences.weeklyWorkoutGoal.toString());
        setTempUnit(preferences.weightUnit);
        setTempTimer(preferences.showTimer);
        setIsPrefsVisible(true);
        triggerMenuHaptic();
    };

    const savePrefs = () => {
        setPreferences({
            defaultRestTime: parseInt(tempRest) || 90,
            weeklyWorkoutGoal: parseInt(tempGoal) || 3,
            weightUnit: tempUnit,
            showTimer: tempTimer,
        });
        setIsPrefsVisible(false);
        if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
                    <View style={styles.levelBadge}>
                        <Trophy size={14} color="#F59E0B" />
                        <Text style={[styles.levelText, { color: '#F59E0B' }]}>LEVEL {level}</Text>
                    </View>
                </View>
            </Animated.View>

            {/* PASEK POSTĘPU XP */}
            <Animated.View entering={FadeInDown.delay(150)} style={styles.xpContainer}>
                <View style={styles.xpHeader}>
                    <Text style={[styles.xpLabel, { color: theme.text }]}>PROGRES DO LEVELU {level + 1}</Text>
                    <Text style={[styles.xpValue, { color: theme.tint }]}>{xp} / {level * 1000} PD</Text>
                </View>
                <View style={[styles.xpBarBackground, { backgroundColor: theme.border }]}>
                    <View style={[styles.xpBarFill, { backgroundColor: theme.tint, width: `${(xp / (level * 1000)) * 100}%` }]} />
                </View>
            </Animated.View>

            {/* SEKCJA KONTO */}
            <Animated.Text entering={FadeInDown.delay(200)} style={[styles.sectionTitle, { color: theme.text }]}>{t.account}</Animated.Text>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={[styles.menuContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                
                {/* 1. Preferencje -> Otwiera Modal Edycji */}
                <TouchableOpacity onPress={openPrefs} style={[styles.menuItem, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
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

            {/* SEKCJA OSIĄGNIĘĆ */}
            <Animated.Text entering={FadeInDown.delay(400)} style={[styles.sectionTitle, { color: theme.text }]}>OSIĄGNIĘCIA</Animated.Text>
            
            <Animated.View entering={FadeInDown.delay(500)} style={styles.achievementsContainer}>
                {achievements.length === 0 ? (
                    <View style={[styles.emptyAchievements, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Trophy size={24} color={theme.icon} />
                        <Text style={{ color: theme.icon, marginTop: 10, fontWeight: '600' }}>Jeszcze nic nie odblokowano.</Text>
                    </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                        {achievements.map((ach) => (
                            <View key={ach.id} style={[styles.achievementCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                                <Trophy size={24} color={theme.tint} />
                                <Text style={[styles.achievementTitle, { color: theme.text }]}>{ach.title}</Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
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

            {/* MODAL PREFERENCJI */}
            <Modal visible={isPrefsVisible} animationType="slide" transparent>
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', alignItems: 'center' }}>
                        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>{t.prefTitle}</Text>
                            
                            {/* Czas odpoczynku */}
                            <View style={styles.prefRow}>
                                <Text style={[styles.prefLabel, { color: theme.text }]}>{t.prefRest}</Text>
                                <TextInput 
                                    style={[styles.prefInput, { color: theme.tint, backgroundColor: theme.background, borderColor: theme.border }]}
                                    keyboardType="numeric"
                                    value={tempRest}
                                    onChangeText={setTempRest}
                                />
                            </View>

                            {/* Cel tygodniowy */}
                            <View style={styles.prefRow}>
                                <Text style={[styles.prefLabel, { color: theme.text }]}>{t.prefGoal}</Text>
                                <TextInput 
                                    style={[styles.prefInput, { color: theme.tint, backgroundColor: theme.background, borderColor: theme.border }]}
                                    keyboardType="numeric"
                                    value={tempGoal}
                                    onChangeText={setTempGoal}
                                />
                            </View>

                            {/* Jednostka wagi */}
                            <View style={styles.prefRow}>
                                <Text style={[styles.prefLabel, { color: theme.text }]}>{t.prefUnit}</Text>
                                <View style={styles.unitContainer}>
                                    {['kg', 'lbs'].map((u) => (
                                        <TouchableOpacity 
                                            key={u} 
                                            onPress={() => setTempUnit(u as any)}
                                            style={[styles.unitButton, { backgroundColor: tempUnit === u ? theme.tint : theme.border }]}
                                        >
                                            <Text style={[styles.unitText, { color: tempUnit === u ? '#fff' : theme.icon }]}>{u}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Stoper w treningu */}
                            <View style={styles.prefRow}>
                                <Text style={[styles.prefLabel, { color: theme.text }]}>{t.prefTimer}</Text>
                                <Switch 
                                    value={tempTimer} 
                                    onValueChange={setTempTimer} 
                                    trackColor={{ false: theme.border, true: theme.tint }}
                                />
                            </View>

                            <View style={[styles.prefRow, { justifyContent: 'center', gap: 12, marginTop: 10 }]}>
                                <TouchableOpacity onPress={handleExportData} style={[styles.unitButton, { backgroundColor: theme.card, borderColor: theme.tint, borderWidth: 1 }]}>
                                    <Text style={[styles.unitText, { color: theme.tint }]}>{t.exportProgress}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsImportVisible(true)} style={[styles.unitButton, { backgroundColor: theme.card, borderColor: theme.tint, borderWidth: 1 }]}>
                                    <Text style={[styles.unitText, { color: theme.tint }]}>{t.importProgress}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={() => setIsPrefsVisible(false)} style={[styles.modalButton, { backgroundColor: theme.border }]}>
                                    <Text style={[styles.modalButtonText, { color: theme.text }]}>ANULUJ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={savePrefs} style={[styles.modalButton, { backgroundColor: theme.tint }]}>
                                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>{t.prefSave}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* MODAL IMPORTU */}
            <Modal visible={isImportVisible} animationType="fade" transparent>
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', alignItems: 'center' }}>
                        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>{t.importPromptTitle}</Text>
                            <Text style={{ color: theme.icon, textAlign: 'center', marginBottom: 20 }}>{t.importPromptMsg}</Text>
                            
                            <TextInput 
                                style={[styles.prefInput, { width: '100%', height: 120, textAlign: 'left', textAlignVertical: 'top', padding: 12, marginBottom: 20, color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
                                multiline
                                placeholder={t.pasteCode}
                                placeholderTextColor={theme.icon}
                                value={importData}
                                onChangeText={setImportData}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity onPress={() => setIsImportVisible(false)} style={[styles.modalButton, { backgroundColor: theme.border }]}>
                                    <Text style={[styles.modalButtonText, { color: theme.text }]}>{t.cancel}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleImportData} style={[styles.modalButton, { backgroundColor: theme.tint }]}>
                                    <Text style={[styles.modalButtonText, { color: '#fff' }]}>{t.importBtn}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

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
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    prefRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    prefLabel: {
        fontSize: 16,
        fontWeight: '700',
    },
    prefInput: {
        width: 80,
        height: 44,
        borderRadius: Radius.md,
        borderWidth: 1,
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
    },
    unitContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    unitButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Radius.md,
    },
    unitText: {
        fontWeight: '800',
        fontSize: 14,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    modalButton: {
        flex: 1,
        height: 54,
        borderRadius: Radius.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '900',
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
    },
    // STYLE DLA GAMIFIKACJI
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    xpContainer: {
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.md,
    },
    xpHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    xpLabel: {
        fontSize: 12,
        fontWeight: '800',
        opacity: 0.6,
    },
    xpValue: {
        fontSize: 12,
        fontWeight: '900',
    },
    xpBarBackground: {
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    xpBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    // STYLE DLA OSIĄGNIĘĆ
    achievementsContainer: {
        paddingHorizontal: Spacing.md,
        marginBottom: Spacing.xl,
    },
    emptyAchievements: {
        padding: 30,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
    },
    achievementCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        minWidth: 120,
    },
    achievementTitle: {
        fontSize: 12,
        fontWeight: '900',
        marginTop: 10,
        textAlign: 'center',
    }
});
