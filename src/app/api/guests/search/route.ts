import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Clean phone number: remove all non-digits
    let cleanPhone = phone.replace(/\D/g, "");

    // Handle Indonesian numbers:
    // If starts with 08, convert to 628
    if (cleanPhone.startsWith("08")) {
      cleanPhone = "628" + cleanPhone.substring(2);
    } 
    // If starts with 8 (direct mobile), convert to 628
    else if (cleanPhone.startsWith("8") && cleanPhone.length >= 9) {
      cleanPhone = "628" + cleanPhone.substring(1);
    }

    // Find guest. Try exact match first.
    let guest = await prisma.guest.findFirst({
      where: {
        phone: cleanPhone
      }
    });

    // If not found, try common variants (like starting with 08 instead of 628 if stored that way)
    if (!guest) {
      let alternatePhone = cleanPhone;
      if (cleanPhone.startsWith("628")) {
        alternatePhone = "08" + cleanPhone.substring(3);
      }
      
      guest = await prisma.guest.findFirst({
        where: {
          phone: alternatePhone
        }
      });
    }

    if (!guest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    return NextResponse.json({ id: guest.id, name: guest.name });
  } catch (error) {
    console.error("Search guest error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
