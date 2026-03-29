import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Icon() {
  const couple = await prisma.couple.findFirst();

  const brideInitial = (couple?.brideAlias || couple?.brideName || "A").charAt(0).toUpperCase();
  const groomInitial = (couple?.groomAlias || couple?.groomName || "P").charAt(0).toUpperCase();
  const initials = `${brideInitial}${groomInitial}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #505b24 0%, #505b24 100%)",
          borderRadius: "8px",
          fontFamily: "serif",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: initials.length > 2 ? 9 : 12,
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          {initials}
        </span>
      </div>
    ),
    { ...size }
  );
}
