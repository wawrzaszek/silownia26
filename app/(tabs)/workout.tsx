import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';
import { router } from 'expo-router';
import { Check, Dumbbell, Plus } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

    if (!activeSession) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={[styles.title, { color: theme.text }]}>Trening</Text>

                <TouchableOpacity
                    style={[styles.startCard, { backgroundColor: theme.tint }]}
                    onPress={() => startSession()}
                >
                    <Text style={styles.startTitle}>Rozpocznij pusty trening</Text>
                    <Text style={styles.startSubtitle}>Szybki start bez planu</Text>
                </TouchableOpacity>

                <Text style={[styles.subtitle, { color: theme.text, marginTop: 32 }]}>Moje szablony</Text>
                <View style={[styles.emptyState, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Dumbbell size={32} color={theme.icon} style={{ marginBottom: 12 }} />
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
                    onPress={() => finishSession()}
                >
                    <Text style={styles.finishText}>Zakończ</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContent}>
                {activeSession.exercises.map((workoutEx, index) => {
                    const exerciseDef = exercises.find((e) => e.id === workoutEx.exerciseId);
                    if (!exerciseDef) return null;

                    return (
                        <View key={workoutEx.id} style={[styles.exerciseBlock, { backgroundColor: theme.card }]}>
                            <View style={styles.exerciseHeader}>
                                <Text style={[styles.exerciseName, { color: theme.text }]}>{exerciseDef.name}</Text>
                            </View>

                            <View style={styles.tableHeader}>
                                <Text style={[styles.tableLabel, { color: theme.icon, width: 40 }]}>Seria</Text>
                                <Text style={[styles.tableLabel, { color: theme.icon, flex: 1, textAlign: 'center' }]}>kg</Text>
                                <Text style={[styles.tableLabel, { color: theme.icon, flex: 1, textAlign: 'center' }]}>Powt.</Text>
                                <View style={{ width: 40 }} />
                            </View>

                            {workoutEx.sets.map((set, setIndex) => (
                                <View key={set.id} style={[styles.setRow, set.completed && { backgroundColor: theme.background }]}>
                                    <Text style={[styles.setNumber, { color: theme.text }]}>{setIndex + 1}</Text>

                                    <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                                        <TextInput
                                            style={[styles.input, { color: theme.text }]}
                                            keyboardType="numeric"
                                            value={set.weight ? set.weight.toString() : ''}
                                            placeholder="-"
                                            placeholderTextColor={theme.icon}
                                            onChangeText={(val) => updateSet(workoutEx.id, set.id, { weight: parseFloat(val) || 0 })}
                                        />
                                    </View>

                                    <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
                                        <TextInput
                                            style={[styles.input, { color: theme.text }]}
                                            keyboardType="numeric"
                                            value={set.reps ? set.reps.toString() : ''}
                                            placeholder="-"
                                            placeholderTextColor={theme.icon}
                                            onChangeText={(val) => updateSet(workoutEx.id, set.id, { reps: parseInt(val, 10) || 0 })}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={[
                                            styles.checkButton,
                                            { backgroundColor: set.completed ? '#10B981' : theme.background, borderColor: set.completed ? '#10B981' : theme.border }
                                        ]}
                                        onPress={() => updateSet(workoutEx.id, set.id, { completed: !set.completed })}
                                    >
                                        <Check size={16} color={set.completed ? '#ffffff' : theme.icon} />
                                    </TouchableOpacity>
                                </View>
                            ))}

                            <TouchableOpacity
                                style={styles.addSetButton}
                                onPress={() => addSet(workoutEx.id)}
                            >
                                <Plus size={16} color={theme.tint} style={{ marginRight: 6 }} />
                                <Text style={[styles.addSetText, { color: theme.tint }]}>Dodaj serię</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}

                <TouchableOpacity
                    style={[styles.addExerciseCard, { borderColor: theme.tint }]}
                    onPress={() => router.push('/exercise-select')}
                >
                    <Plus size={20} color={theme.tint} style={{ marginRight: 8 }} />
                    <Text style={[styles.addExerciseText, { color: theme.tint }]}>Dodaj ćwiczenie</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelSession()}
                >
                    <Text style={styles.cancelText}>Anuluj trening</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 24,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    startCard: {
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    startTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#09090B', // Pure dark for high contrast against the Volt/Black tint
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    startSubtitle: {
        fontSize: 15,
        fontWeight: '600',
        color: 'rgba(9,9,11,0.7)',
    },
    emptyState: {
        padding: 32,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '500',
    },

    // Active session styles
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
    },
    activeTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    finishButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    finishText: {
        color: '#09090B',
        fontWeight: '700',
        fontSize: 15,
    },
    scrollContent: {
        flex: 1,
    },
    exerciseBlock: {
        marginTop: 16,
        paddingVertical: 20,
        borderRadius: 24,
        marginHorizontal: 16,
    },
    exerciseHeader: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    tableLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    setNumber: {
        width: 40,
        fontSize: 16,
        fontWeight: '800',
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 8,
        borderWidth: 1,
        borderRadius: 12,
        height: 44,
        justifyContent: 'center',
    },
    input: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        height: '100%',
    },
    checkButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    addSetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    addSetText: {
        fontSize: 16,
        fontWeight: '700',
    },
    addExerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 20,
        borderRadius: 24,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    addExerciseText: {
        fontSize: 16,
        fontWeight: '700',
    },
    cancelButton: {
        marginTop: 32,
        alignItems: 'center',
        paddingVertical: 16,
    },
    cancelText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '700',
    }
});
