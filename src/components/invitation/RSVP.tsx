"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { m, AnimatePresence } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitRSVP } from "@/lib/actions";
import { useState } from "react";
import { CheckCircle2, UserCheck, UserMinus, Heart } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Z_INDEX } from "@/lib/z-index";

import { Couple as CoupleType, Guest as GuestType } from "@/types";



export default function RSVP({ couple, guest }: { couple: CoupleType | null, guest?: GuestType | null }) {
  const { t, language } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(!!guest?.rsvp);
  const [attendanceChoice, setAttendanceChoice] = useState(guest?.rsvp || "");
  const brideName = couple?.brideAlias || couple?.brideName || (language === "id" ? "Mempelai Wanita" : "The Bride");
  const groomName = couple?.groomAlias || couple?.groomName || (language === "id" ? "Mempelai Pria" : "The Groom");

  const formSchema = z.object({
    attendance: z.string().min(1, {
      message: language === "id" ? "Silakan pilih status kehadiran Anda." : "Please select your attendance status."
    }),
    numberOfAttendees: z.string().optional(),
  }).refine(
    (data) => {
      if (data.attendance === "yes") {
        const num = parseInt(data.numberOfAttendees || "0");
        return !isNaN(num) && num > 0;
      }
      return true;
    },
    {
      message: language === "id" ? "Silakan masukkan jumlah yang hadir (minimal 1)" : "Please enter number of attendees (minimum 1)",
      path: ["numberOfAttendees"],
    }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attendance: "",
      numberOfAttendees: "1",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!guest) return;

    // Ensure numberOfAttendees is a valid number when attendance is "yes"
    const numberOfAttendees = values.attendance === "yes"
      ? parseInt(values.numberOfAttendees || "1") || 1
      : undefined;

    const result = await submitRSVP({
      name: guest.name,
      attendance: values.attendance,
      guestId: guest.id,
      numberOfAttendees,
    });
    if (result.success) {
      setAttendanceChoice(values.attendance);
      setIsSubmitted(true);
    } else {
      alert(t.rsvp.errorMessage);
    }
  }

  if (isSubmitted) {
    return (
      <section id="rsvp" style={{ zIndex: Z_INDEX.RSVP_SECTION }} className="py-16 md:py-24 px-6 md:px-8 lg:px-16 bg-[#faf5eb] relative -mt-[2px] overflow-hidden">




        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
          style={{ zIndex: Z_INDEX.BASE_CONTENT }}
          className="max-w-xl mx-auto text-center relative"
        >
          <div className="bg-white p-7 md:p-12 rounded-[2rem] border-double border-4 border-primary/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] relative">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-base md:text-lg font-serif mb-3 italic text-primary">
              {language === "id" ? "Terima Kasih!" : "Thank You!"}
            </h2>
            <p className="text-muted-foreground font-serif text-[14px] md:text-base leading-snug mb-8">
              {attendanceChoice === "yes" ? t.rsvp.successMessage : t.rsvp.successMessageDecline}
            </p>
            <div className="pt-4 border-t border-primary/5">
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="text-primary hover:bg-primary/5 font-typewriter text-[9px] uppercase tracking-[0.3em] rounded-full px-5 py-3 h-auto border-primary/20 min-h-0"
              >
                {language === "id" ? "Perbarui Konfirmasi" : "Update RSVP"}
              </Button>
            </div>
          </div>
        </m.div>
      </section>
    );
  }

  return (
    <section id="rsvp" style={{ zIndex: Z_INDEX.RSVP_SECTION }} className="py-16 md:py-24 px-6 md:px-8 lg:px-16 bg-[#faf5eb] relative -mt-[2px] overflow-hidden">

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />


      {/* Floating Particles */}
      {/* <m.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[10%] text-primary/10 pointer-events-none"
      >
        <Heart size={44} />
        <Heart size={33} />  <Heart size={22} />  <Heart size={11} />  <Heart size={1} />  </m.div>
      <m.div
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-[10%] text-primary/10 pointer-events-none"
      >
        <Heart size={60} />
      </m.div> */}

      <div style={{ zIndex: Z_INDEX.BASE_CONTENT }} className="max-w-4xl mx-auto relative">
        {/* <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full mb-6">

            <span className="font-typewriter text-[10px] md:text-xs uppercase tracking-[0.3em] text-primary">RSVP Undangan</span>
          </div>
          <p className="text-muted-foreground font-serif italic max-w-2xl md:max-w-3xl mx-auto text-base md:text-base leading-snug">
            {t.rsvp.subtitle}
          </p>
        </m.div> */}

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <span className="font-typewriter text-[14px] md:text-xs uppercase tracking-[0.3em] text-primary mb-6 block">RSVP Undangan</span>
          <p className="text-muted-foreground font-serif italic text-[14px] md:text-base leading-relaxed max-w-2xl mx-auto mb-6">
            {t.rsvp.subtitle}
          </p>
          <div className="w-20 h-[1px] bg-primary/30 mx-auto" />
        </m.div>

        {!guest ? (
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-16 rounded-[2rem] md:rounded-[4rem] shadow-xl border border-primary/10 text-center"
          >
            <h3 className="text-lg md:text-xl font-serif mb-3 text-primary italic">
              {language === "id" ? "Tautan Terbatas" : "Access Restricted"}
            </h3>
            <p className="text-sm md:text-sm text-muted-foreground font-serif leading-snug">
              {language === "id"
                ? "Silakan gunakan tautan undangan unik yang dikirimkan untuk melakukan konfirmasi kehadiran."
                : "Please use your unique invitation link to access and confirm your attendance."
              }
            </p>
          </m.div>
        ) : (
          <m.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-primary/5 relative"
          >
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/5 rounded-tl-2xl md:rounded-tl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/5 rounded-br-2xl md:rounded-br-3xl pointer-events-none" />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1px] bg-primary/20" />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="attendance"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="text-center">
                        <FormLabel className="font-serif text-xs md:text-sm italic text-primary/80">
                          {language === "id" ? "Pilih Status Kehadiran Anda" : "Choose Your Attendance Status"}
                        </FormLabel>
                        <div className="w-10 h-[1px] bg-primary/20 mx-auto mt-2" />
                      </div>

                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => field.onChange("yes")}
                            className={`relative group p-3 rounded-xl border-2 transition-all duration-500 overflow-hidden flex flex-col items-center gap-2 ${field.value === "yes"
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-muted-foreground/10 bg-transparent hover:border-primary/40 hover:bg-primary/[0.02]"
                              }`}
                          >
                            <AnimatePresence>
                              {field.value === "yes" && (
                                <m.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute top-2 right-3"
                                >
                                  <CheckCircle2 className="text-primary w-4 h-4" />
                                </m.div>
                              )}
                            </AnimatePresence>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${field.value === "yes" ? "bg-primary text-white scale-110 shadow-md" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                              <UserCheck size={16} />
                            </div>
                            <div className="text-center">
                              <span className={`block text-xs md:text-sm font-serif font-bold transition-colors ${field.value === "yes" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>
                                {t.rsvp.yesAttend}
                              </span>
                              <span className="block text-[6px] md:text-[8px] font-typewriter uppercase tracking-widest text-muted-foreground/60 mt-0.5">
                                {language === "id" ? "Kehadiran Dikonfirmasi" : "Attendance Confirmed"}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => field.onChange("no")}
                            className={`relative group p-3 rounded-xl border-2 transition-all duration-500 overflow-hidden flex flex-col items-center gap-2 ${field.value === "no"
                              ? "border-primary bg-primary/5 shadow-md"
                              : "border-muted-foreground/10 bg-transparent hover:border-primary/40 hover:bg-primary/[0.02]"
                              }`}
                          >
                            <AnimatePresence>
                              {field.value === "no" && (
                                <m.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute top-2 right-3"
                                >
                                  <CheckCircle2 className="text-primary w-4 h-4" />
                                </m.div>
                              )}
                            </AnimatePresence>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${field.value === "no" ? "bg-primary text-white scale-110 shadow-md" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                              <UserMinus size={16} />
                            </div>
                            <div className="text-center">
                              <span className={`block text-xs md:text-sm font-serif font-bold transition-colors ${field.value === "no" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>
                                {t.rsvp.noAttend}
                              </span>
                              <span className="block text-[6px] md:text-[8px] font-typewriter uppercase tracking-widest text-muted-foreground/60 mt-0.5">
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

                {/* Conditional Number of Attendees Field */}
                <AnimatePresence>
                  {form.watch("attendance") === "yes" && (
                    <m.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="numberOfAttendees"
                        render={({ field }) => {
                          const currentValue = parseInt(field.value || "1");

                          const increment = () => {
                            const newValue = currentValue + 1;
                            field.onChange(newValue.toString());
                          };

                          const decrement = () => {
                            if (currentValue > 1) {
                              const newValue = currentValue - 1;
                              field.onChange(newValue.toString());
                            }
                          };

                          return (
                            <FormItem className="space-y-3 w-full">
                              <div className="text-center">
                                <FormLabel className="font-serif text-xs md:text-sm italic text-primary/80">
                                  {language === "id" ? "Berapa Orang yang Akan Hadir?" : "How Many People Will Attend?"}
                                </FormLabel>
                              </div>
                              <FormControl>
                                <div className="flex items-center gap-2 w-full">
                                  {/* Input - 90% on mobile, larger on desktop */}
                                  <div className="flex-[9] md:flex-[19] w-full">
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder={language === "id" ? "Masukkan jumlah" : "Enter number"}
                                      style={{ height: '55px' }}
                                      className="w-full text-center rounded-xl border-primary/20 text-primary
             text-xl md:text-2xl font-serif
             [appearance:textfield] 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none"
                                      {...field}
                                    />
                                  </div>

                                  {/* Buttons - 10% on mobile, smaller on desktop */}
                                  <div className="flex-[1] md:flex-[1] flex flex-col gap-1">
                                    <button
                                      type="button"
                                      onClick={increment}
                                      className="h-[18px] w-full px-4 md:px-0 py-3 rounded-lg bg-primary hover:bg-primary/90 transition-all flex items-center justify-center text-white font-bold text-base md:text-sm"
                                    >
                                      +
                                    </button>
                                    <button
                                      type="button"
                                      onClick={decrement}
                                      disabled={currentValue <= 1}
                                      className="h-[18px] w-full px-4 md:px-0  py-3 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white font-bold text-base md:text-sm"
                                    >
                                      −
                                    </button>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage className="text-center font-typewriter text-[10px] text-red-400" />
                            </FormItem>
                          );
                        }}
                      />
                    </m.div>
                  )}
                </AnimatePresence>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-sans text-sm md:text-base py-5 rounded-xl shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-0 group relative overflow-hidden">
                  <span className="relative">{t.rsvp.sendRSVP}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Button>
              </form>
            </Form>
          </m.div>
        )}
      </div>
    </section>
  );
}
