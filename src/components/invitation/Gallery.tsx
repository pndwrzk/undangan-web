"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const classPattern = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1"
];

export default function Gallery({ gallery }: { gallery?: any[] }) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-32 px-6 bg-background relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-primary mb-4 block">Moments</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Our Gallery</h2>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
          {gallery.map((photo, index) => (
            <motion.div
              key={photo.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl shadow-lg group ${classPattern[index % classPattern.length]}`}
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
      </div>
      
      {/* Decorative Scrapbook Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 border-4 border-primary/10 rounded-full -rotate-12 hidden md:block" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-[3rem] rotate-45 hidden md:block" />
    </section>
  );
}
