import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY; 
let ai: GoogleGenAI | null = null;

if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (e) {
        console.error("Failed to initialize GoogleGenAI:", e);
    }
} else {
    console.warn("GEMINI_API_KEY is not defined in the frontend.");
}

(window as any).askGemini = async (query: string, systemInstruction: string, history: any[] = []) => {
    if (!ai) throw new Error("Gemini API key is not configured or initialization failed.");
    
    const contents = history.map((msg: any) => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: query }] });

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response.text;
};
