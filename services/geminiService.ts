
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { AnalysisResult, PatientGender, ImageSize, ToxinBrand } from "../types";

// Utility to convert data URL to a base64 string for the API
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

  const analysisInstruction = isStaticImage
    ? `Analyze the patient's facial anatomy from the provided static image. Assess for resting tone, static rhytids, signs of muscle hypertrophy (e.g., masseter), and brow position. Generate a treatment plan based on these static observations. CRITICALLY, use the provided static anatomical image as the canvas for your output. All x/y coordinates in the 'sites' array must map precisely to the muscles on this specific image. Generate the full Step 2-5 output as structured JSON.`
    : `Analyze the patient's facial dynamics from the video. CRITICALLY, use the provided static anatomical image as the canvas for your output. All x/y coordinates in the 'sites' array must map precisely to the muscles on this specific image. Generate the full Step 2-5 output as structured JSON.`;


  const response = await ai.models.generateContent({
    // Fix: Upgraded to a more powerful model for this complex, multimodal analysis task.
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
          text: `STEP 1 INTAKE DATA:
                 - Patient Gender: ${gender}
                 - Selected Toxin Brand: ${brand}
                 - Off-Label Lower Face Consent: ${offLabelConsent ? "GRANTED - Assess lower face if indicated" : "DENIED - Upper face only"}
                 
                 ${analysisInstruction}`,
        },
      ],
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
    },
  });

  // FIX: Access the 'text' property directly instead of calling it as a function.
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

  let prompt = `Create a hyper-realistic, clinical-grade anatomical illustration of a patient's face and neck to serve as a backplate for a botulinum toxin treatment plan. This image must be suitable as a "before" photograph in a clinical context.
  The patient is ${analysis.gender}. The overall facial structure, skin texture, and age appearance should reflect this.
  The view must be anterior (front-facing), showing the full face from the hairline down to the clavicles to include the neck and platysmal bands. The patient should look directly forward with a neutral, relaxed expression.
  The image must display subtle, realistic skin textures, including pores and fine lines.
  Employ sophisticated, soft, clinical lighting and shading to accurately model the three-dimensional contours of the face and neck, creating a lifelike appearance. The musculature of the neck, including the sternocleidocastoid and platysma, should be subtly visible.
  Use a clean, neutral, light gray background.
  
  **IMPORTANT FRAMING RULES:**
  - The face must be perfectly centered horizontally.
  - The vertical composition should frame from just above the hairline to the clavicular notch.
  - This strict, consistent framing is crucial for accurate coordinate mapping later.
  
  **IMPORTANT VISUAL RULES:**
  - Do NOT add any text, labels, injection points, dots, or any other overlays to the image. 
  - The image must be a clean, high-fidelity base layer suitable for a separate data overlay.
  
  **Aesthetic Context (for facial structure generation only):**
  ${
    analysis.gender === PatientGender.MALE
      ? "The male patient has a strong jawline, prominent thyroid cartilage, and lower, flatter brows. Reflect this masculine facial structure."
      : "The female patient has softer features, a more gracile neck, and a gentle brow arch. Reflect this feminine facial structure."
  }
  
  Generate only the clean, perfectly centered base image.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
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
  The patient is ${analysis.gender}. The image should include the face and neck, down to the clavicles.
  
  **CRITICAL CONSISTENCY INSTRUCTION:**
  The output image MUST depict the **exact same person** as the pre-treatment base image, maintaining identical lighting, camera angle, framing, and core facial structure. The only modifications should be the specified aesthetic improvements resulting from the treatment. This is not a different person; it is the same person after treatment.
  
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
  
  Generate only the image of the same person with the described improvements, with no text overlays, labels, or dots.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
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

export const generateAnatomicalOverlayVisual = async (
  gender: PatientGender,
  size: ImageSize = '1K'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Create a medically accurate anatomical illustration of the superficial facial and neck musculature.
  
  **CRITICAL REQUIREMENTS:**
  1.  **Transparent Background:** The image MUST have a transparent background so it can be overlaid on another photograph.
  2.  **Framing and Pose:** The illustration must be a direct anterior (front-facing) view, perfectly centered. The framing must match a clinical photograph, showing the area from just above the hairline down to the clavicles. The expression must be neutral / resting.
  3.  **Realism and Detail:** The style should be that of a high-quality medical textbook illustration (e.g., Netter's Atlas of Human Anatomy). Muscles should be clearly defined, with accurate origins, insertions, and fiber direction. Include major muscles like the frontalis, procerus, corrugators, orbicularis oculi, zygomaticus major/minor, masseter, mentalis, and platysma.
  4.  **Gender-Specific Anatomy:**
      - The patient is **${gender}**.
      - ${
        gender === PatientGender.MALE
          ? "Reflect typically masculine features: a larger overall skull, more prominent supraorbital ridges, larger masseter muscles, and a more prominent thyroid cartilage."
          : "Reflect typically feminine features: a more gracile bone structure, smaller masseters, and less prominent supraorbital ridges."
      }
  5.  **Clean Output:** Do NOT include any labels, text, or pointers on the image itself. The output must be a clean anatomical illustration only.
  
  Generate only the muscle illustration on a transparent background.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "3:4",
        imageSize: size,
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No anatomical overlay image was generated.");
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