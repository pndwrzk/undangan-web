"use client";

import type { Gallery } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Z_INDEX } from "@/lib/z-index";

const classPattern = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
];

export default function Gallery({ gallery = [] }: { gallery?: Gallery[] }) {
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState<Gallery | null>(null);

  if (!Array.isArray(gallery) || gallery.length === 0) return null;

  return (
    <section style={{ zIndex: Z_INDEX.FOOTER - 10 }} className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-[#faf5eb] relative -mt-[2px]">
      <div className="max-w-6xl mx-auto">

        {/* Animated gallery header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <span className="font-typewriter text-[14px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">
            {t.gallery.title}
          </span>
          <p className="text-muted-foreground font-serif italic text-[14px] md:text-base leading-relaxed max-w-2xl mx-auto mb-6">
            {t.gallery.description}
          </p>
          <div className="w-20 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>


        {/* Animated gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {gallery.map((photo, index) => (
            <motion.div
              key={photo.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer ${classPattern[index % classPattern.length]}`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.caption || "Gallery Photo"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                unoptimized
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end justify-center pb-8 px-4">
                {photo.caption && (
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-serif italic px-6 py-2.5 rounded-full text-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">
                    {photo.caption}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog
          open={!!selectedPhoto}
          onOpenChange={(open) => !open && setSelectedPhoto(null)}
        >
          <DialogContent
            showCloseButton={false}
            className="max-w-[95vw] md:max-w-4xl p-0 overflow-visible bg-transparent border-none shadow-none ring-0"
          >
            <div className="relative flex items-center justify-center w-full h-full">
              {selectedPhoto && (
                <div className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.caption || "Gallery Photo"}
                    className="max-w-full max-h-[85vh] md:max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  />

                  {/* Close button inside photo corner */}
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all z-50 border border-primary/10"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {selectedPhoto.caption && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full text-white text-center shadow-2xl">
                      <p className="font-serif italic text-sm md:text-base  drop-shadow-sm">
                        {selectedPhoto.caption}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-3 px-2"
        >
          <div className="w-4 md:w-8 h-[1px] bg-primary/20 shrink-0" />
          <p className="text-[11px] md:text-xs text-muted-foreground font-typewriter tracking-[0.1em] md:tracking-widest leading-relaxed text-center">
            {t.gallery.quote}
          </p>
          <div className="w-4 md:w-8 h-[1px] bg-primary/20 shrink-0" />
        </motion.div>
      </div>

      {/* <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [-12, -8, -12],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-16 left-8 w-20 h-20 border-4 border-primary/10 rounded-full hidden md:block"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [45, 50, 45],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-16 right-8 w-28 h-28 bg-accent/5 rounded-[3rem] hidden md:block"
      /> */}
    </section>
  );
}
