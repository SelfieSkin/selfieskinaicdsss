
export interface MusclePath {
    path: string;
    name: string;
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
}

// Coordinate System: 0-100 X, 0-100 Y (16:9 Aspect Ratio Container)
// Panel 1 (Left Profile): 0-33.3
// Panel 2 (Anterior): 33.3-66.6
// Panel 3 (Right Profile): 66.6-100

const COMMON_STYLES = {
    fill: "#cc7e6d",
    fillOpacity: 0.15,
    stroke: "#cc7e6d",
    strokeWidth: 0.15
};

// --- FEMALE PRESENTING ANATOMY (Tapered, Arched, Slender Neck) ---
export const FEMALE_ANATOMY: Record<string, MusclePath[]> = {
    // ANTERIOR (33.3 - 66.6)
    anterior: [
        {
            name: "Frontalis (Female - Arched)",
            path: "M 38,15 Q 50,10 62,15 L 63,28 Q 50,32 37,28 Z", // Higher arch
            ...COMMON_STYLES
        },
        {
            name: "Glabella Complex",
            path: "M 48,35 L 52,35 L 51,42 L 49,42 Z", // Procerus
            fill: "#b86d5e", fillOpacity: 0.25, stroke: "none"
        },
        {
            name: "Corrugator Supercilii",
            path: "M 48,36 Q 44,35 43,37 L 48,38 M 52,36 Q 56,35 57,37 L 52,38",
            fill: "#a65d4e", fillOpacity: 0.3, stroke: "none"
        },
        {
            name: "Orbicularis Oculi (Left)",
            path: "M 53,42 A 4.5 3.5 0 1 1 53,49 A 4.5 3.5 0 1 1 53,42",
            ...COMMON_STYLES
        },
        {
            name: "Orbicularis Oculi (Right)",
            path: "M 47,42 A 4.5 3.5 0 1 0 47,49 A 4.5 3.5 0 1 0 47,42",
            ...COMMON_STYLES
        },
        {
            name: "Nasalis",
            path: "M 47,52 Q 50,50 53,52 L 52,55 Q 50,53 48,55 Z",
            ...COMMON_STYLES
        },
        // NECK - Anterior Platysma
        {
            name: "Platysma (Anterior - Left)",
            path: "M 55,75 L 60,95 L 52,95 L 52,78 Z",
            fill: "#d48f80", fillOpacity: 0.1, stroke: "none"
        },
        {
             name: "Platysma (Anterior - Right)",
             path: "M 45,75 L 40,95 L 48,95 L 48,78 Z",
             fill: "#d48f80", fillOpacity: 0.1, stroke: "none"
        }
    ],

    // LEFT PROFILE (0 - 33.3)
    left_profile: [
        {
            name: "Temporalis (Left)",
            path: "M 6,20 Q 15,12 22,20 L 22,35 Q 12,36 6,32 Z",
            fill: "#b86d5e", fillOpacity: 0.15, stroke: "none"
        },
        {
            name: "Orbicularis Oculi (Left Lateral)",
            path: "M 25,43 Q 22,46 25,49 L 26,48 Q 24,46 26,44 Z",
            ...COMMON_STYLES
        },
        {
            name: "Masseter (Left)",
            path: "M 15,55 L 22,58 L 20,75 L 12,72 Z",
            fill: "#cc7e6d", fillOpacity: 0.15, stroke: "#cc7e6d", strokeWidth: 0.1
        },
        {
            name: "Platysma (Left Lateral)",
            path: "M 12,72 L 20,75 L 22,95 L 8,95 Z", // Slender neck
            fill: "#d48f80", fillOpacity: 0.1, stroke: "none"
        }
    ],

    // RIGHT PROFILE (66.6 - 100)
    right_profile: [
        {
            name: "Temporalis (Right)",
            path: "M 94,20 Q 85,12 78,20 L 78,35 Q 88,36 94,32 Z",
            fill: "#b86d5e", fillOpacity: 0.15, stroke: "none"
        },
        {
            name: "Orbicularis Oculi (Right Lateral)",
            path: "M 75,43 Q 78,46 75,49 L 74,48 Q 76,46 74,44 Z",
            ...COMMON_STYLES
        },
         {
            name: "Masseter (Right)",
            path: "M 85,55 L 78,58 L 80,75 L 88,72 Z",
            fill: "#cc7e6d", fillOpacity: 0.15, stroke: "#cc7e6d", strokeWidth: 0.1
        },
        {
            name: "Platysma (Right Lateral)",
            path: "M 88,72 L 80,75 L 78,95 L 92,95 Z",
            fill: "#d48f80", fillOpacity: 0.1, stroke: "none"
        }
    ]
};

