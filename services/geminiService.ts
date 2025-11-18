import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askLibertyGuide = async (question: string, context?: string): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure your environment.";
  }

  try {
    const modelId = 'gemini-2.5-flash';
    const systemInstruction = `You are the spirit of the Statue of Liberty, an expert historian and guide. 
    You speak with a tone of dignity, enlightenment, and warmth.
    Keep answers concise (under 100 words) but poetic and informative.
    Focus on the history, construction (Bartholdi, Eiffel), and symbolism of the monument.
    Context: The user is viewing a 3D simulation of you. ${context ? `Current focus: ${context}` : ''}`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: question,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I am currently lost in thought. Please ask again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The winds of the harbor interfere with my voice. Please try again later.";
  }
};