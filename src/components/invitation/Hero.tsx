"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { Couple } from "@/types";
import { Z_INDEX } from "@/lib/z-index";

export default function Hero({ couple }: { couple: Couple | null }) {
  const { t, language, toggleLanguage } = useLanguage();
  const brideName =
    couple?.brideAlias ||
    couple?.brideName ||
    (language === "id" ? "Mempelai Wanita" : "The Bride");

  const groomName =
    couple?.groomAlias ||
    couple?.groomName ||
    (language === "id" ? "Mempelai Pria" : "The Groom");

  // Format wedding date
  const wDate = couple?.weddingDate ? new Date(couple.weddingDate) : new Date();
  const day = wDate.getDate();
  const month = wDate.toLocaleString(language === "id" ? "id-ID" : "en-US", {
    month: "long",
  });
  const year = wDate.getFullYear();
  const officialHashtag = couple?.hashtag;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax effects - smooth and subtle
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full flex flex-col md:flex-row items-center justify-center overflow-hidden bg-background"
      style={{ height: 'min(100vh, calc(100vw * 4/3))', minHeight: '500px' }}
    >
      {/* Background with parallax and overlay */}
        <m.div
          style={{
            y,
            scale,
            zIndex: Z_INDEX.BACKGROUND,
          }}
          className="absolute inset-0 will-change-transform transform-gpu"
        >
          <Image
            src={couple?.heroImage || "/hero-bg.png"}
            alt="Wedding Background"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/18 to-background/55" />
        </m.div>

      {/* Language Switcher */}
      <div style={{ zIndex: Z_INDEX.TORN_EDGE }} className="absolute top-8 right-8">
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white/60 backdrop-blur-md rounded-full border border-primary/20 text-[10px] md:text-xs font-typewriter tracking-widest text-primary hover:bg-primary/20 transition-all active:scale-95 shadow-sm"
        >
          {language === "id" ? "EN" : "ID"}
        </button>
      </div>

      <div style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="w-full max-w-4xl mx-auto relative flex flex-col items-center justify-center gap-12 px-6 md:px-8 lg:px-16">
        <div className="flex-1 text-center">
          {/* Animated heading */}
            <m.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-serif text-foreground leading-tight mb-12 md:mb-16 drop-shadow-lg"
            >
              {brideName} <br />
              <m.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                className="text-primary italic"
              >
                &
              </m.span>{" "}
              {groomName}
            </m.h1>

          {/* Animated hashtag */}
            <m.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="text-primary font-typewriter tracking-[0.2em] text-lg md:text-3xl mb-8 drop-shadow-md"
            >
              {officialHashtag}
            </m.p>

          {/* Animated divider */}
            <m.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1, delay: 1, ease: "easeOut" }}
              className="hidden md:block w-32 h-[1px] bg-primary"
            />
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-10 right-10 hidden lg:block opacity-20 rotate-12">
        <div className="w-1 h-64 bg-primary/40 rounded-full" />
      </div>
    </section>
  );
}