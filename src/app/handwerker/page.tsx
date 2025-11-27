"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function HandwerkerPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      {/* Hero */}
      <section className="sticky top-0 z-0 pt-32 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full">
           <h1 
             className="text-[12vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-8"
           >
             Die Marken <span className="text-[#6B7F59] text-[0.5em] align-top">銘柄</span>
           </h1>
           <div className="h-[1px] w-full bg-black mb-12"></div>
           
           <div className="flex flex-col md:flex-row justify-between gap-12">
             <p className="text-xl md:text-2xl max-w-2xl font-medium">
               Hinter jedem perfekten Schnitt steht Generationen von Wissen. Entdecken Sie die Schmieden, die die Seele von Takumi formen.
             </p>
             <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-2">
               Demnächst verfügbar
             </p>
           </div>
        </div>
      </section>

      {/* Visual */}
      <section className="relative z-10 bg-white px-4 md:px-8 lg:px-12 pb-24 pt-24 min-h-[calc(100vh-5rem+10vh)]">
        <div className="max-w-[1800px] mx-auto">
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-stone-900">
             <Image 
               src="/images/blacksmith.jpg" 
               alt="Meister Schmied bei der Arbeit" 
               fill
               className="object-cover opacity-80"
             />
             <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-white text-4xl md:text-6xl font-oswald font-bold uppercase tracking-widest border-4 border-white px-12 py-6">
                  Feuer & Stahl
                </h2>
             </div>
          </div>
        </div>

        {/* Placeholder Grid */}
        <div className="max-w-[1800px] mx-auto text-center py-24 mt-24 border-t border-black">
           <h3 className="text-4xl font-oswald font-bold uppercase mb-6">Geschichten entstehen...</h3>
           <p className="text-gray-400">Wir dokumentieren derzeit die Geschichten unserer Partner in Sanjo und Miki.</p>
        </div>
      </section>

    </div>
  )
}
