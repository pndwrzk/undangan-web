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
