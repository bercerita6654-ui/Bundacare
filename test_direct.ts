import { GoogleGenAI } from '@google/genai';

async function test() {
  console.log("Key length:", process.env.GEMINI_API_KEY?.length);
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'hi'
    });
    console.log(res.text);
  } catch (e) {
    console.error(e);
  }
}
test();
