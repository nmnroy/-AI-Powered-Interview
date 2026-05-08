import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateWithFallback } from "@/lib/ai";

export const dynamic = "force-dynamic";

type FeedbackPayload = {
  answerId: string;
  question: string;
  answer: string;
};

type ParsedFeedback = {
  score: number;
  clarity: number;
  completeness: number;
  structure: number;
  strengths: string[];
  improvements: string[];
  summary: string;
};

function clampScore(value: number) {
  if (Number.isNaN(value)) return 1;
  return Math.max(1, Math.min(10, Math.round(value)));
}

function buildLocalFeedback(questionText: string, answerText: string): ParsedFeedback {
  const trimmed = answerText.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const hasStructure = /(first|second|third|finally|because|therefore|for example)/i.test(trimmed);
  const mentionsQuestionKeyword = questionText
    .split(/\W+/)
    .filter((w) => w.length > 4)
    .some((w) => new RegExp(`\\b${w}\\b`, "i").test(trimmed));

  const completeness = clampScore(Math.min(10, 2 + words / 30));
  const clarity = clampScore((hasStructure ? 7 : 5) + (words > 80 ? 1 : 0));
  const structure = clampScore((hasStructure ? 7 : 4) + (mentionsQuestionKeyword ? 1 : 0));
  const score = clampScore((clarity + completeness + structure) / 3);

  return {
    score,
    clarity,
    completeness,
    structure,
    strengths: [
      words > 60 ? "You provided enough detail to communicate your reasoning." : "You kept the answer concise and easy to follow.",
      mentionsQuestionKeyword ? "Your response stays relevant to the question asked." : "Your core idea is clear and understandable.",
    ],
    improvements: [
      "Add one concrete example to show practical application.",
      "Use a clearer structure: context, approach, trade-off, and outcome.",
      "Mention edge cases or limitations to demonstrate depth.",
    ],
    summary:
      score >= 7
        ? "This is a solid answer with a clear direction. A bit more structure and concrete examples would make it interview-ready."
        : "The answer has a good starting point but needs more depth and structure. Add examples and explicit trade-offs to improve your score.",
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as Partial<FeedbackPayload>;
    const { answerId } = body;

    if (!answerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.answer.findUnique({
      where: { id: answerId },
      include: {
        user: true,
        question: true,
      },
    });
    if (!existing) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    if (existing.user.clerkId !== userId) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    const question = existing.question.text;
    const answer = existing.content;

    const prompt = `You are an expert technical interview coach.
Evaluate this interview answer and respond in this exact JSON format only, no other text:
{
  "score": number (1-10 overall),
  "clarity": number (1-10),
  "completeness": number (1-10),
  "structure": number (1-10),
  "strengths": [string, string],
  "improvements": [string, string, string],
  "summary": "string (2 sentences max)"
}

Question: ${question}
Candidate Answer: ${answer}

Be specific, actionable, and encouraging.`;

    let parsed: ParsedFeedback | null = null;

    try {
      const text = await generateWithFallback(prompt);
      try {
        const firstCurly = text.indexOf("{");
        const lastCurly = text.lastIndexOf("}");
        if (firstCurly !== -1 && lastCurly !== -1) {
          parsed = JSON.parse(text.slice(firstCurly, lastCurly + 1)) as ParsedFeedback;
        } else {
          parsed = JSON.parse(text) as ParsedFeedback;
        }
      } catch {
        parsed = buildLocalFeedback(question, answer);
      }
    } catch {
      parsed = buildLocalFeedback(question, answer);
    }

    parsed = {
      ...parsed,
      score: clampScore(parsed.score),
      clarity: clampScore(parsed.clarity),
      completeness: clampScore(parsed.completeness),
      structure: clampScore(parsed.structure),
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4) : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 5) : [],
      summary: typeof parsed.summary === "string" ? parsed.summary : "Feedback generated.",
    };

    await prisma.answer.update({
      where: { id: answerId },
      data: {
        score: Math.round(parsed.score),
        feedback: JSON.stringify(parsed),
      },
    });

    return NextResponse.json(parsed);

  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Feedback generation failed", message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}