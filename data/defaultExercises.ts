export type BodyPart =
    | 'Klatka piersiowa'
    | 'Plecy'
    | 'Nogi'
    | 'Barki'
    | 'Biceps'
    | 'Triceps'
    | 'Brzuch'
    | 'Łydki';

export type Equipment =
    | 'Sztanga'
    | 'Hantle'
    | 'Maszyna'
    | 'Brama (Wyciąg)'
    | 'Masa ciała'
    | 'Inne';

export interface Exercise {
    id: string;
    name: string;
    bodyPart: BodyPart;
    equipment: Equipment;
}

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
