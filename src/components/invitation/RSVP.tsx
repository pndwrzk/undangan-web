"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { submitRSVP } from "@/lib/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Couple as CoupleType, Guest as GuestType } from "@/types";
import TornEdge from "@/components/invitation/TornEdge";

const formSchema = z.object({
  attendance: z.string().min(1, { message: "Please select your attendance." }),
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
      alert("Failed to send RSVP. Please try again.");
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-20 px-6 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="bg-white p-10 md:p-14 rounded-[3rem] border-double border-8 border-primary/10 shadow-2xl relative">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-8" />
            <h2 className="text-4xl font-serif mb-6 italic">Thank You</h2>
            <p className="text-muted-foreground font-serif text-lg leading-relaxed mb-10">
              Your response has been saved. We look forward to celebrating with you!
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsSubmitted(false)}
              className="rounded-full px-10 py-6 border-primary/20 text-primary hover:bg-primary/5 uppercase tracking-widest text-xs font-typewriter"
            >
              Update RSVP
            </Button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-20 px-6 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      <TornEdge position="top" color="fill-background" />
      {/* Ornamental Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.07] md:opacity-[0.05] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 text-[15vw] md:text-[10vw] font-serif italic text-primary">RSVP</div>
        <div className="absolute top-1/2 right-10 text-[15vw] md:text-[10vw] font-serif italic -rotate-90 translate-y-[-50%] text-primary/50">FOREVER</div>
        <div className="absolute bottom-20 left-10 text-[15vw] md:text-[10vw] font-serif italic text-primary">2026</div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.4em] text-primary mb-4 block">Reservation</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Confirm Attendance</h2>
          <p className="text-muted-foreground font-serif italic max-w-md mx-auto text-lg">
            Please kindly confirm your attendance to help us prepare for our special day.
          </p>
        </motion.div>

        {!guest ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-sm p-12 md:p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-primary/10 relative text-center"
          >
            <h3 className="text-2xl font-serif mb-4 text-red-500">Access Restricted</h3>
            <p className="text-muted-foreground font-serif">
              Please access this page using the unique invitation link sent to you to submit your RSVP.
            </p>
          </motion.div>
        ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-[4rem] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-primary/5 border-t-[20px] border-t-primary/20"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              <div className="grid grid-cols-1 gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <FormField
                    control={form.control}
                    name="attendance"
                    render={({ field }) => (
                      <FormItem className="space-y-4 md:col-span-2">
                        <FormLabel className="font-serif text-xl tracking-wide flex items-center gap-4">
                          Kehadiran <div className="h-[1px] flex-1 bg-primary/10" />
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-0 border-b-2 border-primary/5 rounded-none bg-transparent px-0 focus:ring-0 focus:border-primary transition-all pb-4 h-auto font-serif text-xl shadow-none">
                              <SelectValue placeholder="Select Confirmation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-primary/10 bg-white/95 backdrop-blur-md">
                            <SelectItem value="yes" className="py-4 focus:bg-primary/5">Will Attend</SelectItem>
                            <SelectItem value="no" className="py-4 focus:bg-primary/5">Regretfully Decline</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="font-typewriter text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="pt-6"
              >
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-serif py-8 rounded-[2rem] shadow-2xl transition-all hover:translate-y-[-4px] active:translate-y-0 text-2xl group relative overflow-hidden">
                  <span className="relative z-10">Confirm Now</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
        )}
        
        {/* Signatures decorative */}
        <div className="mt-20 flex justify-center items-center gap-12 opacity-30 select-none grayscale">
           <span className="font-serif text-5xl">{brideName}</span>
           <span className="text-2xl font-serif text-primary">&</span>
           <span className="font-serif text-5xl">{groomName}</span>
        </div>
      </div>
    </section>
  );
}
