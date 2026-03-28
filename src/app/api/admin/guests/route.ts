import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Guest as GuestType } from "@/types";
import { generateGuestCode } from "@/lib/utils";

async function generateUniqueCode(side: number, group?: string | null) {
  let code = generateGuestCode(side, group);
  let exists = await prisma.guest.findUnique({ where: { code } });
  let attempts = 0;
  while (exists && attempts < 10) {
    code = generateGuestCode(side, group);
    exists = await prisma.guest.findUnique({ where: { code } });
    attempts++;
  }
  return code;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const q = searchParams.get("q") || "";
    const skip = (page - 1) * limit;

    const where = q ? {
      OR: [
        { name: { contains: q } },
        { group: { contains: q } },
        { phone: { contains: q } },
        { code: { contains: q } },
      ]
    } : {};

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.guest.count({ where })
    ]);

    return NextResponse.json({
      data: guests,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    console.error("Failed to fetch guests:", error);
    return NextResponse.json({ error: "Failed to fetch guests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, phone, group, side } = body;
    const finalSide = side !== undefined ? Number(side) : 0;
    
    // Generate unique code
    const code = await generateUniqueCode(finalSide, group);

    const guest = await prisma.guest.create({
      data: { 
        name, 
        code,
        phone, 
        group, 
        partnerName: body.partnerName || null,
        side: finalSide
      }
    }) as GuestType;

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to create guest:", error);
    return NextResponse.json({ error: "Failed to create guest" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const body = await req.json();
    const { name, phone, group, side } = body;
    const finalSide = side !== undefined ? Number(side) : 0;

    const existingGuest = await prisma.guest.findUnique({ where: { id } });
    if (!existingGuest) return NextResponse.json({ error: "Guest not found" }, { status: 404 });

    // Generate code if missing
    let code = (existingGuest as any).code;
    if (!code) {
      code = await generateUniqueCode(finalSide, group);
    }

    const guest = await prisma.guest.update({
      where: { id },
      data: { 
        name, 
        code,
        phone, 
        group, 
        partnerName: body.partnerName || null,
        side: finalSide
      }
    }) as GuestType;

    return NextResponse.json(guest);
  } catch (error) {
    console.error("Failed to update guest:", error);
    return NextResponse.json({ error: "Failed to update guest" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.guest.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete guest:", error);
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }
}
