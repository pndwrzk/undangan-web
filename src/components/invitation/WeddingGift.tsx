"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Gift as GiftType } from "@/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getBankInfo } from "@/constants/banks";

export default function WeddingGift({ gifts }: { gifts?: GiftType[] }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);

  if (!gifts || gifts.length === 0) return null;

  const handleCopy = async (num: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(num);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = num;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(num);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <section
      id="gift"
      className="py-12 md:py-20 px-6 md:px-8 lg:px-16 bg-[#fcfaf3] relative z-40 -mt-[2px]"
    >
      <div className="max-w-4xl mx-auto text-center">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <span className="font-typewriter text-[14px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">
            {t.gift.sectionLabel}
          </span>

          <p className="text-[14px] md:text-base italic text-muted-foreground font-typewriter max-w-lg mx-auto leading-snug">
            {t.gift.description}
          </p>

          <div className="w-20 h-[1px] mt-[25px] bg-primary/30 mx-auto" />
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gifts.map((acc, index) => {
            const bankInfo = getBankInfo(acc.bankName);

            return (
              <motion.div
                key={acc.id || acc.accountNumber}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="
                  bg-background
                  p-6 md:p-7
                  rounded-2xl
                  shadow-lg
                  border border-primary/5
                  hover:border-primary/20
                  transition-all
                  relative
                  min-h-[140px]
                "
              >
                {/* NAME - kiri atas */}
                <p className="absolute top-6 left-6 text-lg font-typewriter font-semibold">
                  {acc.accountName}
                </p>

                {/* LOGO - kanan atas */}
                <div className="absolute top-6 right-6 h-8">
                  {bankInfo ? (
                    <img
                      src={bankInfo.logo}
                      alt={acc.bankName}
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <p className="font-semibold">{acc.bankName}</p>
                  )}
                </div>

                {/* NOMOR + COPY */}
                <div className="absolute left-6 bottom-8 flex items-center gap-3">
                  <p className="text-base md:text-l font-typewriter tracking-widest tabular-nums">
                    {acc.accountNumber}
                  </p>

                  <button
                    onClick={() => handleCopy(acc.accountNumber)}
                    className="p-1.5 rounded-md hover:bg-primary/5 transition"
                  >
                    {copied === acc.accountNumber ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} className="text-primary" />
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FOOTNOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 max-w-md mx-auto"
        >
          <p className="text-[13px] md:text-sm text-muted-foreground font-typewriter leading-snug">
            {t.gift.warningNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}