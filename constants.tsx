
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

**GENDER-SPECIFIC DOSING & AESTHETICS:**
1. **Male Patients (Male Presenting):**
   - **Hypertrophic Musculature:** Assume significantly stronger muscle mass in Glabella and Frontalis. Increase basal dosage guidelines by **1.5x - 2x** compared to female standard.
   - **Brow Aesthetics:** Goal is to maintain a **Horizontal / Flat** brow position. Avoid creating a lateral arch (feminization). Keep frontalis injections lower (but safe) to suppress medial brow elevation if needed.
   - **Glabella:** Often requires multi-point deep injection with higher units (e.g., 20-30U Ona Total) to combat strong frowning.
   
2. **Female Patients (Female Presenting):**
   - **Standard Musculature:** Use standard titration.
   - **Brow Aesthetics:** Goal is to **preserve or enhance the Lateral Arch**. Avoid over-treating the lateral frontalis to prevent lateral brow drop.
   - **Glabella:** Focus on relaxing the frown without widening the inter-brow distance excessively.

**CRITICAL RULE FOR TRYPTYCH COORDINATES (16:9 Aspect Ratio):**
The visual map consists of 3 panels showing EXTREME CLOSE-UP HEADSHOTS (Neck Up). Coordinates are percentage-based (X: 0-100, Y: 0-100).

**PANEL 1 (Left 0-33.3% x): Patient's LEFT Profile (Lateral 90 deg)**
- View: TRUE PROFILE (Patient faces Right).
- Content: Left Temple, Left Crow's Feet, Left Cheek.
- Orientation: Ear is towards Left edge (0%). Nose towards Right edge (33%).
- **Left Crow's Feet (C1L):** X ~ 18-20%. Y ~ 43-46%. (Posterior to eye/canthus).
- **Left Inf. Eyelid (E1L):** X ~ 22-24%. Y ~ 49-51%.

**PANEL 2 (Center 33.3-66.6% x): Anterior / Frontal**
- View: Direct Frontal.
- Content: Glabella, Frontalis, Bunny Lines.
- Orientation: MIRROR VIEW.
  - **Patient's RIGHT side is on Image LEFT (X: 33-50%).**
  - **Patient's LEFT side is on Image RIGHT (X: 50-66%).**
- **Glabella:** Procerus (X=50). Right Corrugator (X=45-47). Left Corrugator (X=53-55).
- **Frontalis:** Right sites (X=38-46). Left sites (X=54-62).
- **Bunny Lines:** Right (X=46-47). Left (X=53-54).

**PANEL 3 (Right 66.6-100% x): Patient's RIGHT Profile (Lateral 90 deg)**
- View: TRUE PROFILE (Patient faces Left).
- Content: Right Temple, Right Crow's Feet, Right Cheek.
- Orientation: Nose towards Left edge (66%). Ear towards Right edge (100%).
- **Right Crow's Feet (C1R):** X ~ 80-82%. Y ~ 43-46%. (Posterior to eye/canthus).
- **Right Inf. Eyelid (E1R):** X ~ 76-78%. Y ~ 49-51%.

**Y-AXIS MAPPING (Neck-Up Framing):**
- Hairline/Upper Forehead: y=15-20%
- Mid-Forehead: y=25-30%
- Glabella (Brows): y=35-40%
- Eye Level (Lateral Canthus): y=44-46%
- Infraorbital/Bunny Lines: y=50-55%

