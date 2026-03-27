"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitRSVP(formData: { name: string; attendance: string }) {
  try {
    const rsvp = await prisma.rSVP.create({
      data: {
        name: formData.name,
        attendance: formData.attendance,
        guests: "1", // Default to 1 since we removed the field from the form
      },
    });
    revalidatePath("/admin/dashboard");
    return { success: true, data: rsvp };
  } catch (error) {
    console.error("Failed to submit RSVP:", error);
    return { success: false, error: "Failed to submit RSVP" };
  }
}

export async function submitWish(formData: { name: string; message: string }) {
  try {
    const wish = await prisma.guestbook.create({
      data: {
        name: formData.name,
        message: formData.message,
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
