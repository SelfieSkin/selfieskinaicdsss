
import { PatientGender } from './types';

export const BRAND_SAGE = '#B2AC88';
export const BRAND_CORAL = '#E2725B';
export const BRAND_CREAM = '#F2E5CF';

export const AIMS_DOSING_NOTE = "Observation: AI models (AIMS Protocol) typically recommend conservative dosages compared to expert clinicians to minimize adverse event risks. Your recorded deviations are critical for improving the system's contextual sensitivity.";

export const SYSTEM_INSTRUCTION = `
You are SelfieSkin, an AI Clinical Decision Support System (AI-CDSS) for aesthetic medicine. Your users are licensed healthcare providers only (MD, NP, PA, RN).

Your scope is STRICTLY limited to the UPPER FACE:
1. Crow’s Feet (Orbicularis Oculi)
2. Bunny Lines (Nasalis)
3. Forehead (Frontalis)
4. Lower Eyelids (Inferior Orbicularis Oculi)
5. Glabella (Procerus, Corrugator Supercilii, Nasalis)

Hard constraints:
1) Non-interchangeability: Treat OnabotulinumtoxinA (Ona), AbobotulinumtoxinA (Abo), and DaxibotulinumtoxinA (Daxxify) as distinct biologic products with non-interchangeable units.
2) Human-in-the-loop: Every output must clearly state it is a recommendation.
3) Safety-first: Prioritize “danger zones” and complication prevention (ptosis, diplopia).

**CLINICAL INDICATIONS & ASYMMETRY DETECTION:**
You must actively screen for and classify:
- **"Spock Brow" (Lateral Brow Elevation):** Unilateral or bilateral overactivity of the lateral frontalis with relative medial relaxation. Treatment: Target lateral frontalis fibers (typically 1-2U Ona) 2cm above the orbital rim.
- **Brow Asymmetry:** Identify resting height differences or dynamic recruitment variance.
- **Compensatory Recruitment:** E.g., Eyebrow elevation during eye closure.

**CRITICAL RULE FOR TRYPTYCH COORDINATES (16:9 Aspect Ratio):**
The visual map consists of 3 panels showing EXTREME CLOSE-UP HEADSHOTS (Neck Up). Coordinates are percentage-based (X: 0-100, Y: 0-100).

**PANEL 1 (Left 0-33.3% x): Patient's LEFT Profile**
- View: Left Oblique (Patient turns head right).
- Content: Shows Patient's Left Eye and Left Crows Feet.
- Orientation: Ear is towards Left edge (0%). Nose towards Right edge (33%).
- **Left Crow's Feet (C1L):** X ~ 14-16%. Y ~ 46-48%. (Lateral to eye, near ear edge).
- **Left Inf. Eyelid (E1L):** X ~ 18-20%. Y ~ 52-54%.

**PANEL 2 (Center 33.3-66.6% x): Anterior / Frontal**
- View: Direct Frontal.
- Content: Glabella, Frontalis, Bunny Lines.
- Orientation: MIRROR VIEW.
  - **Patient's RIGHT side is on Image LEFT (X: 33-50%).**
  - **Patient's LEFT side is on Image RIGHT (X: 50-66%).**
- **Glabella:** Procerus (X=50). Right Corrugator (X=46-47). Left Corrugator (X=53-54).
- **Frontalis:** Right sites (X=40-48). Left sites (X=52-60).
- **Bunny Lines:** Right (X=47-48). Left (X=52-53).

**PANEL 3 (Right 66.6-100% x): Patient's RIGHT Profile**
- View: Right Oblique (Patient turns head left).
- Content: Shows Patient's Right Eye and Right Crows Feet.
- Orientation: Nose towards Left edge (66%). Ear towards Right edge (100%).
- **Right Crow's Feet (C1R):** X ~ 84-86%. Y ~ 46-48%. (Lateral to eye, near ear edge).
- **Right Inf. Eyelid (E1R):** X ~ 80-82%. Y ~ 52-54%.

**Y-AXIS MAPPING (Neck-Up Framing):**
- Hairline/Upper Forehead: y=20-25%
- Mid-Forehead: y=30-35%
- Glabella (Brows): y=40-43%
- Eye Level (Lateral Canthus): y=46-48%
- Infraorbital/Bunny Lines: y=53-56%

RESPONSE FORMAT: Return a single JSON object.
{
  "gender": "Female Presenting" | "Male Presenting",
  "step2": {
    "restingTone": string,
    "maxContraction": { "frontalis": string, "glabella": string, "orbicularis": string, "nasalis": string },
    "glabellarPattern": "V" | "U" | "Omega" | "Inverted Omega" | "Converging Arrows" | "Indeterminate",
    "observedDynamics": string
  },
  "step3": {
    "regionalPlans": Array<{ "region": string, "muscle": string, "points": number, "reasoning": string }>,
    "safetyFlags": Array<string>,
    "conservativeAdjustments": string
  },
  "step4": {
    "dosingRows": Array<{ "region": string, "onaDose": number, "aboDose25": number, "aboDose30": number, "daxDose": string, "notes": string }>,
    "dosingAssumptions": Array<string>,
    "aimsDisclaimer": string
  },
  "sites": Array<{ id, region, muscle, doseOna, label, rationale, x, y }>,
  "dangerZones": Array<{ id, region, risk }>,
  "safetyWarnings": Array<string>,
  "reconstitutionGuide": string,
  "totalDoseOna": number,
  "clinicalReport": string
}
`;

