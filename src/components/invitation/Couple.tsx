import { Couple as CoupleType } from "@/types";
import Image from "next/image"; // Assuming Image component is from next/image
import { motion } from "framer-motion"; // Assuming motion component is from framer-motion

export default function Couple({ couple }: { couple: CoupleType | null }) {
  const brideName = couple?.brideName || "Alvia";
  const brideAlias = couple?.brideAlias || "Alvia";
  const brideBio = couple?.brideBio || "Daughter of Mr. Alvia Senior & Mrs. Alvia Senior";
  const brideImage = couple?.brideImage || "/bride.png";
  
  const groomName = couple?.groomName || "Pandiwa";
  const groomAlias = couple?.groomAlias || "Pandiwa";
  const groomBio = couple?.groomBio || "Son of Mr. Pandiwa Senior & Mrs. Pandiwa Senior";
  const groomImage = couple?.groomImage || "/groom.png";

  return (
    <section className="py-32 px-6 bg-background relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <span className="font-typewriter text-xs uppercase tracking-[0.3em] text-primary mb-4 block">Groom & Bride</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-6">Our Profiles</h2>
          <div className="w-24 h-[1px] bg-primary/30 mx-auto mb-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-center">
          {/* Bride */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center md:items-end text-center md:text-right"
          >
            <div className="relative w-72 h-96 mb-8 transform -rotate-2 group">
              <div className="absolute inset-0 bg-white shadow-2xl p-3 pt-3 pb-12 transition-transform group-hover:rotate-0 duration-500">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={brideImage}
                    alt={brideName}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              {/* Tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/5 opacity-50 rotate-1" />
            </div>
            
            <h3 className="text-4xl font-serif mb-3">{brideAlias}</h3>
            <p className="font-typewriter text-xs uppercase tracking-widest text-primary mb-6">The Bride</p>
            <p className="text-sm italic leading-relaxed text-muted-foreground max-w-xs whitespace-pre-wrap">
              {brideBio}
            </p>
          </motion.div>

          {/* Groom */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <div className="relative w-72 h-96 mb-8 transform rotate-3 group order-first md:order-none">
              <div className="absolute inset-0 bg-white shadow-2xl p-3 pt-3 pb-12 transition-transform group-hover:rotate-0 duration-500">
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={groomImage}
                    alt={groomName}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
              {/* Tape effect */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-black/5 opacity-50 -rotate-2" />
            </div>
            
            <h3 className="text-4xl font-serif mb-3">{groomAlias}</h3>
            <p className="font-typewriter text-xs uppercase tracking-widest text-primary mb-6">The Groom</p>
            <p className="text-sm italic leading-relaxed text-muted-foreground max-w-xs whitespace-pre-wrap">
              {groomBio}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
