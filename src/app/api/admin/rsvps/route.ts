import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const q = searchParams.get("q") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (q) {
      where.name = {
        contains: q,
        mode: "insensitive",
      };
    }

    // Fetch paginated data and all data for stats
    const [data, total, allRSVPs] = await Promise.all([
      prisma.rSVP.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.rSVP.count({ where }),
      prisma.rSVP.findMany({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    // Calculate statistics from all filtered data
    const totalConfirmed = allRSVPs.filter((item: any) => item.attendance === "yes").length;
    const totalGuests = allRSVPs
      .filter((item: any) => item.attendance === "yes")
      .reduce((sum: number, item: any) => sum + (item.guests || 1), 0);

    return NextResponse.json({
      data,
      total,
      pages,
      currentPage: page,
      limit,
      stats: {
        totalConfirmed,
        totalGuests,
      },
    });
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVPs" },
      { status: 500 }
    );
  }
}
