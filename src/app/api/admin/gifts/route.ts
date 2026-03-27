import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const gifts = await prisma.gift.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(gifts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gifts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { bankName, accountNumber, accountName } = body;

    const gift = await prisma.gift.create({
      data: { bankName, accountNumber, accountName }
    });

    return NextResponse.json(gift);
  } catch (error: any) {
    console.error("Gifts API POST Error:", error);
    return NextResponse.json({ error: "Failed to create gift", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, bankName, accountNumber, accountName } = body;

    if (!id) return NextResponse.json({ error: "Gift ID required" }, { status: 400 });

    const gift = await prisma.gift.update({
      where: { id },
      data: { bankName, accountNumber, accountName }
    });

    return NextResponse.json(gift);
  } catch (error: any) {
    console.error("Gifts API PUT Error:", error);
    return NextResponse.json({ error: "Failed to update gift", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.gift.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete gift" }, { status: 500 });
  }
}
