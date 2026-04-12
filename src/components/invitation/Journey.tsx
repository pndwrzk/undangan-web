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
      className="relative h-dvh flex flex-col items-center justify-center overflow-hidden bg-background select-none -mt-1"
      onContextMenu={handleContextMenu}
    >
      {/* Full Cover Background Image - Protected */}
      <div style={{ zIndex: Z_INDEX.BACKGROUND }} className="absolute inset-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt="Our Story"
          fill
          className="object-cover pointer-events-none brightness-[0.95] contrast-[1.02]"
          unoptimized
          draggable={false}
        />
        {/* Transparent Overlay to prevent direct right-click on image */}
        <div style={{ zIndex: Z_INDEX.BACKGROUND_OVERLAY }} className="absolute inset-0 bg-black/5 pointer-events-auto" />
      </div>
    </section>
  );
}
