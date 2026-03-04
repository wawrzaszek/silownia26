import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Exercise, defaultExercises } from '../data/defaultExercises';

export interface WorkoutSet {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
}

export interface WorkoutExercise {
    id: string; // unique for this session/plan
    exerciseId: string;
    sets: WorkoutSet[];
}

export interface WorkoutPlan {
    id: string;
    name: string;
    exercises: WorkoutExercise[];
}

export interface WorkoutSession {
    id: string;
    planId?: string; // If null, it was a fast empty workout
    startTime: number;
    endTime?: number;
    exercises: WorkoutExercise[];
}

interface WorkoutStoreState {
    exercises: Exercise[];
    plans: WorkoutPlan[];
    sessions: WorkoutSession[];
    activeSession: WorkoutSession | null;

    // Actions
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

export const useWorkoutStore = create<WorkoutStoreState>()(
    persist(
        (set, get) => ({
            exercises: [...defaultExercises],
            plans: [],
            sessions: [],
            activeSession: null,

            addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),
            deletePlan: (id) => set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),

            startSession: (planId) => {
                const state = get();
                if (state.activeSession) return; // Prevent starting a new session if one is active

                let initialExercises: WorkoutExercise[] = [];
                if (planId) {
                    const plan = state.plans.find((p) => p.id === planId);
                    if (plan) {
                        // Deep copy plan exercises
                        initialExercises = JSON.parse(JSON.stringify(plan.exercises));
                        // Reset completion
                        initialExercises.forEach(ex => {
                            ex.sets.forEach(s => s.completed = false);
                        });
                    }
                }

                set({
                    activeSession: {
                        id: Date.now().toString(),
                        planId,
                        startTime: Date.now(),
                        exercises: initialExercises,
                    },
                });
            },

            addExerciseToActiveSession: (exerciseId) => {
                set((state) => {
                    if (!state.activeSession) return state;
                    const newWorkoutExercise: WorkoutExercise = {
                        id: Date.now().toString(), // Unique ID for this instance in the session
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

            updateSetInActiveSession: (exerciseId, setId, updates) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const newExercises = state.activeSession.exercises.map((ex) => {
                        if (ex.id !== exerciseId) return ex;
                        const newSets = ex.sets.map((s) => {
                            if (s.id !== setId) return s;
                            return { ...s, ...updates };
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

            addSetToActiveSession: (exerciseId) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const newExercises = state.activeSession.exercises.map((ex) => {
                        if (ex.id !== exerciseId) return ex;
                        const lastSet = ex.sets.length > 0 ? ex.sets[ex.sets.length - 1] : { reps: 0, weight: 0 };
                        return {
                            ...ex,
                            sets: [
                                ...ex.sets,
                                {
                                    id: Date.now().toString() + Math.random().toString(),
                                    reps: lastSet.reps,
                                    weight: lastSet.weight,
                                    completed: false,
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

            finishSession: () => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const finishedSession: WorkoutSession = {
                        ...state.activeSession,
                        endTime: Date.now(),
                    };

                    return {
                        ...state,
                        sessions: [...state.sessions, finishedSession],
                        activeSession: null,
                    };
                });
            },

            cancelSession: () => {
                set({ activeSession: null });
            },

            deleteSetFromActiveSession: (exerciseId, setId) => {
                set((state) => {
                    if (!state.activeSession) return state;

                    const newExercises = state.activeSession.exercises.map((ex) => {
                        if (ex.id !== exerciseId) return ex;
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

            deleteExerciseFromActiveSession: (exerciseId) => {
                set((state) => {
                    if (!state.activeSession) return state;

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
            name: 'silownia26-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
