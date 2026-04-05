"use client";

import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(num);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section id="gift" className="py-12 md:py-20 px-6 md:px-8 lg:px-16 bg-[#fcfaf3] relative z-40 -mt-[2px]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <span className="font-typewriter text-[14px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">{t.gift.sectionLabel}</span>
          <p className="text-[14px] md:text-base italic text-muted-foreground font-serif max-w-lg mx-auto leading-snug">
            {t.gift.description}
          </p>
          <div className="w-20 h-[1px] mt-[25px] bg-primary/30 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gifts.map((acc, index) => {
            const bankInfo = getBankInfo(acc.bankName);

            return (
              <motion.div
                key={acc.id || acc.accountNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-background p-8 rounded-[2rem] shadow-lg border border-primary/5 hover:border-primary/20 transition-all flex flex-col items-center"
              >
                <div className="mb-4 h-8 flex items-center justify-center">
                  {bankInfo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bankInfo.logo}
                      alt={acc.bankName}
                      className="h-full w-auto object-contain transition-all"
                    />
                  ) : (
                    <p className="font-typewriter text-xs uppercase tracking-[0.2em] text-primary">{acc.bankName}</p>
                  )}
                </div>
                <p className="text-xl md:text-2xl font-serif mb-2 tracking-widest tabular-nums">{acc.accountNumber}</p>
                <p className="text-sm font-typewriter text-muted-foreground uppercase mb-8">a/n {acc.accountName}</p>

                <Button
                  variant="outline"
                  onClick={() => handleCopy(acc.accountNumber)}
                  className="rounded-full px-6 py-4 flex items-center gap-2 hover:bg-primary/5 border-primary/20"
                >
                  {copied === acc.accountNumber ? (
                    <>
                      <Check size={16} className="text-green-600" />
                      <span className="text-[10px] uppercase font-sans tracking-[0.1em]">{t.gift.accountCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="text-primary" />
                      <span className="text-[10px] uppercase font-sans tracking-[0.1em]">{t.gift.copyAccount}</span>
                    </>
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 max-w-md mx-auto"
        >
          <p className="text-[13px] md:text-sm text-muted-foreground font-typewriter  leading-snug">
            {t.gift.warningNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
