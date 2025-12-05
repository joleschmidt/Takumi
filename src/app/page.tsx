"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
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
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }
};

// Component for the Changing Image Section (Project Spotlight)
const ProjectSpotlight = () => {
  const [activeImage, setActiveImage] = useState(0);
  const projects = [
    { title: "Die Wahl des Meisters", subtitle: "Okatsune 103", image: "/images/garden-shears.jpg", href: "/werkzeuge/scheren-zangen" },
    { title: "Im Feuer geschmiedet", subtitle: "Sanjo Handwerkskunst", image: "/images/blacksmith.jpg", href: "/handwerker" },
    { title: "Der Stille Schnitt", subtitle: "Silky Sägen", image: "/images/artisan-tools.jpg", href: "/werkzeuge/saegen-beile" },
    { title: "Erde & Stahl", subtitle: "Niwaki Basics", image: "/images/garden-trowel.jpg", href: "/ratgeber" },
  ];

  return (
    <section className="min-h-[calc(100vh-5rem+10vh)] px-4 md:px-8 lg:px-12 bg-[#1A1A1A] text-[#FAFAF8] flex items-center relative">
      <div className="max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Left: List */}
        <div className="space-y-8 md:space-y-12">
          <div className="space-y-2">
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500">Kuratierte Highlights</h2>
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-oswald font-bold uppercase tracking-tighter">Essenzielles</h3>
          </div>

          <div className="flex flex-col">
            {projects.map((project, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveImage(index)}
                className={`group py-5 md:py-6 lg:py-8 border-b border-white/20 cursor-pointer transition-all duration-300 min-h-[80px] md:min-h-[100px] flex items-center ${activeImage === index ? 'opacity-100 pl-4 md:pl-6 lg:pl-8 border-white' : 'opacity-50 hover:opacity-80'}`}
              >
                <Link href={project.href} className="flex justify-between items-center gap-4 w-full">
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] mb-2 block">{project.subtitle}</span>
                    <h4 className="text-xl md:text-2xl lg:text-3xl xl:text-5xl font-oswald font-bold uppercase break-words leading-tight">{project.title}</h4>
                  </div>
                  <ArrowRight className={`w-6 h-6 md:w-6 md:h-6 shrink-0 transform transition-transform duration-300 min-w-[24px] ${activeImage === index ? 'rotate-0' : '-rotate-45'}`} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Image Display - absolutely positioned to align with category cards */}
      <div className="hidden lg:block absolute right-0 top-0 aspect-[4/5] w-[50vw] overflow-hidden">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: activeImage === index ? 1 : 0,
              scale: activeImage === index ? 1 : 1.1
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const xTranslation = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F0EA] text-[#1a1a1a] overflow-hidden">

      {/* Hero Section - Light Background with Sticky Effect */}
      <div className="sticky top-0 z-0">
        <section className="min-h-[90vh] md:min-h-screen flex flex-col justify-center px-4 md:px-8 lg:px-12 pt-40 md:pt-32 bg-[#F2F0EA]">
          <div className="max-w-[1800px] mx-auto w-full z-10 pb-6 md:pb-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-[-0.5vw] md:space-y-[-1vw] mb-8 md:mb-12"
            >
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[18vw] sm:text-[19vw] md:text-[10vw] lg:text-[12vw] leading-[0.85] md:leading-[0.9] font-oswald font-bold uppercase tracking-tighter text-black max-w-full"
                >
                  Japanische
                </motion.h1>
              </div>
              {/* Mobile: Split into two lines */}
              <div className="overflow-hidden md:hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="text-[18vw] sm:text-[19vw] leading-[0.85] font-oswald font-bold uppercase tracking-tighter text-black max-w-full"
                >
                  Garten
                </motion.h1>
              </div>
              <div className="overflow-hidden md:hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  className="text-[18vw] sm:text-[19vw] leading-[0.85] font-oswald font-bold uppercase tracking-tighter text-black max-w-full"
                >
                  werkzeuge
                </motion.h1>
              </div>
              {/* Desktop: Single line */}
              <div className="overflow-hidden hidden md:block">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="text-[10vw] lg:text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter text-black max-w-full"
                >
                  Gartenwerkzeuge
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="text-[18vw] sm:text-[19vw] md:text-[10vw] lg:text-[12vw] leading-[0.85] md:leading-[0.9] font-oswald font-bold uppercase tracking-tighter text-[#6B7F59] max-w-full"
                >
                  mit Seele
                </motion.h1>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 md:gap-6 lg:gap-8 border-t border-black/10 pt-3 md:pt-6 lg:pt-8"
            >
              <p className="max-w-md text-sm md:text-base lg:text-lg xl:text-xl font-medium leading-relaxed md:leading-tight">
                Handgefertigt von Meistern in Japan. <br className="hidden md:block" />
                Kuratiert für jene, die die Natur mit Respekt formen.
              </p>
              <div className="flex gap-4 mt-1 md:mt-0">
                <Link href="/werkzeuge" className="group flex items-center gap-2 text-sm md:text-base lg:text-lg font-bold uppercase tracking-wider hover:opacity-60 transition-opacity min-h-[44px]">
                  Kollektion Entdecken
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Marquee Section - Dark Background - Z-Index 10 to cover Sticky Hero */}
      <div className="relative z-10">
        <section className="bg-[#1A1A1A] text-[#FAFAF8] overflow-hidden whitespace-nowrap py-6 md:py-8">
          <motion.div
            style={{ x: xTranslation }}
            className="flex items-center gap-6 md:gap-8 lg:gap-12 text-2xl md:text-4xl lg:text-6xl font-oswald font-bold uppercase tracking-widest w-fit"
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-6 md:gap-8 lg:gap-12 shrink-0">
                <span className="leading-none">Tradition (Dentō)</span>
                <span className="text-[#6B7F59] flex items-center justify-center leading-none" style={{ transform: 'translateY(-0.25em)' }}>●</span>
                <span className="leading-none">Präzision (Seimitsu)</span>
                <span className="text-[#6B7F59] flex items-center justify-center leading-none" style={{ transform: 'translateY(-0.25em)' }}>●</span>
                <span className="leading-none">Seele (Kokoro)</span>
                <span className="text-[#6B7F59] flex items-center justify-center leading-none" style={{ transform: 'translateY(-0.25em)' }}>●</span>
              </div>
            ))}
          </motion.div>
        </section>

        {/* Categories Grid - Light/Image Background */}
        <section className="bg-white min-h-[calc(100vh-5rem+10vh)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {categories.map((category, index) => (
              <Link key={index} href={category.href} className="group relative min-h-[50vh] md:min-h-screen flex flex-col justify-between overflow-hidden bg-stone-100">
                {/* Persistent Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
                </div>

                <div className="z-10 relative p-6 md:p-8 lg:p-16 h-full flex flex-col justify-between">
                  <div>
                    <span className="block text-xs font-bold mb-3 md:mb-4 text-white/80 tracking-widest">0{index + 1} / 04</span>
                    <h3 className="text-5xl md:text-6xl lg:text-8xl font-oswald font-bold uppercase leading-[0.9] md:leading-none text-white group-hover:translate-x-2 md:group-hover:translate-x-4 transition-transform duration-500">
                      {category.title}
                    </h3>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/30 pt-5 md:pt-6 lg:pt-8 gap-3 md:gap-4">
                    <p className="max-w-[180px] md:max-w-[250px] text-xs md:text-sm text-white/90 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                      {category.description}
                    </p>
                    <div className="w-14 h-14 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border border-white/50 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all duration-300 min-w-[56px] min-h-[56px]">
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:text-black transform -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Changing Image / Spotlight Section - Dark Background (Alternating) */}
      <div className="relative z-10 bg-[#1A1A1A]">
        <ProjectSpotlight />
      </div>

      {/* New Section: "We Are Takumi" / Niwaki Variants - Cream Background */}
      <section className="relative z-10 min-h-[calc(100vh-5rem+10vh)] px-4 md:px-8 lg:px-12 bg-[#F2F0EA] text-[#1A1A1A] border-t border-black/10 flex items-center py-12 md:py-16">
        <div className="max-w-[1800px] mx-auto w-full text-center">
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 md:mb-8">Die Kunst des Schnitts (Sentei)</p>
          <h2 className="text-5xl md:text-6xl lg:text-9xl font-oswald font-bold uppercase tracking-tighter leading-[0.9] md:leading-none mb-10 md:mb-12 lg:mb-16">
            Wir Sind <br /> Takumi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 border-t border-black">
            {[
              { name: "Chokkan", desc: "Formal Aufrecht", detail: "Der Stamm ist gerade und aufrecht, er verjüngt sich natürlich von unten nach oben." },
              { name: "Moyogi", desc: "Frei Aufrecht", detail: "Der Stamm wächst in einer geschwungenen Form, aber die Spitze befindet sich direkt über der Basis." },
              { name: "Shakan", desc: "Geneigt", detail: "Der Stamm neigt sich in einem Winkel, was Bäume darstellt, die im Wind oder Schatten wachsen." }
            ].map((style, i) => (
              <div key={i} className="border-b md:border-b-0 md:border-r border-black last:border-r-0 p-6 md:p-8 lg:p-12 hover:bg-[#E5E3DD] transition-colors duration-300 text-left group cursor-pointer min-h-[200px] md:min-h-0">
                <span className="block text-xs font-bold mb-3 md:mb-4 text-[#6B7F59]">Style 0{i + 1}</span>
                <h3 className="text-3xl md:text-4xl font-oswald font-bold uppercase mb-3 md:mb-4 group-hover:translate-x-2 transition-transform leading-tight">{style.name}</h3>
                <h4 className="text-base md:text-lg font-bold uppercase tracking-wider mb-2 md:mb-3">{style.desc}</h4>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xs">{style.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section - Dark Background */}
      <section className="relative z-10 px-4 md:px-8 lg:px-12 bg-[#1A1A1A] text-[#FAFAF8] min-h-[calc(100vh-5rem+10vh)] flex items-center py-12 md:py-16">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">

          <div className="space-y-10 md:space-y-12 lg:space-y-16 lg:sticky lg:top-32">
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-oswald font-bold uppercase tracking-tighter leading-[0.85] md:leading-[0.8]">
              Für die <br />
              Ewigkeit
            </h2>
            <div className="h-[1px] w-full bg-white/20"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider">Meisterschaft</h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">Geschmiedet von Handwerkern, die ihr Leben dem Handwerk gewidmet haben. Jedes Werkzeug ein Unikat.</p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider">Langlebigkeit</h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">Werkzeuge, die weitergegeben werden. Austauschbare Teile, schärfbare Klingen.</p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 rounded-none text-sm md:text-base lg:text-lg px-6 md:px-8 lg:px-12 py-5 md:py-6 lg:py-8 uppercase tracking-wider font-bold min-h-[44px]">
              <Link href="/ueber-uns">Unsere Geschichte</Link>
            </Button>
          </div>

          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[calc(100vh-5rem+10vh)] overflow-hidden hidden md:block">
            <Image
              src="/images/blacksmith.jpg"
              alt="Japanese Blacksmith"
              fill
              className="object-cover hover:scale-105 transition-transform duration-1000"
            />
            {/* <div className="absolute bottom-0 left-0 p-8 bg-black/50 backdrop-blur-md w-full">
              <p className="text-2xl font-oswald font-bold uppercase">The Soul of Steel</p>
            </div> */}
          </div>

        </div>
      </section>

      {/* Featured / Big Visual Section - Full Height Image */}
      <section className="relative z-10 min-h-[calc(100vh-5rem+10vh)] flex items-center justify-center overflow-hidden bg-black">
        <Image
          src="/images/japanese-garden.jpg"
          alt="Japanese Garden"
          fill
          className="object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-white px-4">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-8xl lg:text-[12rem] font-oswald font-bold uppercase tracking-tighter mb-6 md:mb-8 leading-none"
          >
            Niwaki
          </motion.h2>
          <p className="text-lg md:text-xl lg:text-3xl max-w-3xl mx-auto font-light tracking-wide mb-12 md:mb-16 leading-relaxed">
            Die Kunst, Bäume zu formen. Sie verlangt Geduld, Vision und den perfekten Schnitt.
          </p>
          <Link href="/ratgeber" className="inline-block border border-white px-8 md:px-12 lg:px-16 py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
            Zum Ratgeber
          </Link>
        </div>
      </section>

    </div>
  );
}

const categories = [
  {
    title: "Scheren",
    description: "Präzise Schnitte für gesunde Pflanzen. Von Bonsai bis Grobästung.",
    href: "/werkzeuge/scheren-zangen",
    image: "/images/garden-shears.jpg",
  },
  {
    title: "Sägen",
    description: "Japanische Zugsägen, die durch Holz gleiten wie Butter.",
    href: "/werkzeuge/saegen-beile",
    image: "/images/artisan-tools.jpg",
  },
  {
    title: "Boden",
    description: "Hori Hori Messer und geschmiedete Hacken für perfekte Erde.",
    href: "/werkzeuge/bodenbearbeitung",
    image: "/images/garden-trowel.jpg",
  },
  {
    title: "Pflege",
    description: "Kamelienöl, Schleifsteine und Pflegezubehör.",
    href: "/werkzeuge/zubehoer",
    image: "/images/craftsman-workshop.jpg",
  },
];
