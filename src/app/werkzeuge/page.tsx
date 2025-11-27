"use client";

import { ProductCard } from "@/components/ProductCard"
import { products } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function WerkzeugePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      {/* Hero */}
      <section className="sticky top-0 z-0 pt-32 pb-16 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full">
          <motion.h1 
             initial={{ opacity: 0, y: "100%" }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter mb-12"
          >
            Werkzeug <br/><span className="text-[#6B7F59]">Kollektion</span>
          </motion.h1>
          <div className="h-[1px] w-full bg-black"></div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-4 md:px-8 lg:px-12 pb-24 min-h-[calc(100vh-5rem+10vh)] pt-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Sidebar */}
          <div className="hidden md:block space-y-12 sticky top-32 h-fit">
            <div className="space-y-6">
              <h3 className="font-oswald font-bold text-xl uppercase border-b-2 border-black pb-2">Kategorien</h3>
              <ul className="space-y-3 text-sm font-medium uppercase tracking-widest">
                <li><a href="/werkzeuge/scheren-zangen" className="hover:text-[#6B7F59] transition-colors block py-1">Scheren & Zangen</a></li>
                <li><a href="/werkzeuge/saegen-beile" className="hover:text-[#6B7F59] transition-colors block py-1">Sägen & Beile</a></li>
                <li><a href="/werkzeuge/bodenbearbeitung" className="hover:text-[#6B7F59] transition-colors block py-1">Bodenbearbeitung</a></li>
                <li><a href="/werkzeuge/besen-rechen" className="hover:text-[#6B7F59] transition-colors block py-1">Besen & Rechen</a></li>
              </ul>
            </div>
            
            <div className="space-y-6">
               <h3 className="font-oswald font-bold text-xl uppercase border-b-2 border-black pb-2">Filter</h3>
               <div className="flex flex-wrap gap-2">
                  {['Handgeschmiedet', 'Carbonstahl', 'Traditionell', 'Rostfrei'].map(tag => (
                    <span key={tag} className="border border-black px-3 py-1 text-xs font-bold uppercase hover:bg-black hover:text-white cursor-pointer transition-colors">
                      {tag}
                    </span>
                  ))}
               </div>
            </div>
          </div>

          {/* Grid */}
          <div className="md:col-span-3">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black">
               {products.map((product) => (
                 <div key={product.id} className="-ml-[1px] -mt-[1px] border-r border-b border-black">
                   <ProductCard {...product} />
                 </div>
               ))}
             </div>
          </div>

        </div>
      </section>
    </div>
  )
}
