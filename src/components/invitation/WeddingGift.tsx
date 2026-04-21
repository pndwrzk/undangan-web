"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Gift as GiftType } from "@/types";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getBankInfo } from "@/constants/banks";
import { Z_INDEX } from "@/lib/z-index";

export default function WeddingGift({ gifts }: { gifts?: GiftType[] }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

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
      style={{ zIndex: Z_INDEX.GIFT_SECTION }}
      className="py-16 md:py-24 px-6 md:px-8 lg:px-16 bg-[#fcfaf3] relative -mt-[2px]"
    >
      <div className="max-w-4xl mx-auto text-center">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-8"
        >
          <span className="font-typewriter text-[14px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">{t.gift.sectionLabel}</span>
          <p className="text-muted-foreground font-serif italic text-[14px] md:text-base leading-relaxed max-w-2xl mx-auto mb-6">
            {t.gift.description}
          </p>
          <div className="w-20 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>


        {/* REVEAL CONTAINER */}
        {/* REVEAL CONTAINER */}
        <div className="relative max-w-2xl mx-auto flex flex-col items-center w-full">
          {/* Visual Rail / Pull Track (Only in cover state) */}
          <AnimatePresence>
            {!isRevealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/30 via-primary/10 to-transparent left-1/2 -translate-x-1/2 z-0 pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* GRID (Hidden until revealed) */}
          <motion.div
            animate={{
              opacity: isRevealed ? 1 : 0,
              scale: isRevealed ? 1 : 0.98,
              filter: isRevealed ? "blur(0px)" : "blur(12px)",
              pointerEvents: isRevealed ? "auto" : "none"
            }}
            transition={{ duration: 0.8 }}
            className={`w-full grid grid-cols-1 ${gifts.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-md mx-auto'} gap-6 relative z-10`}
          >
            {gifts.map((acc, index) => {
              const bankInfo = getBankInfo(acc.bankName);

              return (
                <motion.div
                  key={acc.id || acc.accountNumber}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background p-4 rounded-xl shadow-md border border-primary/5 hover:border-primary/20 transition-all text-left"
                >
                  {/* Top Row: Name + Logo */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <p className="text-base font-typewriter font-semibold text-slate-800 leading-tight">
                      {acc.accountName}
                    </p>
                    <div className="h-5 w-16 flex items-center justify-end flex-shrink-0">
                      {bankInfo ? (
                        <img
                          src={bankInfo.logo}
                          alt={acc.bankName}
                          className="max-h-5 w-auto object-contain opacity-80 grayscale"
                        />
                      ) : (
                        <p className="text-[10px] font-semibold text-primary/60">{acc.bankName}</p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row: Account Number + Copy */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-primary/5">
                    <p className="text-sm font-typewriter tracking-[0.1em] tabular-nums text-slate-600">
                      {acc.accountNumber}
                    </p>
                    <button
                      onClick={() => handleCopy(acc.accountNumber)}
                      className="p-1.5 rounded-md hover:bg-primary/10 transition-all active:scale-95 flex-shrink-0"
                    >
                      {copied === acc.accountNumber ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} className="text-primary/60" />
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* DYNAMIC SWIPE CARD (Stands by at the bottom, does not disappear) */}

          {/* Card Initial State (Covering Grid) */}
          {!isRevealed && (
            <motion.div
              layoutId="dynamic-swipe-card"
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 200 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const isIntentional = info.offset.y > 40 || info.velocity.y > 200;
                if (isIntentional) setIsRevealed(true);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 border-primary/10 rounded-2xl py-3 px-10 shadow-xl cursor-grab active:cursor-grabbing absolute inset-0 m-auto h-fit z-30 w-full max-w-xl group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors animate-bounce mt-4">
                  <ChevronDown className="text-primary/60 w-5 h-5" />
                </div>
                <div className="text-center">

                  <p className="font-typewriter text-[9px] tracking-[0.2em] text-muted-foreground uppercase opacity-60">
                    {t.gift.swipeDown}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Card Revealed State (Standby Below Grid) */}
          {isRevealed && (
            <motion.div
              layoutId="dynamic-swipe-card"
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: -200, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const isIntentional = info.offset.y < -40 || info.velocity.y < -200;
                if (isIntentional) setIsRevealed(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 border-primary/10 rounded-2xl py-3 px-10 shadow-xl cursor-grab active:cursor-grabbing relative mt-12 z-30 w-full max-w-xl group"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute -top-12 bottom-full w-[1px] bg-gradient-to-t from-primary/30 to-transparent left-1/2 -translate-x-1/2 pointer-events-none"
              />

              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors animate-bounce mt-4">
                  <ChevronUp className="text-primary/60 w-5 h-5" />
                </div>
                <div className="text-center">

                  <p className="font-typewriter text-[9px] tracking-[0.2em] text-muted-foreground uppercase opacity-60">
                    {t.gift.swipeUp}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
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
