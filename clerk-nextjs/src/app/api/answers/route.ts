import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, content } = body as { questionId: string; content: string };
    const trimmedContent = content?.trim();

    if (!questionId || !trimmedContent) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Mock answer response
    const answer = {
      id: "mock_answer_" + Date.now(),
      content: trimmedContent,
      questionId,
      userId: "mock_user",
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(answer);
  } catch {
    return NextResponse.json({ error: "Failed to save answer" }, { status: 500 });
  }
}
