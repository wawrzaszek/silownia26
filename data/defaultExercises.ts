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
// Rozszerzona baza o najpopularniejsze ćwiczenia siłowe
export const defaultExercises: Exercise[] = [
    // KLATKA PIERSIOWA
    { id: '1', name: 'Wyciskanie sztangi leżąc', bodyPart: 'Klatka piersiowa', equipment: 'Sztanga' },
    { id: '7', name: 'Rozpiętki z hantlami', bodyPart: 'Klatka piersiowa', equipment: 'Hantle' },
    { id: '11', name: 'Wyciskanie hantli na skosie dodatnim', bodyPart: 'Klatka piersiowa', equipment: 'Hantle' },
    { id: '12', name: 'Pompki na poręczach (Dips) - wersja na klatkę', bodyPart: 'Klatka piersiowa', equipment: 'Masa ciała' },
    { id: '13', name: 'Wyciskanie na maszynie Hammer', bodyPart: 'Klatka piersiowa', equipment: 'Maszyna' },
    { id: '14', name: 'Krzyżowanie linek wyciągu górnego', bodyPart: 'Klatka piersiowa', equipment: 'Brama (Wyciąg)' },

    // PLECY
    { id: '2', name: 'Martwy ciąg', bodyPart: 'Plecy', equipment: 'Sztanga' },
    { id: '5', name: 'Wiosłowanie sztangą w opadzie', bodyPart: 'Plecy', equipment: 'Sztanga' },
    { id: '6', name: 'Podciąganie na drążku (Nachwyt)', bodyPart: 'Plecy', equipment: 'Masa ciała' },
    { id: '15', name: 'Ściąganie drążka wyciągu górnego do klatki', bodyPart: 'Plecy', equipment: 'Brama (Wyciąg)' },
    { id: '16', name: 'Wiosłowanie hantlem jednorącz', bodyPart: 'Plecy', equipment: 'Hantle' },
    { id: '17', name: 'Przyciąganie linki wyciągu dolnego do brzucha', bodyPart: 'Plecy', equipment: 'Brama (Wyciąg)' },
    { id: '18', name: 'Unoszenie tułowia z opadu (Prostowniki)', bodyPart: 'Plecy', equipment: 'Inne' },

    // NOGI
    { id: '3', name: 'Przysiady ze sztangą (High Bar)', bodyPart: 'Nogi', equipment: 'Sztanga' },
    { id: '10', name: 'Wykroki z hantlami', bodyPart: 'Nogi', equipment: 'Hantle' },
    { id: '19', name: 'Wypychanie ciężaru na suwnicy', bodyPart: 'Nogi', equipment: 'Maszyna' },
    { id: '20', name: 'Uginanie nóg leżąc (Dwugłowe)', bodyPart: 'Nogi', equipment: 'Maszyna' },
    { id: '21', name: 'Wyprosty nóg na maszynie (Czworogłowe)', bodyPart: 'Nogi', equipment: 'Maszyna' },
    { id: '22', name: 'Przysiad Bułgarski', bodyPart: 'Nogi', equipment: 'Hantle' },
    { id: '23', name: 'Martwy ciąg na prostych nogach', bodyPart: 'Nogi', equipment: 'Sztanga' },

    // BARKI
    { id: '4', name: 'Wyciskanie żołnierskie (OHP)', bodyPart: 'Barki', equipment: 'Sztanga' },
    { id: '24', name: 'Wznosy hantli bokiem', bodyPart: 'Barki', equipment: 'Hantle' },
    { id: '25', name: 'Wyciskanie hantli nad głowę siedząc', bodyPart: 'Barki', equipment: 'Hantle' },
    { id: '26', name: 'Facepulls (Przyciąganie liny do twarzy)', bodyPart: 'Barki', equipment: 'Brama (Wyciąg)' },
    { id: '27', name: 'Wznosy hantli w opadzie (Tył barku)', bodyPart: 'Barki', equipment: 'Hantle' },

    // BICEPS
    { id: '8', name: 'Uginanie ramion ze sztangą', bodyPart: 'Biceps', equipment: 'Sztanga' },
    { id: '28', name: 'Uginanie ramion z hantlami (Chwyt młotkowy)', bodyPart: 'Biceps', equipment: 'Hantle' },
    { id: '29', name: 'Modlitewnik ze sztangą łamaną', bodyPart: 'Biceps', equipment: 'Sztanga' },
    { id: '30', name: 'Uginanie ramion na wyciągu dolnym', bodyPart: 'Biceps', equipment: 'Brama (Wyciąg)' },

    // TRICEPS
    { id: '9', name: 'Wyciskanie francuskie sztangi łamanej', bodyPart: 'Triceps', equipment: 'Sztanga' },
    { id: '31', name: 'Prostowanie ramion z linką wyciągu górnego', bodyPart: 'Triceps', equipment: 'Brama (Wyciąg)' },
    { id: '32', name: 'Wyciskanie sztangi w wąskim chwycie', bodyPart: 'Triceps', equipment: 'Sztanga' },
    { id: '33', name: 'Pompki na poręczach - wersja na triceps', bodyPart: 'Triceps', equipment: 'Masa ciała' },

    // BRZUCH
    { id: '34', name: 'Allahy (Skłony na wyciągu)', bodyPart: 'Brzuch', equipment: 'Brama (Wyciąg)' },
    { id: '35', name: 'Unoszenie nóg w zwisie', bodyPart: 'Brzuch', equipment: 'Masa ciała' },
    { id: '36', name: 'Plank (Deska)', bodyPart: 'Brzuch', equipment: 'Masa ciała' },
    { id: '37', name: 'Russian Twist', bodyPart: 'Brzuch', equipment: 'Inne' },

    // ŁYDKI
    { id: '38', name: 'Wspięcia na palce stojąc', bodyPart: 'Łydki', equipment: 'Sztanga' },
    { id: '39', name: 'Wspięcia na palce siedząc', bodyPart: 'Łydki', equipment: 'Maszyna' },
    { id: '40', name: 'Ośle wspięcia', bodyPart: 'Łydki', equipment: 'Maszyna' },
];
