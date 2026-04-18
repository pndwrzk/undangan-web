"use client";

import { Couple as CoupleType } from "@/types";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Z_INDEX } from "@/lib/z-index";

// Extracted outside Couple to avoid remount on every re-render (prevents flicker)
function PersonSection({
  name,
  label,
  bio,
  image,
  id,
  align = "right",
  className = "",
  onContextMenu,
}: {
  name: string;
  label: string;
  bio?: string | null;
  image: string;
  id: string;
  align?: "left" | "right";
  className?: string;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className={`relative w-full md:w-1/2 overflow-hidden flex flex-col justify-end select-none ${className}`}
      style={{
        height: '100vh',
        minHeight: '100vh'
      }}
      onContextMenu={onContextMenu}
    >
      {/* Background Image - Protected */}
      <div style={{ zIndex: Z_INDEX.BACKGROUND }} className="absolute inset-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover pointer-events-none brightness-[0.9] contrast-[1.05] 
                     scale-125 md:scale-100 
                     origin-center
                     transition-transform duration-300"
          unoptimized
          draggable={false}
          style={{
            objectPosition: 'center center',
            width: '100%',
            height: '100%'
          }}
        />
        {/* Gradient Overlay for Text Readability */}
        <div style={{ zIndex: Z_INDEX.BACKGROUND_OVERLAY }} className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        {/* Transparent Physical Overlay for Protection */}
        <div style={{ zIndex: Z_INDEX.TORN_EDGE }} className="absolute inset-0 bg-transparent pointer-events-auto" />
      </div>

      {/* Content container */}
      <motion.div
        initial={{ opacity: 0, y: 30, x: align === "right" ? 30 : -30 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        style={{ zIndex: Z_INDEX.SECTION_CONTENT }}
        className={`relative p-8 md:p-8 lg:p-16 ${align === "right" ? "text-right self-end" : "text-left self-start"} max-w-xl`}
      >
        <p className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 mb-3 drop-shadow-sm">
          {label}
        </p>
        <h3 className="text-xl md:text-2xl font-serif text-white mb-0.5 drop-shadow-md">
          {name}
        </h3>
        {bio && (
          <p className="text-white/80 font-serif text-sm md:text-base  leading-relaxed drop-shadow-sm">
            {bio}
          </p>
        )}
      </motion.div>

      {/* CSS untuk desktop responsiveness */}
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            height: min(100vh, calc(100vw * 4/3)) !important;
            min-height: 500px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function Couple({ couple }: { couple: CoupleType | null }) {
  const { t } = useLanguage();
  const brideName = couple?.brideName || "Mempelai Wanita";
  const brideBio = couple?.brideBio;
  const brideImage = couple?.brideImage || "/bride.png";

  const groomName = couple?.groomName || "Mempelai Pria";
  const groomBio = couple?.groomBio;
  const groomImage = couple?.groomImage || "/groom.png";

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <section id="couple" style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="bg-background relative">
      <div className="flex flex-col md:flex-row">
        {/* Bride Section First */}
        <PersonSection
          id="bride"
          name={brideName}
          label={t.couple.brideLabel}
          bio={brideBio}
          image={brideImage}
          align="right"
          onContextMenu={handleContextMenu}
        />

        {/* Groom Section Second */}
        <PersonSection
          id="groom"
          name={groomName}
          label={t.couple.groomLabel}
          bio={groomBio}
          image={groomImage}
          align="left"
          onContextMenu={handleContextMenu}
        />
      </div>
    </section>
  );
}
