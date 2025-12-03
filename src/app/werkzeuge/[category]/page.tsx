import { ProductCard } from "@/components/ProductCard"
import { notFound } from "next/navigation"

// Helper to format category title
const formatCategoryTitle = (slug: string) => {
  const titles: Record<string, string> = {
    "scheren-zangen": "Scheren & Zangen",
    "saegen-beile": "Sägen & Beile",
    "bodenbearbeitung": "Bodenbearbeitung",
    "besen-rechen": "Besen & Rechen",
    "zubehoer": "Pflege & Zubehör"
  }
  return titles[slug] || slug.replace(/-/g, " ")
}

// Check if title contains umlauts (Ä, Ö, Ü)
const hasUmlauts = (text: string) => {
  return /[ÄÖÜäöü]/.test(text)
}

import { supabase } from '@/lib/supabase'

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  
  // Fetch products from database
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return notFound()
  }

  // Transform data to match frontend interface
  const categoryProducts = (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    originalName: p.original_name,
    description: p.description,
    category: p.category,
    slug: p.slug,
    priceRange: p.price_range,
    isNew: p.is_new,
    features: p.features || [],
    history: p.history,
    usage: p.usage,
    care: p.care,
    imageUrl: p.image_url,
  }))

  const title = formatCategoryTitle(category)
  const hasUmlautsInTitle = hasUmlauts(title)

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      {/* Hero with Breadcrumbs + Category Title */}
      <section className="sticky top-0 z-0 pt-32 pb-16 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 ${hasUmlautsInTitle ? 'mb-12' : 'mb-8'}`}>
            <a href="/" className="hover:text-black transition-colors">Startseite</a>
            <span>/</span>
            <a href="/werkzeuge" className="hover:text-black transition-colors">Kollektion</a>
            <span>/</span>
            <span className="text-black">{title}</span>
          </div>

          <h1 className="text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter mb-12">
            {title}
          </h1>
          <div className="h-[1px] w-full bg-black"></div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
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
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group -ml-px -mt-px border border-black/10 hover:border-black transition-colors duration-200 [&>a]:border-none [&>a]:hover:border-none"
                  >
                    <ProductCard {...product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border border-black bg-[#F5F5F0]">
                <h3 className="font-oswald text-2xl uppercase mb-2">Keine Werkzeuge gefunden</h3>
                <p className="text-gray-500">Diese Kollektion wird derzeit kuratiert.</p>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}
