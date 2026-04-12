"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Image from "next/image";
import { Couple as CoupleType } from "@/types";
import { Z_INDEX } from "@/lib/z-index";

export interface QuoteHeaderProps {
  couple: CoupleType | null;
}

export default function QuoteHeader({ couple }: QuoteHeaderProps) {
  const { t } = useLanguage();

  return (
    <section
      className="relative -mt-[2px] min-h-[25vh] md:min-h-[40vh] flex items-center justify-center bg-[#fcfaf3]"
    >
      {/* Decorative Cat Paw Elements - Right (Large) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-12 right-8 md:right-12 text-primary/20 pointer-events-none"
      >
        <svg className="w-20 h-20 md:w-32 md:h-32" viewBox="0 0 100 100" fill="currentColor">
          {/* Main pad */}
          <circle cx="50" cy="65" r="12" />
          {/* Toe pads */}
          <circle cx="30" cy="35" r="8" />
          <circle cx="50" cy="20" r="8" />
          <circle cx="70" cy="35" r="8" />
          <circle cx="75" cy="55" r="7" />
        </svg>
      </motion.div>

      {/* Decorative Cat Paw Elements - Right (Small) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-8 right-6 md:right-10 text-primary/10 pointer-events-none"
      >
        <svg className="w-12 h-12 md:w-16 md:h-16" viewBox="0 0 100 100" fill="currentColor">
          {/* Main pad */}
          <circle cx="50" cy="65" r="12" />
          {/* Toe pads */}
          <circle cx="30" cy="35" r="8" />
          <circle cx="50" cy="20" r="8" />
          <circle cx="70" cy="35" r="8" />
          <circle cx="75" cy="55" r="7" />
        </svg>
      </motion.div>

      <div style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="max-w-full w-full relative text-center px-6 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <p className="text-primary/80 font-serif italic text-[13px] md:text-xl leading-relaxed tracking-normal text-center mx-auto max-w-[320px] md:max-w-2xl px-0">
            {t.couple.intro}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
