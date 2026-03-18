// ============================================================
// EKRAN TRENINGU — główny ekran do zarządzania sesjami treningowymi
// ============================================================
// Ten komponent obsługuje dwa stany:
//   1. Brak aktywnego treningu — ekran startowy z przyciskiem i szablonami
//   2. Trwa aktywny trening — lista ćwiczeń z seriami, timer przerwy, summary
// ============================================================

// --- IMPORTY ---
import { Colors } from '@/constants/theme';           // nasze kolory motywu
import { useColorScheme } from '@/hooks/use-color-scheme'; // wykrywanie ciemnego/jasnego trybu
import { useWorkoutStore } from '@/store/workoutStore';  // store z danymi treningu
import * as Haptics from 'expo-haptics';                // wibracje / feedback dotykowy
import { router } from 'expo-router';                   // nawigacja między ekranami
import { Check, Dumbbell, Plus, Timer, Trash2, Trophy, X } from 'lucide-react-native'; // ikony
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOutDown, Layout, SlideInRight, SlideInUp } from 'react-native-reanimated'; // animacje

export default function WorkoutScreen() {
    // Pobieramy aktualny schemat kolorów i odpowiadający mu zestaw barw
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // --- DANE I AKCJE ZE STORE'U ---
    // Pobieramy konkretne kawałki stanu (zamiast całego stanu) — to optymalizacja!
    // Komponent re-renderuje się tylko gdy te konkretne pola się zmienią.
    const activeSession = useWorkoutStore((state) => state.activeSession); // aktywny trening (lub null)
    const startSession = useWorkoutStore((state) => state.startSession);   // funkcja: zacznij trening
    const finishSession = useWorkoutStore((state) => state.finishSession); // funkcja: zakończ i zapisz
    const cancelSession = useWorkoutStore((state) => state.cancelSession); // funkcja: anuluj trening
    const exercises = useWorkoutStore((state) => state.exercises);         // lista wszystkich ćwiczeń
    const updateSet = useWorkoutStore((state) => state.updateSetInActiveSession);   // zmień dane serii
    const addSet = useWorkoutStore((state) => state.addSetToActiveSession);         // dodaj serię
    const deleteSet = useWorkoutStore((state) => state.deleteSetFromActiveSession); // usuń serię
    const deleteExercise = useWorkoutStore((state) => state.deleteExerciseFromActiveSession); // usuń ćwiczenie

    // --- LOKALNY STAN KOMPONENTU ---
    // (dane tymczasowe, które nie muszą się zapisywać na urządzeniu)

    // Stan timera przerwy między seriami
    const [restTime, setRestTime] = useState<number | null>(null); // czas pozostały w sekundach
    const [showTimer, setShowTimer] = useState(false);              // czy timer jest widoczny?

    // Stan modala z podsumowaniem po zakończeniu treningu
    const [showSummary, setShowSummary] = useState(false); // czy modal jest otwarty?
    const [summaryData, setSummaryData] = useState<any>(null); // dane do wyświetlenia w podsumowaniu

    // --- EFEKT: LICZNIK CZASU PRZERWY ---
    // useEffect uruchamia się za każdym razem, gdy zmienią się showTimer lub restTime.
    // Jeśli timer jest aktywny i czas > 0 — odlicza sekundy w dół co 1000ms.
    // Kiedy czas dojdzie do 0 — ukrywa timer i wibruje (ostrzeżenie na iOS).
    // Funkcja czyszcząca (return) zatrzymuje interwał przy ponownym uruchomieniu efektu.
    useEffect(() => {
        let interval: any;
        if (showTimer && restTime !== null && restTime > 0) {
            // Uruchamiamy interwał, który co sekundę zmniejsza czas o 1
            interval = setInterval(() => {
                setRestTime((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
        } else if (restTime === 0) {
            // Czas dobiegł końca — chowamy timer i dajemy sygnał wibracyjny
            setShowTimer(false);
            setRestTime(null);
            if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
        // Czyszczenie interwału zapobiega wyciekom pamięci
        return () => clearInterval(interval);
    }, [showTimer, restTime]);

    // --- HANDLERY (OBSŁUGA ZDARZEŃ) ---
    // Funkcje wywoływane przy akcjach użytkownika (tapnięcia, wpisywanie, etc.)

    // Rozpoczyna nowy pusty trening + feedback wibracyjny (tylko iOS)
    const handleStartSession = () => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        startSession();
    };

    // Aktualizuje dane serii (kg, powtórzenia, lub ukończenie)
    // Jeśli seria zostaje zaznaczona jako ukończona — startuje 90-sekundowy timer przerwy
    const handleSetUpdate = (exerciseId: string, setId: string, updates: any) => {
        if ('completed' in updates && updates.completed) {
            // Seria zaliczona! Mocny wibracyjny sygnał sukcesu
            if (process.env.EXPO_OS === 'ios') {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            // Uruchamiamy timer 90-sekundowej przerwy
            setRestTime(90);
            setShowTimer(true);
        } else if (process.env.EXPO_OS === 'ios') {
            // Dla zwykłych edycji (wpisanie wartości) — delikatna wibracja
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        updateSet(exerciseId, setId, updates);
    };

    // Dodaje nową serię do ćwiczenia (z feedbackiem wibracyjnym)
    const handleAddSet = (exerciseId: string) => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        addSet(exerciseId);
    };

    // Usuwa konkretną serię z ćwiczenia
    const handleDeleteSet = (exerciseId: string, setId: string) => {
        if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        deleteSet(exerciseId, setId);
    };

    // Usuwa całe ćwiczenie z treningu (wibracja ostrzeżenia — to nieodwracalna akcja)
    const handleDeleteExercise = (exerciseId: string) => {
        if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        deleteExercise(exerciseId);
    };

    // Wywoływana przy tapnięciu "Zakończ" — oblicza statystyki i pokazuje modal z podsumowaniem
    const handleFinish = () => {
        if (!activeSession) return;

        // Czas trwania w minutach (zaokrąglony)
        const duration = Math.round((Date.now() - activeSession.startTime) / 60000);

        // Całkowita objętość = suma (kg × powtórzenia) dla każdej ukończonej serii
        // reduce() to metoda tablicy, która "redukuje" elementy do jednej wartości
        const volume = activeSession.exercises.reduce((acc, ex) => {
            return acc + ex.sets.reduce((sAcc, s) => sAcc + (s.completed ? s.weight * s.reps : 0), 0);
        }, 0);

        // Zapisujemy dane do stanu, żeby modal mógł je wyświetlić
        setSummaryData({
            duration,
            volume,
            exercises: activeSession.exercises.length,
            sets: activeSession.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)
        });

        if (process.env.EXPO_OS === 'ios') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowSummary(true); // otwieramy modal z podsumowaniem
    };

    // Potwierdza zakończenie treningu, zapisuje do historii i wraca do home
    const confirmFinish = () => {
        finishSession();      // zapis sesji do store (i AsyncStorage)
        setShowSummary(false); // zamykamy modal
        router.push('/');      // nawigujemy do ekranu głównego
    };

    // Pomocnicza funkcja formatująca sekundy jako "M:SS" (np. 90 → "1:30")
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`; // padStart dodaje zero wiodące
    };

    // --- WIDOK STARTU (brak aktywnej sesji) ---
    // Jeśli activeSession === null, renderujemy ekran powitalny/startowy
    if (!activeSession) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                {/* Tytuł ekranu */}
                <Text style={[styles.title, { color: theme.text }]}>Trening</Text>

                {/* Duży przycisk "Rozpocznij pusty trening" */}
                <TouchableOpacity
                    style={[styles.startCard, { backgroundColor: theme.tint, borderColor: theme.tint }]}
                    onPress={handleStartSession}
                    activeOpacity={0.8}
                >
                    <Text style={styles.startTitle}>Rozpocznij pusty trening</Text>
                    <Text style={styles.startSubtitle}>Szybki start bez planu</Text>
                </TouchableOpacity>

                {/* Sekcja szablonów — na razie pusta, w przyszłości będą tu plany użytkownika */}
                <Text style={[styles.subtitle, { color: theme.text, marginTop: 40 }]}>Moje szablony</Text>
                <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Dumbbell size={32} color={theme.icon} style={{ marginBottom: 16 }} />
                    <Text style={[styles.emptyTitle, { color: theme.text }]}>Brak szablonów</Text>
                    <Text style={[styles.emptySubtitle, { color: theme.icon }]}>Stwórz swój pierwszy plan treningowy.</Text>
                </View>
            </View>
        );
    }

    // --- WIDOK AKTYWNEJ SESJI ---
    // Jeśli activeSession istnieje, renderujemy pełny tryb treningowy
    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingHorizontal: 0 }]}>
            {/* Górny pasek nagłówka z tytułem i przyciskiem zakończenia */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <Text style={[styles.activeTitle, { color: theme.text }]}>Trwa trening</Text>
                {/* Przycisk Zakończ — otwiera modal z podsumowaniem */}
                <TouchableOpacity
                    style={[styles.finishButton, { backgroundColor: theme.tint }]}
                    onPress={handleFinish}
                >
                    <Text style={styles.finishText}>Zakończ</Text>
                </TouchableOpacity>
            </View>

            {/* Przewijalna lista ćwiczeń - keyboardShouldPersistTaps pozwala kliknąć coś
                 poza klawiaturą bez jej automatycznego chowania */}
            <ScrollView style={styles.scrollContent} keyboardShouldPersistTaps="handled">
                {/* Iterujemy po wszystkich ćwiczeniach w aktywnej sesji */}
                {activeSession.exercises.map((workoutEx, index) => {
                    // Szukamy definicji ćwiczenia w bazie ćwiczeń, żeby wyświetlić jego nazwę
                    const exerciseDef = exercises.find((e) => e.id === workoutEx.exerciseId);
                    // Jeśli ćwiczenie z jakiegoś powodu nie istnieje w bazie — pomijamy je
                    if (!exerciseDef) return null;

                    return (
                        // Animated.View z animacją wejścia (faduje z opóźnieniem zależnym od indeksu)
                        // layout={Layout.springify()} sprawia, że lista płynnie reorganizuje się po dodaniu/usunięciu
                        <Animated.View
                            key={workoutEx.id}                           // klucz dla Reacta — unikalny ID
                            layout={Layout.springify()}                  // animacja reorganizacji layoutu
                            entering={FadeIn.delay(index * 100)}         // każde ćwiczenie pojawia się z małym opóźnieniem
                            style={[styles.exerciseBlock, { backgroundColor: theme.card, borderColor: theme.border }]}
                        >
                            {/* Nagłówek bloku ćwiczenia: nazwa i przycisk usunięcia */}
                            <View style={styles.exerciseHeader}>
                                <Text style={[styles.exerciseName, { color: theme.tint }]}>{exerciseDef.name}</Text>
                                <TouchableOpacity onPress={() => handleDeleteExercise(workoutEx.id)}>
                                    <Trash2 size={20} color="#EF4444" />
                                </TouchableOpacity>
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
                                        style={[
                                            styles.checkButton,
                                            { backgroundColor: set.completed ? theme.tint : theme.background, borderColor: set.completed ? theme.tint : theme.border }
                                        ]}
                                        onPress={() => handleSetUpdate(workoutEx.id, set.id, { completed: !set.completed })}
                                    >
                                        <Check size={20} color={set.completed ? '#FFFFFF' : theme.icon} strokeWidth={2.5} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.deleteSetButton}
                                        onPress={() => handleDeleteSet(workoutEx.id, set.id)}
                                    >
                                        <Trash2 size={18} color="#EF4444" opacity={0.6} />
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
                            <Timer size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.timerLabel}>ODPOCZYNEK:</Text>
                            <Text style={[styles.timerValue, { color: "#FFFFFF" }]}>{formatTime(restTime)}</Text>
                        </View>
                        <View style={styles.timerActions}>
                            <TouchableOpacity
                                style={[styles.timerPill, { backgroundColor: 'rgba(0,0,0,0.1)' }]}
                                onPress={() => setRestTime(prev => (prev || 0) + 30)}
                            >
                                <Text style={[styles.timerPillText, { color: "#FFFFFF" }]}>+30s</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.timerPill, { backgroundColor: "rgba(255,255,255,0.2)" }]}
                                onPress={() => setShowTimer(false)}
                            >
                                <X size={18} color="#FFFFFF" />
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
        fontSize: 34,
        fontWeight: '700',
        marginBottom: 20,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 16,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        opacity: 0.5,
    },
    startCard: {
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    startTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: 0,
    },
    startSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.8)',
    },
    emptyState: {
        padding: 32,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        opacity: 0.6,
    },

    // Active session styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: 12,
        borderBottomWidth: 1,
    },
    activeTitle: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    finishButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    finishText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    scrollContent: {
        flex: 1,
    },
    exerciseBlock: {
        marginTop: 16,
        paddingVertical: 20,
        borderRadius: 20,
        marginHorizontal: 16,
        borderWidth: 1,
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    tableLabel: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        opacity: 0.5,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    setNumber: {
        width: 30,
        fontSize: 15,
        fontWeight: '600',
        opacity: 0.7,
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 6,
        borderRadius: 12,
        height: 40,
        justifyContent: 'center',
        backgroundColor: 'rgba(128,128,128,0.08)',
    },
    input: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        height: '100%',
    },
    checkButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        borderWidth: 1,
    },
    deleteSetButton: {
        padding: 8,
        marginLeft: 4,
    },
    addSetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 8,
    },
    addSetText: {
        fontSize: 15,
        fontWeight: '600',
    },
    addExerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    addExerciseText: {
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 32,
        alignItems: 'center',
        paddingVertical: 16,
    },
    cancelText: {
        color: '#EF4444',
        fontSize: 15,
        fontWeight: '600',
    },
    // TIMER STYLES
    timerOverlay: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 100,
        borderRadius: 30,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    timerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    timerLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginRight: 6,
        color: '#FFFFFF',
    },
    timerValue: {
        fontSize: 16,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    timerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerPill: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: 6,
    },
    timerPillText: {
        fontSize: 13,
        fontWeight: '600',
    },
    // SUMMARY MODAL STYLES
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    summaryModal: {
        width: '100%',
        borderRadius: 32,
        borderWidth: 1,
        padding: 32,
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
        textAlign: 'center',
        marginBottom: 8,
    },
    summarySubtitle: {
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.7,
        marginBottom: 32,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    summaryStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValueSmall: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabelSmall: {
        fontSize: 11,
        fontWeight: '600',
        opacity: 0.6,
        textTransform: 'uppercase',
    },
    confirmButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    }
});
