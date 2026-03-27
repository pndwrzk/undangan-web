import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const activeOnly = searchParams.get("active") === "true";
  
  const session = await getServerSession(authOptions);
  if (!session && !activeOnly) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (activeOnly) {
      const song = await prisma.song.findFirst({
        where: { isActive: true }
      });
      return NextResponse.json(song);
    }

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
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string || "";
    const isActive = formData.get("isActive") === "true";
    const audioFile = formData.get("audioFile") as File;
    let url = formData.get("url") as string || "";

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    // Handle file upload if provided
    if (audioFile && audioFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "uploads/songs");
      await mkdir(uploadDir, { recursive: true });

      const bytes = await audioFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `song-${Date.now()}-${audioFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      url = `/uploads/songs/${filename}`;
    }

    if (!url) return NextResponse.json({ error: "Audio file or URL is required" }, { status: 400 });

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
        artist, 
        url, 
        isActive 
      }
    });
    revalidatePath("/");
    return NextResponse.json(song);
  } catch (error) {
    console.error("Song API POST Error:", error);
    return NextResponse.json({ error: "Failed to create song" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const artist = formData.get("artist") as string || "";
    const isActive = formData.get("isActive") === "true";
    const audioFile = formData.get("audioFile") as File;
    let url = formData.get("url") as string;

    if (!id) return NextResponse.json({ error: "Song ID required" }, { status: 400 });

    const existingSong = await prisma.song.findUnique({ where: { id } });
    if (!existingSong) return NextResponse.json({ error: "Song not found" }, { status: 404 });

    // Handle new file upload
    if (audioFile && audioFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "uploads/songs");
      await mkdir(uploadDir, { recursive: true });

      // Delete old file if it exists and was an upload
        try {
          const pathSegments = existingSong.url.startsWith('/') ? existingSong.url.substring(1).split('/') : existingSong.url.split('/');
          const oldFilePath = path.join(process.cwd(), ...pathSegments);
          await unlink(oldFilePath).catch(() => {});
        } catch (e) {}

      const bytes = await audioFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `song-${Date.now()}-${audioFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      url = `/uploads/songs/${filename}`;
    }

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
        title: title || existingSong.title, 
        artist: artist || existingSong.artist, 
        url: url || existingSong.url, 
        isActive 
      }
    });

    revalidatePath("/");
    return NextResponse.json(song);
  } catch (error) {
    console.error("Song API PUT Error:", error);
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

    const song = await prisma.song.findUnique({ where: { id } });
    
    // Delete physical file if it exists
    if (song?.url.startsWith('/uploads/songs/')) {
      try {
        const pathSegments = song.url.startsWith('/') ? song.url.substring(1).split('/') : song.url.split('/');
        const filePath = path.join(process.cwd(), ...pathSegments);
        await unlink(filePath).catch(() => {});
      } catch (e) {}
    }

    await prisma.song.delete({
      where: { id }
    });

    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete song" }, { status: 500 });
  }
}
