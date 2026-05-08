import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateWithFallback } from "@/lib/ai";

export const dynamic = "force-dynamic";

type GeneratedQuestion = {
  text: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

type GenerateQuestionsResponse = {
  technical: GeneratedQuestion[];
  behavioral: GeneratedQuestion[];
};

function extractJson(text: string) {
  const firstCurly = text.indexOf("{");
  const lastCurly = text.lastIndexOf("}");
  if (firstCurly === -1 || lastCurly === -1 || lastCurly <= firstCurly) {
    return JSON.parse(text);
  }

  return JSON.parse(text.slice(firstCurly, lastCurly + 1));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function inferDifficulty(text: string): "EASY" | "MEDIUM" | "HARD" {
  if (/design|scale|trade-off|architecture|distributed|optimi[sz]e|latency/i.test(text)) {
    return "HARD";
  }
  if (/implement|approach|strategy|debug|analy[sz]e/i.test(text)) {
    return "MEDIUM";
  }
  return "EASY";
}

function buildFallbackQuestions(jobDescription: string): GenerateQuestionsResponse {
  const jd = jobDescription.replace(/\s+/g, " ").trim();
  const sentences = jd.split(/(?<=[.!?])\s+/).filter((line) => line.length > 20);
  const focus = sentences.slice(0, 6);

  const techTemplates = [
    `Walk through how you would design a solution for: ${focus[0] ?? "a core feature from this role"}.`,
    `What technical trade-offs would you consider when implementing: ${focus[1] ?? "the main responsibilities in this JD"}?`,
    `Describe how you would debug and improve performance for systems related to: ${focus[2] ?? "this role's core stack"}.`,
    `How would you prioritize architecture decisions for requirements like: ${focus[3] ?? "scalability, reliability, and maintainability"}?`,
  ];

  const behavioralTemplates = [
    `Tell me about a time you handled a challenging requirement similar to: ${focus[0] ?? "this job description"}.`,
    `Describe how you communicate trade-offs with stakeholders when working on: ${focus[1] ?? "complex technical projects"}.`,
    `Give an example of collaborating across teams to deliver outcomes tied to: ${focus[2] ?? "this role's goals"}.`,
    `How do you learn quickly and ramp up when asked to own areas like: ${focus[3] ?? "new technical domains"}?`,
  ];

  return {
    technical: techTemplates.map((text) => ({ text, difficulty: inferDifficulty(text) })),
    behavioral: behavioralTemplates.map((text) => ({ text, difficulty: "MEDIUM" })),
  };
}

function normalizeOutput(parsed: GenerateQuestionsResponse) {
  const normalizeDifficulty = (value: string): "EASY" | "MEDIUM" | "HARD" => {
    if (value === "EASY" || value === "MEDIUM" || value === "HARD") return value;
    return "MEDIUM";
  };

  return {
    technical: parsed.technical.slice(0, 4).map((q) => ({ text: String(q.text).trim(), difficulty: normalizeDifficulty(String(q.difficulty)) })),
    behavioral: parsed.behavioral.slice(0, 4).map((q) => ({ text: String(q.text).trim(), difficulty: normalizeDifficulty(String(q.difficulty)) })),
  } satisfies GenerateQuestionsResponse;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      jobDescription?: string;
      role?: string;
      company?: string;
    };

    const jobDescription = body.jobDescription?.trim();
    const role = body.role?.trim() ?? "";
    const company = body.company?.trim() ?? "";

    if (!jobDescription) {
      return NextResponse.json({ error: "jobDescription is required" }, { status: 400 });
    }

    const prompt = `You are an expert interviewer at a top tech company.
Based on this job description, generate exactly 8 interview questions.
Return ONLY this JSON, no other text:
{
  "technical": [
    { "text": string, "difficulty": "EASY"|"MEDIUM"|"HARD" },
    (4 items)
  ],
  "behavioral": [
    { "text": string, "difficulty": "EASY"|"MEDIUM"|"HARD" },
    (4 items)
  ]
}

Job Description: ${jobDescription}
Role: ${role}
Company: ${company}

Make questions specific to this exact role, not generic. Reference actual skills from the JD.`;

    let parsed: GenerateQuestionsResponse | null = null;
    try {
      const text = await generateWithFallback(prompt);
      parsed = extractJson(text) as GenerateQuestionsResponse;
    } catch {
      parsed = buildFallbackQuestions(jobDescription);
    }

    if (!Array.isArray(parsed.technical) || !Array.isArray(parsed.behavioral) || parsed.technical.length < 4 || parsed.behavioral.length < 4) {
      parsed = buildFallbackQuestions(jobDescription);
    }

    return NextResponse.json(normalizeOutput(parsed));
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to generate questions", message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
