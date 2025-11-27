import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Check, ArrowUpRight, Info } from "lucide-react"

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ category: string; product: string }> 
}) {
  const { category, product: slug } = await params
  
  const productData = products.find((p) => p.slug === slug)

  if (!productData) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        
        {/* Left: Sticky Image Gallery */}
        <div className="relative bg-[#F5F5F0] lg:h-screen lg:sticky lg:top-0 flex items-center justify-center p-8 md:p-16">
           <div className="relative w-full aspect-[4/5] max-w-xl shadow-2xl shadow-black/5">
              {/* Main Image */}
              <div className="absolute inset-0 bg-white flex items-center justify-center overflow-hidden">
                 <span className="text-8xl grayscale opacity-20">🖼️</span>
                 {/* In real app, Image component here */}
              </div>
              
              {/* Product Badge */}
              {productData.isNew && (
                <div className="absolute top-8 left-8 bg-black text-white px-4 py-2 font-bold uppercase tracking-widest text-sm z-10">
                  New Arrival
                </div>
              )}
           </div>

           {/* Mobile Breadcrumb overlay */}
           <div className="absolute top-24 left-4 md:left-8 lg:hidden z-20">
              <Link href={`/werkzeuge/${category}`} className="bg-white/80 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-widest border border-black/10">
                ← Back
              </Link>
           </div>
        </div>

        {/* Right: Content */}
        <div className="p-8 md:p-16 lg:pt-32 flex flex-col justify-center">
           
           <div className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-12">
             <Link href="/werkzeuge" className="hover:text-black transition-colors">Collection</Link>
             <span>/</span>
             <Link href={`/werkzeuge/${category}`} className="hover:text-black transition-colors">{category.replace(/-/g, ' ')}</Link>
           </div>

           <div className="mb-12">
             <h1 className="text-6xl md:text-8xl font-oswald font-bold uppercase leading-[0.9] mb-4">
               {productData.title}
             </h1>
             {productData.originalName && (
               <p className="text-xl text-gray-500 font-medium italic mb-6">
                 {productData.originalName}
               </p>
             )}
             <p className="text-3xl font-bold font-oswald">
               {productData.priceRange}
             </p>
           </div>

           <div className="prose prose-lg max-w-none mb-12 text-gray-600 leading-relaxed">
             <p>{productData.description}</p>
           </div>

           <div className="space-y-4 mb-16">
              <Button size="lg" className="w-full h-16 rounded-none bg-[#1a1a1a] text-white hover:bg-[#6B7F59] text-lg font-bold uppercase tracking-widest flex justify-between px-8">
                <span>Buy at Dictum</span>
                <ArrowUpRight />
              </Button>
              <Button variant="outline" size="lg" className="w-full h-16 rounded-none border-2 border-black/10 hover:bg-black hover:text-white text-lg font-bold uppercase tracking-widest flex justify-between px-8">
                <span>Check Amazon</span>
                <ArrowUpRight />
              </Button>
              <p className="text-xs text-gray-400 text-center uppercase tracking-wider">
                * We earn a commission from partner links.
              </p>
           </div>

           <div className="grid gap-12">
              <div>
                <h3 className="font-oswald font-bold text-2xl uppercase border-b border-black pb-4 mb-6">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {productData.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                         <div className="w-1.5 h-1.5 bg-[#6B7F59] mt-2 shrink-0 rounded-full" />
                         <span className="font-medium text-gray-700">{feature}</span>
                      </li>
                   ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-[#F5F5F0] p-8">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Usage</h4>
                    <p className="text-sm leading-relaxed">{productData.usage}</p>
                 </div>
                 <div className="bg-[#F5F5F0] p-8">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Care</h4>
                    <p className="text-sm leading-relaxed">{productData.care}</p>
                 </div>
              </div>
           </div>

        </div>
      </div>

    </div>
  )
}
