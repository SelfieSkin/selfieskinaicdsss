
export interface MusclePath {
    path: string;
    name: string;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
}

// Coordinate System: 0-100 X, 0-100 Y (16:9 Aspect Ratio Container)
// Panel 1 (Left Oblique): 0-33.3 | Nose ~33, Ear ~5
// Panel 2 (Anterior): 33.3-66.6 | Nose ~50
// Panel 3 (Right Oblique): 66.6-100 | Nose ~66, Ear ~95

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

    // --- PANEL 1: LEFT OBLIQUE (PATIENT LOOKING RIGHT) 0-33% ---
    // Shows Patient's LEFT side. Nose at ~33. Ear at ~5.
    left_oblique_muscles: [
        {
            name: "Frontalis (Lateral Left)",
            path: "M 10,18 Q 20,15 28,18 L 29,30 Q 20,32 10,28 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        },
        {
            name: "Orbicularis Oculi (Lateral Left View)",
            path: "M 22,42 A 5 4 0 1 1 22,50 L 20,46 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.15,
            stroke: "#cc7e6d",
            strokeWidth: 0.2
        },
        {
            name: "Crows Feet Fan (Left)",
            path: "M 17,44 L 12,42 M 17,46 L 11,46 M 17,48 L 12,50",
            fill: "none",
            stroke: "#cc7e6d",
            strokeWidth: 0.3,
            fillOpacity: 0
        },
        {
            name: "Zygomaticus Major (Left origin)",
            path: "M 15,55 L 25,65 L 27,63 L 17,53 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        }
    ],

    // --- PANEL 3: RIGHT OBLIQUE (PATIENT LOOKING LEFT) 66-100% ---
    // Shows Patient's RIGHT side. Nose at ~66. Ear at ~95.
    right_oblique_muscles: [
        {
            name: "Frontalis (Lateral Right)",
            path: "M 90,18 Q 80,15 72,18 L 71,30 Q 80,32 90,28 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        },
        {
            name: "Orbicularis Oculi (Lateral Right View)",
            path: "M 78,42 A 5 4 0 1 0 78,50 L 80,46 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.15,
            stroke: "#cc7e6d",
            strokeWidth: 0.2
        },
        {
            name: "Crows Feet Fan (Right)",
            path: "M 83,44 L 88,42 M 83,46 L 89,46 M 83,48 L 88,50",
            fill: "none",
            stroke: "#cc7e6d",
            strokeWidth: 0.3,
            fillOpacity: 0
        },
         {
            name: "Zygomaticus Major (Right origin)",
            path: "M 85,55 L 75,65 L 73,63 L 83,53 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        }
    ]
};
