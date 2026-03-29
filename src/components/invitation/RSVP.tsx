"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { submitRSVP } from "@/lib/actions";
import { useState } from "react";
import { CheckCircle2, UserCheck, UserMinus, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

import { Couple as CoupleType, Guest as GuestType } from "@/types";
import TornEdge from "@/components/invitation/TornEdge";

const formSchema = z.object({
  attendance: z.string().min(1, { message: "Silakan pilih status kehadiran Anda." }),
});

export default function RSVP({ couple, guest }: { couple: CoupleType | null, guest?: GuestType | null }) {
  const { t, language } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(!!guest?.rsvp);
  const brideName = couple?.brideAlias || couple?.brideName || (language === "id" ? "Mempelai Wanita" : "The Bride");
  const groomName = couple?.groomAlias || couple?.groomName || (language === "id" ? "Mempelai Pria" : "The Groom");

  const formSchema = z.object({
    attendance: z.string().min(1, { 
      message: language === "id" ? "Silakan pilih status kehadiran Anda." : "Please select your attendance status." 
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendance: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!guest) return;
    const result = await submitRSVP({ 
      name: guest.name, 
      attendance: values.attendance,
      guestId: guest.id,
    });
    if (result.success) {
      setIsSubmitted(true);
    } else {
      alert(t.rsvp.errorMessage);
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-20 md:py-32 px-6 bg-background relative overflow-hidden">
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60vw] md:text-[45vw] font-serif italic opacity-[0.03] md:opacity-[0.02] pointer-events-none select-none z-0">
          RSVP
        </div>

        {/* Floating Particles */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] text-primary/10 pointer-events-none"
        >
          <Sparkles size={40} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="max-w-xl mx-auto text-center relative z-10"
        >
          <div className="bg-white p-12 md:p-20 rounded-[4rem] border-double border-8 border-primary/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] relative">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif mb-4 italic text-primary">
              {language === "id" ? "Terima Kasih!" : "Thank You!"}
            </h2>
            <p className="text-muted-foreground font-serif text-lg leading-snug mb-8">
              {t.rsvp.successMessage}
            </p>
            <div className="pt-4 border-t border-primary/5">
              <Button 
                variant="outline" 
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:bg-primary/5 font-typewriter text-[10px] uppercase tracking-[0.3em] rounded-full px-8 py-6 h-auto border-primary/20"
              >
                {language === "id" ? "Perbarui Konfirmasi" : "Update RSVP"}
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 md:py-32 px-6 bg-background relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[60vw] md:text-[45vw] font-serif italic opacity-[0.03] md:opacity-[0.02] pointer-events-none select-none z-0">
        RSVP
      </div>

      {/* Floating Particles */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] text-primary/10 pointer-events-none"
      >
        <Sparkles size={40} />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-[10%] text-primary/10 pointer-events-none"
      >
        <Sparkles size={60} />
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full mb-6">
            <Sparkles size={14} className="text-primary" />
            <span className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary">RSVP Undangan</span>
          </div>
          <p className="text-muted-foreground font-serif italic max-w-2xl md:max-w-3xl mx-auto text-base md:text-lg leading-snug">
            {t.rsvp.subtitle}
          </p>
        </motion.div>

        {!guest ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] shadow-xl border border-primary/10 text-center"
          >
            <h3 className="text-lg md:text-xl font-serif mb-3 text-primary italic">
              {language === "id" ? "Tautan Pribadi Diperlukan" : "Personal Link Required"}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground font-serif leading-snug">
              {language === "id" 
                ? "Kami tidak dapat mengenali Anda. Silakan gunakan tautan unik yang dibagikan kepada Anda untuk mengakses portal RSVP."
                : "We are unable to recognize you. Please use your unique link to access the RSVP portal."
              }
            </p>
          </motion.div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-8 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-primary/5 relative"
        >
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/5 rounded-tl-[2rem] md:rounded-tl-[4rem] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/5 rounded-br-[2rem] md:rounded-br-[4rem] pointer-events-none" />
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1px] bg-primary/20" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
              <FormField
                control={form.control}
                name="attendance"
                render={({ field }) => (
                  <FormItem className="space-y-10">
                    <div className="text-center">
                      <FormLabel className="font-serif text-2xl italic text-primary/80">
                        {language === "id" ? "Pilih Status Kehadiran Anda" : "Choose Your Attendance Status"}
                      </FormLabel>
                      <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-3" />
                    </div>
                    
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                          type="button"
                          onClick={() => field.onChange("yes")}
                          className={`relative group p-6 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden flex flex-col items-center gap-3 ${
                            field.value === "yes" 
                              ? "border-primary bg-primary/5 shadow-md" 
                              : "border-muted-foreground/10 bg-transparent hover:border-primary/40 hover:bg-primary/[0.02]"
                          }`}
                        >
                          <AnimatePresence>
                            {field.value === "yes" && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-4 right-6"
                              >
                                <CheckCircle2 className="text-primary w-6 h-6" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${field.value === "yes" ? "bg-primary text-white scale-110 shadow-md" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                            <UserCheck size={24} />
                          </div>
                          <div className="text-center">
                            <span className={`block text-lg font-serif font-bold transition-colors ${field.value === "yes" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>
                              {t.rsvp.yesAttend}
                            </span>
                            <span className="block text-[9px] font-typewriter uppercase tracking-widest text-muted-foreground/60 mt-1">
                              {language === "id" ? "Kehadiran Dikonfirmasi" : "Attendance Confirmed"}
                            </span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange("no")}
                          className={`relative group p-6 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden flex flex-col items-center gap-3 ${
                            field.value === "no" 
                              ? "border-primary bg-primary/5 shadow-md" 
                              : "border-muted-foreground/10 bg-transparent hover:border-primary/40 hover:bg-primary/[0.02]"
                          }`}
                        >
                          <AnimatePresence>
                            {field.value === "no" && (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-4 right-6"
                              >
                                <CheckCircle2 className="text-primary w-6 h-6" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${field.value === "no" ? "bg-primary text-white scale-110 shadow-md" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                            <UserMinus size={24} />
                          </div>
                          <div className="text-center">
                            <span className={`block text-lg font-serif font-bold transition-colors ${field.value === "no" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>
                              {t.rsvp.noAttend}
                            </span>
                            <span className="block text-[9px] font-typewriter uppercase tracking-widest text-muted-foreground/60 mt-1">
                              {language === "id" ? "Berhalangan Hadir" : "Regretfully Decline"}
                            </span>
                          </div>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center font-typewriter text-[10px] text-red-400" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-serif py-6 rounded-2xl shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-0 text-xl group relative overflow-hidden">
                <span className="relative z-10">{t.rsvp.sendRSVP}</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </form>
          </Form>
        </motion.div>
        )}
      </div>
    </section>
  );
}
