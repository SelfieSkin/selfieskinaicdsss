
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

**CRITICAL RULE FOR TRYPTYCH COORDINATES:** 
- **Panel 1 (Left 0-33.3% x):** Left Oblique.
- **Panel 2 (Center 33.3-66.6% x):** Anterior.
- **Panel 3 (Right 66.6-100% x):** Right Oblique.

Injection Mapping Rules:
1. **Left-sided sites** (Left Crow's Feet, Left Corrugator, Left Nasalis): 
   - Primary: Left Oblique (x: 12-24%).
   - Secondary: Center Anterior (x: 38-48%).
2. **Right-sided sites**:
   - Primary: Right Oblique (x: 76-88%).
   - Secondary: Center Anterior (x: 52-62%).
3. **Midline sites** (Procerus, Frontalis-Mid): 
   - Map primarily to the Center panel (x: 48-52%).
4. **Lower Eyelids**: Map carefully to the inferior portion of the orbicularis (y: 52-54% range).
5. **Bunny Lines**: Map to the nasalis on the side of the bridge of the nose.

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
      { region: "Forehead", muscle: "Frontalis", points: 8, reasoning: "High placement microdroplets." },
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
    // --- CENTER PANEL (33-66) ---
    { id: "f-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 4, rationale: "Center.", x: 50, y: 48 },
    { id: "f-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Left Medial.", x: 47, y: 46 },
    { id: "f-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Right Medial.", x: 53, y: 46 },
    { id: "f-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 2, rationale: "Left bridge.", x: 48, y: 55 },
    { id: "f-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 2, rationale: "Right bridge.", x: 52, y: 55 },
    
    // --- OBLIQUE PANELS ---
    { id: "f-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 2, rationale: "Left Lateral.", x: 12, y: 49 },
    { id: "f-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 2, rationale: "Right Lateral.", x: 88, y: 49 },
    { id: "f-e1l-l", label: "E1L", region: "Lower Eyelid", muscle: "Inf. Orbicularis", doseOna: 1, rationale: "Left Inferior.", x: 15, y: 54 },
    { id: "f-e1r-r", label: "E1R", region: "Lower Eyelid", muscle: "Inf. Orbicularis", doseOna: 1, rationale: "Right Inferior.", x: 85, y: 54 }
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
      { region: "Forehead", muscle: "Frontalis", points: 10, reasoning: "Broad microdroplet spread." }
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
    // --- CENTER PANEL (33-66) ---
    { id: "m-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 8, rationale: "Male dose.", x: 50, y: 48 },
    { id: "m-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 7, rationale: "Medial.", x: 47, y: 46 },
    { id: "m-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 7, rationale: "Medial.", x: 53, y: 46 },
    { id: "m-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Left bridge.", x: 48, y: 55 },
    { id: "m-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Right bridge.", x: 52, y: 55 },
    
    // --- OBLIQUE PANELS ---
    { id: "m-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 3, rationale: "Left Lateral.", x: 12, y: 49 },
    { id: "m-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 3, rationale: "Right Lateral.", x: 88, y: 49 }
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
