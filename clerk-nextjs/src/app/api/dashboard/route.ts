import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { DashboardDataType } from "@/types";

export const dynamic = "force-dynamic";

const DAILY_TARGET = 5;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json<DashboardDataType>(
        {
          currentStreak: 0,
          longestStreak: 0,
          totalAnswers: 0,
          averageScore: null,
          questionsLeftToday: DAILY_TARGET,
          lastPracticeDate: null,
          recentAnswers: [],
        },
        { status: 200 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        streak: true,
        answers: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            question: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json<DashboardDataType>(
        {
          currentStreak: 0,
          longestStreak: 0,
          totalAnswers: 0,
          averageScore: null,
          questionsLeftToday: DAILY_TARGET,
          lastPracticeDate: null,
          recentAnswers: [],
        },
        { status: 200 }
      );
    }

    const totalAnswers = await prisma.answer.count({ where: { userId: user.id } });

    const scoreTotals = await prisma.answer.aggregate({
      where: {
        userId: user.id,
        score: {
          not: null,
        },
      },
      _avg: {
        score: true,
      },
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const answersToday = await prisma.answer.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: todayStart,
        },
      },
    });

    const response: DashboardDataType = {
      currentStreak: user.streak?.currentStreak ?? 0,
      longestStreak: user.streak?.longestStreak ?? 0,
      totalAnswers,
      averageScore: scoreTotals._avg.score ?? null,
      questionsLeftToday: Math.max(0, DAILY_TARGET - answersToday),
      lastPracticeDate: user.streak?.lastPracticeDate?.toISOString() ?? null,
      recentAnswers: user.answers.map((answer) => ({
        id: answer.id,
        content: answer.content,
        score: answer.score,
        feedback: answer.feedback,
        createdAt: answer.createdAt.toISOString(),
        question: {
          id: answer.question.id,
          text: answer.question.text,
          category: answer.question.category,
          difficulty: answer.question.difficulty,
          tags: answer.question.tags,
        },
      })),
    };

    return NextResponse.json(response);
  } catch (err) {
    // If DB is unreachable or any server error occurs, return a safe fallback
    return NextResponse.json<DashboardDataType>(
      {
        currentStreak: 0,
        longestStreak: 0,
        totalAnswers: 0,
        averageScore: null,
        questionsLeftToday: DAILY_TARGET,
        lastPracticeDate: null,
        recentAnswers: [],
      },
      { status: 200 }
    );
  }
}