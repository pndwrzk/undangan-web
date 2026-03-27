import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Guestbook as GuestbookType } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const wishes = await prisma.guestbook.findMany({
      orderBy: { createdAt: 'desc' }
    }) as GuestbookType[];
    return NextResponse.json(wishes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    
    if (!id || typeof status !== 'number') {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const wish = await prisma.guestbook.update({
      where: { id },
      data: { status }
    }) as GuestbookType;

    return NextResponse.json(wish);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update wish" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.guestbook.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete wish" }, { status: 500 });
  }
}
