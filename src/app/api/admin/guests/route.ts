import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Guest as GuestType } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const guests = await prisma.guest.findMany({
      orderBy: { createdAt: 'desc' }
    }) as GuestType[];
    return NextResponse.json(guests);
  } catch (error) {
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
        side: side !== undefined ? Number(side) : 0 
      }
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
        side: side !== undefined ? Number(side) : 0 
      }
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
