import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const couple = await prisma.couple.findFirst();
    return NextResponse.json(couple);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch couple data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    
    // Extract text fields
    const groomName = formData.get("groomName") as string;
    const groomAlias = formData.get("groomAlias") as string;
    const groomBio = formData.get("groomBio") as string;
    const brideName = formData.get("brideName") as string;
    const brideAlias = formData.get("brideAlias") as string;
    const brideBio = formData.get("brideBio") as string;
    const hashtag = formData.get("hashtag") as string;
    const weddingDate = formData.get("weddingDate") as string;
    const id = formData.get("id") as string || '00000000-0000-4000-8000-000000000000';

    const existingCouple = await prisma.couple.findUnique({ where: { id } });

    // Handle File Uploads
    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true }); // Ensure dir exists
    
    let groomImagePath: string | undefined = undefined;
    let brideImagePath: string | undefined = undefined;
    let heroImagePath: string | undefined = undefined;
    let quoteImagePath: string | undefined = undefined;

    const unlinkOld = async (imgPath: string) => {
      try {
        if (!imgPath.endsWith("groom.png") && !imgPath.endsWith("bride.png") && !imgPath.endsWith("hero.jpg") && !imgPath.endsWith("quote-bg.png")) {
          const pathSegments = imgPath.startsWith('/') ? imgPath.substring(1).split('/') : imgPath.split('/');
          const oldFile = path.join(process.cwd(), ...pathSegments);
          await import("fs/promises").then(fs => fs.unlink(oldFile)).catch(() => {});
        }
      } catch (e) {}
    };

    const heroImageFile = formData.get("heroImageFile") as File;
    if (heroImageFile && heroImageFile.size > 0) {
      const heroDir = path.join(uploadDir, "couple/hero");
      await mkdir(heroDir, { recursive: true });
      const bytes = await heroImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `hero-${Date.now()}-${heroImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      await writeFile(path.join(heroDir, filename), buffer);
      heroImagePath = `/uploads/couple/hero/${filename}`;
      if (existingCouple?.heroImage) await unlinkOld(existingCouple.heroImage);
    }

    const groomImageFile = formData.get("groomImageFile") as File;
    if (groomImageFile && groomImageFile.size > 0) {
      const groomDir = path.join(uploadDir, "couple/groom");
      await mkdir(groomDir, { recursive: true });
      const bytes = await groomImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `groom-${Date.now()}-${groomImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      await writeFile(path.join(groomDir, filename), buffer);
      groomImagePath = `/uploads/couple/groom/${filename}`;
      if (existingCouple?.groomImage) await unlinkOld(existingCouple.groomImage);
    }

    const brideImageFile = formData.get("brideImageFile") as File;
    if (brideImageFile && brideImageFile.size > 0) {
      const brideDir = path.join(uploadDir, "couple/bride");
      await mkdir(brideDir, { recursive: true });
      const bytes = await brideImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `bride-${Date.now()}-${brideImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      await writeFile(path.join(brideDir, filename), buffer);
      brideImagePath = `/uploads/couple/bride/${filename}`;
      if (existingCouple?.brideImage) await unlinkOld(existingCouple.brideImage);
    }

    const quoteImageFile = formData.get("quoteImageFile") as File;
    if (quoteImageFile && quoteImageFile.size > 0) {
      const quoteDir = path.join(uploadDir, "couple/quote");
      await mkdir(quoteDir, { recursive: true });
      const bytes = await quoteImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `quote-${Date.now()}-${quoteImageFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      await writeFile(path.join(quoteDir, filename), buffer);
      quoteImagePath = `/uploads/couple/quote/${filename}`;
      if (existingCouple?.quoteImage) await unlinkOld(existingCouple.quoteImage);
    }

    // Build update and create payload
    const dataPayload: any = {
      groomName,
      groomAlias,
      groomBio,
      brideName,
      brideAlias,
      brideBio,
      hashtag: hashtag || "#AlviaPandiwaMenyatu",
      weddingDate: weddingDate ? new Date(weddingDate) : null,
    };
    if (groomImagePath) dataPayload.groomImage = groomImagePath;
    if (brideImagePath) dataPayload.brideImage = brideImagePath;
    if (heroImagePath) dataPayload.heroImage = heroImagePath;
    if (quoteImagePath) dataPayload.quoteImage = quoteImagePath;

    const couple = await prisma.couple.upsert({
      where: { id },
      update: dataPayload,
      create: {
        id,
        ...dataPayload,
        // Set defaults if no image uploaded on first create
        groomImage: groomImagePath || "/groom.png",
        brideImage: brideImagePath || "/bride.png",
        heroImage: heroImagePath || "/hero.jpg",
        quoteImage: quoteImagePath || "/quote-bg.png",
      },
    });

    revalidatePath("/");
    return NextResponse.json(couple);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update couple data" }, { status: 500 });
  }
}
