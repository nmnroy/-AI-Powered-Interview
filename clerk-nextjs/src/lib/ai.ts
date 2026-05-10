import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"

const geminiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[]

export async function generateWithFallback(prompt: string): Promise<string> {
  if (geminiKeys.length === 0 && !process.env.GROQ_API_KEY) {
    console.error("No AI API keys (Gemini or Groq) found in environment variables.");
    throw new Error("AI configuration missing");
  }

  // Try each Gemini key one by one
  for (const key of geminiKeys) {
    try {
      console.log(`Attempting Gemini generation (Key Index: ${geminiKeys.indexOf(key)})`);
      const genAI = new GoogleGenerativeAI(key)
      // Use the most compatible stable model name
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      })
      const result = await model.generateContent(prompt)
      const text = result.response.text();
      if (text) return text;
    } catch (error: any) {
      console.error(`Gemini key ${geminiKeys.indexOf(key)} failed:`, error.message || error);
      
      // If it's not a rate limit error, we might want to try the next key anyway 
      // just in case one key is invalid but others are fine.
      continue;
    }
  }

  // All Gemini keys exhausted — fall back to Groq
  if (process.env.GROQ_API_KEY) {
    console.log("All Gemini attempts failed, falling back to Groq...");
    try {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      })
      return completion.choices[0]?.message?.content || ""
    } catch (groqError: any) {
      console.error("Groq fallback also failed:", groqError.message || groqError);
      throw new Error("All AI providers exhausted");
    }
  }

  throw new Error("All AI providers failed or were not configured");
}