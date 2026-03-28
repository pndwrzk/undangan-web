import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || searchParams.get("phone");

    if (!q) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Try search by Code first (exact match, case insensitive)
    let guest = await prisma.guest.findUnique({
      where: { code: q.toUpperCase() }
    });

    // 2. Try search by Phone if not found by code
    if (!guest) {
      // Clean phone number: remove all non-digits
      let cleanPhone = q.replace(/\D/g, "");

      if (cleanPhone.length >= 9) {
        // Handle Indonesian numbers:
        if (cleanPhone.startsWith("08")) {
          cleanPhone = "628" + cleanPhone.substring(2);
        } else if (cleanPhone.startsWith("8")) {
          cleanPhone = "628" + cleanPhone.substring(1);
        }

        guest = await prisma.guest.findFirst({
          where: {
            OR: [
              { phone: cleanPhone },
              { phone: cleanPhone.startsWith("628") ? "08" + cleanPhone.substring(3) : cleanPhone }
            ]
          }
        });
      }
    }

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ code: guest.code, name: guest.name });
  } catch (error) {
    console.error("Search guest error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
