
import { GoogleGenAI, Modality } from "@google/genai";

interface EditImageParams {
  base64ImageData: string;
  mimeType: string;
  prompt: string;
}

export const editImage = async ({ base64ImageData, mimeType, prompt }: EditImageParams): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    // Check for response and parts
    const firstCandidate = response.candidates?.[0];
    if (!firstCandidate || !firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
      throw new Error("Invalid response structure from Gemini API.");
    }

    // Find the image part in the response
    const imagePart = firstCandidate.content.parts.find(part => part.inlineData && part.inlineData.mimeType.startsWith('image/'));
    if (!imagePart || !imagePart.inlineData) {
       throw new Error("No image data found in the API response.");
    }
    
    return imagePart.inlineData.data;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
