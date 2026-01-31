
export interface MusclePath {
    path: string;
    name: string;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
}

// Coordinate System: 0-100 X, 0-100 Y (16:9 Aspect Ratio Container)
// Panel 1 (Left Profile): 0-33.3 | Ear ~5, Eye ~25, Nose ~33
// Panel 2 (Anterior): 33.3-66.6 | Nose ~50
// Panel 3 (Right Profile): 66.6-100 | Nose ~66, Eye ~75, Ear ~95

export const TRIPTYCH_ANATOMY: Record<string, MusclePath[]> = {
    // --- PANEL 2: ANTERIOR (FRONTAL) 33-66% ---
    frontalis_main: [
        {
            name: "Frontalis (Main Belly)",
            path: "M 38,15 Q 50,12 62,15 L 64,30 Q 50,33 36,30 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.15,
            stroke: "#cc7e6d",
            strokeWidth: 0.2
        },
        {
            name: "Frontalis (Aponeurosis Edge)",
            path: "M 38,15 Q 50,10 62,15",
            fill: "none",
            stroke: "#cc7e6d",
            strokeWidth: 0.1,
            fillOpacity: 0
        }
    ],
    glabella_complex: [
        {
            name: "Procerus",
            path: "M 48.5,35 L 50,33 L 51.5,35 L 51.5,45 Q 50,47 48.5,45 Z",
            fill: "#b86d5e",
            fillOpacity: 0.25,
            stroke: "#b86d5e",
            strokeWidth: 0.3
        },
        {
            name: "Corrugator (Left Medial)",
            path: "M 51.5,38 L 56,36 Q 58,37 57,39 L 52,40 Z",
            fill: "#a65d4e",
            fillOpacity: 0.3,
            stroke: "#a65d4e",
            strokeWidth: 0.3
        },
        {
            name: "Corrugator (Right Medial)",
            path: "M 48.5,38 L 44,36 Q 42,37 43,39 L 48,40 Z",
            fill: "#a65d4e",
            fillOpacity: 0.3,
            stroke: "#a65d4e",
            strokeWidth: 0.3
        }
    ],
    orbicularis_anterior: [
        {
            name: "Orbicularis Oculi (Left)",
            path: "M 53,42 A 4.5 3.5 0 1 1 53,49 A 4.5 3.5 0 1 1 53,42 M 52,43 A 3 2 0 1 0 52,48 A 3 2 0 1 0 52,43",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.15
        },
        {
            name: "Orbicularis Oculi (Right)",
            path: "M 47,42 A 4.5 3.5 0 1 0 47,49 A 4.5 3.5 0 1 0 47,42 M 48,43 A 3 2 0 1 1 48,48 A 3 2 0 1 1 48,43",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.15
        }
    ],
    nasalis_anterior: [
        {
            name: "Nasalis (Transverse)",
            path: "M 47,52 Q 50,50 53,52 L 52,56 Q 50,54 48,56 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.2,
            stroke: "#cc7e6d",
            strokeWidth: 0.2
        }
    ],

    // --- PANEL 1: LEFT PROFILE (PATIENT LOOKING RIGHT) 0-33% ---
    // Shows Patient's LEFT side in PROFILE. Ear ~5, Eye ~25, Nose ~33.
    left_profile_muscles: [
        {
            name: "Frontalis (Left Profile)",
            path: "M 10,18 Q 20,12 28,16 L 28,32 Q 18,34 10,32 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        },
        {
            name: "Orbicularis Oculi (Left Profile)",
            path: "M 22,43 A 3 4 0 0 1 25,47 L 22,50 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.15,
            stroke: "#cc7e6d",
            strokeWidth: 0.2
        },
        {
            name: "Crows Feet Fan (Left Profile)",
            path: "M 19,45 L 14,44 M 19,47 L 13,47 M 19,49 L 14,50",
            fill: "none",
            stroke: "#cc7e6d",
            strokeWidth: 0.3,
            fillOpacity: 0
        },
        {
            name: "Zygomaticus Major (Left Profile)",
            path: "M 12,55 L 22,62 L 24,60 L 14,53 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        }
    ],

    // --- PANEL 3: RIGHT PROFILE (PATIENT LOOKING LEFT) 66-100% ---
    // Shows Patient's RIGHT side in PROFILE. Nose ~66, Eye ~75, Ear ~95.
    right_profile_muscles: [
        {
            name: "Frontalis (Right Profile)",
            path: "M 90,18 Q 80,12 72,16 L 72,32 Q 82,34 90,32 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        },
        {
            name: "Orbicularis Oculi (Right Profile)",
            path: "M 78,43 A 3 4 0 0 0 75,47 L 78,50 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.15,
            stroke: "#cc7e6d",
            strokeWidth: 0.2
        },
        {
            name: "Crows Feet Fan (Right Profile)",
            path: "M 81,45 L 86,44 M 81,47 L 87,47 M 81,49 L 86,50",
            fill: "none",
            stroke: "#cc7e6d",
            strokeWidth: 0.3,
            fillOpacity: 0
        },
         {
            name: "Zygomaticus Major (Right Profile)",
            path: "M 88,55 L 78,62 L 76,60 L 86,53 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        }
    ]
};
