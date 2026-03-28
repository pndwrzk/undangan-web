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
    <section 
      className="relative min-h-[40vh] md:min-h-[50vh] flex items-center justify-center px-6 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={couple?.quoteImage || "/quote-bg.png"}
          alt="Quote Background"
          fill
          className="object-cover brightness-[0.4] saturate-50"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-full w-full relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="text-white font-accent text-base sm:text-2xl md:text-4xl leading-snug tracking-tight drop-shadow-lg text-center mx-auto max-w-none px-0 whitespace-pre-line">
            {t.couple.intro}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
