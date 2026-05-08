import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CATEGORY_BY_COLUMN = {
  technical: "SYSTEM_DESIGN",
  behavioral: "BEHAVIORAL",
} as const;

type QuestionInput = {
  text?: string;
  category?: unknown;
  difficulty?: unknown;
  tags?: unknown;
  column?: string;
};

type QuestionsPayload = {
  question?: QuestionInput;
  questions?: QuestionInput[];
};

function normalizeCategory(input: unknown) {
  if (input === "DSA" || input === "HR" || input === "SYSTEM_DESIGN" || input === "BEHAVIORAL") {
    return input;
  }
  return null;
}

function normalizeDifficulty(input: unknown) {
  if (input === "EASY" || input === "MEDIUM" || input === "HARD") {
    return input;
  }
  return "MEDIUM" as const;
}

async function getOrCreateUser(clerkId: string) {
  const existingUser = await prisma.user.findUnique({ where: { clerkId } });
  if (existingUser) return existingUser;

  return prisma.user.create({
    data: {
      clerkId,
      email: `${clerkId}@clerk.local`,
    },
  });
}

async function createQuestionRecord(userId: string, input: QuestionInput) {
  const text = String(input.text ?? "").trim();
  if (!text) {
    throw new Error("Question text is required");
  }

  const category = normalizeCategory(input.category) ?? CATEGORY_BY_COLUMN[input.column as keyof typeof CATEGORY_BY_COLUMN] ?? null;
  if (!category) {
    throw new Error("Invalid category");
  }

  return prisma.question.create({
    data: {
      text,
      category,
      difficulty: normalizeDifficulty(input.difficulty),
      tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
      userId,
    },
  });
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateUser(clerkId);
    const body = (await req.json()) as QuestionsPayload;

    if (Array.isArray(body.questions)) {
      const questions = await Promise.all(
        body.questions.map((item) => createQuestionRecord(user.id, item))
      );
      return NextResponse.json({ questions });
    }

    if (body.question) {
      const question = await createQuestionRecord(user.id, body.question);
      return NextResponse.json({ question });
    }

    return NextResponse.json({ error: "Missing question data" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to save question", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
