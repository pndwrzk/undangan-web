"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import TornEdge from "@/components/invitation/TornEdge";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function EventDetails({ events }: { events?: any[] }) {
  const { t } = useLanguage();
  if (!events || events.length === 0) return null;

  return (
    <section id="event" className="py-20 md:py-32 px-6 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      <TornEdge position="top" color="fill-muted/5" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="font-arabic text-2xl md:text-3xl text-primary mb-8 md:mb-10 block leading-[1.6] md:leading-[1.8] drop-shadow-sm px-4" dir="rtl">
            {t.event.sectionLabel}
          </span>
          <h2 className="text-base md:text-lg font-serif mb-8 text-muted-foreground italic leading-relaxed max-w-4xl mx-auto px-6 opacity-90">
            "{t.event.title.split(' (')[0]}"
            <span className="block text-[9px] md:text-[10px] font-typewriter uppercase tracking-[0.3em] mt-4 md:mt-6 not-italic opacity-40">
              {t.event.title.includes('(') ? `(${t.event.title.split(' (')[1]}` : ''}
            </span>
          </h2>
          <div className="w-16 md:w-24 h-[1px] bg-primary/20 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {events.map((ev, idx) => (
            <motion.div
              key={ev.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + (idx * 0.2) }}
              className="flex flex-col bg-background p-8 sm:p-10 md:p-16 rounded-[2rem] shadow-xl border border-primary/5 group hover:border-primary/20 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="p-3 md:p-4 rounded-2xl bg-primary/10 text-primary">
                  {idx % 2 === 0 ? <Calendar size={24} className="md:w-7 md:h-7" /> : <Clock size={24} className="md:w-7 md:h-7" />}
                </div>
                <span className="font-typewriter text-[9px] md:text-[10px] uppercase tracking-widest px-3 py-1 bg-accent/20 rounded-full">{ev.title}</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-serif mb-4 md:mb-6">{ev.subtitle || ev.title}</h3>
              
              <div className="space-y-6 flex-1">
                <div className="flex items-start gap-4">
                  <Clock className="text-primary mt-1 shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-foreground">{ev.time}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{ev.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary mt-1 shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-foreground leading-snug">{ev.location}</p>
                    <p className="text-sm text-muted-foreground mt-1">{ev.address}</p>
                  </div>
                </div>
              </div>

              {ev.mapUrl && (
                <a
                  href={ev.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-12 w-full py-4 bg-primary text-white flex items-center justify-center gap-2 rounded-xl font-serif uppercase tracking-[0.2em] text-xs hover:bg-primary/90 transition-all group-hover:shadow-lg"
                >
                  <ExternalLink size={14} />
                  {t.event.viewMap}
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Motif */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] md:text-[15vw] font-serif italic opacity-[0.03] md:opacity-[0.02] pointer-events-none select-none z-0 -rotate-90">
        {t.event.decorativeTitle}
      </div>
    </section>
  );
}
