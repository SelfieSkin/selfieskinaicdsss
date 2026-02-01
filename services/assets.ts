
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
    // Shows Patient's LEFT side in PROFILE. Ear ~5, Eye ~28.
    left_profile_muscles: [
        {
            name: "Temporalis (Left Profile)",
            // Fan shape from ear (left) extending up/forward
            path: "M 5,30 Q 2,20 8,15 Q 15,12 20,18 L 18,35 Q 12,38 5,30 Z",
            fill: "#b86d5e",
            fillOpacity: 0.15,
            stroke: "none"
        },
        {
            name: "Frontalis (Left Profile)",
            // Side view strip of forehead
            path: "M 20,18 Q 28,15 30,22 L 30,32 L 20,32 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        },
        {
            name: "Orbicularis Oculi (Left Profile)",
            // C-shape around the eye location (approx x=28, y=45)
            path: "M 28,42 Q 22,45 28,50 L 30,50 Q 25,45 30,42 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.2,
            stroke: "#cc7e6d",
            strokeWidth: 0.15
        }
    ],

    // --- PANEL 3: RIGHT PROFILE (PATIENT LOOKING LEFT) 66-100% ---
    // Shows Patient's RIGHT side in PROFILE. Eye ~72, Ear ~95.
    right_profile_muscles: [
        {
            name: "Temporalis (Right Profile)",
            // Fan shape from ear (right) extending up/forward (mirrored)
            path: "M 95,30 Q 98,20 92,15 Q 85,12 80,18 L 82,35 Q 88,38 95,30 Z",
            fill: "#b86d5e",
            fillOpacity: 0.15,
            stroke: "none"
        },
        {
            name: "Frontalis (Right Profile)",
            // Side view strip
            path: "M 80,18 Q 72,15 70,22 L 70,32 L 80,32 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.1,
            stroke: "#cc7e6d",
            strokeWidth: 0.1
        },
        {
            name: "Orbicularis Oculi (Right Profile)",
            // C-shape around eye location (approx x=72, y=45)
            path: "M 72,42 Q 78,45 72,50 L 70,50 Q 75,45 70,42 Z",
            fill: "#cc7e6d",
            fillOpacity: 0.2,
            stroke: "#cc7e6d",
            strokeWidth: 0.15
        }
    ]
};
