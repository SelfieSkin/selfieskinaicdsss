
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, PatientGender, ImageSize, ToxinBrand } from "../types";

export const analyzePatientVideo = async (
  videoBase64: string,
  mimeType: string,
  gender: PatientGender,
  brand: ToxinBrand,
  offLabelConsent: boolean
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: videoBase64,
          },
        },
        {
          text: `STEP 1 INTAKE DATA:
                 - Patient Gender: ${gender}
                 - Selected Toxin Brand: ${brand}
                 - Off-Label Lower Face Consent: ${offLabelConsent ? "GRANTED - Assess lower face if indicated" : "DENIED - Upper face only"}
                 
                 Analyze this patient's facial dynamics. Generate the full Step 2-5 output as structured JSON.`,
        },
      ],
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
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
  analysis: AnalysisResult,
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const upperFaceSites = analysis.sites.filter(s => ['Glabella', 'Forehead', 'Periocular'].includes(s.region));
  const upperFaceZones = analysis.dangerZones.filter(z => ['Periocular', 'Supraorbital'].includes(z.region));

  let prompt = `Create a professional, evidence-based medical illustration for an upper-face botulinum toxin treatment plan.
  The patient is ${analysis.gender}. The overall facial structure should reflect this.
  The view should be anterior (front-facing), focusing on the upper face from the nose up.
  Use a clean, white background. The style should be photorealistic with anatomical accuracy.
  Labeling must be clear, legible, and unobtrusive, using a modern sans-serif font.
  
  **Aesthetic Goal:**
  ${
    analysis.gender === PatientGender.MALE
      ? "For this male patient, the primary goal is to reduce deep rhytids while preserving a strong, masculine facial structure. Key considerations: Maintain a relatively flat, lower brow line. Aggressively treating the frontalis to create a high arch is clinically inappropriate and must be avoided. The final image should reflect a natural reduction in lines without feminizing the features."
      : "For this female patient, the primary goal is to soften dynamic rhytids to create a relaxed and refreshed appearance. Key considerations: Aim to create a gentle, aesthetically pleasing arch to the brow. The treatment should open up the periorbital area while preserving natural expression. The final image should reflect softened lines and a subtle brow lift."
  }
  
  **Patient Presentation:**
  - Glabellar Pattern: ${analysis.step2.glabellarPattern}
  - Resting Tone observations: ${analysis.step2.restingTone}
  - Contraction observations: Forehead: ${analysis.step2.maxContraction.frontalis}. Glabella: ${analysis.step2.maxContraction.glabella}.
  
  **Treatment Plan Overlay:**
  `;

  if (upperFaceSites.length > 0) {
    prompt += `\n**Injection Sites (Green Dots):**
    Overlay the following injection points as small, distinct green dots. Next to each dot, add a label with its ID and Ona-equivalent dose.
    `;
    upperFaceSites.forEach(site => {
        prompt += `- Site ID: ${site.label}, Dose: ${site.doseOna}U. Location: ${site.muscle}. Rationale for placement: ${site.rationale}. Visually place this accurately based on the muscle and rationale.\n`;
    });
  }

  if (upperFaceZones.length > 0) {
    prompt += `\n**Danger Zones (Red Areas):**
    Illustrate the following anatomical danger zones as transparent red-hashed circular areas to be avoided.
    `;
    upperFaceZones.forEach(zone => {
        prompt += `- Zone: ${zone.region}. Risk: ${zone.risk}. Center this zone appropriately.\n`;
    });
  }
  
  prompt += `\nEnsure the final image is a clear, high-fidelity clinical guide suitable for a medical professional, strictly adhering to the gender-specific aesthetic goals.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No treatment map image was generated.");
};


export const generateAestheticVisual = async (
  prompt: string,
  size: ImageSize
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: `Highly detailed professional medical illustration for aesthetic medicine: ${prompt}. Cinematic lighting, 8k resolution, anatomical accuracy.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated by the clinical visualizer.");
};
