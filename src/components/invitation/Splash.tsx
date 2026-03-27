"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react";
import { Suspense } from "react";

import { Couple as CoupleType } from "@/types";

function SplashContent({
  onOpen,
  isOpen,
  couple,
  guestName: propGuestName
}: {
  onOpen: () => void;
  isOpen: boolean;
  couple: CoupleType | null;
  guestName?: string | null;
}) {
  const searchParams = useSearchParams();
  const guestName = propGuestName || searchParams.get("to") || "Tamu Undangan";

  const brideName = couple?.brideName || "Alvia";
  const groomName = couple?.groomName || "Pandiwa";

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
        >
          {/* Background Image with Overlay */}
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={couple?.heroImage || "/hero-bg.png"}
              alt="Background"
              fill
              className="object-cover opacity-30 grayscale saturate-50"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
          </motion.div>

          <div className="relative z-10 text-center px-6 max-w-lg w-full">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="mb-8"
            >
              <p className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-primary mb-4">Wedding Invitation</p>
              <h1 className="text-6xl md:text-8xl font-serif text-foreground mb-4">
                {brideName} <br /> <span className="italic text-primary">&</span> <br /> {groomName}
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="h-[1px] bg-primary/20 mx-auto mt-6"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mb-12"
            >
              <p className="font-serif italic text-muted-foreground mb-4 text-sm">Kepada Bapak/Ibu/Saudara/i:</p>
              <div className="relative py-4">
                <h2 className="text-3xl md:text-4xl font-serif text-foreground relative z-10">{guestName}</h2>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-primary/5 -rotate-1" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <Button
                onClick={onOpen}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-full shadow-[0_15px_30px_-10px_rgba(var(--primary-rgb),0.5)] transition-all hover:scale-105 group text-lg font-serif tracking-widest uppercase overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <MailOpen className="h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Buka Undangan
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </motion.div>
          </div>

          {/* Ornamental Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 1.5, duration: 2 }}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          >
            <motion.div 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-10 left-10 w-40 h-40 border-[20px] border-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2" 
            />
            <motion.div 
              animate={{ 
                y: [0, 30, 0],
                x: [0, 15, 0]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute bottom-10 right-10 w-60 h-60 border-[2px] border-primary/20 rounded-full translate-x-1/3 translate-y-1/3" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Splash(props: { onOpen: () => void; isOpen: boolean; couple: CoupleType | null; guestName?: string | null }) {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[100] bg-background" />}>
      <SplashContent {...props} />
    </Suspense>
  );
}
