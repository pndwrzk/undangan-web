"use client";

import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift as GiftType } from "@/types";
import { useLanguage } from "@/components/providers/LanguageProvider";

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
    <section className="py-32 px-6 bg-muted/10 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <div className="p-4 bg-primary/10 w-fit mx-auto rounded-full text-primary mb-6">
            <Gift size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-serif mb-6">{t.gift.title}</h2>
          <p className="text-base md:text-lg italic text-muted-foreground font-serif max-w-xl mx-auto leading-relaxed">
            {t.gift.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gifts.map((acc, index) => (
            <motion.div
              key={acc.id || acc.accountNumber}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-background p-8 rounded-[2rem] shadow-lg border border-primary/5 hover:border-primary/20 transition-all flex flex-col items-center"
            >
              <p className="font-typewriter text-xs uppercase tracking-[0.2em] text-primary mb-4">{acc.bankName}</p>
              <p className="text-xl md:text-2xl font-serif mb-2 tracking-widest">{acc.accountNumber}</p>
              <p className="text-sm font-typewriter text-muted-foreground uppercase mb-8">a/n {acc.accountName}</p>
              
              <Button
                variant="outline"
                onClick={() => handleCopy(acc.accountNumber)}
                className="rounded-full px-6 py-4 flex items-center gap-2 hover:bg-primary/5 border-primary/20"
              >
                {copied === acc.accountNumber ? (
                  <>
                    <Check size={16} className="text-green-600" />
                    <span className="text-xs uppercase font-typewriter">{t.gift.accountCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="text-primary" />
                    <span className="text-xs uppercase font-typewriter">{t.gift.copyAccount}</span>
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.5 }}
           className="mt-16 max-w-md mx-auto"
        >
           <p className="text-sm text-muted-foreground font-serif italic italic leading-relaxed">
             {t.gift.warningNote}
           </p>
        </motion.div>
      </div>
    </section>
  );
}
