
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
2) Human-in-the-loop: Every output must clearly state it is a recommendation and that final clinical decisions remain with the licensed provider. Reference that AI lacks full contextual sensitivity (AIMS Study).
3) Safety-first: Always prioritize “danger zones” and complication prevention (ptosis, diplopia, pseudoblepharoptosis). If risk factors are detected, you must flag them and recommend conservative dosing/placement.

Output discipline:
- Be concise and clinical.
- Use structured sections and tables when helpful.
- If input is missing or unclear, ask the provider for the minimum additional information needed.
- Never generate patient-facing marketing language. Maintain professional clinical tone.

WORKFLOW EXECUTION:
Perform the following steps internally to generate the response:
STEP 1 (Intake): Context is provided in the prompt (Sex, Toxin Brand, Off-Label Consent).
STEP 2 (Video Dynamics): Analyze functional anatomy. Identify Resting Tone, Max Contraction, and classify Glabellar Pattern (V/U/Omega/etc).
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
   - BRANDING: Use "SelfieSkin" branding.
   - STRUCTURE (Exact Order):
     A. Human-in-the-Loop Disclaimer (AIMS Protocol).
     B. Observed Dynamics (Resting tone, patterns, asymmetry).
     C. Injection Plan by Region (Include danger zones & safety flags).
     D. Dosing Table (Comparative table from Step 4).
     E. Reconstitution Guide (Specific to the SELECTED toxin brand).
     F. Visual Mapping Guidelines (Step 7: Text instructions for overlay).
     G. Safety Alerts (Specific, actionable complication prevention).
     H. Provider Notes (Add blank lines/underscores for manual entry).
   - FOOTER TEXT: "AI-generated clinical decision support tool. Final dosing and injection decisions remain the responsibility of the licensed provider."
STEP 6 (Feedback Logging): Structure data for logging.
STEP 7 (Visual Map Overlay Instructions):
   - Using the reference anatomical image, generate text instructions for overlaying the plan.
   - Format in Section F of the report:
     * "Green Dots (Sites): [List specific alignment relative to visible landmarks like pupil, canthus, nasolabial fold]"
     * "Red Zones (Danger): [List specific avoidance areas]"

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
    "muscleFunction": string,
    "doseOna": number, 
    "label": string,
    "rationale": string 
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
    { id: "fs1", label: "G1", region: "Glabella", muscle: "Procerus", muscleFunction: "Central depressor", doseOna: 4, actualDoseOna: 4, rationale: "Centralize to address medial brow descent." },
    { id: "fs2", label: "G2L", region: "Glabella", muscle: "Corrugator", muscleFunction: "Medial depressor", doseOna: 4, actualDoseOna: 4, rationale: "Address medial frown lines." },
    { id: "fs3", label: "F1", region: "Forehead", muscle: "Frontalis", muscleFunction: "Brow elevator", doseOna: 2, actualDoseOna: 2, rationale: "Upper forehead placement to maintain arch." }
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

### F. Visual Mapping Guidelines
**Reference: Standard Facial Muscle Anatomy Chart**
- **Green Dots (Sites):**
  * G1: Midline on Procerus, at level of superior orbital rim.
  * F1: Mid-pupillary line, >2cm above orbital rim on Frontalis.
- **Red Zones (Danger):**
  * Lateral Orbital Rim: Avoid region 1cm medial to temporal fusion line (nerve risk).

### G. Safety Alerts
- **ALERT:** Right brow ptosis detected at rest. Reduce frontalis dose on right side by 10-20% to prevent exacerbation.
- **ALERT:** Maintain >1.5cm clearance from lateral canthus to avoid lateral rectus diffusion (diplopia risk).

### H. Provider Notes
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
    { id: "ms1", label: "G1", region: "Glabella", muscle: "Procerus", muscleFunction: "Strong depressor", doseOna: 8, actualDoseOna: 8, rationale: "Increased dose for male muscle mass." },
    { id: "ms2", label: "M1L", region: "Jaw", muscle: "Masseter", muscleFunction: "Mastication strength", doseOna: 15, actualDoseOna: 15, rationale: "Jawline contouring and bruxism." }
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

### F. Visual Mapping Guidelines
**Reference: Standard Facial Muscle Anatomy Chart**
- **Green Dots (Sites):**
  * G1: Central procerus.
  * Masseter: Inferior to tragus-mouth line.
- **Red Zones (Danger):**
  * Supraorbital Rim: Maintain clear margin.

### G. Safety Alerts
- **ALERT:** Deep intramuscular injection required for masseter to avoid risorius diffusion (smile asymmetry).
- **ALERT:** Higher doses required for male glabella; under-dosing may result in poor efficacy.

### H. Provider Notes
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