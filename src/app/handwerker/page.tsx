"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HandwerkerPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      {/* Hero */}
      <section className="pt-32 px-4 md:px-8 lg:px-12 mb-24">
        <div className="max-w-[1800px] mx-auto">
           <motion.h1 
             initial={{ opacity: 0, y: 100 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
             className="text-[12vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-8"
           >
             The Makers
           </motion.h1>
           <div className="h-[1px] w-full bg-black mb-12"></div>
           
           <div className="flex flex-col md:flex-row justify-between gap-12">
             <p className="text-xl md:text-2xl max-w-2xl font-medium">
               Behind every perfect cut lies generations of knowledge. Meet the blacksmiths who forge the soul of Takumi.
             </p>
             <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-2">
               Coming Soon
             </p>
           </div>
        </div>
      </section>

      {/* Visual */}
      <section className="px-4 md:px-8 lg:px-12 pb-24">
        <div className="max-w-[1800px] mx-auto">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-stone-900">
             <Image 
               src="/images/blacksmith.jpg" 
               alt="Master Blacksmith at work" 
               fill
               className="object-cover opacity-80"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-4xl md:text-6xl font-oswald font-bold uppercase tracking-widest border-4 border-white px-12 py-6">
                  Forge & Fire
                </h2>
             </div>
          </div>
        </div>
      </section>

      {/* Placeholder Grid */}
      <section className="py-24 px-4 md:px-8 lg:px-12 bg-[#1a1a1a] text-[#FAFAF8]">
         <div className="max-w-[1800px] mx-auto text-center py-24">
            <h3 className="text-4xl font-oswald font-bold uppercase mb-6">Stories unfolding...</h3>
            <p className="text-gray-400">We are currently documenting the stories of our partners in Sanjo and Miki.</p>
         </div>
      </section>

    </div>
  )
}
