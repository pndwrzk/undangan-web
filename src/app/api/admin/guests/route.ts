import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Guest as GuestType } from "@/types";

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

    const guest = await prisma.guest.create({
      data: { 
        name, 
        phone, 
        group, 
        partnerName: body.partnerName || null,
        side: side !== undefined ? Number(side) : 0 
      } as any
    }) as GuestType;

    return NextResponse.json(guest);
  } catch (error) {
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

    const guest = await prisma.guest.update({
      where: { id },
      data: { 
        name, 
        phone, 
        group, 
        partnerName: body.partnerName || null,
        side: side !== undefined ? Number(side) : 0 
      } as any
    }) as GuestType;

    return NextResponse.json(guest);
  } catch (error) {
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

    await (prisma as any).guest.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete guest" }, { status: 500 });
  }
}
