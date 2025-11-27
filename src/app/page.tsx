"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const revealText = {
  hidden: { y: "100%" },
  visible: { 
    y: "0%",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] text-[#1a1a1a] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-4 md:px-8 lg:px-12 pt-20">
        <div className="max-w-[1800px] mx-auto w-full z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-[-1vw] mb-12"
          >
            <div className="overflow-hidden">
              <motion.h1 variants={revealText} className="text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter text-black">
                Japanese
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 variants={revealText} className="text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter text-black">
                Garden Tools
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 variants={revealText} className="text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter text-[#6B7F59]">
                With Soul
              </motion.h1>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-black/10 pt-8"
          >
            <p className="max-w-md text-lg md:text-xl font-medium leading-tight">
              Hand-forged by masters in Japan. <br/>
              Curated for those who shape nature with respect.
            </p>
            <div className="flex gap-4">
               <Link href="/werkzeuge" className="group flex items-center gap-2 text-lg font-bold uppercase tracking-wider hover:opacity-60 transition-opacity">
                  Explore Collection
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Background Image Parallax Effect could go here */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none z-0">
           {/* Abstract shape or subtle image */}
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-8 bg-black text-[#FAFAF8] overflow-hidden whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex items-center gap-12 text-4xl md:text-6xl font-oswald font-bold uppercase tracking-widest"
        >
          <span>Tradition</span>
          <span className="text-[#6B7F59]">●</span>
          <span>Craftsmanship</span>
          <span className="text-[#6B7F59]">●</span>
          <span>Precision</span>
          <span className="text-[#6B7F59]">●</span>
          <span>Soul</span>
          <span className="text-[#6B7F59]">●</span>
          <span>Tradition</span>
          <span className="text-[#6B7F59]">●</span>
          <span>Craftsmanship</span>
          <span className="text-[#6B7F59]">●</span>
          <span>Precision</span>
          <span className="text-[#6B7F59]">●</span>
          <span>Soul</span>
          <span className="text-[#6B7F59]">●</span>
        </motion.div>
      </section>

      {/* Categories Grid - "WHO WE HELP" style */}
      <section className="py-24 px-4 md:px-8 lg:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex justify-between items-baseline mb-16">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Our Collection</h2>
            <Link href="/werkzeuge" className="hidden md:block text-sm font-bold uppercase tracking-widest hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-black">
            {categories.map((category, index) => (
              <Link key={index} href={category.href} className="group border-b border-r border-black p-8 md:p-12 min-h-[400px] flex flex-col justify-between hover:bg-[#F5F5F0] transition-colors relative overflow-hidden">
                <div className="z-10 relative">
                  <span className="block text-xs font-bold mb-4">0{index + 1} / 04</span>
                  <h3 className="text-4xl md:text-5xl font-oswald font-bold uppercase leading-none mb-4 group-hover:translate-x-2 transition-transform duration-300">
                    {category.title}
                  </h3>
                </div>
                
                <div className="relative z-10 flex justify-between items-end">
                   <p className="max-w-[200px] text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                     {category.description}
                   </p>
                   <ArrowRight className="w-8 h-8 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>

                {/* Hover Image Reveal */}
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                   <Image 
                     src={category.image} 
                     alt={category.title}
                     fill
                     className="object-cover grayscale"
                   />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - "WHAT WE DO" style */}
      <section className="py-32 px-4 md:px-8 lg:px-12 bg-[#2C2C2C] text-[#FAFAF8]">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div className="space-y-12">
            <h2 className="text-7xl md:text-8xl font-oswald font-bold uppercase tracking-tighter leading-[0.8]">
              We Make <br/>
              It Last
            </h2>
            <div className="h-[1px] w-full bg-white/20"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-4">
                 <h3 className="text-xl font-bold uppercase tracking-wider">Mastery</h3>
                 <p className="text-gray-400">Forged by artisans who have dedicated their lives to the craft. Each tool is unique.</p>
               </div>
               <div className="space-y-4">
                 <h3 className="text-xl font-bold uppercase tracking-wider">Longevity</h3>
                 <p className="text-gray-400">Tools designed to be passed down. Replaceable parts, sharpenable blades.</p>
               </div>
            </div>
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 rounded-none text-lg px-8 py-6 uppercase tracking-wider font-bold">
               <Link href="/ueber-uns">Our Story</Link>
            </Button>
          </div>

          <div className="relative aspect-[4/5] lg:aspect-auto h-full min-h-[600px] w-full overflow-hidden">
             <Image 
               src="/images/blacksmith.jpg" 
               alt="Japanese Blacksmith" 
               fill
               className="object-cover hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute bottom-0 left-0 p-8 bg-black/50 backdrop-blur-md w-full">
                <p className="text-2xl font-oswald font-bold uppercase">The Soul of Steel</p>
             </div>
          </div>

        </div>
      </section>

      {/* Featured / Big Visual Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/japanese-garden.jpg" 
          alt="Japanese Garden" 
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 text-center text-white px-4">
           <motion.h2 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="text-6xl md:text-9xl font-oswald font-bold uppercase tracking-tighter mb-8"
           >
             Niwaki
           </motion.h2>
           <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light tracking-wide mb-12">
             The art of sculpting trees. It demands patience, vision, and the perfect cut.
           </p>
           <Link href="/ratgeber" className="inline-block border border-white px-12 py-4 text-lg font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
             Read The Guide
           </Link>
        </div>
      </section>

    </div>
  );
}

const categories = [
  {
    title: "Shears",
    description: "Precision cuts for healthy plants. Bonsai to heavy duty.",
    href: "/werkzeuge/scheren-zangen",
    image: "/images/garden-shears.jpg",
  },
  {
    title: "Saws",
    description: "Japanese pull saws that glide through wood like butter.",
    href: "/werkzeuge/saegen-beile",
    image: "/images/artisan-tools.jpg",
  },
  {
    title: "Soil",
    description: "Hori Hori knives and forged hoes for perfect earth.",
    href: "/werkzeuge/bodenbearbeitung",
    image: "/images/garden-trowel.jpg",
  },
  {
    title: "Care",
    description: "Camellia oil, whetstones and maintenance gear.",
    href: "/werkzeuge/zubehoer",
    image: "/images/craftsman-workshop.jpg",
  },
];
