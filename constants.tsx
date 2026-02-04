
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

**INJECTION PROTOCOLS & MAPPING RULES:**

**A. ORBICULARIS OCULI (CROW'S FEET) PROTOCOL:**
Implement the standard **3-Point Injection Pattern**:
1.  **Central Point (C1):** Located at the level of the lateral canthus. **CRITICAL SAFETY:** Must be placed **1.5 cm to 2.0 cm temporal** to the lateral canthus (just temporal to the lateral orbital rim) to avoid extraocular muscle involvement.
2.  **Superior Point (C2):** Located 1.0-1.5 cm superior to C1. Angle placement ~30° medially toward the brow tail.
3.  **Inferior Point (C3):** Located 1.0-1.5 cm inferior to C1. Angle placement ~30° medially toward the cheek.
*Modified Pattern:* If rhytids are primarily inferior, shift the injection line to angle from anteroinferior to superoposterior.

**B. GLABELLA PROTOCOL:**
- Corrugators: Insert deep (intramuscular). 
- Procerus: Insert deep (intramuscular).
- Safety: Stay >1cm above the orbital rim to minimize lid ptosis risk.

**C. GENDER-SPECIFIC DOSING & AESTHETICS:**
1. **Male Patients (Male Presenting):**
   - **Hypertrophic Musculature:** Assume significantly stronger muscle mass in Glabella and Frontalis. Increase basal dosage guidelines by **1.5x - 2x** compared to female standard.
   - **Brow Aesthetics:** Goal is to maintain a **Horizontal / Flat** brow position. Avoid creating a lateral arch (feminization). Keep frontalis injections lower (but safe) to suppress medial brow elevation if needed.
   
2. **Female Patients (Female Presenting):**
   - **Standard Musculature:** Use standard titration.
   - **Brow Aesthetics:** Goal is to **preserve or enhance the Lateral Arch**. Avoid over-treating the lateral frontalis to prevent lateral brow drop.

**CRITICAL RULE FOR TRYPTYCH COORDINATES (16:9 Aspect Ratio):**
The visual map consists of 3 panels showing EXTREME CLOSE-UP HEADSHOTS (Neck Up). Coordinates are percentage-based (X: 0-100, Y: 0-100).

**PANEL 1 (Left 0-33.3% x): Patient's LEFT Profile (Lateral 90 deg)**
- View: TRUE PROFILE (Patient faces Right).
- Content: Left Temple, Left Crow's Feet, Left Cheek.
- Orientation: Ear is towards Left edge (0%). Nose towards Right edge (33%).
- **Left Crow's Feet (C1L - Central):** X ~ 22%. Y ~ 46%.
- **Left Crow's Feet (C2L - Superior):** X ~ 20%. Y ~ 42%.
- **Left Crow's Feet (C3L - Inferior):** X ~ 20%. Y ~ 50%.

**PANEL 2 (Center 33.3-66.6% x): Anterior / Frontal**
- View: Direct Frontal. Midline at X=50%.
- Orientation: MIRROR VIEW.
  - **Patient's RIGHT side is on Image LEFT (X: 33-50%).**
  - **Patient's LEFT side is on Image RIGHT (X: 50-66%).**
- **Glabella:** Procerus (X=50). Right Corr (X~46). Left Corr (X~54).
- **Frontalis:** Symmetric distribution around X=50.
- **Bunny Lines:** Right (X~47). Left (X~53).

**PANEL 3 (Right 66.6-100% x): Patient's RIGHT Profile (Lateral 90 deg)**
- View: TRUE PROFILE (Patient faces Left).
- Content: Right Temple, Right Crow's Feet, Right Cheek.
- Orientation: Nose towards Left edge (66%). Ear towards Right edge (100%).
- **Right Crow's Feet (C1R - Central):** X ~ 78%. Y ~ 46%.
- **Right Crow's Feet (C2R - Superior):** X ~ 80%. Y ~ 42%.
- **Right Crow's Feet (C3R - Inferior):** X ~ 80%. Y ~ 50%.

**Y-AXIS MAPPING (Neck-Up Framing):**
- Hairline/Upper Forehead: y=15-20%
- Mid-Forehead: y=25-30%
- Glabella (Brows): y=38-40%
- Eye Level (Lateral Canthus): y=46-48%
- Infraorbital/Bunny Lines: y=52-55%

RESPONSE FORMAT: Return a single JSON object.
{
  "gender": "Female Presenting" | "Male Presenting",
  "assessmentNarrative": "A concise, professional paragraph summarizing the findings and plan. Start with 'Assessment indicates...'. Mention morphology, pattern, total recommended dose, and specific safety checks.",
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
  assessmentNarrative: "Assessment indicates a female patient with high dynamic frontalis lines and a strong 'V' pattern glabellar recruitment. The treatment plan prioritizes a microdroplet frontalis approach to preserve the brow arch while smoothing rhytids. Total recommended dose is ~48U Ona-Eq. Special attention is placed on avoiding the 'danger zone' 2cm above the orbital rim to prevent ptosis. Clinical verification of lid function is mandatory before injection.",
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
      { region: "Crow's Feet", muscle: "Orbicularis", points: 6, reasoning: "Standard 3-point pattern." }
    ],
    safetyFlags: ["Avoid low frontalis"],
    conservativeAdjustments: "Reduced dose in central frontalis."
  },
  step4: {
    dosingRows: [
      { region: "Glabella", onaDose: 18, aboDose25: 45, aboDose30: 54, daxDose: "30U", notes: "Standard." },
      { region: "Bunny Lines", onaDose: 6, aboDose25: 15, aboDose30: 18, daxDose: "Off-Label", notes: "Lateral nasal." },
      { region: "Forehead", onaDose: 12, aboDose25: 30, aboDose30: 36, daxDose: "Off-Label", notes: "Conservative." },
      { region: "Crow's Feet", onaDose: 12, aboDose25: 30, aboDose30: 36, daxDose: "Off-Label", notes: "Standard." }
    ],
    dosingAssumptions: ["Standard concentration applied.", "Upper face focus."],
    aimsDisclaimer: "Clinical decision support only."
  },
  sites: [
    { id: "f-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 6, rationale: "Center.", x: 50, y: 38 },
    { id: "f-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 6, rationale: "Patient Right (Medial).", x: 46.5, y: 37 },
    { id: "f-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 6, rationale: "Patient Left (Medial).", x: 53.5, y: 37 },
    { id: "f-f1r-c", label: "F1R", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Right (Mid).", x: 43, y: 28 },
    { id: "f-f2l-c", label: "F2L", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Left (Mid).", x: 57, y: 28 },
    { id: "f-f3r-c", label: "F3R", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Right (High).", x: 39, y: 20 },
    { id: "f-f4l-c", label: "F4L", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Left (High).", x: 61, y: 20 },
    { id: "f-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Patient Right.", x: 47.5, y: 53 },
    { id: "f-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Patient Left.", x: 52.5, y: 53 },
    { id: "f-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Central. 1.5cm temporal to canthus.", x: 22, y: 46 },
    { id: "f-c2l-l", label: "C2L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Superior. 30° medial vector.", x: 20, y: 42 },
    { id: "f-c3l-l", label: "C3L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Inferior. 30° medial vector.", x: 20, y: 50 },
    { id: "f-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Central. 1.5cm temporal to canthus.", x: 78, y: 46 },
    { id: "f-c2r-r", label: "C2R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Superior. 30° medial vector.", x: 80, y: 42 },
    { id: "f-c3r-r", label: "C3R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Inferior. 30° medial vector.", x: 80, y: 50 }
  ],
  dangerZones: [{ id: "fd1", region: "Periocular", risk: "Levator palpebrae risk." }],
  safetyWarnings: ["Focus on brow symmetry."],
  reconstitutionGuide: "100U in 2.5mL saline.",
  totalDoseOna: 48,
  clinicalReport: `# SelfieSkin Clinical Report\n\n### A. Human-in-the-Loop Disclaimer\n**AIMS Protocol Active.** ...`
};

export const SAMPLE_ANALYSIS_MALE = {
  gender: PatientGender.MALE,
  assessmentNarrative: "Assessment indicates a male patient with moderate-to-severe frontalis activity and 'U' pattern glabellar recruitment. The treatment plan prioritizes a higher-dose approach typical for male aesthetics (Total ~56U Ona). Special attention is placed on lateral frontalis injections to prevent 'Spock Brow' and maintain a masculine, horizontal brow position. Assessment was performed on a supine image; clinical verification of brow heaviness in the upright position is mandatory before injection.",
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
      { region: "Glabella", muscle: "Procerus + Corrugator", points: 5, reasoning: "U-pattern heavy dose (20U+)." },
      { region: "Bunny Lines", muscle: "Nasalis", points: 2, reasoning: "Treating lateral bridge." },
      { region: "Forehead", muscle: "Frontalis", points: 6, reasoning: "Broad spread, avoiding lateral peaks." }
    ],
    safetyFlags: ["Maintain masculine brow", "Check for lid heaviness"],
    conservativeAdjustments: "Avoid peaked lateral arch to prevent feminization."
  },
  step4: {
    dosingRows: [
      { region: "Glabella", onaDose: 24, aboDose25: 60, aboDose20: 72, daxDose: "40U+", notes: "Male Hypertrophic Dose." },
      { region: "Bunny Lines", onaDose: 6, aboDose25: 15, aboDose30: 18, daxDose: "3U/side." },
      { region: "Forehead", onaDose: 16, aboDose25: 40, aboDose30: 48, daxDose: "Heavy frontalis load.", notes: "Conservative" }
    ],
    dosingAssumptions: ["Male dosing correction (+50-100% glabella).", "Horizontal brow goal."],
    aimsDisclaimer: "Clinical judgment mandatory."
  },
  sites: [
    { id: "m-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 8, rationale: "Male dose.", x: 50, y: 40 },
    { id: "m-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 8, rationale: "Pt Right.", x: 46, y: 38 },
    { id: "m-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 8, rationale: "Pt Left.", x: 54, y: 38 },
    { id: "m-f1r-c", label: "F1R", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Right Lat.", x: 38, y: 26 },
    { id: "m-f2r-c", label: "F2R", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Right Med.", x: 44, y: 26 },
    { id: "m-f3l-c", label: "F3L", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Left Med.", x: 56, y: 26 },
    { id: "m-f4l-c", label: "F4L", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Left Lat.", x: 62, y: 26 },
    { id: "m-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Pt Right.", x: 47, y: 53 },
    { id: "m-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Pt Left.", x: 53, y: 53 },
    { id: "m-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 5, rationale: "Central. 1.5cm temporal.", x: 22, y: 46 },
    { id: "m-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 5, rationale: "Central. 1.5cm temporal.", x: 78, y: 46 }
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
    },
    {
      area: 'Advanced Injection Pattern Variants',
      color: 'border-[#cc7e6d]',
      muscles: [
        {
            name: 'Glabella Variations',
            description: 'Adapting to muscle mass and recruitment.',
            indications: [
                { title: "Wide Pattern", detail: "For lateral corrugator recruitment. Adds superficial lateral point." },
                { title: "Strong Pattern", detail: "Male/Hypertrophic. High dose (up to 80U total) often required." },
                { title: "Down Pull", detail: "Dominant Procerus/Depressor Supercilii. Focus medial dose." },
                { title: "Cautious", detail: "Lower dose above mid-pupillary line to reduce ptosis risk." }
            ]
        },
        {
            name: 'Forehead Variations',
            description: 'Managing brow height and shape.',
            indications: [
                { title: "Short Forehead", detail: "Reduced vertical space. Small doses high near hairline." },
                { title: "Tall Forehead", detail: "Requires multiple rows. Leave lower 2cm clear." },
                { title: "Lateral Lift", detail: "Leave lateral frontalis active to preserve brow arch." }
            ]
        },
        {
            name: "Crow's Feet Variants",
            description: "Orbicularis Oculi tailoring.",
            indications: [
                { title: "Modified Inferior", detail: "For low rhytids. Angle anteroinferior to superoposterior." },
                { title: "Pinched Look Prevention", detail: "Lower inferior dose to preserve cheek elevation (Zygomaticus)." }
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
  'Orbicularis': { depth: 'Superficial Intradermal', angle: '15°', pearl: 'Inj. 1.5-2.0cm temporal to lateral canthus.' },
  'Nasalis': { depth: 'Superficial Intradermal', angle: '30°', pearl: 'Inject lateral nasal bridge.' },
  'Default': { depth: 'Standard', angle: '90°', pearl: 'Follow anatomy.' }
};
