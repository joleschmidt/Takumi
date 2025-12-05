import { ProductCard } from "@/components/ProductCard"
import { notFound } from "next/navigation"
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

export const dynamic = 'force-dynamic'

type SubCategoryPageProps = {
  params: Promise<{ category: string; sub: string }>
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { category, sub } = await params
  const decodedSub = decodeURIComponent(sub)

  // Fetch products for this category + subcategory
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("subcategory", decodedSub)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching products:", error)
    return notFound()
  }

  const products = (data || []).map((p: any) => ({
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
    imageUrl: p.image_url,
  }))

  const categoryTitle = formatCategoryTitle(category)
  const subTitle = decodedSub
  const hasUmlautsInTitle = hasUmlauts(subTitle)

  // Fetch description for this subcategory
  const { data: descData, error: descError } = await supabase
    .from('category_descriptions')
    .select('description')
    .eq('category', category)
    .eq('subcategory', decodedSub)
    .maybeSingle()

  const customDescription = descData?.description || null

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      {/* Hero with Breadcrumbs + Subcategory Title */}
      <section className="sticky top-0 z-10 pt-32 pb-16 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full">
          <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 ${hasUmlautsInTitle ? 'mb-12' : 'mb-8'}`}>
            <a href="/" className="hover:text-black transition-colors">
              Startseite
            </a>
            <span>/</span>
            <a href="/werkzeuge" className="hover:text-black transition-colors">
              Kollektion
            </a>
            <span>/</span>
            <a
              href={`/werkzeuge/${category}`}
              className="hover:text-black transition-colors"
            >
              {categoryTitle}
            </a>
            <span>/</span>
            <span className="text-black">{subTitle}</span>
          </div>

          <h1 className="text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter mb-12">
            {subTitle}
          </h1>
          <div className="h-[1px] w-full bg-black mb-8" />
          {/* Description */}
          {customDescription && (
            <div className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl">
              <p>{customDescription}</p>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 bg-white px-4 md:px-8 lg:px-12 pb-24 min-h-[calc(100vh-5rem+10vh)] pt-12">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sidebar: simple back + sibling info if needed */}
          <div className="hidden md:block space-y-6 sticky top-32 h-fit text-xs font-bold uppercase tracking-widest">
            <a
              href={`/werkzeuge/${category}`}
              className="block border border-black px-3 py-2 hover:bg-black hover:text-white transition-colors"
            >
              ← Zurück zu {categoryTitle}
            </a>
          </div>

          {/* Grid */}
          <div className="md:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {products.map((product) => (
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
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border border-black bg-[#F5F5F0]">
                <h3 className="font-oswald text-2xl uppercase mb-2">
                  Keine Werkzeuge gefunden
                </h3>
                <p className="text-gray-500">
                  Diese Unterkategorie wird derzeit kuratiert.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}


