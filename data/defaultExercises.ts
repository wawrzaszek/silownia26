// ============================================================
// BAZA DANYCH ĆWICZEŃ — domyślna lista ćwiczeń w aplikacji
// ============================================================
// Ten plik zawiera typy (TypeScript) i domyślne ćwiczenia,
// które są ładowane do store'u przy pierwszym uruchomieniu aplikacji.
// Możesz tutaj dodawać nowe ćwiczenia, rozszerzać listę części ciała
// lub zmieniać dostępny sprzęt.
// ============================================================

// Typ pomocniczy — lista dozwolonych nazw partii mięśniowych
// (używamy go, żeby TypeScript poinformował o błędzie przy literówce)
export type BodyPart =
    | 'Klatka piersiowa'
    | 'Plecy'
    | 'Nogi'
    | 'Barki'
    | 'Biceps'
    | 'Triceps'
    | 'Brzuch'
    | 'Łydki';

// Typ pomocniczy — lista dozwolonego sprzętu siłowni
export type Equipment =
    | 'Sztanga'
    | 'Hantle'
    | 'Maszyna'
    | 'Brama (Wyciąg)'
    | 'Masa ciała'
    | 'Inne';

// Interfejs (TypeScript) — kształt obiektu ćwiczenia
// Każde ćwiczenie ma ID, nazwę, partię ciała i typ sprzętu
export interface Exercise {
    id: string;
    name: string;
    bodyPart: BodyPart;
    equipment: Equipment;
}

// Lista domyślnych ćwiczeń — ładowana przy pierwszym uruchomieniu appki
// WSKAZÓWKA: żeby dodać ćwiczenie, dopisz nowy obiekt w tym formacie:
// { id: '11', name: 'Nazwa ćwiczenia', bodyPart: 'Partia', equipment: 'Sprzęt' }
export const defaultExercises: Exercise[] = [
    { id: '1', name: 'Wyciskanie sztangi leżąc', bodyPart: 'Klatka piersiowa', equipment: 'Sztanga' },
    { id: '2', name: 'Martwy ciąg', bodyPart: 'Plecy', equipment: 'Sztanga' },
    { id: '3', name: 'Przysiady ze sztangą', bodyPart: 'Nogi', equipment: 'Sztanga' },
    { id: '4', name: 'Wyciskanie żołnierskie', bodyPart: 'Barki', equipment: 'Sztanga' },
    { id: '5', name: 'Wiosłowanie sztangą', bodyPart: 'Plecy', equipment: 'Sztanga' },
    { id: '6', name: 'Podciąganie kierownicą (Nachwyt)', bodyPart: 'Plecy', equipment: 'Masa ciała' },
    { id: '7', name: 'Rozpiętki z hantlami', bodyPart: 'Klatka piersiowa', equipment: 'Hantle' },
    { id: '8', name: 'Uginanie ramion ze sztangą', bodyPart: 'Biceps', equipment: 'Sztanga' },
    { id: '9', name: 'Francuskie wyciskanie', bodyPart: 'Triceps', equipment: 'Sztanga' },
    { id: '10', name: 'Wykroki z hantlami', bodyPart: 'Nogi', equipment: 'Hantle' },
];
