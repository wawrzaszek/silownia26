import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Check, Dumbbell, Plus, Timer, Trophy, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutDown, Layout, SlideInRight, SlideInUp } from 'react-native-reanimated';

export default function WorkoutScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    const activeSession = useWorkoutStore((state) => state.activeSession);
    const startSession = useWorkoutStore((state) => state.startSession);
    const finishSession = useWorkoutStore((state) => state.finishSession);
    const cancelSession = useWorkoutStore((state) => state.cancelSession);
    const exercises = useWorkoutStore((state) => state.exercises);
    const updateSet = useWorkoutStore((state) => state.updateSetInActiveSession);
    const addSet = useWorkoutStore((state) => state.addSetToActiveSession);

    // Rest Timer State
    const [restTime, setRestTime] = useState<number | null>(null);
    const [showTimer, setShowTimer] = useState(false);

    // Summary State
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);

    useEffect(() => {
        let interval: any;
        if (showTimer && restTime !== null && restTime > 0) {
            interval = setInterval(() => {
                setRestTime((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (restTime === 0) {
            setShowTimer(false);
            setRestTime(null);
            if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        return () => clearInterval(interval);
    }, [showTimer, restTime]);

    const handleStartSession = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        startSession();
    };

    const handleSetUpdate = (exerciseId: string, setId: string, updates: any) => {
        if ('completed' in updates && updates.completed) {
            if (process.env.EXPO_OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            // Start rest timer
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

    const handleFinish = () => {
        if (!activeSession) return;

        const duration = Math.round((Date.now() - activeSession.startTime) / 60000);
        const volume = activeSession.exercises.reduce((acc, ex) => {
            return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.completed ? s.weight * s.reps : 0), 0);
        }, 0);

        setSummaryData({
            duration,
            volume,
            exercises: activeSession.exercises.length,
            sets: activeSession.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)
        });

        if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowSummary(true);
    };

    const confirmFinish = () => {
        finishSession();
        setShowSummary(false);
        router.push('/');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!activeSession) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>Trening</Text>

                <TouchableOpacity
                    style={[styles.startCard, { backgroundColor: theme.tint, borderColor: theme.tint }]}
                    onPress={handleStartSession}
                    activeOpacity={0.8}
                >
                    <Text style={styles.startTitle}>Rozpocznij pusty trening</Text>
                    <Text style={styles.startSubtitle}>Szybki start bez planu</Text>
                </TouchableOpacity>

                <Text style={[styles.subtitle, { color: theme.text, marginTop: 40 }]}>Moje szablony</Text>
                <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Dumbbell size={32} color={theme.icon} style={{ marginBottom: 16 }} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>Brak szablonów</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.icon }]}>Stwórz swój pierwszy plan treningowy.</Text>
                </View>
            </View>
        );
    }

    // ACTIVE SESSION UI
    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: 0 }]}>
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.activeTitle, { color: theme.text }]}>Trwa trening</Text>
                <TouchableOpacity
                    style={[styles.finishButton, { backgroundColor: theme.tint }]}
                    onPress={handleFinish}
                >
                    <Text style={styles.finishText}>Zakończ</Text>
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
                            style={[styles.exerciseBlock, { backgroundColor: theme.card, borderColor: theme.border }]}
                        >
                            <View style={styles.exerciseHeader}>
                                <Text style={[styles.exerciseName, { color: theme.tint }]}>{exerciseDef.name}</Text>
                            </View>

                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableLabel, { color: theme.icon, width: 40 }]}>Seria</Text>
                                <Text style={[styles.tableLabel, { color: theme.icon, flex: 1, textAlign: 'center' }]}>kg</Text>
                                <Text style={[styles.tableLabel, { color: theme.icon, flex: 1, textAlign: 'center' }]}>Powt.</Text>
                                <View style={{ width: 48 }} />
                            </View>

                            {workoutEx.sets.map((set, setIndex) => (
                                <Animated.View
                                    key={set.id}
                                    layout={Layout.springify()}
                                    entering={SlideInRight.duration(300)}
                                    style={[styles.setRow, set.completed && { backgroundColor: 'rgba(0,0,0,0.02)' }]}
                                >
                                    <Text style={[styles.setNumber, { color: theme.text }]}>{setIndex + 1}</Text>

                                    <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                                        <TextInput
                                            style={[styles.input, { color: theme.text }]}
                                            keyboardType="numeric"
                                            value={set.weight ? set.weight.toString() : ''}
                                            placeholder="-"
                                            placeholderTextColor={theme.icon}
                                            onChangeText={(val) => handleSetUpdate(workoutEx.id, set.id, { weight: parseFloat(val) || 0 })}
                                        />
                                    </View>

                                    <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
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
                                        style={[
                                            styles.checkButton,
                                            { backgroundColor: set.completed ? '#10B981' : theme.background, borderColor: set.completed ? '#10B981' : theme.border }
                                        ]}
                                        onPress={() => handleSetUpdate(workoutEx.id, set.id, { completed: !set.completed })}
                                    >
                                        <Check size={20} color={set.completed ? '#09090B' : theme.icon} strokeWidth={3} />
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}

                            <TouchableOpacity
                                style={styles.addSetButton}
                                onPress={() => handleAddSet(workoutEx.id)}
                            >
                                <Plus size={20} color={theme.tint} style={{ marginRight: 8 }} />
                                <Text style={[styles.addSetText, { color: theme.tint }]}>Dodaj serię</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}

                <TouchableOpacity
                    style={[styles.addExerciseCard, { borderColor: theme.tint }]}
                    onPress={() => router.push('/exercise-select')}
                >
                    <Plus size={24} color={theme.tint} style={{ marginRight: 8 }} />
                    <Text style={[styles.addExerciseText, { color: theme.tint }]}>Dodaj ćwiczenie</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        cancelSession();
                    }}
                >
                    <Text style={styles.cancelText}>Anuluj trening</Text>
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* REST TIMER COMPONENT */}
            {showTimer && restTime !== null && (
                <Animated.View
                    entering={FadeInDown.duration(400)}
                    exiting={FadeOutDown.duration(400)}
                    style={[styles.timerOverlay, { backgroundColor: theme.tint }]}
                >
                    <View style={styles.timerContent}>
                        <View style={styles.timerTextContainer}>
                            <Timer size={24} color={theme.background} style={{ marginRight: 12 }} />
                            <Text style={[styles.timerLabel, { color: theme.background }]}>ODPOCZYNEK:</Text>
                            <Text style={[styles.timerValue, { color: theme.background }]}>{formatTime(restTime)}</Text>
                        </View>
                        <View style={styles.timerActions}>
                            <TouchableOpacity
                                style={[styles.timerPill, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
                                onPress={() => setRestTime(prev => (prev || 0) + 30)}
                            >
                                <Text style={[styles.timerPillText, { color: theme.background }]}>+30s</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.timerPill, { backgroundColor: theme.background }]}
                                onPress={() => setShowTimer(false)}
                            >
                                <X size={20} color={theme.tint} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            )}

            {/* SUMMARY MODAL */}
            <Modal visible={showSummary} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <Animated.View entering={SlideInUp} style={[styles.summaryModal, { backgroundColor: theme.card, borderColor: theme.tint }]}>
                        <Trophy color={theme.tint} size={64} style={{ marginBottom: 20 }} />
                        <Text style={[styles.summaryTitle, { color: theme.text }]}>TRENING UKOŃCZONY!</Text>
                        <Text style={[styles.summarySubtitle, { color: theme.text }]}>Dobra robota, Szymon!</Text>

                        <View style={styles.summaryStats}>
                            <View style={styles.summaryStatItem}>
                                <Text style={[styles.statValueSmall, { color: theme.tint }]}>{summaryData?.duration}</Text>
                                <Text style={[styles.statLabelSmall, { color: theme.text }]}>CZAS (MIN)</Text>
                            </View>
                            <View style={styles.summaryStatItem}>
                                <Text style={[styles.statValueSmall, { color: theme.tint }]}>{summaryData?.volume}</Text>
                                <Text style={[styles.statLabelSmall, { color: theme.text }]}>OBJĘTOŚĆ (KG)</Text>
                            </View>
                            <View style={styles.summaryStatItem}>
                                <Text style={[styles.statValueSmall, { color: theme.tint }]}>{summaryData?.sets}</Text>
                                <Text style={[styles.statLabelSmall, { color: theme.text }]}>SERII</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.confirmButton, { backgroundColor: theme.tint }]}
                            onPress={confirmFinish}
                        >
                            <Text style={styles.confirmButtonText}>ZAPISZ I WYJDŹ</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </View>
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
        marginBottom: 24,
        letterSpacing: -2,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '900',
        marginBottom: 16,
        letterSpacing: 2,
        textTransform: 'uppercase',
        opacity: 0.6,
    },
    startCard: {
        padding: 32,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    startTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#09090B',
        marginBottom: 4,
        letterSpacing: -1,
        textTransform: 'uppercase',
    },
    startSubtitle: {
        fontSize: 15,
        fontWeight: '700',
        color: 'rgba(9,9,11,0.7)',
    },
    emptyState: {
        padding: 40,
        borderRadius: 32,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
        opacity: 0.7,
    },

    // Active session styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderBottomWidth: 2,
    },
    activeTitle: {
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: -1,
        textTransform: 'uppercase',
    },
    finishButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 32,
    },
    finishText: {
        color: '#09090B',
        fontWeight: '900',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    scrollContent: {
        flex: 1,
    },
    exerciseBlock: {
        marginTop: 20,
        paddingVertical: 24,
        borderRadius: 32,
        marginHorizontal: 16,
        borderWidth: 1.5,
    },
    exerciseHeader: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    exerciseName: {
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: -0.5,
        textTransform: 'uppercase',
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    tableLabel: {
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        opacity: 0.6,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    setNumber: {
        width: 40,
        fontSize: 18,
        fontWeight: '900',
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 8,
        borderWidth: 1.5,
        borderRadius: 16,
        height: 48,
        justifyContent: 'center',
    },
    input: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '900',
        height: '100%',
    },
    checkButton: {
        width: 48,
        height: 48,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    addSetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 12,
    },
    addSetText: {
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    addExerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 32,
        paddingVertical: 24,
        borderRadius: 32,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    addExerciseText: {
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cancelButton: {
        marginTop: 40,
        alignItems: 'center',
        paddingVertical: 20,
    },
    cancelText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    // TIMER STYLES
    timerOverlay: {
        position: 'absolute',
        left: 20,
        right: 20,
        bottom: 110,
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    timerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    timerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerLabel: {
        fontSize: 12,
        fontWeight: '900',
        marginRight: 8,
    },
    timerValue: {
        fontSize: 24,
        fontWeight: '900',
        fontVariant: ['tabular-nums'],
    },
    timerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerPill: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginLeft: 8,
    },
    timerPillText: {
        fontSize: 12,
        fontWeight: '900',
    },
    // SUMMARY MODAL STYLES
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    summaryModal: {
        width: '100%',
        borderRadius: 40,
        borderWidth: 2,
        padding: 40,
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
        textAlign: 'center',
        marginBottom: 8,
    },
    summarySubtitle: {
        fontSize: 18,
        fontWeight: '700',
        opacity: 0.6,
        marginBottom: 40,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    summaryStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValueSmall: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
    },
    statLabelSmall: {
        fontSize: 10,
        fontWeight: '900',
        opacity: 0.5,
    },
    confirmButton: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: 24,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#09090B',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 1,
    }
});
