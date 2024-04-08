import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyCuqQLcfipx9YLJAAoQDJy21k59LO5shGk";

async function runChat(prompt) {
  try {
    // Initialize Generative AI
    const generativeAI = new GoogleGenerativeAI(API_KEY);
    const model = generativeAI.getGenerativeModel({ model: MODEL_NAME });

    // Generation configuration
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    // Safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    // Start chat
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    // Send message and return response
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    // console.error("Error running chat:", error);
    // throw error; // Rethrow the error for handling by the caller
    return "There is no exact answer to this question. Please ask a more clear question";
  }
}

export default runChat;
