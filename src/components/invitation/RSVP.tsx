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

import { Couple as CoupleType, Guest as GuestType } from "@/types";
import TornEdge from "@/components/invitation/TornEdge";

const formSchema = z.object({
  attendance: z.string().min(1, { message: "Please select your attendance status." }),
});

export default function RSVP({ couple, guest }: { couple: CoupleType | null, guest?: GuestType | null }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const brideName = couple?.brideName || "Alvia";
  const groomName = couple?.groomName || "Pandiwa";

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
      alert("Something went wrong. Please try again.");
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-32 px-6 bg-background relative overflow-hidden">
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
            <h2 className="text-4xl md:text-5xl font-serif mb-6 italic text-primary">Thank You!</h2>
            <p className="text-muted-foreground font-serif text-xl leading-relaxed mb-12">
              Your confirmation has been received. We are so grateful to have you join us on our special journey.
            </p>
            <Button 
              variant="link" 
              onClick={() => setIsSubmitted(false)}
              className="text-primary hover:text-primary/70 font-typewriter text-[10px] uppercase tracking-[0.3em]"
            >
              Update Confirmation
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-32 px-6 bg-[#FAF9F6] relative overflow-hidden">
      <TornEdge position="top" color="fill-background" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-full mb-6">
            <Sparkles size={14} className="text-primary" />
            <span className="font-typewriter text-[10px] uppercase tracking-[0.3em] text-primary">Invitation RSVP</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-serif mb-8 text-primary/90">Will You Attend?</h2>
          <p className="text-muted-foreground font-serif italic max-w-lg mx-auto text-xl leading-relaxed">
            Please kindly confirm your presence before the date to help us prepare a seat for you.
          </p>
        </motion.div>

        {!guest ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-16 rounded-[4rem] shadow-xl border border-primary/10 text-center"
          >
            <h3 className="text-3xl font-serif mb-6 text-primary italic">Personal Link Required</h3>
            <p className="text-lg text-muted-foreground font-serif leading-relaxed">
              We couldn't identify you. Please use the unique link shared with you to access the RSVP portal.
            </p>
          </motion.div>
        ) : (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-white rounded-[5rem] p-10 md:p-20 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.1)] border border-primary/5 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1px] bg-primary/20" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-16">
              <FormField
                control={form.control}
                name="attendance"
                render={({ field }) => (
                  <FormItem className="space-y-10">
                    <div className="text-center">
                      <FormLabel className="font-serif text-3xl italic text-primary/80">Select Your Attendance Status</FormLabel>
                      <div className="w-16 h-[2px] bg-primary/20 mx-auto mt-4" />
                    </div>
                    
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                          type="button"
                          onClick={() => field.onChange("yes")}
                          className={`relative group p-8 rounded-[3rem] border-2 transition-all duration-500 overflow-hidden flex flex-col items-center gap-4 ${
                            field.value === "yes" 
                              ? "border-primary bg-primary/5 shadow-lg" 
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
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${field.value === "yes" ? "bg-primary text-white scale-110 shadow-lg" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                            <UserCheck size={28} />
                          </div>
                          <div className="text-center">
                            <span className={`block text-xl font-serif font-bold transition-colors ${field.value === "yes" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>Yes, I'll Be There</span>
                            <span className="block text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground/60 mt-1">Confirmed Presence</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange("no")}
                          className={`relative group p-8 rounded-[3rem] border-2 transition-all duration-500 overflow-hidden flex flex-col items-center gap-4 ${
                            field.value === "no" 
                              ? "border-primary bg-primary/5 shadow-lg" 
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
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${field.value === "no" ? "bg-primary text-white scale-110 shadow-lg" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}`}>
                            <UserMinus size={28} />
                          </div>
                          <div className="text-center">
                            <span className={`block text-xl font-serif font-bold transition-colors ${field.value === "no" ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`}>Regretfully Decline</span>
                            <span className="block text-[10px] font-typewriter uppercase tracking-widest text-muted-foreground/60 mt-1">Unable to Attend</span>
                          </div>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-center font-typewriter text-[10px] text-red-400" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-serif py-10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] transition-all hover:translate-y-[-4px] active:translate-y-0 text-3xl group relative overflow-hidden">
                <span className="relative z-10">Send Confirmation</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Button>
            </form>
          </Form>
        </motion.div>
        )}
        
        {/* Signatures decorative */}
        <div className="mt-24 flex justify-center items-center gap-16 opacity-30 select-none grayscale">
           <span className="font-serif text-5xl md:text-7xl">{brideName}</span>
           <div className="w-16 h-[1px] bg-primary" />
           <span className="font-serif text-5xl md:text-7xl">{groomName}</span>
        </div>
      </div>
    </section>
  );
}
