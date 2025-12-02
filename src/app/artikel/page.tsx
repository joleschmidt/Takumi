"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Blog articles data - später aus Supabase
const blogArticles = [
  {
    slug: "bonsai-schnitt-grundlagen",
    title: "Bonsai Schnitt Grundlagen",
    excerpt: "Die Kunst des Bonsai-Schnitts erfordert Geduld, Präzision und das richtige Werkzeug. Lernen Sie die Grundlagen für perfekte Schnitte.",
    category: "Bonsai",
    image: "/images/garden-shears.jpg",
    readTime: "8 Min",
    date: "2024-01-15"
  },
  {
    slug: "japanische-zugsaege",
    title: "Japanische Zugsägen",
    excerpt: "Warum japanische Zugsägen anders sind und wie Sie sie richtig verwenden. Ein tiefer Einblick in die Tradition des japanischen Sägens.",
    category: "Werkzeuge",
    image: "/images/artisan-tools.jpg",
    readTime: "12 Min",
    date: "2024-01-10"
  },
  {
    slug: "stahlpflege-und-schleifen",
    title: "Stahlpflege & Schleifen",
    excerpt: "Wie Sie Ihre japanischen Gartenwerkzeuge richtig pflegen und schärfen. Von der Wahl des Schleifsteins bis zur perfekten Klinge.",
    category: "Pflege",
    image: "/images/craftsman-workshop.jpg",
    readTime: "15 Min",
    date: "2024-01-05"
  },
  {
    slug: "niwaki-formgebung",
    title: "Niwaki Formgebung",
    excerpt: "Die japanische Kunst, Bäume zu formen. Erfahren Sie, wie Sie mit den richtigen Techniken und Werkzeugen atemberaubende Formen schaffen.",
    category: "Niwaki",
    image: "/images/japanese-garden.jpg",
    readTime: "10 Min",
    date: "2024-01-01"
  },
  {
    slug: "horihori-messer",
    title: "Das Hori Hori Messer",
    excerpt: "Das vielseitigste Werkzeug im japanischen Garten. Lernen Sie alle Anwendungen dieses unverzichtbaren Begleiters kennen.",
    category: "Werkzeuge",
    image: "/images/garden-trowel.jpg",
    readTime: "6 Min",
    date: "2023-12-28"
  },
  {
    slug: "carbonstahl-vs-rostfrei",
    title: "Carbonstahl vs. Rostfrei",
    excerpt: "Der ultimative Vergleich zwischen Carbonstahl und rostfreiem Stahl. Welcher Stahl ist der richtige für Ihre Bedürfnisse?",
    category: "Wissen",
    image: "/images/blacksmith.jpg",
    readTime: "9 Min",
    date: "2023-12-25"
  }
];

export default function ArtikelPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">

      <section className="sticky top-0 z-0 pt-32 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full">
          <h1
            className="text-[10vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-12"
          >
            Artikel <span className="text-[#6B7F59]">&</span> Wissen
          </h1>
          <div className="h-[1px] w-full bg-black"></div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-4 md:px-8 lg:px-12 pb-32 min-h-[calc(100vh-5rem+10vh)] pt-24">
        <div className="max-w-[1800px] mx-auto">

          <div className="grid grid-cols-1 gap-0">
            {blogArticles.map((article, i) => (
              <Link key={article.slug} href={`/artikel/${article.slug}`}>
                <div className="group border-b border-black py-12 flex flex-col md:flex-row gap-8 md:items-center justify-between cursor-pointer transition-colors hover:bg-gray-100 relative overflow-hidden">

                  <div className="w-full md:w-1/3 z-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] mb-2 block">{article.category}</span>
                    <h2 className="text-4xl md:text-5xl font-oswald font-bold uppercase group-hover:translate-x-4 transition-transform duration-300 mb-4">
                      {article.title}
                    </h2>
                    <p className="text-lg text-gray-600 font-medium max-w-md mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{article.readTime} Lesezeit</span>
                      <span>•</span>
                      <span>{new Date(article.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 z-10">
                    <div className="relative w-full aspect-[4/3] bg-[#F2F0EA] overflow-hidden border-2 border-black">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-auto z-10 md:pr-8">
                    <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <ArrowRight className="w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

    </div>
  )
}
