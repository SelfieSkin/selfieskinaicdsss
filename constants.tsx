
import { PatientGender } from './types';

export const BRAND_SAGE = '#B2AC88';
export const BRAND_CORAL = '#E2725B';
export const BRAND_CREAM = '#F2E5CF';

export const AIMS_DOSING_NOTE = "Observation: AI models (AIMS Protocol) typically recommend conservative dosages compared to expert clinicians to minimize adverse event risks. Your recorded deviations are critical for improving the system's contextual sensitivity.";

export const SYSTEM_INSTRUCTION = `
You are SelfieSkin, an AI Clinical Decision Support System (AI-CDSS) for aesthetic medicine. Your users are licensed healthcare providers only (MD, NP, PA, RN).

Your purpose is to analyze dynamic facial muscle activity from patient video input and generate evidence-based Botulinum Toxin (BoNT) injection recommendations. You provide decision support only. You do not diagnose, prescribe, or replace clinical judgment.

Hard constraints:
1) Non-interchangeability: Treat OnabotulinumtoxinA (Ona: Botox, Xeomin, Jeuveau), AbobotulinumtoxinA (Abo: Dysport), and DaxibotulinumtoxinA (Daxxify) as distinct biologic products with non-interchangeable units.
2) Human-in-the-Loop: Every output must clearly state it is a recommendation and that final clinical decisions remain with the licensed provider. Reference that AI lacks full contextual sensitivity (AIMS Study).
3) Safety-first: Always prioritize “danger zones” and complication prevention (ptosis, diplopia, pseudoblepharoptosis). If risk factors are detected, you must flag them and recommend conservative dosing/placement.

Output discipline:
- Be concise and clinical.
- Use structured sections and tables when helpful.
- If input is missing or unclear, ask the provider for the minimum additional information needed.
- Never generate patient-facing marketing language. Maintain professional clinical tone.

WORKFLOW EXECUTION:
Perform the following steps internally to generate the response:
STEP 1 (Intake): Context is provided in the prompt (Sex, Toxin Brand, Off-Label Consent, and crucially, a base anatomical image).
STEP 2 (Video Dynamics): Analyze functional anatomy from the video. Identify Resting Tone, Max Contraction, and classify Glabellar Pattern (V/U/Omega/etc).
STEP 3 (Injection Planning): Generate a strategic plan based ONLY on Step 2.
   - RULES UPPER FACE:
     * Glabella: If V-pattern = 7 points (Procerus + Corrugators). If U-pattern = 5 points.
     * Forehead: Injections must be 1.5-2.5cm above eyebrow rim.
     * Risk Flag: If low-set brows or dermatochalasis detected, flag "Pseudoblepharoptosis Risk" and recommend conservative dosing.
   - RULES PERIOCULAR:
     * Crow's Feet: Injection points >1.5-2.0cm lateral to lateral canthus (prevent diplopia/strabismus).
     * Bunny Lines: High on nasal wall, avoid levator labii superioris.
   - RULES LOWER FACE:
     * ONLY if "Off-Label Consent" is TRUE and hyperkinesis is present.
     * Gummy Smile: Target LLSAN (Yonsei Point) if gingival display >3mm.
     * Masseter: Safe zone below tragus-to-mouth line.
     * Mentalis: Low on chin.
   - Do NOT output units in Step 3 data, only point counts and reasoning.
STEP 4 (Dosing Engine): Calculate doses based on the plan from Step 3.
   - Generate a Comparative Dosing Table (Ona, Abo 2.5/3, Dax).
   - Daxxify Rule: Standard Glabella dose is 40U (vs ~20U Ona). Note "2:1 for Indication Only" for Glabella. Other regions marked as "Off-Label/Clinical Judgment".
   - Explicitly list Assumptions and AIMS Disclaimer.
STEP 5 (Report Pack): Generate a full Markdown clinical report string tailored for PDF export.

**CRITICAL RULE FOR COORDINATES:** You are provided with a base anatomical image. All \`x\` and \`y\` coordinates for the \`sites\` array MUST be precisely mapped to the anatomical landmarks and muscles visible on that specific image to ensure perfect visual alignment. The coordinate system is a 100x100 grid where (0,0) is top-left. (50, 50) should be the approximate center of the nasal root.

RESPONSE FORMAT: You must return a single JSON object matching this schema exactly.
{
  "gender": "Female Presenting" | "Male Presenting",
  "step2": {
    "restingTone": string,
    "maxContraction": { "frontalis": string, "glabella": string, "orbicularis": string },
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
  "sites": Array<{ 
    "region": string, 
    "muscle": string,
    "doseOna": number, 
    "label": string,
    "rationale": string,
    "x": number,
    "y": number
  }>,
  "dangerZones": Array<{ "region": string, "risk": string }>,
  "safetyWarnings": Array<string>,
  "reconstitutionGuide": string,
  "totalDoseOna": number,
  "clinicalReport": string
}
`;

