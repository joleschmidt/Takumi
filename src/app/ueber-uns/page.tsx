"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      {/* Hero Header */}
      <section className="pt-32 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1800px] mx-auto">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="border-b border-black pb-8 mb-12"
          >
            <h1 className="text-[10vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter">
              About <span className="text-[#6B7F59]">Takumi</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             <div className="text-xl md:text-2xl font-medium leading-relaxed space-y-8">
               <p>
                 Takumi (匠) means "Master" or "Artisan" in Japanese. It stands for someone who not only masters their craft but practices it with dedication and a pursuit of perfection.
               </p>
               <p className="text-gray-600">
                 Our mission is to bring this level of craftsmanship to Germany. We are not just an online shop, but a curation platform for those who understand the true value of quality.
               </p>
             </div>
             
             <div className="relative w-full aspect-[4/5] max-h-[60vh] bg-stone-200">
                <Image 
                  src="/images/japanese-garden.jpg" 
                  alt="Japanese Garden Philosophy" 
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 px-4 md:px-8 lg:px-12 bg-[#1a1a1a] text-[#FAFAF8]">
        <div className="max-w-[1800px] mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-16">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/20">
            {[
              { title: "Authenticity", desc: "Only genuine Japanese tools. Sourced directly from the makers." },
              { title: "Sustainability", desc: "Tools for life, not for a season. Replaceable parts, repairable steel." },
              { title: "Education", desc: "We teach the art of maintenance. A sharp tool is a safe tool." }
            ].map((item, i) => (
              <div key={i} className="border-b border-r border-white/20 p-8 md:p-12 min-h-[300px] flex flex-col justify-between hover:bg-white/5 transition-colors">
                 <span className="text-xs font-bold text-gray-500">0{i + 1}</span>
                 <div>
                   <h3 className="text-4xl font-oswald font-bold uppercase mb-4">{item.title}</h3>
                   <p className="text-gray-400 max-w-sm">{item.desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4 md:px-8 lg:px-12 bg-[#FAFAF8]">
         <div className="max-w-[1800px] mx-auto text-center">
            <h2 className="text-6xl md:text-8xl font-oswald font-bold uppercase tracking-tighter mb-12">
              Start Your Journey
            </h2>
            <Link href="/werkzeuge" className="inline-flex items-center gap-4 text-xl font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
              Explore The Collection <ArrowRight />
            </Link>
         </div>
      </section>

    </div>
  )
}
