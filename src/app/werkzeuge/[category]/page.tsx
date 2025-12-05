import { ProductCard } from "@/components/ProductCard"
import { notFound } from "next/navigation"
import { cache } from "react"
import { supabase } from "@/lib/supabase"

// Helper to format category title
const formatCategoryTitle = (slug: string) => {
  const titles: Record<string, string> = {
    "scheren-zangen": "Scheren & Zangen",
    "saegen-beile": "Sägen & Beile",
    "bodenbearbeitung": "Bodenbearbeitung",
    "besen-rechen": "Besen & Rechen",
    "zubehoer": "Pflege & Zubehör",
  }
  return titles[slug] || slug.replace(/-/g, " ")
}

// Check if title contains umlauts (Ä, Ö, Ü)
const hasUmlauts = (text: string) => {
  return /[ÄÖÜäöü]/.test(text)
}

// Cache category products fetch with 30min revalidation
const getCategoryProducts = cache(async (category: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, original_name, description, category, subcategory, subtype, slug, price_range, is_new, image_url")
    .eq("category", category)
    .order("created_at", { ascending: false })
  
  if (error) {
    return null
  }
  
  return data || []
})

// Cache category description fetch
const getCategoryDescription = cache(async (category: string) => {
  const { data, error } = await supabase
    .from('category_descriptions')
    .select('description')
    .eq('category', category)
    .is('subcategory', null)
    .maybeSingle()
  
  if (error) {
    return null
  }
  
  return data?.description || null
})

export const revalidate = 1800 // 30 minutes ISR

type CategoryPageProps = {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  // Fetch products and description in parallel with optimized column selection
  const [productsData, descData] = await Promise.all([
    getCategoryProducts(category),
    getCategoryDescription(category)
  ])

  if (productsData === null) {
    return notFound()
  }

  // Transform data to match frontend interface
  const categoryProducts = productsData.map((p: any) => ({
    id: p.id,
    title: p.title,
    originalName: p.original_name,
    description: p.description,
    category: p.category,
    subcategory: p.subcategory as string | null,
    subtype: p.subtype as string | null,
    slug: p.slug,
    priceRange: p.price_range,
    isNew: p.is_new,
    features: p.features || [],
    history: p.history,
    usage: p.usage,
    care: p.care,
    imageUrl: p.image_url,
  }))

  // Sidebar taxonomy tree (for this main category only)
  const subTree = new Map<string, Set<string>>()
  for (const p of categoryProducts) {
    const subKey = p.subcategory || "– keine –"
    const typeKey = p.subtype || ""
    if (!subTree.has(subKey)) subTree.set(subKey, new Set())
    if (typeKey) subTree.get(subKey)!.add(typeKey)
  }

  const allSubKeys = Array.from(subTree.keys()).sort((a, b) => a.localeCompare(b, "de"))
  const visibleSubKeys = allSubKeys.filter((k) => k !== "– keine –")

  const title = formatCategoryTitle(category)
  const hasUmlautsInTitle = hasUmlauts(title)

  const customDescription = descData

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      
      {/* Hero with Breadcrumbs + Category Title */}
      <section className="sticky top-0 z-10 pt-32 pb-12 md:pb-16 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 ${hasUmlautsInTitle ? 'mb-8 md:mb-12' : 'mb-6 md:mb-8'}`}>
            <a href="/" className="hover:text-black transition-colors">Startseite</a>
            <span>/</span>
            <a href="/werkzeuge" className="hover:text-black transition-colors">Kollektion</a>
            <span>/</span>
            <span className="text-black">{title}</span>
          </div>

          <h1 className="text-[8vw] md:text-[10vw] lg:text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter mb-8 md:mb-12 max-w-full">
            {title}
          </h1>
          <div className="h-[1px] w-full bg-black mb-6 md:mb-8"></div>
          {/* Description */}
          {customDescription && (
            <div className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-3xl">
              <p>{customDescription}</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="relative z-10 bg-white px-4 md:px-8 lg:px-12 pb-16 md:pb-24 min-h-[calc(100vh-5rem+10vh)] pt-8 md:pt-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Sidebar – only subcategories of this main category */}
          <div className="hidden md:block space-y-12 sticky top-32 h-fit">
            <div className="space-y-6">
              <h3 className="font-oswald font-bold text-xl uppercase border-b-2 border-black pb-2">
                {title}
              </h3>
              {/* Level 1: Main category + subcategories */}
              {visibleSubKeys.length > 0 && (
                <div className="space-y-2 text-xs font-bold uppercase tracking-widest">
                  <ul className="space-y-1">
                    {visibleSubKeys.map((subKey) => {
                      const href = `/werkzeuge/${category}/sub/${encodeURIComponent(subKey)}`
                      return (
                        <li key={subKey}>
                          <a
                            href={href}
                            className="block py-1 hover:text-[#6B7F59]"
                          >
                            {subKey}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

            </div>
          </div>

          {/* Grid – always all products of this main category */}
          <div className="md:col-span-3">
            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {categoryProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group -ml-px -mt-px border border-black/10 hover:border-black transition-colors duration-200 [&>a]:border-none [&>a]:hover:border-none"
                  >
                    <ProductCard
                      title={product.title}
                      originalName={product.originalName}
                      description={product.description}
                      priceRange={product.priceRange}
                      category={product.category}
                      subcategory={product.subcategory}
                      subtype={product.subtype}
                      slug={product.slug}
                      imageUrl={product.imageUrl}
                      isNew={product.isNew}
                      priority={index < 6}
                    />
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
