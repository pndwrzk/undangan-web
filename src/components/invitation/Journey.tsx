"use client";

import Image from "next/image";

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
      className="relative h-dvh flex flex-col items-center justify-center overflow-hidden bg-background select-none"
      onContextMenu={handleContextMenu}
    >
      {/* Full Cover Background Image - Protected */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={imageUrl}
          alt="Our Story"
          fill
          className="object-cover pointer-events-none brightness-[0.95] contrast-[1.02]"
          unoptimized
          draggable={false}
        />
        {/* Transparent Overlay to prevent direct right-click on image */}
        <div className="absolute inset-0 z-10 bg-black/5 pointer-events-auto" />
      </div>
    </section>
  );
}
