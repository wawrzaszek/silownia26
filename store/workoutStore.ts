// ============================================================
// STORE TRENINGOWY — główny "magazyn" danych całej aplikacji
// ============================================================
// Używamy biblioteki Zustand do zarządzania stanem (state management).
// Dzięki "persist" dane są automatycznie zapisywane na urządzeniu
// (AsyncStorage) i nie znikają po zamknięciu aplikacji.
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Exercise, defaultExercises } from '../data/defaultExercises';

// --- TYPY DANYCH (TypeScript Interfaces) ---
// Opisują "kształt" obiektów, żeby TypeScript mógł pilnować błędów.

// Jedna seria (np. 3 × 80kg, zaznaczona jako ukończona)
export interface WorkoutSet {
    id: string;       // unikalny identyfikator serii
    reps: number;     // liczba powtórzeń
    weight: number;   // ciężar w kilogramach
    completed: boolean; // czy seria jest zaliczona?
}

// Jedno ćwiczenie w trakcie sesji (np. "Martwy ciąg" z listą serii)
export interface WorkoutExercise {
    id: string;         // unikalny ID tej konkretnej instancji ćwiczenia w sesji
    exerciseId: string; // ID ćwiczenia z bazy danych (defaultExercises)
    sets: WorkoutSet[]; // tablica serii należących do tego ćwiczenia
}

// Plan treningowy (szablon do późniejszego użycia)
export interface WorkoutPlan {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
}

// Aktywna/zakończona sesja treningowa
export interface WorkoutSession {
    id: string;
    planId?: string;     // ID planu — opcjonalne (null = trening bez szablonu)
    startTime: number;   // timestamp startu (milisekundy od epoch)
    endTime?: number;    // timestamp zakończenia — opcjonalne
    exercises: WorkoutExercise[];
}

// --- INTERFEJS STANU STORE'U ---
// Opisuje WSZYSTKIE dane i WSZYSTKIE akcje dostępne w store.
interface WorkoutStoreState {
    exercises: Exercise[];         // lista wszystkich dostępnych ćwiczeń
    plans: WorkoutPlan[];          // zapisane plany treningowe użytkownika
    sessions: WorkoutSession[];    // historia ukończonych sesji
    activeSession: WorkoutSession | null; // aktualnie trwający trening (null = brak)

    hasCompletedOnboarding: boolean; // czy użytkownik przeszedł kreator startowy
    userGoal: string | null;       // główny cel - np. 'schudnac', 'zbudowac_miesnie' itp.

    // --- Akcje (funkcje zmieniające stan) ---
    completeOnboarding: (goal: string) => void;

    addPlan: (plan: WorkoutPlan) => void;
    deletePlan: (id: string) => void;

    startSession: (planId?: string) => void;
    updateSetInActiveSession: (exerciseId: string, setId: string, updates: Partial<WorkoutSet>) => void;
    addSetToActiveSession: (exerciseId: string) => void;
    finishSession: () => void;
    cancelSession: () => void;

    addExerciseToActiveSession: (exerciseId: string) => void;
    deleteSetFromActiveSession: (exerciseId: string, setId: string) => void;
    deleteExerciseFromActiveSession: (exerciseId: string) => void;
}