export const SAMPLE_ANALYSIS_FEMALE = {
  gender: PatientGender.FEMALE,
  step2: {
    restingTone: "Symmetric upper face. High dynamic lines in forehead.",
    maxContraction: {
      frontalis: "Type 2 recruitment (Full field) with deep rhytids.",
      glabella: "Strong V-pattern recruitment.",
      orbicularis: "Dynamic lateral canthal lines.",
      nasalis: "Active bunny lines during speech."
    },
    glabellarPattern: "V",
    observedDynamics: "High medial recruitment in glabella complex. Nasalis involvement noted."
  },
  step3: {
    regionalPlans: [
      { region: "Glabella", muscle: "Procerus + Corrugator", points: 5, reasoning: "Medial dominance focus." },
      { region: "Bunny Lines", muscle: "Nasalis", points: 2, reasoning: "Targeting lateral bridge." },
      { region: "Forehead", muscle: "Frontalis", points: 6, reasoning: "High placement microdroplets." },
      { region: "Crow's Feet", muscle: "Orbicularis", points: 6, reasoning: "3 pts per side." }
    ],
    safetyFlags: ["Avoid low frontalis"],
    conservativeAdjustments: "Reduced dose in central frontalis."
  },
  step4: {
    dosingRows: [
      { region: "Glabella", onaDose: 20, aboDose25: 50, aboDose30: 60, daxDose: "40U", notes: "Standard." },
      { region: "Bunny Lines", onaDose: 4, aboDose25: 10, aboDose30: 12, daxDose: "Off-Label", notes: "Lateral nasal." },
      { region: "Forehead", onaDose: 12, aboDose25: 30, aboDose30: 36, daxDose: "Off-Label", notes: "Conservative." },
      { region: "Crow's Feet", onaDose: 12, aboDose25: 30, aboDose30: 36, daxDose: "Off-Label", notes: "Standard." }
    ],
    dosingAssumptions: ["Standard concentration applied.", "Upper face focus."],
    aimsDisclaimer: "Clinical decision support only."
  },
  sites: [
    // --- CENTER PANEL (33-66%) ---
    // Glabella (Between Brows ~42% Y)
    // Patient Right is Image Left (X < 50). Patient Left is Image Right (X > 50).
    { id: "f-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 4, rationale: "Center.", x: 50, y: 42 },
    { id: "f-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Patient Right (Medial).", x: 47, y: 40 },
    { id: "f-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Patient Left (Medial).", x: 53, y: 40 },
    
    // Frontalis (Forehead ~25-35% Y) - Standard Omega Pattern
    { id: "f-f1r-c", label: "F1R", region: "Forehead", muscle: "Frontalis", doseOna: 2, rationale: "Patient Right (Mid).", x: 45, y: 30 },
    { id: "f-f2l-c", label: "F2L", region: "Forehead", muscle: "Frontalis", doseOna: 2, rationale: "Patient Left (Mid).", x: 55, y: 30 },
    { id: "f-f3r-c", label: "F3R", region: "Forehead", muscle: "Frontalis", doseOna: 2, rationale: "Patient Right (High).", x: 42, y: 22 },
    { id: "f-f4l-c", label: "F4L", region: "Forehead", muscle: "Frontalis", doseOna: 2, rationale: "Patient Left (High).", x: 58, y: 22 },

    // Bunny Lines (Nose ~55% Y)
    { id: "f-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 2, rationale: "Patient Right.", x: 47, y: 55 },
    { id: "f-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 2, rationale: "Patient Left.", x: 53, y: 55 },
    
    // --- OBLIQUE PANELS ---
    // Panel 1 (Left 0-33%): Left Oblique (Patient turns head RIGHT). Shows Patient LEFT side.
    // Nose is towards Image Right (33). Ear towards Image Left (0). Eye ~ 20. Lateral Canthus ~ 15.
    { id: "f-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 2, rationale: "Patient Left Lateral.", x: 15, y: 46 },
    { id: "f-e1l-l", label: "E1L", region: "Lower Eyelid", muscle: "Inf. Orbicularis", doseOna: 1, rationale: "Patient Left Inferior.", x: 19, y: 52 },

    // Panel 3 (Right 66-100%): Right Oblique (Patient turns head LEFT). Shows Patient RIGHT side.
    // Nose is towards Image Left (66). Ear towards Image Right (100). Eye ~ 80. Lateral Canthus ~ 85.
    { id: "f-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 2, rationale: "Patient Right Lateral.", x: 85, y: 46 },
    { id: "f-e1r-r", label: "E1R", region: "Lower Eyelid", muscle: "Inf. Orbicularis", doseOna: 1, rationale: "Patient Right Inferior.", x: 81, y: 52 }
  ],
  dangerZones: [{ id: "fd1", region: "Periocular", risk: "Levator palpebrae risk." }],
  safetyWarnings: ["Focus on brow symmetry."],
  reconstitutionGuide: "100U in 2.5mL saline.",
  totalDoseOna: 48,
  clinicalReport: `# SelfieSkin Clinical Report\n\n### A. Human-in-the-Loop Disclaimer\n**AIMS Protocol Active.** ...`
};

export const SAMPLE_ANALYSIS_MALE = {
  gender: PatientGender.MALE,
  step2: {
    restingTone: "Strong frontal muscle mass, horizontal lines present at rest.",
    maxContraction: {
      frontalis: "Severe recruitment, full field rhytids.",
      glabella: "U-Pattern (Global recruitment).",
      orbicularis: "Coarse static and dynamic crow's feet.",
      nasalis: "Moderate bunny line recruitment."
    },
    glabellarPattern: "U",
    observedDynamics: "Hypertrophic upper face musculature."
  },
  step3: {
    regionalPlans: [
      { region: "Glabella", muscle: "Procerus + Corrugator", points: 5, reasoning: "U-pattern heavy dose." },
      { region: "Bunny Lines", muscle: "Nasalis", points: 2, reasoning: "Treating lateral bridge." },
      { region: "Forehead", muscle: "Frontalis", points: 6, reasoning: "Broad microdroplet spread." }
    ],
    safetyFlags: ["Maintain masculine brow"],
    conservativeAdjustments: "Avoid peaked lateral arch."
  },
  step4: {
    dosingRows: [
      { region: "Glabella", onaDose: 30, aboDose25: 75, aboDose30: 90, daxDose: "40U+", notes: "Male dose." },
      { region: "Bunny Lines", onaDose: 6, aboDose25: 15, aboDose30: 18, daxDose: "Off-Label", notes: "3U/side." },
      { region: "Forehead", onaDose: 20, aboDose25: 50, aboDose30: 60, daxDose: "Off-Label", notes: "Heavy frontalis." }
    ],
    dosingAssumptions: ["Male dosing correction (+50% glabella)."],
    aimsDisclaimer: "Clinical judgment mandatory."
  },
  sites: [
    // --- CENTER PANEL (33-66%) ---
    { id: "m-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 8, rationale: "Male dose.", x: 50, y: 43 },
    { id: "m-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 7, rationale: "Pt Right.", x: 46, y: 41 },
    { id: "m-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 7, rationale: "Pt Left.", x: 54, y: 41 },
    
    // Frontalis (Male - Straighter/Lower/Broader)
    { id: "m-f1r-c", label: "F1R", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Pt Right Lat.", x: 40, y: 28 },
    { id: "m-f2r-c", label: "F2R", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Pt Right Med.", x: 46, y: 28 },
    { id: "m-f3l-c", label: "F3L", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Pt Left Med.", x: 54, y: 28 },
    { id: "m-f4l-c", label: "F4L", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Pt Left Lat.", x: 60, y: 28 },

    // Bunny Lines
    { id: "m-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Pt Right.", x: 47, y: 56 },
    { id: "m-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Pt Left.", x: 53, y: 56 },
    
    // --- OBLIQUE PANELS ---
    { id: "m-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 3, rationale: "Pt Left.", x: 15, y: 47 },
    { id: "m-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 3, rationale: "Pt Right.", x: 85, y: 47 }
  ],
  dangerZones: [{ id: "md1", region: "Supraorbital", risk: "Avoid feminizing arch." }],
  safetyWarnings: ["Higher glabella doses needed."],
  reconstitutionGuide: "100U in 1.0mL saline.",
  totalDoseOna: 56,
  clinicalReport: `# SelfieSkin Clinical Report\n\n### A. Human-in-the-Loop Disclaimer\n**AIMS Protocol Active.** ...`
};

export const KNOWLEDGE_BASE_DATA = {
  treatmentAreas: [
    {
      area: 'Upper Face Core',
      color: 'border-blue-500',
      muscles: [
        {
          name: 'Glabellar Complex & Nasalis',
          description: 'Frowning, vertical "11" lines, and nasal bunny lines.',
          indications: [
            { title: "Glabellar Rhytids", detail: "Frown lines (11s)." },
            { title: "Bunny Lines", detail: "Lines on the bridge of the nose." }
          ]
        },
        {
          name: 'Frontalis',
          description: 'Sole eyebrow elevator; horizontal lines.',
          indications: [
            { title: "Horizontal Forehead Lines", detail: "Elevation rhytids." }
          ]
        },
        {
          name: 'Orbicularis Oculi',
          description: 'Sphincter muscle around the eye.',
          indications: [
            { title: "Lateral Crow's Feet", detail: "Smiling lines." },
            { title: "Inferior Eyelid Lines", detail: "Fine lines under eye (Inf. Orbicularis)." }
          ]
        }
      ]
    }
  ],
  contraindications: [
    { title: "Hypersensitivity", description: "Allergy to BoNT components." }
  ],
  adverseEvents: [
    { title: "Ptosis", description: "Drooping of lid or brow." }
  ]
};

export const INJECTION_TECHNIQUES = {
  'Frontalis': { depth: 'Superficial Intradermal', angle: '15-30°', pearl: 'Stay high to preserve brow height.' },
  'Corrugator': { depth: 'Intramuscular', angle: '90°', pearl: 'Avoid orbital rim.' },
  'Procerus': { depth: 'Intramuscular', angle: '90°', pearl: 'Central muscle belly.' },
  'Orbicularis': { depth: 'Superficial Intradermal', angle: '10-20°', pearl: 'Stay >1.5cm from lateral canthus.' },
  'Nasalis': { depth: 'Superficial Intradermal', angle: '30°', pearl: 'Inject lateral nasal bridge.' },
  'Default': { depth: 'Standard', angle: '90°', pearl: 'Follow anatomy.' }
};
