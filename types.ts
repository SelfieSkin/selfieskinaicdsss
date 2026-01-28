
export enum ToxinBrand {
  BOTOX = 'OnabotulinumtoxinA (Botox/Xeomin/Jeuveau)',
  DYSPORT = 'AbobotulinumtoxinA (Dysport)',
  DAXXIFY = 'DaxibotulinumtoxinA (Daxxify)'
}

export enum PatientGender {
  FEMALE = 'Female Presenting',
  MALE = 'Male Presenting'
}

export type ImageSize = '1K' | '2K' | '4K';

export interface InjectionSite {
  id: string;
  region: string;
  muscle: string;
  muscleFunction?: string;
  x: number;
  y: number;
  doseOna: number;
  actualDoseOna?: number;
  label: string;
  rationale: string;
}

export interface DangerZone {
  id: string;
  region: string;
  x: number;
  y: number;
  radius: number;
  risk: string;
}

export interface Step2Data {
  restingTone: string;
  maxContraction: {
    frontalis: string;
    glabella: string;
    orbicularis: string;
  };
  glabellarPattern: 'V' | 'U' | 'Omega' | 'Inverted Omega' | 'Converging Arrows' | 'Indeterminate';
  observedDynamics: string;
}

export interface RegionPlan {
  region: string;
  muscle: string;
  points: number;
  reasoning: string;
}

export interface Step3Data {
  regionalPlans: RegionPlan[];
  safetyFlags: string[];
  conservativeAdjustments: string;
}

export interface DosingRow {
  region: string;
  onaDose: number;
  aboDose25: number;
  aboDose30: number;
  daxDose: string;
  notes: string;
}

export interface Step4Data {
  dosingRows: DosingRow[];
  dosingAssumptions: string[];
  aimsDisclaimer: string;
}

export interface AnalysisResult {
  gender: PatientGender;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  sites: InjectionSite[];
  dangerZones: DangerZone[];
  safetyWarnings: string[];
  reconstitutionGuide: string;
  totalDoseOna: number;
  clinicalReport: string;
}

export interface FeedbackData {
  modified: boolean;
  regionsModified: string[];
  aiRecommendationSummary: string;
  providerModificationSummary: string;
  rationale: string;
  safetyIssue: boolean;
  safetyIssueDetails?: string;
  finalDose: number;
  outcomeNotes?: string;
  patientSatisfaction?: 'Very Satisfied' | 'Satisfied' | 'Neutral' | 'Unsatisfied' | 'Very Unsatisfied';
}

export interface TreatmentSession {
  id: string;
  patientId: string;
  gender: PatientGender;
  date: string;
  brand: ToxinBrand;
  analysis: AnalysisResult;
  feedback: FeedbackData;
}
