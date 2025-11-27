import { ProductCard } from "@/components/ProductCard"
import { products } from "@/lib/data"
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

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  
  const categoryProducts = products.filter((p) => p.category === category)
  const title = formatCategoryTitle(category)

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      <section className="pt-32 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1800px] mx-auto">
          
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
             <a href="/" className="hover:text-black">Startseite</a>
             <span>/</span>
             <a href="/werkzeuge" className="hover:text-black">Kollektion</a>
             <span>/</span>
             <span className="text-black">{title}</span>
          </div>

          <h1 className="text-[10vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-12">
            {title}
          </h1>
          <div className="h-[1px] w-full bg-black"></div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 pb-24">
        <div className="max-w-[1800px] mx-auto">
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-black/10">
              {categoryProducts.map((product) => (
                <div key={product.id} className="-ml-[1px] -mt-[1px]">
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center border border-black/10 bg-[#F5F5F0]">
              <h3 className="font-oswald text-2xl uppercase mb-2">Keine Werkzeuge gefunden</h3>
              <p className="text-gray-500">Diese Kollektion wird derzeit kuratiert.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
