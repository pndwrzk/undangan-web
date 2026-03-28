"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MailOpen } from "lucide-react";
import { Suspense } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

import { Couple as CoupleType } from "@/types";

function SplashContent({
  onOpen,
  isOpen,
  couple,
  guestName: propGuestName,
  partnerName
}: {
  onOpen: () => void;
  isOpen: boolean;
  couple: CoupleType | null;
  guestName?: string | null;
  partnerName?: string | null;
}) {
  const { t, language, toggleLanguage } = useLanguage();
  const searchParams = useSearchParams();
  const isDefaultGuest = !propGuestName && !searchParams.get("id");
  const [showSearch, setShowSearch] = useState(isDefaultGuest);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const guestName = propGuestName || searchParams.get("to") || (language === "id" ? "Tamu Undangan" : "Valued Guest");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 4) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/guests/search?q=${phone}`);
      const data = await res.json();
      
      if (res.ok && data.code) {
        window.location.href = `/?guest_code=${data.code}`;
      } else {
        setError(t.splash.notFound);
      }
    } catch (err) {
      setError(t.splash.notFound);
    } finally {
      setLoading(false);
    }
  };

  const brideName = couple?.brideAlias || couple?.brideName || "Mempelai Wanita";
  const groomName = couple?.groomAlias || couple?.groomName || "Mempelai Pria";

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
              <p className="font-typewriter text-[10px] uppercase tracking-[0.5em] text-primary mb-4">{t.splash.weddingInvitation}</p>
              <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-4">
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
              <p className="font-serif italic text-muted-foreground mb-4 text-sm">
                {String(language) === "id" ? "Kepada Bapak/Ibu/Saudara/i:" : "To our Valued Guests:"}
              </p>
              
              <AnimatePresence mode="wait">
                {!showSearch ? (
                  <motion.div
                    key="guest-info"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative py-4"
                  >
                    <h2 className="text-2xl md:text-3xl font-serif text-foreground relative z-10 transition-all">
                      {guestName}
                      {partnerName && (
                        <span className="text-primary italic mx-2">&</span>
                      )}
                      {partnerName}
                    </h2>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-primary/5 -rotate-1" />
                    
                    {isDefaultGuest && (
                      <button
                        onClick={() => setShowSearch(true)}
                        className="mt-6 text-[10px] font-typewriter underline underline-offset-4 tracking-widest text-primary/60 hover:text-primary transition-colors block mx-auto"
                      >
                        {t.splash.findInvitation}
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="search-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative py-4 max-w-sm mx-auto"
                  >
                    <form onSubmit={handleSearch} className="flex flex-col gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={language === "id" ? "Masukkan No. Telp atau Kode" : "Enter Phone or Code"}
                          className="w-full bg-background/50 border border-primary/20 rounded-full px-6 py-3 text-sm font-serif focus:outline-none focus:border-primary/50 transition-all text-center"
                          autoFocus
                        />
                        {loading && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      {error && (
                        <p className="text-[10px] text-red-500 font-serif italic">{error}</p>
                      )}
                      
                      <div className="flex gap-2 justify-center">
                        <button
                          type="submit"
                          disabled={loading || phone.length < 5}
                          className="bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-typewriter tracking-widest uppercase px-6 py-2 rounded-full transition-all disabled:opacity-50"
                        >
                          {t.splash.searchButton}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowSearch(false); setError(""); }}
                          className="text-[10px] font-typewriter tracking-widest uppercase px-4 py-2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
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
                  {t.splash.openInvitation}
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
            {/* Lead to SplashContent div end */}
          </motion.div>

          {/* Language Switcher - Not Fixed, part of Splash */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute top-8 right-8 z-[110]"
          >
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-primary/20 text-[10px] font-typewriter tracking-widest text-primary hover:bg-primary/20 transition-all active:scale-95"
            >
              {language === "id" ? "EN" : "ID"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Splash(props: { onOpen: () => void; isOpen: boolean; couple: CoupleType | null; guestName?: string | null; partnerName?: string | null }) {
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[100] bg-background" />}>
      <SplashContent {...props} />
    </Suspense>
  );
}
