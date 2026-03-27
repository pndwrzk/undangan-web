"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero({ couple }: { couple: any }) {
  const brideName = couple?.brideName || "Alvia";
  const groomName = couple?.groomName || "Pandiwa";
  
  // Format wedding date
  const wDate = couple?.weddingDate ? new Date(couple.weddingDate) : new Date("2026-09-12");
  const day = wDate.getDate();
  const month = wDate.toLocaleString('default', { month: 'long' });
  const year = wDate.getFullYear();
  const officialHashtag = couple?.hashtag || `#${groomName}${brideName}Journey`;

  return (
    <section className="relative min-h-[80vh] md:h-screen flex flex-col md:flex-row items-center justify-center overflow-hidden bg-background">
      {/* Background with texture/image bg */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image
          src={couple?.heroImage || "/hero-bg.png"}
          alt="Wedding Background"
          fill
          className="object-cover animate-slow-zoom"
          priority
        />
      </div>

      <div className="container relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 px-6">
        {/* Left Side: Names */}
        <div className="flex-1 text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-primary font-serif italic text-xl mb-4"
          >
            The Wedding of
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-7xl md:text-9xl font-serif text-foreground leading-none mb-8"
          >
            {brideName} <br />
            <span className="text-primary italic">&</span> {groomName}
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

        {/* Right Side: Sticky Note Date */}
        <motion.div
          initial={{ opacity: 0, rotate: 5, scale: 0.8 }}
          animate={{ opacity: 1, rotate: -2, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative w-64 h-64 bg-[#FFF9C4] shadow-xl p-8 flex flex-col items-center justify-center transform hover:rotate-0 transition-transform duration-500"
        >
          {/* Tape effect */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-8 bg-white/40 backdrop-blur-sm -rotate-2" />
          
          <p className="font-typewriter text-xs uppercase tracking-widest text-muted-foreground mb-4">Save the Date</p>
          <p className="font-serif text-5xl font-bold text-foreground">{day}</p>
          <p className="font-serif text-xl uppercase tracking-[0.2em] text-primary">{month}</p>
          <p className="font-serif text-2xl text-foreground mt-2">{year}</p>
          
          <div className="mt-4 w-full border-t border-black/5 pt-4 text-center">
            <p className="font-typewriter text-[10px] text-muted-foreground italic">{officialHashtag}</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Pencil/Element */}
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20 rotate-12">
        <div className="w-1 h-64 bg-primary/40 rounded-full" />
      </div>
    </section>
  );
}
