import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, content } = body as { questionId: string; content: string };
    const trimmedContent = content?.trim();

    if (!questionId || !trimmedContent) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) {
      // create a minimal user record using clerkId; use a synthetic email to satisfy schema
      user = await prisma.user.create({ data: { clerkId: userId, email: `${userId}@clerk.local` } });
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (question.userId && question.userId !== user.id) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const answer = await prisma.answer.create({
      data: {
        content: trimmedContent,
        questionId,
        userId: user.id,
      },
    });

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let streak = await prisma.streak.findUnique({ where: { userId: user.id } });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId: user.id,
          currentStreak: 1,
          longestStreak: 1,
          lastPracticeDate: today,
        },
      });
    } else {
      const last = streak.lastPracticeDate ? new Date(streak.lastPracticeDate) : null;
      if (last) {
        const lastDate = new Date(last);
        lastDate.setHours(0, 0, 0, 0);

        if (lastDate.getTime() === today.getTime()) {
          // already practiced today — keep streak
          // update lastPracticeDate to today (no-op)
          await prisma.streak.update({ where: { id: streak.id }, data: { lastPracticeDate: today } });
        } else if (lastDate.getTime() === yesterday.getTime()) {
          // continue streak
          const newCurrent = streak.currentStreak + 1;
          const newLongest = Math.max(streak.longestStreak, newCurrent);
          await prisma.streak.update({
            where: { id: streak.id },
            data: { currentStreak: newCurrent, longestStreak: newLongest, lastPracticeDate: today },
          });
        } else {
          // reset streak
          await prisma.streak.update({
            where: { id: streak.id },
            data: { currentStreak: 1, longestStreak: Math.max(streak.longestStreak, 1), lastPracticeDate: today },
          });
        }
      } else {
        // no lastPracticeDate stored, set to today
        await prisma.streak.update({ where: { id: streak.id }, data: { currentStreak: 1, lastPracticeDate: today } });
      }
    }

    return NextResponse.json(answer);
  } catch {
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
