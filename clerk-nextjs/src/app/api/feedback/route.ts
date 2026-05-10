import { NextResponse } from "next/server";

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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<FeedbackPayload>;
    const { answerId, question, answer } = body;

    if (!answerId || !question || !answer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let parsed = buildLocalFeedback(question, answer);

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

    return NextResponse.json(parsed);

  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Feedback generation failed", message: String(error) },
      { status: 500 }
    );
  }
}