// ============================================================
// SŁOWNIK JĘZYKOWY (i18n)
// ============================================================
// Przechowuje stałe tekstowe dla języka polskiego i angielskiego.
// Pozwala to na dynamiczną zmianę tekstu w aplikacji na żywo.
// ============================================================

export type AppLanguage = 'pl' | 'en';

export const translations = {
  pl: {
    tabs: {
        home: 'START',
        trainer: 'TRENER',
        food: 'DIETA',
        profile: 'PROFIL',
    },
    dashboard: {
        greeting: 'Cześć',
        streak: 'Dni w tym tygodniu',
        calories: 'Dzisiejsze kalorie',
        addMeal: '+ Dodaj posiłek',
        protein: 'Białko',
        carbs: 'Węglowodany',
        fats: 'Tłuszcz',
        workout: 'Twój Trening',
        startWorkout: 'Rozpocznij',
    },
    profile: {
        title: 'TWÓJ PROFIL',
        beginner: 'POCZĄTKUJĄCY',
        account: 'KONTO',
        settings: 'USTAWIENIA KONTA',
        notifications: 'POWIADOMIENIA',
        preferences: 'PREFERENCJE',
        help: 'POMOC I WSPARCIE',
        language: 'Język / Language',
        history: 'HISTORIA TRENINGÓW',
        emptyHistory: 'Brak zapisanych treningów, czas wziąć się do pracy.',
        loginTitle: 'WITAJ W KUŹNI',
        loginSubtitle: 'Jak mamy się do Ciebie zwracać?',
        loginButton: 'ZAPISZ PROFIL',
        logout: 'WYLOGUJ SIĘ',
        pushNotifications: 'Włącz powiadomienia (Push)',
        status: 'ZWERYFIKOWANY'
    },
    food: {
        title: 'DODAJ POSIŁEK',
        subtitle: 'Zanotuj co zjadłeś, żeby utrzymać maszynę w ruchu.',
        cals: 'Kalorie (kcal)',
        protein: 'Białko (g)',
        carbs: 'Węglowodany (g)',
        fats: 'Tłuszcze (g)',
        save: 'Zapisz w Dzienniku'
    },
    workout: {
        title: 'Trening',
        startEmpty: 'Rozpocznij pusty trening',
        fastStart: 'Szybki start bez planu',
        myTemplates: 'Moje szablony',
        noTemplates: 'Brak szablonów',
        createFirst: 'Stwórz swój pierwszy plan treningowy.',
        activeWorkout: 'Trwa trening',
        finish: 'Zakończ',
        addSet: 'Dodaj serię',
        addExercise: 'Dodaj ćwiczenie',
        cancelWorkout: 'Anuluj trening',
        rest: 'ODPOCZYNEK:',
        workoutDone: 'TRENING UKOŃCZONY!',
        goodJob: 'Dobra robota!',
        time: 'CZAS (MIN)',
        volume: 'OBJĘTOŚĆ (KG)',
        sets: 'SERII',
        saveExit: 'ZAPISZ I WYJDŹ',
        set: 'Seria',
        reps: 'Powt.',
    }
  },
  en: {
    tabs: {
        home: 'HOME',
        trainer: 'TRAINER',
        food: 'FOOD',
        profile: 'PROFILE',
    },
    dashboard: {
        greeting: 'Hello',
        streak: 'Days this week',
        calories: 'Today\'s Calories',
        addMeal: '+ Add Meal',
        protein: 'Protein',
        carbs: 'Carbs',
        fats: 'Fats',
        workout: 'Your Workout',
        startWorkout: 'Start',
    },
    profile: {
        title: 'YOUR PROFILE',
        beginner: 'BEGINNER',
        account: 'ACCOUNT',
        settings: 'ACCOUNT SETTINGS',
        notifications: 'NOTIFICATIONS',
        preferences: 'PREFERENCES',
        help: 'HELP & SUPPORT',
        language: 'Language / Język',
        history: 'WORKOUT HISTORY',
        emptyHistory: 'No saved workouts yet. Time to get to work.',
        loginTitle: 'WELCOME TO FORGE',
        loginSubtitle: 'How should we call you?',
        loginButton: 'SAVE PROFILE',
        logout: 'LOG OUT',
        pushNotifications: 'Enable Push Notifications',
        status: 'VERIFIED'
    },
    food: {
        title: 'ADD MEAL',
        subtitle: 'Log your food to keep the machine running.',
        cals: 'Calories (kcal)',
        protein: 'Protein (g)',
        carbs: 'Carbs (g)',
        fats: 'Fats (g)',
        save: 'Save to Diary'
    },
    workout: {
        title: 'Workout',
        startEmpty: 'Start Empty Workout',
        fastStart: 'Quick start without plan',
        myTemplates: 'My Templates',
        noTemplates: 'No templates',
        createFirst: 'Create your first workout plan.',
        activeWorkout: 'Workout in progress',
        finish: 'Finish',
        addSet: 'Add Set',
        addExercise: 'Add Exercise',
        cancelWorkout: 'Cancel Workout',
        rest: 'REST TIME:',
        workoutDone: 'WORKOUT COMPLETE!',
        goodJob: 'Great job!',
        time: 'TIME (MIN)',
        volume: 'VOLUME (KG)',
        sets: 'SETS',
        saveExit: 'SAVE & EXIT',
        set: 'Set',
        reps: 'Reps',
    }
  }
};
