"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitRSVP(formData: { name: string; attendance: string; guestId?: string | null }) {
  try {
    const data: any = {
      name: formData.name,
      attendance: formData.attendance,
      guests: "1",
    };

    let rsvp;
    if (formData.guestId) {
      rsvp = await prisma.rSVP.upsert({
        where: { guestId: formData.guestId },
        update: data,
        create: { ...data, guestId: formData.guestId },
      });
    } else {
      rsvp = await prisma.rSVP.create({
        data,
      });
    }

    revalidatePath("/admin/dashboard");
    return { success: true, data: rsvp };
  } catch (error) {
    console.error("Failed to submit RSVP:", error);
    return { success: false, error: "Failed to submit RSVP" };
  }
}

export async function submitWish(formData: { name: string; message: string; guestId?: string | null }) {
  try {
    const wish = await prisma.guestbook.create({
      data: {
        name: formData.name,
        message: formData.message,
        guestId: formData.guestId,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true, data: wish };
  } catch (error) {
    console.error("Failed to submit wish:", error);
    return { success: false, error: "Failed to submit wish" };
  }
}
export async function toggleLikeGuestbookMessage(guestbookId: string, guestId: string) {
  let result;
  try {
    // Check if guest has already liked this message
    const existingLike = await prisma.guestLike.findUnique({
      where: {
        guestId_guestbookId: {
          guestId,
          guestbookId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Delete like and decrement count
      await prisma.$transaction([
        prisma.guestLike.delete({
          where: {
            id: existingLike.id,
          },
        }),
        prisma.guestbook.update({
          where: { id: guestbookId },
          data: {
            likes: {
              decrement: 1,
            },
          },
        }),
      ]);
      result = { success: true, liked: false };
    } else {
      // Like: Create like and increment count
      await prisma.$transaction([
        prisma.guestLike.create({
          data: {
            guestId,
            guestbookId,
          },
        }),
        prisma.guestbook.update({
          where: { id: guestbookId },
          data: {
            likes: {
              increment: 1,
            },
          },
        }),
      ]);
      result = { success: true, liked: true };
    }
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return { success: false, error: "Failed to toggle like" };
  }

  // Revalidate outside try-catch to avoid potential issues in Next.js action handling
  revalidatePath("/");
  return result;
}
