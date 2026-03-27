"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const classPattern = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1"
];

export default function Gallery({ gallery }: { gallery?: any[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-12 px-6 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-primary mb-4 block">Moments</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Our Gallery</h2>
          <div className="w-20 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>

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
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                {photo.caption && (
                  <span className="text-white text-sm font-serif italic drop-shadow-md px-2 text-center drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {photo.caption}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
          <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none ring-0">
            <div className="relative w-full aspect-[4/5] md:aspect-video flex items-center justify-center">
              {selectedPhoto && (
                <Image
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.caption || "Gallery Photo"}
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Decorative Scrapbook Elements */}
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
          rotate: [-12, -8, -12]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-16 left-8 w-20 h-20 border-4 border-primary/10 rounded-full hidden md:block" 
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [45, 50, 45]
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-16 right-8 w-28 h-28 bg-accent/5 rounded-[3rem] hidden md:block" 
      />
    </section>
  );
}
