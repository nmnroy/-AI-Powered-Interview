import { NextResponse } from "next/server";
import { generateWithFallback } from "@/lib/ai";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { questionText, category, difficulty } = await req.json();

  if (!questionText) {
    return NextResponse.json({ error: "Question text is required" }, { status: 400 });
  }

  const prompt = `You are a helpful DSA interview coach. Generate a concise, insightful hint for the following coding interview question.

Question: "${questionText}"
Category: ${category ?? "DSA"}
Difficulty: ${difficulty ?? "MEDIUM"}

Rules:
- Give ONLY a hint, NOT the full solution or code
- Hint should nudge the candidate toward the right approach (data structure, algorithm pattern, time complexity target)
- Be specific to THIS question — don't give generic advice
- Keep it under 3 sentences
- Use technical terms naturally (e.g., "try a two-pointer approach" or "think about using a HashMap for O(1) lookups")
- Do NOT start with "Hint:" — just write the hint directly

Respond with ONLY the hint text, nothing else.`;

  try {
    const hint = await generateWithFallback(prompt);
    return NextResponse.json({ hint: hint.trim() });
  } catch {
    return NextResponse.json({ error: "Failed to generate hint" }, { status: 500 });
  }
}
