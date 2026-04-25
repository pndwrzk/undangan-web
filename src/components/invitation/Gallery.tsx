"use client";

import type { Gallery } from "@/types";
import { m } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useState, useEffect } from "react";
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
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Reset loading state when selected photo changes
  useEffect(() => {
    if (selectedPhoto) {
      setIsImageLoading(true);
    }
  }, [selectedPhoto]);

  if (!Array.isArray(gallery) || gallery.length === 0) return null;

  return (
    <section style={{ zIndex: Z_INDEX.FOOTER - 10 }} className="py-16 md:py-24 px-6 md:px-12 lg:px-24 bg-[#faf5eb] relative -mt-[2px]">
      <div className="max-w-6xl mx-auto">

        {/* Animated gallery header */}
        <m.div
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
        </m.div>


        {/* Animated gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {gallery.map((photo, index) => (
            <m.div
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
                loading="lazy"
                quality={75}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-end justify-center pb-8 px-4">
                {photo.caption && (
                  <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-serif italic px-6 py-2.5 rounded-full text-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 translate-y-4 group-hover:translate-y-0">
                    {photo.caption}
                  </span>
                )}
              </div>
            </m.div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog
          open={!!selectedPhoto}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedPhoto(null);
              setIsImageLoading(true);
            }
          }}
        >
          <DialogContent
            showCloseButton={false}
            className="max-w-[95vw] md:max-w-4xl p-0 overflow-visible bg-transparent border-none shadow-none ring-0"
          >
            <div className="relative flex items-center justify-center w-full h-full min-h-[50vh]" onClick={() => setSelectedPhoto(null)}>
              {selectedPhoto && (
                <div className="relative group" onClick={(e) => e.stopPropagation()}>
                  {/* Loading skeleton */}
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[80vw] h-[70vh] md:w-[60vw] md:h-[80vh] bg-white/10 backdrop-blur-sm rounded-lg animate-pulse flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                          <p className="text-white/70 text-sm font-serif italic">Loading image...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="relative max-w-full max-h-[85vh] md:max-h-[90vh]">
                    <Image
                      src={selectedPhoto.imageUrl}
                      alt={selectedPhoto.caption || "Gallery Photo"}
                      width={1200}
                      height={1200}
                      quality={90}
                      className={`max-w-full max-h-[85vh] md:max-h-[90vh] w-auto h-auto object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                        isImageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      priority
                      onLoad={() => setIsImageLoading(false)}
                      onError={() => setIsImageLoading(false)}
                    />
                  </div>

                  {/* Close button inside photo corner */}
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all z-50 border border-primary/10"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {selectedPhoto.caption && !isImageLoading && (
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

        <m.div
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
        </m.div>
      </div>

      {/* <m.div
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
      <m.div
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
