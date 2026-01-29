
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, PatientGender, ImageSize, ToxinBrand } from "../types";

// Utility to convert data URL to a base64 string for the API
const dataUrlToBase64 = (dataUrl: string) => dataUrl.split(',')[1];

export const analyzePatientVideo = async (
  videoBase64: string,
  mimeType: string,
  gender: PatientGender,
  brand: ToxinBrand,
  offLabelConsent: boolean,
  imageBase64?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = imageBase64 ? [{
    inlineData: {
      mimeType: 'image/png',
      data: imageBase64,
    },
  }] : [];

  const response = await ai.models.generateContent({
    // Fix: Upgraded to a more powerful model for this complex, multimodal analysis task.
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        ...imagePart,
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
                 
                 Analyze the patient's facial dynamics from the video. CRITICALLY, use the provided static anatomical image as the canvas for your output. All x/y coordinates in the 'sites' array must map precisely to the muscles on this specific image. Generate the full Step 2-5 output as structured JSON.`,
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
  analysis: AnalysisResult | { gender: PatientGender, step2: any }, // Allow partial data for initial generation
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt = `Create a professional, evidence-based medical illustration of a patient's face to serve as an anatomical backplate for a botulinum toxin treatment plan.
  The patient is ${analysis.gender}. The overall facial structure, skin texture, and age appearance should reflect this.
  The view must be anterior (front-facing), with the patient looking directly forward with a neutral expression.
  The image should be photorealistic, with clear anatomical landmarks (e.g., brows, canthi, nasal root).
  Use a clean, white background.
  
  **IMPORTANT FRAMING RULES:**
  - The face must be perfectly centered horizontally and vertically.
  - The top of the head should have a small, consistent margin from the top edge of the image.
  - The chin should have a small, consistent margin from the bottom edge of the image.
  - This strict, consistent framing is crucial for accurate coordinate mapping later.
  
  **IMPORTANT VISUAL RULES:**
  - Do NOT add any text, labels, injection points, dots, or any other overlays to the image. 
  - The image must be a clean, high-fidelity base layer suitable for a separate data overlay.
  
  **Aesthetic Context (for facial structure generation only):**
  ${
    analysis.gender === PatientGender.MALE
      ? "The male patient has a strong jawline and lower, flatter brows. Reflect this masculine facial structure."
      : "The female patient has softer features and a gentle brow arch. Reflect this feminine facial structure."
  }
  
  Generate only the clean, perfectly centered base image.`;

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


export const generatePostTreatmentVisual = async (
  analysis: AnalysisResult,
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let prompt = `Create a photorealistic medical illustration showing the expected **post-treatment** outcome for an aesthetic botulinum toxin procedure.
  The patient is ${analysis.gender}. The facial structure should be consistent with this.
  The view should be anterior (front-facing), focusing on the upper face. The style should be photorealistic, clean, and professional.
  
  **Aesthetic Goal (Post-Treatment):**
  ${
    analysis.gender === PatientGender.MALE
      ? "For this male patient, the treatment aimed to reduce deep rhytids while preserving a strong, masculine facial structure. The final image must show a natural reduction in lines with a maintained flat, lower brow line. Avoid any appearance of a high, arched brow."
      : "For this female patient, the treatment aimed to soften dynamic rhytids for a relaxed, refreshed appearance. The final image must show softened lines with a gentle, aesthetically pleasing arch to the brow, creating an open periorbital area."
  }
  
  **Pre-Treatment Observations (for context):**
  - Glabellar Pattern was: ${analysis.step2.glabellarPattern}.
  - Max contraction showed: Forehead: ${analysis.step2.maxContraction.frontalis}. Glabella: ${analysis.step2.maxContraction.glabella}.
  - The treatment plan involved injections in: ${analysis.step3.regionalPlans.map(p => p.region).join(', ')}.
  
  **Required Output Image Details:**
  - **Skin Texture:** Show smoother skin in the treated areas (glabella, forehead, crow's feet) compared to the pre-treatment state.
  - **Rhytids:** Dynamic lines should be visibly softened or eliminated. Static lines may still be faintly visible but should be less pronounced.
  - **Brow Position:** The brow position must reflect the gender-specific aesthetic goal described above.
  - **Expression:** The patient should have a neutral, relaxed expression. The result should look natural and refreshed, NOT 'frozen' or unnatural.
  
  Generate only the image, with no text overlays, labels, or dots.`;

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

  throw new Error("No post-treatment simulation image was generated.");
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