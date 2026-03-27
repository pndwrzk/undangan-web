"use client";

import { motion } from "framer-motion";
import { Gift, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift as GiftType } from "@/types";

export default function WeddingGift({ gifts }: { gifts?: GiftType[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!gifts || gifts.length === 0) return null;

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(num);
    setTimeout(() => setCopied(null), 2000);
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
          <h2 className="text-4xl md:text-6xl font-serif mb-6">Wedding Gift</h2>
          <p className="text-sm italic text-muted-foreground font-serif max-w-md mx-auto">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a digital contribution would be very much appreciated.
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
              <p className="text-2xl font-serif mb-2 tracking-widest">{acc.accountNumber}</p>
              <p className="text-sm font-typewriter text-muted-foreground uppercase mb-8">a/n {acc.accountName}</p>
              
              <Button
                variant="outline"
                onClick={() => handleCopy(acc.accountNumber)}
                className="rounded-full px-6 py-4 flex items-center gap-2 hover:bg-primary/5 border-primary/20"
              >
                {copied === acc.accountNumber ? (
                  <>
                    <Check size={16} className="text-green-600" />
                    <span className="text-xs uppercase font-typewriter">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="text-primary" />
                    <span className="text-xs uppercase font-typewriter">Copy Number</span>
                  </>
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
