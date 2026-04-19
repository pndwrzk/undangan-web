import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  try {
    const iconPath = join(process.cwd(), "public/images/icon.png");
    const buffer = await readFile(iconPath);
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    // Fallback jika file tidak ditemukan
    return new Response(null, { status: 404 });
  }
}
