import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { userId: clerkId } = await auth();
    const { id } = await context.params;

    const question = await prisma.question.findUnique({ where: { id } });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    if (question.userId) {
      if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user || user.id !== question.userId) {
        return NextResponse.json({ error: "Question not found" }, { status: 404 });
      }
    }

    return NextResponse.json(question);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to load question", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
