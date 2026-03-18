// ============================================================
// EKRAN WYBORU ĆWICZENIA — modal wyszukiwarki ćwiczeń
// ============================================================
// Ten ekran otwiera się jako modal (wyjeżdża od dołu ekranu),
// gdy użytkownik tapnie "Dodaj ćwiczenie" podczas aktywnego treningu.
// Umożliwia wyszukiwanie ćwiczeń po nazwie i filtrowanie po partii mięśniowej.
// ============================================================

// --- IMPORTY ---
import { Colors } from '@/constants/theme';           // kolory motywu
import { useColorScheme } from '@/hooks/use-color-scheme'; // jasny/ciemny tryb
import { useWorkoutStore } from '@/store/workoutStore';  // akcja dodawania ćwiczenia do sesji
import * as Haptics from 'expo-haptics';                // wibracje
import { Plus, Search, X } from 'lucide-react-native'; // ikony
import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated'; // animacje wejścia kart

export default function ExerciseSelectModal() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    // Pobieramy listę ćwiczeń i funkcję dodawania do sesji ze store'u
    const exercises = useWorkoutStore((state) => state.exercises);
    const addExercise = useWorkoutStore((state) => state.addExerciseToActiveSession);

    // --- LOKALNY STAN FILTROWANIA I WYSZUKIWANIA ---
    const [searchQuery, setSearchQuery] = useState(''); // tekst wpisany w polu wyszukiwarki
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null); // aktywny filtr partii

    // Unikalnie wyodrębniamy i sortujemy nazwy partii mięśniowych z listy ćwiczeń
    // useMemo = przelicza tylko gdy 'exercises' się zmieni, nie przy każdym renderze (optymalizacja)
    const bodyParts = useMemo(() => {
        const parts = Array.from(new Set(exercises.map((e) => e.bodyPart))); // Set usuwa duplikaty
        return parts.sort(); // sortujemy alfabetycznie
    }, [exercises]);

    // Filtrujemy ćwiczenia według wyszukiwanej frazy i wybranej partii ciała
    // Oba warunki muszą być spełnione jednocześnie (ćwiczenie jest pokazywane tylko gdy pasuje do obu)
    const filteredExercises = useMemo(() => {
        return exercises.filter((ex) => {
            const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()); // ćwiczenie pasuje do wyszukiwarki?
            const matchesBodyPart = selectedBodyPart ? ex.bodyPart === selectedBodyPart : true; // pasuje do filtru?
            return matchesSearch && matchesBodyPart; // tylko jeśli oba warunki są true
        });
    }, [exercises, searchQuery, selectedBodyPart]);

    // Dodaje wybrane ćwiczenie do aktywnej sesji treningowej i daje wibracyjny sygnał
    const handleAddExercise = (id: string) => {
        if (process.env.EXPO_OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        addExercise(id); // wywołujemy akcję ze store'u
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Tytuł modala */}
            <Text style={[styles.title, { color: theme.text }]}>Wybierz ćwiczenie</Text>

            {/* WYSZUKIWARKA — pole tekstowe z ikonką lupy i przyciskiem czyszczenia */}
            <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Search color={theme.icon} size={20} />
                <TextInput
                    placeholder="Szukaj ćwiczenia..."
                    placeholderTextColor={theme.icon}
                    style={[styles.searchInput, { color: theme.text }]}
                    value={searchQuery}
                    onChangeText={setSearchQuery} // aktualizuj stan za każdym razem gdy użytkownik pisze
                />
                {/* Przycisk X do czyszczenia wyszukiwarki — widoczny tylko gdy jest tekst */}
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <X color={theme.icon} size={20} />
                    </TouchableOpacity>
                )}
            </View>

            {/* FILTRY PARTII MIĘŚLIOWYCH — przewijana poziomo lista pigulek filtrów */}
            <View style={styles.filterWrapper}>
                <ScrollView
                    horizontal                        // scrollowanie poziome
                    showsHorizontalScrollIndicator={false} // ukrywamy scrollbar dla estetyki
                    contentContainerStyle={styles.filterContainer}
                >
                    {/* Pigulka "Wszystkie" — resetuje filtr do braku zaznaczenia */}
                    <TouchableOpacity
                        style={[
                            styles.filterPill,
                            !selectedBodyPart && { backgroundColor: theme.tint, borderColor: theme.tint } // aktywna gdy brak filtru
                        ]}
                        onPress={() => {
                            setSelectedBodyPart(null); // resetuj filtr
                            if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Text style={[styles.filterText, !selectedBodyPart ? { color: "#FFFFFF" } : { color: theme.text }]}>Wszystkie</Text>
                    </TouchableOpacity>

                    {/* Generujemy pigulki dla każdej unikalnej partii mięśniowej */}
                    {bodyParts.map((part) => (
                        <TouchableOpacity
                            key={part}
                            style={[
                                styles.filterPill,
                                selectedBodyPart === part && { backgroundColor: theme.tint, borderColor: theme.tint } // aktywna pigulka
                            ]}
                            onPress={() => {
                                setSelectedBodyPart(part); // ustaw filtr na wybraną partię
                                if (process.env.EXPO_OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            }}
                        >
                            <Text style={[styles.filterText, selectedBodyPart === part ? { color: "#FFFFFF" } : { color: theme.text }]}>{part}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* LISTA ĆWICZEŃ — FlatList to wydajny komponent listy od React Native
                 (renderuje tylko te elementy, które są widoczne na ekranie) */}
            <FlatList
                data={filteredExercises}          // dane do wyświetlenia (przefiltrowane)
                keyExtractor={(item) => item.id}  // unikalny klucz dla każdego elementu
                contentContainerStyle={{ paddingBottom: 40 }}

                // ListEmptyComponent = komponent wyświetlany gdy lista jest pusta
                ListEmptyComponent={() => (
                    <View style={styles.emptyResults}>
                        <Search color={theme.icon} size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <Text style={[styles.emptyResultsText, { color: theme.text }]}>Nie znaleziono ćwiczeń</Text>
                        <Text style={[styles.emptyResultsSubtitle, { color: theme.icon }]}>Spróbuj zmienić filtry lub wyszukiwaną frazę.</Text>
                    </View>
                )}

                // Renderowanie pojedynczej karty ćwiczenia — Animated.View dodaje animację slidingu z dołu
                renderItem={({ item, index }) => (
                    <Animated.View
                        entering={FadeInDown.delay(index * 50).duration(400)}
                        style={[styles.exerciseCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                    >
                        {/* Lewa kolumna: nazwa i partia/sprzęt */}
                        <View style={styles.exerciseInfo}>
                            <Text style={[styles.exerciseName, { color: theme.text }]}>{item.name}</Text>
                            <Text style={[styles.exerciseMuscle, { color: theme.icon }]}>
                                {item.bodyPart} • {item.equipment} {/* • to znak odstępnika */}
                            </Text>
                        </View>

                        {/* Przycisk "+" dodający ćwiczenie do aktywnego treningu */}
                        <TouchableOpacity
                            style={[styles.addButton, { backgroundColor: theme.tint }]}
                            onPress={() => handleAddExercise(item.id)}
                        >
                            <Plus color="#FFFFFF" size={24} />
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
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 10,
        letterSpacing: -0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '500',
    },
    filterWrapper: {
        marginBottom: 20,
    },
    filterContainer: {
        paddingRight: 16,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'transparent',
        backgroundColor: 'rgba(128,128,128,0.1)',
        marginRight: 8,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    exerciseMuscle: {
        fontSize: 13,
        fontWeight: '500',
        opacity: 0.6,
        textTransform: 'capitalize',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
        fontWeight: '700',
        marginBottom: 8,
    },
    emptyResultsSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        paddingHorizontal: 40,
        opacity: 0.6,
    }
});
