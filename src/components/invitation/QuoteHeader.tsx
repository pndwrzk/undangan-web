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
      className="relative -mt-[2px] min-h-[25vh] md:min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#fcfaf3]"
    >
      <div className="max-w-full w-full relative z-10 text-center px-6">
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
