import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const guestId = searchParams.get("guestId");
    const skip = (page - 1) * limit;

    const [wishes, total] = await Promise.all([
      prisma.guestbook.findMany({
        where: { status: 1 },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.guestbook.count({
        where: { status: 1 }
      })
    ]);

    // If guestId is provided, find which of these wishes the guest has liked
    let likedByGuest: string[] = [];
    if (guestId) {
      const wishIds = wishes.map(w => w.id);
      const guestLikes = await prisma.guestLike.findMany({
        where: {
          guestId,
          guestbookId: { in: wishIds }
        },
        select: { guestbookId: true }
      });
      likedByGuest = guestLikes.map((l: { guestbookId: string }) => l.guestbookId);
    }

    return NextResponse.json({
      data: wishes,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      likedByGuest
    });
  } catch (error) {
    console.error("Failed to fetch wishes:", error);
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}
