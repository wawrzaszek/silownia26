import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';
import { Plus, Search } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExerciseSelectModal() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const exercises = useWorkoutStore((state) => state.exercises);
    const addExercise = useWorkoutStore((state) => state.addExerciseToActiveSession);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Wybierz ćwiczenie</Text>

            <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Search color={theme.icon} size={20} />
                <TextInput
                    placeholder="Szukaj ćwiczenia..."
                    placeholderTextColor={theme.icon}
                    style={[styles.searchInput, { color: theme.text }]}
                />
            </View>

            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={styles.exerciseInfo}>
                            <Text style={[styles.exerciseName, { color: theme.text }]}>{item.name}</Text>
                            <Text style={[styles.exerciseMuscle, { color: theme.icon }]}>
                                {item.bodyPart} • {item.equipment}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.tint }]}
                            onPress={() => addExercise(item.id)}
                        >
                            <Plus color="#ffffff" size={20} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 20,
        marginTop: 10,
        letterSpacing: -0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 24,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 12,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    exerciseMuscle: {
        fontSize: 14,
        fontWeight: '500',
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    }
});
