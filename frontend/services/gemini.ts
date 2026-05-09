import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';

// Initialize the SDK. Assuming process.env.API_KEY is available in the build environment.
// If not, this will fail gracefully in the UI.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: apiKey, vertexai: true });

export const getGeminiResponse = async (
  message: string,
  systemInstruction: string,
  history: ChatMessage[]
): Promise<string> => {
  try {
    // Map the history to the format expected by the Gemini API
    const contents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));
    
    // Append the new user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    
    return response.text || '';
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