// --- TWORZENIE STORE'U ---
// create() tworzy hook (useWorkoutStore), którym korzystamy w komponentach.
// persist() owija logikę, żeby automatycznie zapisywać/ładować dane z pamięci.
export const useWorkoutStore = create<WorkoutStoreState>()(
    persist(
        (set, get) => ({
            // Domyślne wartości stanu przy pierwszym uruchomieniu
            exercises: [...defaultExercises], // kopiujemy domyślne ćwiczenia
            plans: [],
            sessions: [],
            activeSession: null,

            hasCompletedOnboarding: false, // domyślnie użytkownik tego nie przeszedł
            userGoal: null,  // nie ustawiono jeszcze celu

            // Zapisuje wynik pracy kreatora (onboarding)
            completeOnboarding: (goal) => set({ hasCompletedOnboarding: true, userGoal: goal }),

            // Dodaje nowy plan treningowy do listy planów
            addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),

            // Usuwa plan o podanym ID z listy planów
            deletePlan: (id) => set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),

            // Rozpoczyna nową sesję treningową
            // Jeśli podano planId, ćwiczenia z planu są kopiowane do sesji
            startSession: (planId) => {
                const state = get();
                // Zabezpieczenie: nie można startować drugiej sesji jednocześnie
                if (state.activeSession) return;

                let initialExercises: WorkoutExercise[] = [];
                if (planId) {
                    const plan = state.plans.find((p) => p.id === planId);
                    if (plan) {
                        // Głęboka kopia planu, żeby nie modyfikować oryginału
                        initialExercises = JSON.parse(JSON.stringify(plan.exercises));
                        // Resetujemy ukończenie serii (zaczynamy od zera)
                        initialExercises.forEach(ex => {
                            ex.sets.forEach(s => s.completed = false);
                        });
                    }
                }

                // Ustawiamy nową aktywną sesję z unikalnym ID i czasem startu
                set({
                    activeSession: {
                        id: Date.now().toString(),
                        planId,
                        startTime: Date.now(),
                        exercises: initialExercises,
                    },
                });
            },

            // Dodaje wybrane ćwiczenie do aktywnej sesji
            // Każde nowe ćwiczenie startuje z jedną pustą serią
            addExerciseToActiveSession: (exerciseId) => {
                set((state) => {
                    if (!state.activeSession) return state;
                    const newWorkoutExercise: WorkoutExercise = {
                        id: Date.now().toString(), // unikalny ID instancji w sesji
                        exerciseId,
                        sets: [{ id: Date.now().toString() + '1', reps: 0, weight: 0, completed: false }]
                    };
                    return {
                        ...state,
                        activeSession: {
                            ...state.activeSession,
                            exercises: [...state.activeSession.exercises, newWorkoutExercise]
                        }
                    }
                });
            },

            // Aktualizuje dane serii (wagę, powtórzenia lub status ukończenia)
            // updates to obiekt z wybranymi polami do nadpisania
            updateSetInActiveSession: (exerciseId, setId, updates) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    // Przeszukujemy ćwiczenia i serie, żeby znaleźć tę konkretną serię
                    const newExercises = state.activeSession.exercises.map((ex) => {
                        if (ex.id !== exerciseId) return ex;
                        const newSets = ex.sets.map((s) => {
                            if (s.id !== setId) return s;
                            return { ...s, ...updates }; // nadpisujemy tylko zmienione pola
                        });
                        return { ...ex, sets: newSets };
                    });

                    return {
                        ...state,
                        activeSession: {
                            ...state.activeSession,
                            exercises: newExercises,
                        },
                    };
                });
            },

            // Dodaje nową serię do ćwiczenia w aktywnej sesji
            // Nowa seria ma takie same wartości kg/powtórzeń jak poprzednia (wygoda użytkownika)
            addSetToActiveSession: (exerciseId) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const newExercises = state.activeSession.exercises.map((ex) => {
                        if (ex.id !== exerciseId) return ex;
                        // Pobieramy ostatnią serię jako "szablon" dla nowej
                        const lastSet = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1] : { reps: 0, weight: 0 };
                        return {
                            ...ex,
                            sets: [
                                ...ex.sets,
                                {
                                    id: Date.now().toString() + Math.random().toString(), // losowe ID żeby uniknąć duplikatów
                                    reps: lastSet.reps,
                                    weight: lastSet.weight,
                                    completed: false, // nowa seria zawsze zaczyna jako niezaliczona
                                },
                            ],
                        };
                    });

                    return {
                        ...state,
                        activeSession: {
                            ...state.activeSession,
                            exercises: newExercises,
                        },
                    };
                });
            },

            // Kończy aktywny trening i zapisuje go w historii sesji
            finishSession: () => {
                set((state) => {
                    if (!state.activeSession) return state;

                    // Tworzymy kompletny obiekt zakończonej sesji z endTime
                    const finishedSession: WorkoutSession = {
                        ...state.activeSession,
                        endTime: Date.now(),
                    };

                    return {
                        ...state,
                        sessions: [...state.sessions, finishedSession], // dodajemy do historii
                        activeSession: null, // czyścimy aktywną sesję
                    };
                });
            },

            // Anuluje aktywny trening BEZ zapisywania do historii
            cancelSession: () => {
                set({ activeSession: null });
            },

            // Usuwa konkretną serię z ćwiczenia w aktywnej sesji
            deleteSetFromActiveSession: (exerciseId, setId) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const newExercises = state.activeSession.exercises.map((ex) => {
                        if (ex.id !== exerciseId) return ex;
                        // Filtrujemy serie, zostawiając wszystko OPRÓCZ tej do usunięcia
                        const newSets = ex.sets.filter((s) => s.id !== setId);
                        return { ...ex, sets: newSets };
                    });

                    return {
                        ...state,
                        activeSession: {
                            ...state.activeSession,
                            exercises: newExercises,
                        },
                    };
                });
            },

            // Usuwa całe ćwiczenie z aktywnej sesji (wszystkie jego serie też znikają)
            deleteExerciseFromActiveSession: (exerciseId) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    // Filtrujemy ćwiczenia, pomijając to do usunięcia
                    const newExercises = state.activeSession.exercises.filter((ex) => ex.id !== exerciseId);

                    return {
                        ...state,
                        activeSession: {
                            ...state.activeSession,
                            exercises: newExercises,
                        },
                    };
                });
            },
        }),
        {
            // Konfiguracja persystencji — klucz w AsyncStorage i adapter do przechowywania
            name: 'silownia26-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