// --- MALE PRESENTING ANATOMY (Broader, Heavier Brow, Thicker Neck) ---
export const MALE_ANATOMY: Record<string, MusclePath[]> = {
    // ANTERIOR
    anterior: [
        {
            name: "Frontalis (Male - Broad/Flat)",
            path: "M 36,18 Q 50,16 64,18 L 65,32 Q 50,34 35,32 Z", // Flatter, wider
            fill: "#cc7e6d", fillOpacity: 0.2, stroke: "#cc7e6d", strokeWidth: 0.2
        },
        {
            name: "Glabella Complex (Hypertrophic)",
            path: "M 48,36 L 52,36 L 52,44 L 48,44 Z", // Stronger Procerus
            fill: "#a85d4e", fillOpacity: 0.3, stroke: "none"
        },
         {
            name: "Corrugator Supercilii",
            path: "M 48,38 Q 42,37 41,39 L 48,41 M 52,38 Q 58,37 59,39 L 52,41", // Thicker
            fill: "#964d3e", fillOpacity: 0.35, stroke: "none"
        },
        {
            name: "Orbicularis Oculi (Left)",
            path: "M 54,42 A 4.5 4 0 1 1 54,50 A 4.5 4 0 1 1 54,42",
            ...COMMON_STYLES
        },
        {
            name: "Orbicularis Oculi (Right)",
            path: "M 46,42 A 4.5 4 0 1 0 46,50 A 4.5 4 0 1 0 46,42",
            ...COMMON_STYLES
        },
        {
            name: "Nasalis",
            path: "M 46,53 Q 50,51 54,53 L 53,57 Q 50,55 47,57 Z",
            ...COMMON_STYLES
        },
        // NECK - Thicker Anterior Platysma
        {
            name: "Platysma (Anterior - Left)",
            path: "M 56,72 L 63,98 L 51,98 L 51,75 Z",
            fill: "#d48f80", fillOpacity: 0.15, stroke: "none"
        },
        {
             name: "Platysma (Anterior - Right)",
             path: "M 44,72 L 37,98 L 49,98 L 49,75 Z",
             fill: "#d48f80", fillOpacity: 0.15, stroke: "none"
        }
    ],

    // LEFT PROFILE
    left_profile: [
        {
            name: "Temporalis (Left)",
            path: "M 4,20 Q 15,10 24,20 L 24,38 Q 12,40 4,35 Z", // Broader fan
            fill: "#b86d5e", fillOpacity: 0.15, stroke: "none"
        },
        {
            name: "Orbicularis Oculi (Left Lateral)",
            path: "M 27,43 Q 23,46 27,50 L 28,49 Q 25,46 28,44 Z",
            ...COMMON_STYLES
        },
        {
            name: "Masseter (Left - Squared)",
            path: "M 14,55 L 24,58 L 22,78 L 10,75 Z", // Squared jaw
            fill: "#cc7e6d", fillOpacity: 0.2, stroke: "#cc7e6d", strokeWidth: 0.15
        },
        {
            name: "Platysma (Left Lateral)",
            path: "M 10,75 L 22,78 L 24,98 L 5,98 Z", // Thick neck
            fill: "#d48f80", fillOpacity: 0.15, stroke: "none"
        }
    ],

    // RIGHT PROFILE
    right_profile: [
        {
            name: "Temporalis (Right)",
            path: "M 96,20 Q 85,10 76,20 L 76,38 Q 88,40 96,35 Z",
            fill: "#b86d5e", fillOpacity: 0.15, stroke: "none"
        },
        {
            name: "Orbicularis Oculi (Right Lateral)",
            path: "M 73,43 Q 77,46 73,50 L 72,49 Q 75,46 72,44 Z",
            ...COMMON_STYLES
        },
        {
            name: "Masseter (Right - Squared)",
            path: "M 86,55 L 76,58 L 78,78 L 90,75 Z",
            fill: "#cc7e6d", fillOpacity: 0.2, stroke: "#cc7e6d", strokeWidth: 0.15
        },
        {
            name: "Platysma (Right Lateral)",
            path: "M 90,75 L 78,78 L 76,98 L 95,98 Z",
            fill: "#d48f80", fillOpacity: 0.15, stroke: "none"
        }
    ]
};
