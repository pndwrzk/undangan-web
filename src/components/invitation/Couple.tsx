"use client";

import { Couple as CoupleType } from "@/types";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import TornEdge from "@/components/invitation/TornEdge";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

  const PersonSection = ({ 
    name, 
    label, 
    bio, 
    image, 
    id,
    align = "right"
  }: { 
    name: string; 
    label: string; 
    bio?: string | null; 
    image: string; 
    id: string;
    align?: "left" | "right";
  }) => (
    <div 
      className="relative h-[80vh] md:h-screen w-full md:w-1/2 overflow-hidden flex flex-col justify-end select-none"
      onContextMenu={handleContextMenu}
    >
      {/* Background Image - Protected */}
      <div className="absolute inset-0 z-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover pointer-events-none brightness-[0.9] contrast-[1.05]"
          unoptimized
          draggable={false}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className={`absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none`} />
        {/* Transparent Physical Overlay for Protection */}
        <div className="absolute inset-0 z-20 bg-transparent pointer-events-auto" />
      </div>

      {/* Content container */}
      <motion.div 
        initial={{ opacity: 0, y: 30, x: align === "right" ? 30 : -30 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`relative z-30 p-8 md:p-16 ${align === "right" ? "text-right self-end" : "text-left self-start"} max-w-xl`}
      >
        <p className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/70 mb-1 drop-shadow-sm">
          {label}
        </p>
        <h3 className="text-xl md:text-2xl font-serif text-white mb-3 drop-shadow-md">
          {name}
        </h3>
        {bio && (
          <p className="text-white/80 font-serif text-sm md:text-base leading-relaxed drop-shadow-sm">
            {bio}
          </p>
        )}
      </motion.div>
    </div>
  );

  return (
    <section id="couple" className="bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Bride Section First */}
        <PersonSection 
          id="bride"
          name={brideName}
          label={t.couple.brideLabel}
          bio={brideBio}
          image={brideImage}
          align="right"
        />

        {/* Groom Section Second */}
        <PersonSection 
          id="groom"
          name={groomName}
          label={t.couple.groomLabel}
          bio={groomBio}
          image={groomImage}
          align="left"
        />
      </div>
    </section>
  );
}
