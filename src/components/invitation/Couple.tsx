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
  const brideAlias = couple?.brideAlias || couple?.brideName;
  const brideBio = couple?.brideBio;
  const brideImage = couple?.brideImage || "/bride.png";
  
  const groomName = couple?.groomName || "Mempelai Pria";
  const groomAlias = couple?.groomAlias || couple?.groomName;
  const groomBio = couple?.groomBio;
  const groomImage = couple?.groomImage || "/groom.png";

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section id="couple" ref={sectionRef} className="py-20 md:py-32 px-6 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <TornEdge position="top" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24 max-w-2xl mx-auto"
        >
          <span className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">{t.couple.title}</span>
          
          <p className="text-muted-foreground font-serif italic text-base md:text-lg leading-relaxed mb-6">
            {t.couple.intro}
          </p>
          
          <p className="text-muted-foreground font-serif italic text-base leading-relaxed mb-12">
            {t.couple.requestRestu}
          </p>

          <div className="w-24 h-[1px] bg-primary/20 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          {/* Bride */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center md:items-end text-center md:text-right"
          >
            <div className="relative w-72 h-96 mb-8 transform -rotate-2 group">
              <div className="absolute inset-0 bg-white shadow-2xl p-3 pt-3 pb-12 transition-transform group-hover:rotate-0 duration-500">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={brideImage}
                    alt={brideName}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              {/* Tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/5 opacity-50 rotate-1" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-serif mb-3">{brideName}</h3>
            <p className="font-typewriter text-xs uppercase tracking-widest text-primary mb-6">{t.couple.brideLabel}</p>
            <p className="text-sm italic leading-relaxed text-muted-foreground max-w-xs whitespace-pre-wrap">
              {brideBio}
            </p>
          </motion.div>

          {/* Groom */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="relative w-72 h-96 mb-8 transform rotate-3 group order-first md:order-none">
              <div className="absolute inset-0 bg-white shadow-2xl p-3 pt-3 pb-12 transition-transform group-hover:rotate-0 duration-500">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={groomImage}
                    alt={groomName}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              {/* Tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/5 opacity-50 -rotate-2" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-serif mb-3">{groomName}</h3>
            <p className="font-typewriter text-xs uppercase tracking-widest text-primary mb-6">{t.couple.groomLabel}</p>
            <p className="text-sm italic leading-relaxed text-muted-foreground max-w-xs whitespace-pre-wrap">
              {groomBio}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Background Motif */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60vw] md:text-[40vw] font-serif italic opacity-[0.03] md:opacity-[0.02] pointer-events-none select-none z-0">
        &
      </div>
    </section>
  );
}
