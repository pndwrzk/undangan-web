"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import TornEdge from "@/components/invitation/TornEdge";

export default function EventDetails({ events }: { events?: any[] }) {
  if (!events || events.length === 0) return null;

  return (
    <section id="event" className="py-32 px-6 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      <TornEdge position="top" color="fill-muted/5" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-primary mb-4 block">The Celebration</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Wedding Events</h2>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
          {events.map((ev, idx) => (
            <motion.div
              key={ev.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + (idx * 0.2) }}
              className="flex flex-col bg-background p-10 md:p-16 rounded-[2rem] shadow-xl border border-primary/5 group hover:border-primary/20 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                  {idx % 2 === 0 ? <Calendar size={28} /> : <Clock size={28} />}
                </div>
                <span className="font-typewriter text-[10px] uppercase tracking-widest px-3 py-1 bg-accent/20 rounded-full">{ev.title}</span>
              </div>
              
              <h3 className="text-3xl font-serif mb-6">{ev.subtitle || ev.title}</h3>
              
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
                  View Location
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Motif */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] md:text-[15vw] font-serif italic opacity-[0.03] md:opacity-[0.02] pointer-events-none select-none z-0 -rotate-90">
        THE CELEBRATION
      </div>
    </section>
  );
}
