import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        stats: { total: 0, average: null, currentStreak: 0, longestStreak: 0, bestScore: null },
        chartData: [],
        categoryData: [],
        answers: [],
      });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId }, include: { streak: true } });

    if (!user) {
      return NextResponse.json({
        stats: { total: 0, average: null, currentStreak: 0, longestStreak: 0, bestScore: null },
        chartData: [],
        categoryData: [],
        answers: [],
      });
    }

    const userIdInternal = user.id;

    const total = await prisma.answer.count({ where: { userId: userIdInternal } });

    const avgRes = await prisma.answer.aggregate({
      where: { userId: userIdInternal, score: { not: null } },
      _avg: { score: true },
      _max: { score: true },
    });

    const average = avgRes._avg.score ?? null;
    const bestScore = avgRes._max.score ?? null;

    // Score trend last 14 days
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 13);
    start.setHours(0, 0, 0, 0);

    const recentAnswers = await prisma.answer.findMany({
      where: { userId: userIdInternal, score: { not: null }, createdAt: { gte: start } },
      orderBy: { createdAt: "asc" },
    });

    // group by date string YYYY-MM-DD and average
    const map = new Map<string, { sum: number; count: number }>();
    for (const a of recentAnswers) {
      const d = new Date(a.createdAt);
      const key = d.toISOString().slice(0, 10);
      const cur = map.get(key) ?? { sum: 0, count: 0 };
      cur.sum += (a.score ?? 0);
      cur.count += 1;
      map.set(key, cur);
    }

    const chartData: Array<{ date: string; score: number }> = [];
    for (const [date, val] of map) {
      chartData.push({ date, score: Math.round((val.sum / val.count) * 10) / 10 });
    }

    // Category breakdown
    const answersWithQuestions = await prisma.answer.findMany({
      where: { userId: userIdInternal, score: { not: null } },
      include: { question: true },
    });

    const catMap = new Map<string, { sum: number; count: number }>();
    for (const a of answersWithQuestions) {
      const cat = a.question.category;
      const cur = catMap.get(cat) ?? { sum: 0, count: 0 };
      cur.sum += (a.score ?? 0);
      cur.count += 1;
      catMap.set(cat, cur);
    }

    const categories = ["DSA", "HR", "SYSTEM_DESIGN", "BEHAVIORAL"];
    const categoryData = categories.map((c) => {
      const v = catMap.get(c) ?? { sum: 0, count: 0 };
      return { category: c, avgScore: v.count ? Math.round((v.sum / v.count) * 10) / 10 : null, count: v.count };
    });

    // Full answer history
    const answers = await prisma.answer.findMany({
      where: { userId: userIdInternal },
      include: { question: true },
      orderBy: { createdAt: "desc" },
    });

    const stats = {
      total,
      average,
      currentStreak: user.streak?.currentStreak ?? 0,
      longestStreak: user.streak?.longestStreak ?? 0,
      bestScore,
    };

    return NextResponse.json({ stats, chartData, categoryData, answers });
  } catch {
    return NextResponse.json({ error: "Failed to load progress" }, { status: 500 });
  }
}
