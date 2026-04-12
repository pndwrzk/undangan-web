"use client";

import Image from "next/image";
import { Z_INDEX } from "@/lib/z-index";

interface JourneyProps {
  imageUrl?: string | null;
}

export default function Journey({ imageUrl }: JourneyProps) {
  if (!imageUrl) return null;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <section
      id="story"
      style={{ zIndex: Z_INDEX.TORN_EDGE }}
      className="relative w-full overflow-hidden bg-background select-none -mt-1 will-change-transform"
      onContextMenu={handleContextMenu}
    >
      {/* Image wrapper */}
      <div className="relative w-full">
        <Image
          src={imageUrl}
          alt="Our Story"
          width={2000}   // bebas, hanya untuk ratio
          height={1200}  // bebas, hanya untuk ratio
          className="w-full h-auto object-cover brightness-[0.95] contrast-[1.02] pointer-events-none"
          unoptimized
          draggable={false}
          priority
          loading="eager"
        />

        {/* overlay */}
        <div
          style={{ zIndex: Z_INDEX.BACKGROUND_OVERLAY }}
          className="absolute inset-0 bg-black/5 pointer-events-auto"
        />
      </div>
    </section>
  );
}