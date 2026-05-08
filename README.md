// ============================================================================
// FILE 1: prisma/schema.prisma
// Run: npx prisma db push
// ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  answers   Answer[]
  createdAt DateTime @default(now())
}

model Question {
  id         String   @id @default(uuid())
  text       String
  category   String   // DSA, HR, SYSTEM_DESIGN
  difficulty String   // EASY, MEDIUM, HARD
  answers    Answer[]
}

model Answer {
  id           String   @id @default(uuid())
  userId       String
  questionId   String
  userText     String   // The answer the user provided
  score        Int      // 1-10 overall score from AI
  clarity      Int
  completeness Int
  structure    Int
  feedback     String   // AI JSON feedback stored as string
  createdAt    DateTime @default(now())

  user     User     @relation(fields: [userId], references: [id])
  question Question @relation(fields: [questionId], references: [id])
}


// ============================================================================
// FILE 2: src/lib/ai.ts
// Requires: npm install @google/generative-ai
// ============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_1!);

export async function evaluateAnswer(question: string, answer: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are an expert technical interviewer. Evaluate the candidate's answer.
    Question: "${question}"
    Candidate Answer: "${answer}"
    
    Return ONLY a valid JSON object with the following structure:
    {
      "score": number (1-10),
      "clarity": number (1-10),
      "completeness": number (1-10),
      "structure": number (1-10),
      "strengths": ["string"],
      "improvements": ["string"],
      "summary": "string"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean markdown formatting if AI wraps JSON in ```json
    const cleanedText = text.replace(/
```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI Evaluation Failed:", error);
    throw new Error("Failed to evaluate answer");
  }
}


// ============================================================================
// FILE 3: src/app/api/evaluate/route.ts
// Next.js API Route (Backend)
// ============================================================================

import { NextResponse } from "next/server";
import { evaluateAnswer } from "@/lib/ai";
import prisma from "@/lib/prisma"; // Assuming you export your prisma client here

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, questionId, questionText, answerText } = body;

    if (!answerText || !questionText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Get AI Feedback
    const aiFeedback = await evaluateAnswer(questionText, answerText);

    // 2. Save to Database
    const savedAnswer = await prisma.answer.create({
      data: {
        userId,
        questionId,
        userText: answerText,
        score: aiFeedback.score,
        clarity: aiFeedback.clarity,
        completeness: aiFeedback.completeness,
        structure: aiFeedback.structure,
        feedback: JSON.stringify(aiFeedback)
      }
    });

    // 3. Return result to frontend
    return NextResponse.json({ success: true, feedback: aiFeedback });

  } catch (error) {
    console.error("Endpoint Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// ============================================================================
// FILE 4: src/app/practice/page.tsx
// Frontend React Component
// ============================================================================

"use client";

import { useState } from "react";

export default function PracticeArena() {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  // Hardcoded for demo purposes
  const mockQuestion = "Explain the difference between client-side and server-side rendering in Next.js.";

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "test-user-id", // Replace with actual Clerk userId
          questionId: "test-question-id", 
          questionText: mockQuestion,
          answerText: answer
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Practice Arena</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Question:</h2>
        <p>{mockQuestion}</p>
      </div>

      <textarea
        className="w-full border p-4 rounded-lg h-48 mb-4 focus:ring-2 focus:ring-black outline-none"
        placeholder="Type your answer here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={isSubmitting}
      />

      <button 
        onClick={handleSubmit}
        disabled={isSubmitting || !answer}
        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? "Evaluating..." : "Submit Answer"}
      </button>

      {/* AI Feedback UI */}
      {feedback && (
        <div className="mt-8 border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">AI Evaluation</h2>
          <div className="flex gap-4 mb-6">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg flex-1">
              <span className="block text-sm">Overall Score</span>
              <span className="text-3xl font-bold">{feedback.score}/10</span>
            </div>
            {/* You can add similar boxes for clarity, completeness, etc. */}
          </div>
          
          <h3 className="font-bold text-lg mb-2 text-green-700">Strengths:</h3>
          <ul className="list-disc pl-5 mb-4">
            {feedback.strengths.map((str: string, i: number) => <li key={i}>{str}</li>)}
          </ul>

          <h3 className="font-bold text-lg mb-2 text-red-700">Areas to Improve:</h3>
          <ul className="list-disc pl-5 mb-4">
            {feedback.improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
          </ul>

          <div className="bg-gray-50 p-4 rounded-lg mt-4 italic">
            "{feedback.summary}"
          </div>
        </div>
      )}
    </div>
  );
}
