import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const wishes = await prisma.guestbook.findMany({
      where: { status: 1 },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(wishes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}
