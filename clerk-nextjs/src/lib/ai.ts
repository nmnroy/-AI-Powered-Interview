import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"

const geminiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean) as string[]

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function generateWithFallback(prompt: string): Promise<string> {
  // Try each Gemini key one by one
  for (const key of geminiKeys) {
    try {
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash" 
      })
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error: unknown) {
      const errorObject = error as { status?: number; message?: string }
      // If rate limited or quota exceeded, try next key
      if (
        errorObject.status === 429 ||
        errorObject.message?.includes("quota") ||
        errorObject.message?.includes("rate")
      ) {
        console.log(`Gemini key failed, trying next...`)
        continue
      }
      // For other errors, throw immediately
      throw error
    }
  }

  // All Gemini keys exhausted — fall back to Groq
  console.log("All Gemini keys exhausted, using Groq...")
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    })
    return completion.choices[0]?.message?.content || ""
  } catch {
    throw new Error("All AI providers exhausted")
  }
}