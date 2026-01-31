
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, PatientGender, ImageSize, ToxinBrand } from "../types";

const dataUrlToBase64 = (dataUrl: string) => dataUrl.split(',')[1];

export const analyzePatientInput = async (
  mediaBase64: string,
  mimeType: string,
  gender: PatientGender,
  brand: ToxinBrand,
  offLabelConsent: boolean, 
  isStaticImage: boolean
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const analysisInstruction = `Analyze patient facial dynamics from the provided scan. 
  CRITICAL THINKING:
  1. Identify muscle recruitment patterns (Glabella pattern, Frontalis recruitment type).
  2. ACTIVELY SCREEN FOR ASYMMETRY: Look for unilateral brow elevation ("Spock Brow"), ptosis, or uneven static lines. 
  3. If "Spock Brow" is detected, classify it and recommend lateral frontalis injection sites to correct it.
  4. Map injection sites across the Left Profile, Anterior, and Right Profile panels of the clinical tryptych. 
  5. GENERATE NARRATIVE: Create a concise "assessmentNarrative" summarizing findings and plan in a professional clinical voice.
  Output the result as structured JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: mediaBase64,
          },
        },
        {
          text: `STEP 1 INTAKE: Gender: ${gender}, Brand: ${brand}. ${analysisInstruction}`,
        },
      ],
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      // Retaining thinking budget for high-level anatomical deduction
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty AI result.");

  try {
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Parse error:", error);
    throw new Error("Clinical data processing error.");
  }
};

export const generateProtocolVisual = async (
  narrative: string,
  gender: PatientGender,
  size: ImageSize = '1K'
): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Medical illustration of facial anatomy showing the recommended injection protocol. 
    Context: ${narrative}
    Gender: ${gender}
    Style: Professional medical line art with color highlights for injection zones. 
    Focus on Upper Face. Clean white background.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
            imageConfig: { aspectRatio: "16:9", imageSize: size }
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    throw new Error("Protocol visual generation failed.");
}

export const generateTreatmentMapVisual = async (
  analysis: AnalysisResult | { gender: PatientGender, step2: any },
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let conditionDescription = "";
  if (analysis.step2 && analysis.step2.observedDynamics) {
      conditionDescription = `
      **CLINICAL PRESENTATION TO VISUALIZE:**
      - Resting Tone: ${analysis.step2.restingTone}
      - Dynamics: ${analysis.step2.observedDynamics}
      - Glabellar Pattern: ${analysis.step2.glabellarPattern}
      **CRITICAL INSTRUCTION:** Accurately depict any diagnosed asymmetries described above in the "Dynamics" section (e.g., Unilateral "Spock Brow"/lateral brow elevation, uneven brow height, or static rhytid asymmetry). The baseline image must clearly show the clinical indication being treated.
      `;
  }

  let prompt = `Create a hyper-realistic, clinical-grade BASELINE anatomical tryptych (16:9).
  Three panels: Left Profile, Anterior, Right Profile.
  Patient: ${analysis.gender}. 
  ${conditionDescription}
  FRAMING: EXTREME CLOSE-UP HEADSHOTS ONLY (FROM CLAVICLE UP). DO NOT INCLUDE SHOULDERS, CHEST, OR TORSO.
  The face must be vertically centered and fill 80% of the frame to ensure accurate injection coordinate mapping.
  Orientation:
  - Panel 1 (Left): Left Lateral Profile view (90 degrees, Patient facing Right).
  - Panel 2 (Center): Direct Anterior (Frontal) view.
  - Panel 3 (Right): Right Lateral Profile view (90 degrees, Patient facing Left).
  Clean studio background, medical lighting. NO text or markers.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Baseline tryptych generation failed.");
};

export const generatePostTreatmentVisual = async (
  analysis: AnalysisResult,
  baselineImageDataUrl: string | null,
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const baselinePart = baselineImageDataUrl ? [{
    inlineData: {
      mimeType: 'image/png',
      data: dataUrlToBase64(baselineImageDataUrl),
    },
  }] : [];

  let prompt = `Using the provided baseline image, generate a simulated OUTCOME tryptych.
  CRITICAL: MAINTAIN IDENTICAL TIGHT HEADSHOT FRAMING (NECK UP). Do not zoom out.
  Patient identity and framing must be IDENTICAL. 
  Show smooth, relaxed skin in: ${analysis.step3.regionalPlans.map(p => p.region).join(', ')}.
  **CORRECTION GOAL:** Visually correct any asymmetries (like Spock Brow) identified in the baseline. Ensure symmetric, balanced brow height and relaxation of hyperactive zones.
  Brow position goal: ${analysis.gender === PatientGender.MALE ? "Flat masculine" : "Soft feminine arch"}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { 
      parts: [
        ...baselinePart,
        { text: prompt }
      ] 
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Outcome simulation failed.");
};

export const generateAnatomicalOverlayVisual = async (
  gender: PatientGender,
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Medical 3D anatomical render of upper face muscles. 16:9 Tryptych format. 
  FRAMING: EXTREME CLOSE-UP HEADSHOTS ONLY (FROM NECK UP). MATCHING CLINICAL PHOTOGRAPHY FRAMING.
  Panel 1: Left Lateral Profile (90 deg). Panel 2: Anterior. Panel 3: Right Lateral Profile (90 deg).
  Transparent/Black background. Clean, high-fidelity anatomy.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Anatomy render failed.");
};

export const generateAestheticVisual = async (
  prompt: string,
  size: ImageSize
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `Medical illustration: ${prompt}` }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    },
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Visual generation failed.");
};
