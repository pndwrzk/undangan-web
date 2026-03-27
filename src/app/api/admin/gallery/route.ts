import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(gallery);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string || "";
    const imageFile = formData.get("imageFile") as File;

    if (!imageFile || imageFile.size === 0) {
      return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const galleryDir = path.join(uploadDir, "gallery");
    await mkdir(galleryDir, { recursive: true });

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `gallery-${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
    await writeFile(path.join(galleryDir, filename), buffer);
    const imageUrl = `/uploads/gallery/${filename}`;

    const order = parseInt(formData.get("order") as string) || 0;

    const galleryItem = await prisma.gallery.create({
      data: { imageUrl, caption: title, order }
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const item = await prisma.gallery.findUnique({
      where: { id }
    });

    if (item?.imageUrl) {
      try {
        const filePath = path.join(process.cwd(), "public", item.imageUrl);
        await import("fs/promises").then(fs => fs.unlink(filePath)).catch(() => {});
      } catch (e) {
        console.error("Failed to delete image file:", e);
      }
    }

    await prisma.gallery.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string || "";
    const order = parseInt(formData.get("order") as string) || 0;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existingItem = await prisma.gallery.findUnique({
      where: { id }
    });

    if (!existingItem) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    // Handle File Upload if provided
    let imageUrl = existingItem.imageUrl;
    const imageFile = formData.get("imageFile") as File;
    
    if (imageFile && imageFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads/gallery");
      await mkdir(uploadDir, { recursive: true });
      
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `gallery-${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      await writeFile(path.join(uploadDir, filename), buffer);
      
      // Delete old file
      try {
        const oldFilePath = path.join(process.cwd(), "public", existingItem.imageUrl);
        await import("fs/promises").then(fs => fs.unlink(oldFilePath)).catch(() => {});
      } catch (e) {}
      
      imageUrl = `/uploads/gallery/${filename}`;
    }

    const updatedItem = await prisma.gallery.update({
      where: { id },
      data: {
        imageUrl,
        caption: title,
        order
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Gallery API PUT Error:", error);
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 });
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
        prisma.gallery.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery API PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
