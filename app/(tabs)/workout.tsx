// ============================================================
// EKRAN TRENINGU — Premium Glasmorphism Edition
// ============================================================
import { Colors, Spacing, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Check, Dumbbell, Plus, Timer, Trash2, Trophy, X, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Share } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutDown, Layout, SlideInRight, SlideInUp } from 'react-native-reanimated';
import { translations } from '@/constants/translations';
import { LinearGradient } from 'expo-linear-gradient';

export default function WorkoutScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const activeSession = useWorkoutStore((state) => state.activeSession);
    const plans = useWorkoutStore((state) => state.plans);
    const startSession = useWorkoutStore((state) => state.startSession);
    const finishSession = useWorkoutStore((state) => state.finishSession);
    const cancelSession = useWorkoutStore((state) => state.cancelSession);
    const exercises = useWorkoutStore((state) => state.exercises);
    const updateSet = useWorkoutStore((state) => state.updateSetInActiveSession);
    const addSet = useWorkoutStore((state) => state.addSetToActiveSession);
    const deleteSet = useWorkoutStore((state) => state.deleteSetFromActiveSession);
    const deleteExercise = useWorkoutStore((state) => state.deleteExerciseFromActiveSession);
    const saveSessionAsPlan = useWorkoutStore((state) => state.saveSessionAsPlan);
    const addXP = useWorkoutStore((state) => state.addXP);
    
    // Zmienne językowe
    const { language } = useWorkoutStore();
    const t = translations[language].workout;

    const [restTime, setRestTime] = useState<number | null>(null);
    const [showTimer, setShowTimer] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [saveAsTemplate, setSaveAsTemplate] = useState(false);
    const [templateName, setTemplateName] = useState('');

    useEffect(() => {
        let interval: any;
        if (showTimer && restTime !== null && restTime > 0) {
            interval = setInterval(() => setRestTime((prev) => (prev !== null ? prev - 1 : null)), 1000);
        } else if (restTime === 0) {
            setShowTimer(false);
            setRestTime(null);
            if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return () => clearInterval(interval);
    }, [showTimer, restTime]);

    const handleStartSession = (planId?: string) => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        startSession(planId);
    };

    const handleSetUpdate = (exerciseId: string, setId: string, updates: any) => {
        if ('completed' in updates && updates.completed) {
            if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setRestTime(90);
            setShowTimer(true);
        } else if (process.env.EXPO_OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        updateSet(exerciseId, setId, updates);
    };

    const handleAddSet = (exerciseId: string) => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        addSet(exerciseId);
    };

    const handleDeleteSet = (exerciseId: string, setId: string) => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        deleteSet(exerciseId, setId);
    };

    const handleDeleteExercise = (exerciseId: string) => {
        if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        deleteExercise(exerciseId);
    };

    const handleFinish = () => {
        if (!activeSession) return;
        const duration = Math.round((Date.now() - activeSession.startTime) / 60000);
        const volume = activeSession.exercises.reduce((acc, ex) => {
            return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.completed ? s.weight * s.reps : 0), 0);
        }, 0);
        const setsCount = activeSession.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0);
        
        // Obliczanie PD (XP): 10 XP za każde ukończone ćwiczenie + 2 XP za każdą serię + bonus za czas
        const xpGained = (activeSession.exercises.length * 10) + (setsCount * 2) + Math.min(duration, 60);

        setSummaryData({
            duration, volume,
            exercises: activeSession.exercises.length,
            sets: setsCount,
            xpGained
        });
        if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowSummary(true);
    };

    const handleShare = async () => {
        if (!summaryData) return;
        const message = `Właśnie ukończyłem trening w aplikacji FORGE! 🏋️‍♂️\n` +
                        `🔥 Objętość: ${summaryData.volume}kg\n` +
                        `⏱ Czas: ${summaryData.duration} min\n` +
                        `✨ Zdobyte PD: ${summaryData.xpGained}\n` +
                        `Dołącz do mnie! 💪`;
        try {
            await Share.share({ message });
        } catch (error) {
            console.log(error);
        }
    };

    const confirmFinish = () => {
        if (saveAsTemplate && templateName.trim()) {
            saveSessionAsPlan(templateName.trim());
        }
        if (summaryData?.xpGained) {
            addXP(summaryData.xpGained);
        }
        finishSession();
        setShowSummary(false);
        setSaveAsTemplate(false);
        setTemplateName('');
        router.push('/');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Kalkulator Estymowanego 1RM (Epley formula)
    const getEstimated1RM = (weight: number, reps: number) => {
        if (!weight || !reps) return 0;
        if (reps === 1) return weight;
        return Math.round(weight * (1 + reps / 30));
    };

    if (!activeSession) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>{t.title}</Text>
                
                <Animated.View entering={FadeInDown.duration(400).springify()}>
                    <TouchableOpacity activeOpacity={0.9} onPress={() => handleStartSession()}>
                        <LinearGradient colors={[theme.tint, theme.tint + 'CC']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={[styles.startCard, { shadowColor: theme.tint }]}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.startTitle}>{t.startEmpty}</Text>
                                <Text style={styles.startSubtitle}>{t.fastStart}</Text>
                            </View>
                            <View style={styles.playBtn}>
                                <Play fill="#fff" size={24} color="#fff" style={{marginLeft: 4}} />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                <Animated.Text entering={FadeInDown.delay(200)} style={[styles.subtitle, { color: theme.text, marginTop: 40 }]}>{t.myTemplates}</Animated.Text>
                
                {plans.length === 0 ? (
                    <Animated.View entering={FadeInDown.delay(300)} style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Dumbbell size={32} color={theme.icon} style={{ marginBottom: 16 }} />
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>{t.noTemplates}</Text>
                        <Text style={[styles.emptySubtitle, { color: theme.icon }]}>{t.createFirst}</Text>
                    </Animated.View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {plans.map((plan, index) => (
                            <Animated.View key={plan.id} entering={FadeInDown.delay(300 + index * 100)}>
                                <TouchableOpacity 
                                    style={[styles.planCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                                    onPress={() => handleStartSession(plan.id)}
                                >
                                    <View>
                                        <Text style={[styles.planName, { color: theme.text }]}>{plan.name}</Text>
                                        <Text style={[styles.planInfo, { color: theme.icon }]}>{plan.exercises.length} ćwiczeń</Text>
                                    </View>
                                    <Play fill={theme.tint} size={20} color={theme.tint} />
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: 0 }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.activeTitle, { color: theme.text }]}>{t.activeWorkout}</Text>
                <TouchableOpacity onPress={handleFinish} activeOpacity={0.8}>
                    <LinearGradient colors={[theme.tint, theme.tint + 'CC']} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.finishButton}>
                        <Text style={styles.finishText}>{t.finish}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {activeSession.exercises.map((workoutEx, index) => {
                    const exerciseDef = exercises.find((e) => e.id === workoutEx.exerciseId);
                    if (!exerciseDef) return null;

                    return (
                        <Animated.View
                            key={workoutEx.id}
                            layout={Layout.springify()}
                            entering={FadeIn.delay(index * 100)}
                            style={[styles.exerciseBlock, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }]}
                        >
                            <View style={styles.exerciseHeader}>
                                <Text style={[styles.exerciseName, { color: theme.tint }]}>{exerciseDef.name}</Text>
                                <TouchableOpacity onPress={() => handleDeleteExercise(workoutEx.id)}>
                                    <Trash2 size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableLabel, { color: theme.icon, width: 40 }]}>{t.set}</Text>
                                <Text style={[styles.tableLabel, { color: theme.icon, flex: 1, textAlign: 'center' }]}>kg</Text>
                                <Text style={[styles.tableLabel, { color: theme.icon, flex: 1, textAlign: 'center' }]}>{t.reps}</Text>
                                <View style={{ width: 48 }} />
                            </View>

                            {workoutEx.sets.map((set, setIndex) => (
                                <Animated.View key={set.id} layout={Layout.springify()} entering={SlideInRight.duration(300)} style={[styles.setRow, set.completed && { backgroundColor: 'rgba(0,0,0,0.02)' }]}>
                                    <Text style={[styles.setNumber, { color: theme.text }]}>{setIndex + 1}</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={[styles.input, { color: theme.text }]}
                                            keyboardType="numeric"
                                            value={set.weight ? set.weight.toString() : ''}
                                            placeholder="-"
                                            placeholderTextColor={theme.icon}
                                            onChangeText={(val) => handleSetUpdate(workoutEx.id, set.id, { weight: parseFloat(val) || 0 })}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={[styles.input, { color: theme.text }]}
                                            keyboardType="numeric"
                                            value={set.reps ? set.reps.toString() : ''}
                                            placeholder="-"
                                            placeholderTextColor={theme.icon}
                                            onChangeText={(val) => handleSetUpdate(workoutEx.id, set.id, { reps: parseInt(val, 10) || 0 })}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.checkButton, { backgroundColor: set.completed ? theme.tint : theme.background, borderColor: set.completed ? theme.tint : theme.border }]}
                                        onPress={() => handleSetUpdate(workoutEx.id, set.id, { completed: !set.completed })}
                                    >
                                        <Check size={20} color={set.completed ? '#FFFFFF' : theme.icon} strokeWidth={2.5} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteSetButton} onPress={() => handleDeleteSet(workoutEx.id, set.id)}>
                                        <Trash2 size={18} color="#EF4444" opacity={0.6} />
                                    </TouchableOpacity>

                                    {/* Estymacja 1RM podserią */}
                                    {set.reps > 1 && set.weight > 0 && (
                                        <View style={styles.oneRMBadge}>
                                            <Text style={styles.oneRMText}>1RM: {getEstimated1RM(set.weight, set.reps)}kg</Text>
                                        </View>
                                    )}
                                </Animated.View>
                            ))}

                            <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(workoutEx.id)}>
                                <Plus size={20} color={theme.tint} style={{ marginRight: 8 }} />
                                <Text style={[styles.addSetText, { color: theme.tint }]}>{t.addSet}</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}

                <TouchableOpacity style={[styles.addExerciseCard, { borderColor: theme.tint, backgroundColor: 'transparent' }]} onPress={() => router.push('/exercise-select')}>
                    <Plus size={24} color={theme.tint} style={{ marginRight: 8 }} />
                    <Text style={[styles.addExerciseText, { color: theme.tint }]}>{t.addExercise}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => { if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); cancelSession(); }}>
                    <Text style={styles.cancelText}>{t.cancelWorkout}</Text>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            {showTimer && restTime !== null && (
                <Animated.View entering={FadeInDown.duration(400)} exiting={FadeOutDown.duration(400)} style={[styles.timerOverlay, { backgroundColor: theme.tint }]}>
                    <View style={styles.timerContent}>
                        <View style={styles.timerTextContainer}>
                            <Timer size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.timerLabel}>{t.rest}</Text>
                            <Text style={[styles.timerValue, { color: "#FFFFFF" }]}>{formatTime(restTime)}</Text>
                        </View>
                        <View style={styles.timerActions}>
                            <TouchableOpacity style={[styles.timerPill, { backgroundColor: 'rgba(0,0,0,0.1)' }]} onPress={() => setRestTime(prev => (prev || 0) + 30)}>
                                <Text style={[styles.timerPillText, { color: "#FFFFFF" }]}>+30s</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.timerPill, { backgroundColor: "rgba(255,255,255,0.2)" }]} onPress={() => setShowTimer(false)}>
                                <X size={18} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            )}

            <Modal visible={showSummary} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View entering={SlideInUp} style={[styles.summaryModal, { backgroundColor: theme.card, borderColor: '#1c1c26' }]}>
                        <Trophy color={theme.tint} size={64} style={{ marginBottom: 20 }} />
                        <Text style={[styles.summaryTitle, { color: theme.text }]}>{t.workoutDone}</Text>
                        <Text style={[styles.summarySubtitle, { color: theme.text }]}>{t.goodJob}</Text>

                        <View style={styles.summaryStats}>
                            <View style={styles.summaryStatItem}>
                                <Text style={[styles.statValueSmall, { color: theme.tint }]}>{summaryData?.duration}</Text>
                                <Text style={[styles.statLabelSmall, { color: theme.text }]}>{t.time}</Text>
                            </View>
                            <View style={styles.summaryStatItem}>
                                <Text style={[styles.statValueSmall, { color: theme.tint }]}>{summaryData?.volume}</Text>
                                <Text style={[styles.statLabelSmall, { color: theme.text }]}>{t.volume}</Text>
                            </View>
                            <View style={styles.summaryStatItem}>
                                <Text style={[styles.statValueSmall, { color: theme.tint }]}>{summaryData?.sets}</Text>
                                <Text style={[styles.statLabelSmall, { color: theme.text }]}>{t.sets}</Text>
                            </View>
                        </View>

                        {/* DODATEK: PRZYCISK UDOSTĘPNIANIA */}
                        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                            <Play size={16} color={theme.tint} />
                            <Text style={[styles.shareText, { color: theme.tint }]}>UDOSTĘPNIJ WYNIK</Text>
                        </TouchableOpacity>

                        {/* DODATEK: PD (XP) */}
                        <View style={styles.xpResult}>
                            <Trophy color="#F59E0B" size={20} />
                            <Text style={[styles.xpText, { color: theme.text }]}>{t.xpEarned} +{summaryData?.xpGained} PD</Text>
                        </View>

                        {/* DODATEK: ZAPISZ JAKO SZABLON */}
                        <View style={[styles.saveTemplateSection, { borderTopColor: theme.border }]}>
                             <TouchableOpacity 
                                style={styles.checkboxRow} 
                                onPress={() => setSaveAsTemplate(!saveAsTemplate)}
                             >
                                <View style={[styles.checkbox, { borderColor: theme.tint, backgroundColor: saveAsTemplate ? theme.tint : 'transparent' }]}>
                                    {saveAsTemplate && <Check size={14} color="#fff" />}
                                </View>
                                <Text style={[styles.saveTemplateText, { color: theme.text }]}>{t.saveAsTemplate}</Text>
                             </TouchableOpacity>

                             {saveAsTemplate && (
                                <TextInput 
                                    style={[styles.templateInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                                    placeholder={t.templateName}
                                    placeholderTextColor={theme.icon}
                                    value={templateName}
                                    onChangeText={setTemplateName}
                                />
                             )}
                        </View>

                        <TouchableOpacity activeOpacity={0.8} style={{width: '100%'}} onPress={confirmFinish}>
                            <LinearGradient colors={[theme.tint, theme.tint + 'CC']} start={{x:0, y:0}} end={{x:1, y:1}} style={[styles.confirmButton, { shadowColor: theme.tint }]}>
                                <Text style={styles.confirmButtonText}>{t.saveExit}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, paddingTop: 60 },
    title: { fontSize: 34, fontWeight: '900', marginBottom: 20, letterSpacing: -1, textAlign: 'center' },
    subtitle: { fontSize: 13, fontWeight: '800', marginBottom: 16, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' },
    startCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.xl, borderRadius: Radius.xl, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
    startTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', marginBottom: 6, letterSpacing: -1 },
    startSubtitle: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
    playBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
    emptyState: { padding: 32, borderRadius: 32, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed' },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginBottom: 4, letterSpacing: -0.5 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 12, borderBottomWidth: 1 },
    activeTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
    finishButton: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.lg },
    finishText: { color: '#FFFFFF', fontWeight: '900', fontSize: 15 },
    scrollContent: { flex: 1 },
    exerciseBlock: { marginTop: Spacing.md, paddingVertical: Spacing.lg, borderRadius: Radius.xl, marginHorizontal: Spacing.md, borderWidth: 1 },
    exerciseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 },
    exerciseName: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
    tableHeader: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 8 },
    tableLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, opacity: 0.5 },
    setRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
    setNumber: { width: 30, fontSize: 15, fontWeight: '700', opacity: 0.7 },
    inputContainer: { flex: 1, marginHorizontal: 6, borderRadius: 14, height: 44, justifyContent: 'center', backgroundColor: 'rgba(128,128,128,0.1)' },
    input: { textAlign: 'center', fontSize: 16, fontWeight: '800', height: '100%' },
    checkButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 8, borderWidth: 1 },
    deleteSetButton: { padding: 8, marginLeft: 4 },
    addSetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginTop: 8 },
    addSetText: { fontSize: 15, fontWeight: '800' },
    addExerciseCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 20, paddingVertical: 20, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed' },
    addExerciseText: { fontSize: 16, fontWeight: '800' },
    cancelButton: { marginTop: 32, alignItems: 'center', paddingVertical: 16 },
    cancelText: { color: '#EF4444', fontSize: 15, fontWeight: '800' },
    timerOverlay: { position: 'absolute', alignSelf: 'center', bottom: 100, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    timerContent: { flexDirection: 'row', alignItems: 'center' },
    timerTextContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    timerLabel: { fontSize: 13, fontWeight: '800', marginRight: 6, color: '#FFFFFF' },
    timerValue: { fontSize: 18, fontWeight: '900', fontVariant: ['tabular-nums'] },
    timerActions: { flexDirection: 'row', alignItems: 'center' },
    timerPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, marginLeft: 8 },
    timerPillText: { fontSize: 13, fontWeight: '800' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
    summaryModal: { width: '100%', borderRadius: Radius.xl, borderWidth: 1, padding: Spacing.xl, alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 30 },
    summaryTitle: { fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 8, letterSpacing: -1.5 },
    summarySubtitle: { fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.7)', marginBottom: 32 },
    summaryStats: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 32, backgroundColor: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 24 },
    summaryStatItem: { alignItems: 'center', flex: 1 },
    statValueSmall: { fontSize: 28, fontWeight: '900', marginBottom: 4 },
    statLabelSmall: { fontSize: 11, fontWeight: '800', opacity: 0.6, textTransform: 'uppercase' },
    confirmButton: { width: '100%', paddingVertical: Spacing.lg, borderRadius: Radius.xl, alignItems: 'center', shadowOpacity: 0.4, shadowRadius: 20 },
    confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
    
    // NOWE STYLE DLA SZABLONÓW I XP
    planCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 12 },
    planName: { fontSize: 18, fontWeight: '900', marginBottom: 4 },
    planInfo: { fontSize: 13, fontWeight: '600' },
    xpResult: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 8 },
    xpText: { fontSize: 18, fontWeight: '900' },
    saveTemplateSection: { width: '100%', borderTopWidth: 1, paddingTop: 20, marginBottom: 24 },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
    saveTemplateText: { fontSize: 15, fontWeight: '700' },
    templateInput: { width: '100%', height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 15, fontWeight: '600' },
    oneRMBadge: { position: 'absolute', right: 80, bottom: -2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.05)' },
    oneRMText: { fontSize: 9, fontWeight: '800', opacity: 0.5 },
    shareButton: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
    shareText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 }
});
