"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Hero({ couple }: { couple: any }) {
  const { t, language, toggleLanguage } = useLanguage();
  const brideName = couple?.brideAlias || couple?.brideName || (language === "id" ? "Mempelai Wanita" : "The Bride");
  const groomName = couple?.groomAlias || couple?.groomName || (language === "id" ? "Mempelai Pria" : "The Groom");
  
  // Format wedding date
  const wDate = couple?.weddingDate ? new Date(couple.weddingDate) : new Date();
  const day = wDate.getDate();
  const month = wDate.toLocaleString(language === "id" ? 'id-ID' : 'en-US', { month: 'long' });
  const year = wDate.getFullYear();
  const officialHashtag = couple?.hashtag;
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.4, 0]);

  return (
    <section ref={containerRef} id="hero" className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col md:flex-row items-center justify-center overflow-hidden bg-background">
      {/* Background with texture/image bg */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={couple?.heroImage || "/hero-bg.png"}
          alt="Wedding Background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Language Switcher - Not Fixed, part of Hero */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-primary/20 text-[10px] font-typewriter tracking-widest text-primary hover:bg-primary/20 transition-all active:scale-95 shadow-sm"
        >
          {language === "id" ? "EN" : "ID"}
        </button>
      </div>

      <div className="container relative z-10 flex flex-col items-center justify-center gap-12 px-6">
        {/* Names */}
        <div className="flex-1 text-center">
          
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-6xl md:text-8xl font-serif text-foreground leading-tight mb-12 md:mb-16"
          >
            {brideName} <br />
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-primary italic"
            >&</motion.span> {groomName}
          </motion.h1>

          {officialHashtag && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-primary font-typewriter tracking-[0.2em] uppercase text-sm mb-8"
            >
              {officialHashtag}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="hidden md:block w-32 h-[1px] bg-primary"
          />
        </div>

      </div>

      {/* Decorative Pencil/Element */}
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20 rotate-12">
        <div className="w-1 h-64 bg-primary/40 rounded-full" />
      </div>
    </section>
  );
}
