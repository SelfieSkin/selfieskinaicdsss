
import { GoogleGenAI, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, PatientGender, ImageSize, ToxinBrand } from "../types";

const dataUrlToBase64 = (dataUrl: string) => dataUrl.split(',')[1];

export const analyzePatientInput = async (
  mediaBase64: string,
  mimeType: string,
  gender: PatientGender,
  brand: ToxinBrand,
  offLabelConsent: boolean, 
  isStaticImage: boolean,
  imageBase64?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = imageBase64 ? [{
    inlineData: {
      mimeType: 'image/png',
      data: imageBase64,
    },
  }] : [];

  const analysisInstruction = `Analyze patient facial dynamics from the provided scan. 
  CRITICAL: First, perform a deep reasoning of the muscle recruitment patterns (thinking phase). 
  Then, map injection sites across the Left Oblique, Anterior, and Right Oblique panels of the clinical tryptych. 
  Output the result as structured JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...imagePart,
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

export const generateTreatmentMapVisual = async (
  analysis: AnalysisResult | { gender: PatientGender, step2: any },
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt = `Create a hyper-realistic, clinical-grade BASELINE anatomical tryptych (16:9).
  Three panels: Left Oblique, Anterior, Right Oblique.
  Patient: ${analysis.gender}. 
  FRAMING: EXTREME CLOSE-UP HEADSHOTS ONLY (FROM CLAVICLE UP). DO NOT INCLUDE SHOULDERS, CHEST, OR TORSO.
  The face must be vertically centered and fill 80% of the frame to ensure accurate injection coordinate mapping.
  Orientation:
  - Panel 1 (Left): Left Oblique view (Patient turns head 45 degrees to their right, exposing Left profile).
  - Panel 2 (Center): Direct Anterior (Frontal) view.
  - Panel 3 (Right): Right Oblique view (Patient turns head 45 degrees to their left, exposing Right profile).
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
  Brow position: ${analysis.gender === PatientGender.MALE ? "Flat masculine" : "Soft feminine arch"}.`;

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
  Panel 1: Left Oblique. Panel 2: Anterior. Panel 3: Right Oblique.
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
      imageConfig: { aspectRatio: "1:1", imageSize: size }
    },
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("Visual generation failed.");
};
