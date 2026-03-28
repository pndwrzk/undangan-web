"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Image from "next/image";
import { Couple as CoupleType } from "@/types";

export interface QuoteHeaderProps {
  couple: CoupleType | null;
}

export default function QuoteHeader({ couple }: QuoteHeaderProps) {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/quote-bg.png"
          alt="Quote Background"
          fill
          className="object-cover brightness-[0.4] saturate-50 scale-105"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="text-white font-serif text-lg md:text-xl lg:text-2xl leading-relaxed drop-shadow-2xl">
            {t.couple.intro}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
