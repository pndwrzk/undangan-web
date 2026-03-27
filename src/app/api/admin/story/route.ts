import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { Story as StoryType } from "@/types";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const stories = await prisma.story.findMany({
      orderBy: { order: 'asc' }
    }) as StoryType[];
    return NextResponse.json(stories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const date = formData.get("date") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    // Handle File Upload
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get("imageFile") as File;
    
    if (imageFile && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads/story");
      await mkdir(uploadDir, { recursive: true });
      
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `story-${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/story/${filename}`;
    }

    const story = await prisma.story.create({
      data: {
        date,
        title,
        description,
        image: imageUrl,
        icon: icon || "Heart",
        order
      }
    }) as StoryType;

    return NextResponse.json(story);
  } catch (error: any) {
    console.error("Story API POST Error:", error);
    return NextResponse.json({ error: "Failed to create story", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const date = formData.get("date") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const order = parseInt(formData.get("order") as string) || 0;

    if (!id) return NextResponse.json({ error: "Story ID required" }, { status: 400 });

    const existingStory = await prisma.story.findUnique({ where: { id } });

    // Handle File Upload
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get("imageFile") as File;
    
    if (imageFile && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads/story");
      await mkdir(uploadDir, { recursive: true });
      
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `story-${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      imageUrl = `/uploads/story/${filename}`;

      if (existingStory?.image) {
        try {
          const oldFile = path.join(process.cwd(), "public", existingStory.image);
          await import("fs/promises").then(fs => fs.unlink(oldFile)).catch(() => {});
        } catch (e) {}
      }
    }

    const dataPayload: Partial<StoryType> = {
      date,
      title,
      description,
      icon,
      order
    };
    if (imageUrl) dataPayload.image = imageUrl;

    const story = await prisma.story.update({
      where: { id },
      data: dataPayload
    }) as StoryType;

    return NextResponse.json(story);
  } catch (error: any) {
    console.error("Story API PUT Error:", error);
    return NextResponse.json({ error: "Failed to update story", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existingStory = await prisma.story.findUnique({ where: { id } });

    if (existingStory?.image) {
      try {
        const filePath = path.join(process.cwd(), "public", existingStory.image);
        await import("fs/promises").then(fs => fs.unlink(filePath)).catch(() => {});
      } catch (e) {}
    }

    await prisma.story.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const items = await req.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await prisma.$transaction(
      items.map((item: { id: string, order: number }) => 
        prisma.story.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Story API PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
