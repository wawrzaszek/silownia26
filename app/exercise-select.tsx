import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useWorkoutStore } from '@/store/workoutStore';
import * as Haptics from 'expo-haptics';
import { Plus, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ExerciseSelectModal() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const exercises = useWorkoutStore((state) => state.exercises);
    const addExercise = useWorkoutStore((state) => state.addExerciseToActiveSession);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

    const bodyParts = useMemo(() => {
        const parts = Array.from(new Set(exercises.map((e) => e.bodyPart)));
        return parts.sort();
    }, [exercises]);

    const filteredExercises = useMemo(() => {
        return exercises.filter((ex) => {
            const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesBodyPart = selectedBodyPart ? ex.bodyPart === selectedBodyPart : true;
            return matchesSearch && matchesBodyPart;
        });
    }, [exercises, searchQuery, selectedBodyPart]);

    const handleAddExercise = (id: string) => {
        if (process.env.EXPO_OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        addExercise(id);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Wybierz ćwiczenie</Text>

            <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Search color={theme.icon} size={20} />
                <TextInput
                    placeholder="Szukaj ćwiczenia..."
                    placeholderTextColor={theme.icon}
                    style={[styles.searchInput, { color: theme.text }]}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <X color={theme.icon} size={20} />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
                >
                    <TouchableOpacity
                        style={[
                            styles.filterPill,
                            !selectedBodyPart && { backgroundColor: theme.tint, borderColor: theme.tint }
                        ]}
                        onPress={() => {
                            setSelectedBodyPart(null);
                            if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Text style={[styles.filterText, !selectedBodyPart ? { color: theme.background } : { color: theme.text }]}>Wszystkie</Text>
                    </TouchableOpacity>
                    {bodyParts.map((part) => (
                        <TouchableOpacity
                            key={part}
                            style={[
                                styles.filterPill,
                                selectedBodyPart === part && { backgroundColor: theme.tint, borderColor: theme.tint }
                            ]}
                            onPress={() => {
                                setSelectedBodyPart(part);
                                if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                        >
                            <Text style={[styles.filterText, selectedBodyPart === part ? { color: theme.background } : { color: theme.text }]}>{part}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40 }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyResults}>
                        <Search color={theme.icon} size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <Text style={[styles.emptyResultsText, { color: theme.text }]}>Nie znaleziono ćwiczeń</Text>
                        <Text style={[styles.emptyResultsSubtitle, { color: theme.icon }]}>Spróbuj zmienić filtry lub wyszukiwaną frazę.</Text>
                    </View>
                )}
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={FadeInDown.delay(index * 50).duration(400)}
                        style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                    >
                        <View style={styles.exerciseInfo}>
                            <Text style={[styles.exerciseName, { color: theme.text }]}>{item.name}</Text>
                            <Text style={[styles.exerciseMuscle, { color: theme.icon }]}>
                                {item.bodyPart} • {item.equipment}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.tint }]}
                            onPress={() => handleAddExercise(item.id)}
                        >
                            <Plus color={theme.background} size={24} />
                        </TouchableOpacity>
                    </Animated.View>
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
        fontWeight: '900',
        marginBottom: 20,
        marginTop: 10,
        letterSpacing: -1,
        textTransform: 'uppercase',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 24,
        borderWidth: 1.5,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '700',
    },
    filterWrapper: {
        marginBottom: 24,
    },
    filterContainer: {
        paddingRight: 16,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(128,128,128,0.2)',
        marginRight: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1.5,
        marginBottom: 12,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 6,
        letterSpacing: -0.5,
        textTransform: 'uppercase',
    },
    exerciseMuscle: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        opacity: 0.6,
    },
    addButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    emptyResults: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyResultsText: {
        fontSize: 18,
        fontWeight: '900',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    emptyResultsSubtitle: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        paddingHorizontal: 40,
    }
});
