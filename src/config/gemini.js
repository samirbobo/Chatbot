import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = "gemini-2.5-flash";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function runChat(prompt) {
  try {
    // Initialize Generative AI
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // Safety settings
    const safetySettings = [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ]

    // Send message and return response
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      generationConfig: {
        temperature: 0.5,
        topK: 10,
        topP: 0.9,
        maxOutputTokens: 1000,
      },
      safetySettings: safetySettings,
    });

    console.log(response.text)

    return response.text;
  } catch (error) {
    console.error("Error running chat:", error);
    throw error; // Rethrow the error for handling by the caller
  }
}

export default runChat;
