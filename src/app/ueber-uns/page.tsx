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
              Über <span className="text-[#6B7F59]">Takumi</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
             <div className="text-xl md:text-2xl font-medium leading-relaxed space-y-8">
               <p>
                 Takumi (匠) bedeutet "Meister" oder "Kunsthandwerker" auf Japanisch. Es steht für jemanden, der sein Handwerk nicht nur beherrscht, sondern es mit Hingabe und dem Streben nach Perfektion ausübt.
               </p>
               <p className="text-gray-600">
                 Unsere Mission ist es, dieses Niveau an Handwerkskunst nach Deutschland zu bringen. Wir sind nicht nur ein Online-Shop, sondern eine Kurationsplattform für diejenigen, die den wahren Wert von Qualität verstehen.
               </p>
             </div>
             
             <div className="relative w-full aspect-[4/5] max-h-[60vh] bg-stone-200">
                <Image 
                  src="/images/japanese-garden.jpg" 
                  alt="Japanische Garten Philosophie" 
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
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-16">Unsere Werte</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/20">
            {[
              { title: "Authentizität", desc: "Nur echte japanische Werkzeuge. Direkt von den Machern bezogen." },
              { title: "Nachhaltigkeit", desc: "Werkzeuge fürs Leben, nicht für eine Saison. Austauschbare Teile, reparierbarer Stahl." },
              { title: "Bildung", desc: "Wir lehren die Kunst der Pflege. Ein scharfes Werkzeug ist ein sicheres Werkzeug." }
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
              Beginnen Sie Ihre Reise
            </h2>
            <Link href="/werkzeuge" className="inline-flex items-center gap-4 text-xl font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
              Zur Kollektion <ArrowRight />
            </Link>
         </div>
      </section>

    </div>
  )
}
