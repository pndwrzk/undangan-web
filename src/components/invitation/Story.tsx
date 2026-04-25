"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { m } from "framer-motion";
import { Heart } from "lucide-react";
import { Z_INDEX } from "@/lib/z-index";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function Story() {
  const { t } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Gambar dari folder public/images
  const topLeftImage = "/images/foto_kecil.jpeg";
  const bottomLeftImages = [
    "/images/rotate/rotate_1.jpeg",
    "/images/rotate/rotate_2.jpeg",
    "/images/rotate/rotate_3.jpeg",
    "/images/rotate/rotate_4.jpeg",
    "/images/rotate/rotate_5.jpeg"
  ];
  const topRightImage = "/images/foto_prewad.jpeg";

  useEffect(() => {
    if (bottomLeftImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % bottomLeftImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [bottomLeftImages.length]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };



  return (
    <section
      id="story"
      style={{ zIndex: Z_INDEX.TORN_EDGE }}
      className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-[#faf5eb] relative -mt-[2px] select-none will-change-transform overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Floating Hearts - Multiple positions with varied sizes */}
      <m.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -10, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 right-[12%] text-primary/30 pointer-events-none z-0"
      >
        <Heart size={60} fill="currentColor" />
      </m.div>

      <m.div
        animate={{ 
          y: [0, -18, 0],
          rotate: [0, 15, 0],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-[40%] left-[12%] text-primary/30 pointer-events-none z-0"
      >
        <Heart size={45} fill="currentColor" />
      </m.div>

      <m.div
        animate={{ 
          y: [0, 12, 0],
          rotate: [0, -12, 0],
          opacity: [0.18, 0.38, 0.18]
        }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-[15%] right-[8%] text-primary/30 pointer-events-none z-0"
      >
        <Heart size={52} fill="currentColor" />
      </m.div>

      <m.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 12, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[8%] text-primary/30 pointer-events-none z-0"
      >
        <Heart size={55} fill="currentColor" />
      </m.div>
      
      <m.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -8, 0],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[15%] right-[15%] text-primary/30 pointer-events-none z-0"
      >
        <Heart size={48} fill="currentColor" />
      </m.div>

      <m.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 8, 0],
          opacity: [0.15, 0.32, 0.15]
        }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        className="absolute top-[60%] right-[20%] text-primary/30 pointer-events-none z-0"
      >
        <Heart size={42} fill="currentColor" />
      </m.div>

      <m.div
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 10, 0],
          opacity: [0.18, 0.36, 0.18]
        }}
        transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
        className="absolute bottom-[25%] left-[15%] text-primary/30 pointer-events-none z-0"
      >
        <Heart size={50} fill="currentColor" />
      </m.div>

      <div className="max-w-6xl mx-auto" style={{ zIndex: Z_INDEX.BASE_CONTENT }}>
        {/* Section Title */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <span className="font-typewriter text-[14px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">{t.story.title}</span>
          <div className="w-20 h-[1px] bg-primary/30 mx-auto" />
        </m.div>

        {/* Story Text - Above Images */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-8 md:mb-12 px-6 md:px-0"
        >
          <p className="text-[11px] md:text-xs text-muted-foreground font-typewriter tracking-[0.1em] md:tracking-widest leading-relaxed text-center">
            {t.story.paragraph1}
          </p>
          <p className="text-[11px] md:text-xs text-muted-foreground font-typewriter tracking-[0.1em] md:tracking-widest leading-relaxed text-center mt-4">
            {t.story.paragraph2}
          </p>
          <p className="text-[11px] md:text-xs text-muted-foreground font-typewriter tracking-[0.1em] md:tracking-widest leading-relaxed text-center mt-4">
            {t.story.paragraph3}
          </p>
        </m.div>

        {/* Grid Layout: 2 columns side by side */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-12 max-w-3xl mx-auto">
          {/* Left Image */}
          <m.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl group"
          >
            <Image
              src={topRightImage}
              alt="Our Story - Left"
              fill
              quality={80}
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
              className="object-cover brightness-[0.95] contrast-[1.02] pointer-events-none transition-transform duration-700 group-hover:scale-105"
              draggable={false}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </m.div>

          {/* Right Rotating Images */}
          <m.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl shadow-2xl group"
          >
            {bottomLeftImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Our Story - Rotating ${index + 1}`}
                fill
                quality={80}
                sizes="(max-width: 768px) 50vw, 33vw"
                loading={index === 0 ? "lazy" : "lazy"}
                className={`object-cover brightness-[0.95] contrast-[1.02] pointer-events-none transition-all duration-1000 ${
                  index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
                draggable={false}
              />
            ))}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </m.div>
        </div>
      </div>
    </section>
  );
}
