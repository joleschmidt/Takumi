"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const guides = [
  {
    title: "Maintenance Basics",
    desc: "How to prevent rust and keep your blades singing.",
    category: "Care",
    image: "/images/garden-trowel.jpg"
  },
  {
    title: "Steel 101",
    desc: "Understanding the difference between Carbon Steel (Aogami) and Stainless.",
    category: "Knowledge",
    image: "/images/artisan-tools.jpg"
  },
  {
    title: "Sharpening Guide",
    desc: "Master the whetstone. A step-by-step visual guide.",
    category: "Technique",
    image: "/images/craftsman-workshop.jpg"
  },
  {
    title: "Choosing Your Shears",
    desc: "Okatsune vs. Tobisho. Which one fits your hand?",
    category: "Selection",
    image: "/images/garden-shears.jpg"
  }
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      <section className="pt-32 px-4 md:px-8 lg:px-12 mb-16">
        <div className="max-w-[1800px] mx-auto">
          <motion.h1 
             initial={{ opacity: 0, y: "100%" }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="text-[10vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-12"
          >
            Guide <span className="text-[#6B7F59]">&</span> Care
          </motion.h1>
          <div className="h-[1px] w-full bg-black"></div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-32">
        <div className="max-w-[1800px] mx-auto">
          
          <div className="grid grid-cols-1 gap-0">
            {guides.map((guide, i) => (
              <div key={i} className="group border-b border-black py-12 flex flex-col md:flex-row gap-8 md:items-center justify-between cursor-pointer transition-colors hover:bg-gray-100 relative overflow-hidden">
                
                <div className="w-full md:w-1/3 z-10">
                   <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] mb-2 block">{guide.category}</span>
                   <h2 className="text-4xl md:text-5xl font-oswald font-bold uppercase group-hover:translate-x-4 transition-transform duration-300">
                     {guide.title}
                   </h2>
                </div>

                <div className="w-full md:w-1/3 z-10">
                  <p className="text-lg text-gray-600 font-medium max-w-md">
                    {guide.desc}
                  </p>
                </div>

                <div className="w-full md:w-auto z-10 md:pr-8">
                   <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <ArrowRight className="w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                   </div>
                </div>

                {/* Hover Image Reveal - Absolute centered or following cursor could be cool, but fixed placement is safer for mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none hidden lg:block">
                   <Image 
                     src={guide.image} 
                     alt={guide.title}
                     fill
                     className="object-cover grayscale"
                   />
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}