export const SAMPLE_ANALYSIS_FEMALE = {
  gender: PatientGender.FEMALE,
  step2: {
    restingTone: "Mild right brow ptosis detected at rest. Oral commissures symmetric.",
    maxContraction: {
      frontalis: "Type 2 recruitment (Full field) with preserved lateral activity.",
      glabella: "Strong procerus recruitment vs moderate corrugator activity.",
      orbicularis: "Lateral crow's feet extending to mid-cheek."
    },
    glabellarPattern: "V",
    observedDynamics: "Patient demonstrates high medial recruitment in the glabella complex consistent with a V-pattern. Frontalis activity is broad. Suggested treatment focuses on superior frontalis placement to preserve brow height."
  },
  step3: {
    regionalPlans: [
      { region: "Glabella", muscle: "Procerus + Corrugator", points: 7, reasoning: "V-Pattern protocol: 1 central, 2 medial corrugator, 2 lateral corrugator, 2 superior/tail." },
      { region: "Forehead", muscle: "Frontalis", points: 8, reasoning: "High placement (>2cm from rim) to preserve brow height." },
      { region: "Periocular", muscle: "Orbicularis Oculi", points: 6, reasoning: "3 points per side, >1.5cm lateral to canthus." }
    ],
    safetyFlags: ["Pseudoblepharoptosis Risk (Right Brow)", "Lateral Rectus Avoidance Zone"],
    conservativeAdjustments: "Reduced dose in lower frontalis to prevent brow heaviness. Strict avoidance of orbital rim injection."
  },
  step4: {
    dosingRows: [
      { region: "Glabella", onaDose: 20, aboDose25: 50, aboDose30: 60, daxDose: "40U (Standard)", notes: "Standard FDA-approved Daxxify dose." },
      { region: "Forehead", onaDose: 12, aboDose25: 30, aboDose30: 36, daxDose: "Off-Label", notes: "Conservative dosing to avoid ptosis." },
      { region: "Crow's Feet", onaDose: 12, aboDose25: 30, aboDose30: 36, daxDose: "Off-Label", notes: "Split between 3 points per side." }
    ],
    dosingAssumptions: [
      "Standard dilution (2.5mL/100U Ona).",
      "Abo conversion range provided for clinical preference (2.5:1 vs 3:1).",
      "Doses reduced by 10% due to ptosis risk flag."
    ],
    aimsDisclaimer: "This guidance is generated by AI (AIMS Protocol). It lacks haptic feedback and full patient history. The licensed provider assumes full liability for final dosing."
  },
  sites: [
    // Glabella (20U) - V-Pattern
    { id: "g1", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 4, rationale: "Centralize to address medial brow descent.", x: 50, y: 49 },
    { id: "g2l", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Address medial frown lines, left.", x: 45.5, y: 47 },
    { id: "g2r", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Address medial frown lines, right.", x: 54.5, y: 47 },
    { id: "g3l", label: "G3L", region: "Glabella", muscle: "Corrugator", doseOna: 2, rationale: "Soften lateral corrugator pull, left.", x: 40, y: 46 },
    { id: "g3r", label: "G3R", region: "Glabella", muscle: "Corrugator", doseOna: 2, rationale: "Soften lateral corrugator pull, right.", x: 60, y: 46 },
    { id: "g4l", label: "G4L", region: "Glabella", muscle: "Corrugator", doseOna: 2, rationale: "Address tail of corrugator, left.", x: 35, y: 44 },
    { id: "g4r", label: "G4R", region: "Glabella", muscle: "Corrugator", doseOna: 2, rationale: "Address tail of corrugator, right.", x: 65, y: 44 },
    // Forehead (12U)
    { id: "f1", label: "F1", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Upper forehead placement, left.", x: 40, y: 31 },
    { id: "f2", label: "F2", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Upper forehead placement, mid-left.", x: 46, y: 29 },
    { id: "f3", label: "F3", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Upper forehead placement, mid-right.", x: 54, y: 29 },
    { id: "f4", label: "F4", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Upper forehead placement, right.", x: 60, y: 31 },
    { id: "f5", label: "F5", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Mid-forehead placement, left.", x: 38, y: 36 },
    { id: "f6", label: "F6", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Mid-forehead placement, mid-left.", x: 44, y: 35 },
    { id: "f7", label: "F7", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Mid-forehead placement, mid-right.", x: 56, y: 35 },
    { id: "f8", label: "F8", region: "Forehead", muscle: "Frontalis", doseOna: 1.5, rationale: "Mid-forehead placement, right.", x: 62, y: 36 },
    // Periocular (12U)
    { id: "c1l", label: "C1L", region: "Periocular", muscle: "Orbicularis Oculi", doseOna: 2, rationale: "Lateral canthal rhytids, left upper.", x: 29, y: 48 },
    { id: "c2l", label: "C2L", region: "Periocular", muscle: "Orbicularis Oculi", doseOna: 2, rationale: "Lateral canthal rhytids, left mid.", x: 27, y: 52 },
    { id: "c3l", label: "C3L", region: "Periocular", muscle: "Orbicularis Oculi", doseOna: 2, rationale: "Lateral canthal rhytids, left lower.", x: 29, y: 56 },
    { id: "c1r", label: "C1R", region: "Periocular", muscle: "Orbicularis Oculi", doseOna: 2, rationale: "Lateral canthal rhytids, right upper.", x: 71, y: 48 },
    { id: "c2r", label: "C2R", region: "Periocular", muscle: "Orbicularis Oculi", doseOna: 2, rationale: "Lateral canthal rhytids, right mid.", x: 73, y: 52 },
    { id: "c3r", label: "C3R", region: "Periocular", muscle: "Orbicularis Oculi", doseOna: 2, rationale: "Lateral canthal rhytids, right lower.", x: 71, y: 56 }
  ],
  dangerZones: [
    { id: "fd1", region: "Periocular", risk: "Levator palpebrae risk." }
  ],
  safetyWarnings: ["Focus on brow symmetry.", "Superficial injection in lateral frontalis."],
  reconstitutionGuide: "100U in 2.5mL saline.",
  totalDoseOna: 44,
  clinicalReport: `# SelfieSkin Clinical Report

### A. Human-in-the-Loop Disclaimer
**AIMS Protocol Active.** This report is generated by an AI Clinical Decision Support System. It provides evidence-based anatomical analysis but lacks haptic feedback, full patient history, and physical examination capabilities. **Final dosing, injection depth, and product selection are the sole responsibility of the licensed provider.**

### B. Observed Dynamics
**Patient ID:** DEMO-F
**Functional Anatomy:**
- **Resting Tone:** Mild right brow ptosis detected at rest. Oral commissures symmetric.
- **Glabellar Pattern:** V-Pattern (Medial Dominance).
- **Maximal Contraction:**
  - Frontalis: Type 2 recruitment (Full field) with preserved lateral activity.
  - Glabella: Strong procerus recruitment vs moderate corrugator activity.
  - Orbicularis: Lateral crow's feet extending to mid-cheek.

### C. Injection Plan by Region
| Region | Muscle | Target Pts | Rationale |
| :--- | :--- | :--- | :--- |
| **Glabella** | Procerus + Corrugator | 7 | V-Pattern protocol: 1 central, 2 medial, 2 lateral, 2 superior/tail. |
| **Forehead** | Frontalis | 8 | High placement (>2cm from rim) to preserve brow height. |
| **Periocular** | Orbicularis Oculi | 6 | 3 points per side, >1.5cm lateral to canthus. |

**Identified Danger Zones:**
- **Lateral Orbital Rim:** Risk of Levator Palpebrae interaction (Ptosis). Keep >1cm margin.

### D. Comparative Dosing Engine
| Region | Ona (1:1) | Abo (2.5:1) | Abo (3:1) | Daxxify |
| :--- | :--- | :--- | :--- | :--- |
| Glabella | 20U | 50U | 60U | 40U (Std) |
| Forehead | 12U | 30U | 36U | Off-Label |
| Crow's Feet | 12U | 30U | 36U | Off-Label |

### E. Reconstitution Guide
**For OnabotulinumtoxinA (100U Vial):**
- Reconstitute with **2.5mL** of 0.9% non-preserved saline.
- **Concentration:** 4.0 Units per 0.1mL.

### F. Safety Alerts
- **ALERT:** Right brow ptosis detected at rest. Reduce frontalis dose on right side by 10-20% to prevent exacerbation.
- **ALERT:** Maintain >1.5cm clearance from lateral canthus to avoid lateral rectus diffusion (diplopia risk).

### G. Provider Notes
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
`
};

export const SAMPLE_ANALYSIS_MALE = {
  gender: PatientGender.MALE,
  step2: {
    restingTone: "No significant resting asymmetry. Hypertrophic masseter appearance.",
    maxContraction: {
      frontalis: "Deep horizontal rhytids, central dominance.",
      glabella: "Severe global recruitment (Procerus + Corrugators).",
      orbicularis: "Coarse static and dynamic lines."
    },
    glabellarPattern: "U",
    observedDynamics: "Significant muscle mass in corrugators and masseters (U-pattern). High dose requirement for effective paralysis. Avoid arched brows to maintain masculine aesthetic."
  },
  step3: {
    regionalPlans: [
      { region: "Glabella", muscle: "Procerus + Corrugator", points: 5, reasoning: "U-Pattern protocol: Heavy central dose, lateral extension." },
      { region: "Lower Face", muscle: "Masseter", points: 6, reasoning: "3 points per side, inferior to tragus-mouth line (Safety Zone)." }
    ],
    safetyFlags: ["Brow Feminization Risk", "Masseter Diffusion Risk"],
    conservativeAdjustments: "Maintain flat brow shape. Deep intramuscular injection for masseters."
  },
  step4: {
    dosingRows: [
      { region: "Glabella", onaDose: 30, aboDose25: 75, aboDose30: 90, daxDose: "40U+", notes: "High dose for male muscle mass." },
      { region: "Masseter", onaDose: 30, aboDose25: 75, aboDose30: 90, daxDose: "Off-Label", notes: "15U per side for hypertrophy." }
    ],
    dosingAssumptions: [
      "Male gender adjustment (+50% base dose).",
      "Masseter treatment included (Off-label consent active).",
      "Standard concentrations applied."
    ],
    aimsDisclaimer: "AI-CDSS recommendation. Verify masseter palpation before injection."
  },
  sites: [
    // Glabella (30U) - Recalibrated for better anatomical position
    { id: "mg1", label: "G1", region: "Glabella", muscle: "Procerus", doseOna: 8, rationale: "Increased dose for male muscle mass.", x: 50, y: 50 },
    { id: "mg2l", label: "G2L", region: "Glabella", muscle: "Corrugator", doseOna: 7, rationale: "Address strong medial corrugator, left.", x: 45.5, y: 49 },
    { id: "mg2r", label: "G2R", region: "Glabella", muscle: "Corrugator", doseOna: 7, rationale: "Address strong medial corrugator, right.", x: 54.5, y: 49 },
    { id: "mg3l", label: "G3L", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Address lateral corrugator, left.", x: 40, y: 48 },
    { id: "mg3r", label: "G3R", region: "Glabella", muscle: "Corrugator", doseOna: 4, rationale: "Address lateral corrugator, right.", x: 60, y: 48 },
    // Masseter (30U) - Recalibrated for better anatomical position
    { id: "mm1l", label: "M1L", region: "Jaw", muscle: "Masseter", doseOna: 5, rationale: "Superior-posterior masseter point, left.", x: 25, y: 74 },
    { id: "mm2l", label: "M2L", region: "Jaw", muscle: "Masseter", doseOna: 5, rationale: "Anterior masseter point, left.", x: 29, y: 79 },
    { id: "mm3l", label: "M3L", region: "Jaw", muscle: "Masseter", doseOna: 5, rationale: "Inferior-posterior masseter point, left.", x: 25, y: 84 },
    { id: "mm1r", label: "M1R", region: "Jaw", muscle: "Masseter", doseOna: 5, rationale: "Superior-posterior masseter point, right.", x: 75, y: 74 },
    { id: "mm2r", label: "M2R", region: "Jaw", muscle: "Masseter", doseOna: 5, rationale: "Anterior masseter point, right.", x: 71, y: 79 },
    { id: "mm3r", label: "M3R", region: "Jaw", muscle: "Masseter", doseOna: 5, rationale: "Inferior-posterior masseter point, right.", x: 75, y: 84 }
  ],
  dangerZones: [
    { id: "md1", region: "Supraorbital", risk: "Avoid feminized arch." }
  ],
  safetyWarnings: ["Ensure deep intramuscular injection in masseter.", "Higher doses required for glabella."],
  reconstitutionGuide: "100U in 1.0mL saline for high concentration.",
  totalDoseOna: 60,
  clinicalReport: `# SelfieSkin Clinical Report

### A. Human-in-the-Loop Disclaimer
**AIMS Protocol Active.** This report is generated by an AI Clinical Decision Support System. It provides evidence-based anatomical analysis but lacks haptic feedback, full patient history, and physical examination capabilities. **Final dosing, injection depth, and product selection are the sole responsibility of the licensed provider.**

### B. Observed Dynamics
**Patient ID:** DEMO-M
**Functional Anatomy:**
- **Resting Tone:** Symmetric. Hypertrophic masseter appearance.
- **Glabellar Pattern:** U-Pattern (Heavy recruitment).
- **Maximal Contraction:**
  - Frontalis: Deep horizontal rhytids, central dominance.
  - Glabella: Severe global recruitment (Procerus + Corrugators).
  - Orbicularis: Coarse static and dynamic lines.

### C. Injection Plan by Region
| Region | Muscle | Target Pts | Rationale |
| :--- | :--- | :--- | :--- |
| **Glabella** | Procerus + Corrugator | 5 | U-Pattern protocol: Heavy central dose, lateral extension. |
| **Masseter** | Masseter | 6 | 3 pts/side, inferior to tragus-mouth line. |

**Identified Danger Zones:**
- **Supraorbital:** Avoid feminization of brow arch.

### D. Comparative Dosing Engine
| Region | Ona (1:1) | Abo (2.5:1) | Abo (3:1) | Daxxify |
| :--- | :--- | :--- | :--- | :--- |
| Glabella | 30U | 75U | 90U | 40U+ |
| Masseter | 30U | 75U | 90U | Off-Label |

### E. Reconstitution Guide
**For OnabotulinumtoxinA (100U Vial):**
- Reconstitute with **1.0mL** of 0.9% non-preserved saline.
- **Concentration:** 10.0 Units per 0.1mL (High concentration for large muscles).

### F. Safety Alerts
- **ALERT:** Deep intramuscular injection required for masseter to avoid risorius diffusion (smile asymmetry).
- **ALERT:** Higher doses required for male glabella; under-dosing may result in poor efficacy.

### G. Provider Notes
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________
`
};

export const KNOWLEDGE_BASE_DATA = {
  indications: [
    { title: "Glabellar Lines", description: "Moderate to severe frown lines." },
    { title: "Forehead Lines", description: "Horizontal frontalis activity." }
  ],
  contraindications: [
    { title: "Hypersensitivity", description: "Known hypersensitivity to BoNT." }
  ],
  adverseEvents: [
    { title: "Eyelid Ptosis", description: "Upper eyelid drooping." }
  ],
  patientSelection: [
    { title: "Functional Anatomy", description: "Assessment of muscle mass and contraction strength." }
  ]
};

export const INJECTION_TECHNIQUES = {
  'Frontalis': {
    depth: 'Superficial Intradermal',
    angle: '15-30° Bevel Up',
    pearl: 'Place injections high to avoid brow ptosis. Use microdroplets.'
  },
  'Corrugator': {
    depth: 'Intramuscular',
    angle: '90° to bone',
    pearl: 'Palpate muscle during frown. Avoid orbital rim.'
  },
  'Procerus': {
    depth: 'Intramuscular',
    angle: '90° to bone',
    pearl: 'Single injection in the muscle belly. Can be treated from above.'
  },
  'Orbicularis Oculi': {
    depth: 'Superficial Intradermal',
    angle: '10-20° Bevel Up',
    pearl: 'Stay >1.5cm from lateral canthus. Inject into contracting muscle.'
  },
  'Masseter': {
    depth: 'Deep Intramuscular',
    angle: '90° to bone',
    pearl: 'Inject within safety zone below tragus-mouth line. Palpate during clench.'
  },
  'Default': {
    depth: 'Perpendicular to skin',
    angle: '90°',
    pearl: 'Follow standard protocol for the target muscle.'
  }
};