RESPONSE FORMAT: Return a single JSON object.
{
  "gender": "Female Presenting" | "Male Presenting",
  "assessmentNarrative": "A concise, professional paragraph summarizing the findings and plan. Start with 'Assessment indicates...'. Mention morphology, pattern, total recommended dose, and specific safety checks (e.g. 'verification of brow heaviness is mandatory').",
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
      { region: "Crow's Feet", muscle: "Orbicularis", points: 6, reasoning: "3 pts per side." }
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
    // --- CENTER PANEL (33-66%) ---
    // Glabella (Total 18U)
    { id: "f-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 6, rationale: "Center.", x: 50, y: 38 },
    { id: "f-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 6, rationale: "Patient Right (Medial).", x: 46, y: 37 },
    { id: "f-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 6, rationale: "Patient Left (Medial).", x: 54, y: 37 },
    
    // Frontalis (Total 12U)
    { id: "f-f1r-c", label: "F1R", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Right (Mid).", x: 44, y: 28 },
    { id: "f-f2l-c", label: "F2L", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Left (Mid).", x: 56, y: 28 },
    { id: "f-f3r-c", label: "F3R", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Right (High).", x: 40, y: 20 },
    { id: "f-f4l-c", label: "F4L", region: "Forehead", muscle: "Frontalis", doseOna: 3, rationale: "Patient Left (High).", x: 60, y: 20 },

    // Bunny Lines (Total 6U)
    { id: "f-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Patient Right.", x: 47, y: 52 },
    { id: "f-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Patient Left.", x: 53, y: 52 },
    
    // --- PROFILE PANELS (Recalibrated for 90 Degree Profile) ---
    // Left Profile Panel (0-33%) - Looking at patient's LEFT side (Facing Right)
    // Eye is anterior (x ~ 28%), Ear is posterior (x ~ 5%)
    { id: "f-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Patient Left Lateral.", x: 22, y: 46 },
    { id: "f-e1l-l", label: "E1L", region: "Lower Eyelid", muscle: "Inf. Orbicularis", doseOna: 2, rationale: "Patient Left Inferior.", x: 25, y: 50 },

    // Right Profile Panel (66-100%) - Looking at patient's RIGHT side (Facing Left)
    // Eye is anterior (x ~ 72%), Ear is posterior (x ~ 95%)
    { id: "f-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 4, rationale: "Patient Right Lateral.", x: 78, y: 46 },
    { id: "f-e1r-r", label: "E1R", region: "Lower Eyelid", muscle: "Inf. Orbicularis", doseOna: 2, rationale: "Patient Right Inferior.", x: 75, y: 50 }
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
      { region: "Glabella", onaDose: 24, aboDose25: 60, aboDose30: 72, daxDose: "40U+", notes: "Male Hypertrophic Dose." },
      { region: "Bunny Lines", onaDose: 6, aboDose25: 15, aboDose30: 18, daxDose: "Off-Label", notes: "3U/side." },
      { region: "Forehead", onaDose: 16, aboDose25: 40, aboDose30: 48, daxDose: "Off-Label", notes: "Heavy frontalis load." }
    ],
    dosingAssumptions: ["Male dosing correction (+50-100% glabella).", "Horizontal brow goal."],
    aimsDisclaimer: "Clinical judgment mandatory."
  },
  sites: [
    // --- CENTER PANEL (33-66%) ---
    // Glabella (Total 24U)
    { id: "m-g1-c", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 8, rationale: "Male dose.", x: 50, y: 40 },
    { id: "m-g2r-c", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 8, rationale: "Pt Right.", x: 46, y: 38 },
    { id: "m-g2l-c", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 8, rationale: "Pt Left.", x: 54, y: 38 },
    
    // Frontalis (Total 16U)
    { id: "m-f1r-c", label: "F1R", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Right Lat.", x: 38, y: 26 },
    { id: "m-f2r-c", label: "F2R", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Right Med.", x: 44, y: 26 },
    { id: "m-f3l-c", label: "F3L", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Left Med.", x: 56, y: 26 },
    { id: "m-f4l-c", label: "F4L", region: "Forehead", muscle: "Frontalis", doseOna: 4, rationale: "Pt Left Lat.", x: 62, y: 26 },

    // Bunny Lines (Total 6U)
    { id: "m-b1r-c", label: "B1R", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Pt Right.", x: 47, y: 53 },
    { id: "m-b1l-c", label: "B1L", region: "Bunny Lines", muscle: "Nasalis", doseOna: 3, rationale: "Pt Left.", x: 53, y: 53 },
    
    // --- PROFILE PANELS (Recalibrated for 90 Degree Profile) ---
    // Left Profile: Eye ~ 28%, Ear ~ 5%. Crow's feet ~ 22%.
    { id: "m-c1l-l", label: "C1L", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 5, rationale: "Pt Left.", x: 22, y: 46 },
    // Right Profile: Eye ~ 72%, Ear ~ 95%. Crow's feet ~ 78%.
    { id: "m-c1r-r", label: "C1R", region: "Crow's Feet", muscle: "Orbicularis", doseOna: 5, rationale: "Pt Right.", x: 78, y: 46 }
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
