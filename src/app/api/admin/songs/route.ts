import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(songs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, artist, url, isActive } = body;

    // If this song is active, set all others to inactive
    if (isActive) {
      await prisma.song.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    const song = await prisma.song.create({
      data: { 
        title, 
        artist: artist || "", 
        url, 
        isActive: !!isActive 
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, title, artist, url, isActive } = body;

    if (!id) return NextResponse.json({ error: "Song ID required" }, { status: 400 });

    // If this song is being set to active, set all others to inactive
    if (isActive) {
      await prisma.song.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    const song = await prisma.song.update({
      where: { id },
      data: { 
        title, 
        artist: artist || "", 
        url, 
        isActive: !!isActive 
      }
    });

    return NextResponse.json(song);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update song" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await prisma.song.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
