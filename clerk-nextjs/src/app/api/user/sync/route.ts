import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@clerk.local`;
    const name = clerkUser.fullName ?? ([clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null);

    const existingUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (existingUser) {
      const needsEmailUpdate = existingUser.email.endsWith("@clerk.local") && existingUser.email !== email;
      const needsNameUpdate = !existingUser.name && !!name;

      if (needsEmailUpdate || needsNameUpdate) {
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            ...(needsEmailUpdate ? { email } : {}),
            ...(needsNameUpdate ? { name } : {}),
          },
        });
        return NextResponse.json({ user: updatedUser });
      }

      return NextResponse.json({ user: existingUser });
    }

    const user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        name,
      },
    });

    return NextResponse.json({ user });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to sync user", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
