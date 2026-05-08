import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category, Difficulty, Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function normalizeCategory(input?: string): Category | undefined {
  if (!input) return undefined;
  const v = input.toUpperCase();
  if (["DSA", "HR", "SYSTEM_DESIGN", "BEHAVIORAL"].includes(v)) return v as Category;
  return undefined;
}

function normalizeDifficulty(input?: string): Difficulty | undefined {
  if (!input) return undefined;
  const v = input.toUpperCase();
  if (["EASY", "MEDIUM", "HARD"].includes(v)) return v as Difficulty;
  return undefined;
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const url = new URL(req.url);
    const category = normalizeCategory(url.searchParams.get("category") ?? undefined);
    const difficulty = normalizeDifficulty(url.searchParams.get("difficulty") ?? undefined);

    const where: Prisma.QuestionWhereInput = {
      ...(category ? { category } : {}),
      ...(difficulty ? { difficulty } : {}),
    };

    const count = await prisma.question.count({ where });

    if (count === 0) {
      return NextResponse.json({ error: "No questions found" }, { status: 404 });
    }

    const skip = Math.floor(Math.random() * count);

    const [question] = await prisma.question.findMany({ where, take: 1, skip });

    return NextResponse.json(question);
  } catch {
    return NextResponse.json({ error: "Failed to fetch random question" }, { status: 500 });
  }
}
