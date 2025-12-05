import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import { VendorButton } from "@/components/VendorButton"
import { ImageGallery } from "./image-gallery"
import { ReadMore } from "@/components/ReadMore"
import { ProductCard } from "@/components/ProductCard"

import { supabase } from "@/lib/supabase"

// Check if title contains umlauts (Ä, Ö, Ü)
const hasUmlauts = (text: string) => {
  return /[ÄÖÜäöü]/.test(text)
}

// Cache product data fetch with 60s revalidation
const getProductData = cache(async (slug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, original_name, description, category, subcategory, subtype, slug, price_range, is_new, features, history, usage, care, image_url, images, vendors")
    .eq("slug", slug)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data
})

// Cache related products fetch with 60s revalidation
const getRelatedProducts = cache(async (category: string, excludeSlug: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, original_name, description, category, subcategory, subtype, slug, price_range, is_new, image_url")
    .eq("category", category)
    .neq("slug", excludeSlug)
    .limit(4)
  
  if (error) {
    return []
  }
  
  return data || []
})

export const revalidate = 3600 // 1 hour ISR

export default async function ProductPage({ 
  params,
}: { 
  params: Promise<{ category: string; product: string }> 
}) {
  const { category, product: slug } = await params
  
  // Fetch current product with optimized column selection
  const data = await getProductData(slug)

  if (!data) {
    return notFound()
  }

  // Transform data to match frontend interface
  const allImages =
    data.images && Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : data.image_url
        ? [data.image_url]
        : []

  const productData = {
    id: data.id,
    title: data.title,
    originalName: data.original_name,
    description: data.description,
    category: data.category,
    subcategory: data.subcategory as string | null,
    subtype: data.subtype as string | null,
    slug: data.slug,
    priceRange: data.price_range,
    isNew: data.is_new,
    features: data.features || [],
    history: data.history,
    usage: data.usage,
    care: data.care,
    imageUrl: data.image_url,
    images: allImages,
    vendors: data.vendors && Array.isArray(data.vendors) ? data.vendors : [],
  }

  // Fetch related products from same category (exclude current) with optimized columns
  const relatedRaw = await getRelatedProducts(productData.category, productData.slug)

  const relatedProducts =
    relatedRaw.map((p) => ({
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
    })) ?? []

  // Category slug + human label
  const categorySlug = productData.category || category
  const categoryLabelMap: Record<string, string> = {
    "scheren-zangen": "Scheren & Zangen",
    "saegen-beile": "Sägen & Beile",
    "bodenbearbeitung": "Bodenbearbeitung",
    "besen-rechen": "Besen & Rechen",
  }
  const categoryLabel =
    categoryLabelMap[categorySlug] ?? categorySlug.replace(/-/g, " ")

  const subcategoryLabel = productData.subcategory || ""
  const subtypeLabel = productData.subtype || ""
  const hasUmlautsInTitle = hasUmlauts(productData.title)

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left: Sticky Image Gallery - 50% width */}
        <div className="relative bg-[#F2F0EA] lg:h-screen lg:sticky lg:top-20 flex items-center justify-center p-4 md:p-8 lg:p-12 xl:p-16">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full flex items-center justify-center mb-6 md:mb-10">
              <ImageGallery images={productData.images} title={productData.title} />

              {/* Product Badge */}
              {productData.isNew && (
                <div className="absolute top-2 left-2 md:top-4 md:left-4 lg:top-8 lg:left-8 bg-black text-white px-3 py-1.5 md:px-4 md:py-2 font-bold uppercase tracking-widest text-xs md:text-sm z-20">
                  Neuheit
      </div>
              )}
             </div>
          </div>

          {/* Mobile Breadcrumb overlay */}
          <div className="absolute top-20 left-2 md:top-24 md:left-4 lg:hidden z-20">
            <Link
              href={`/werkzeuge/${categorySlug}`}
              className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
              ← Zurück
            </Link>
          </div>
        </div>

        {/* Right: Content - 50% width */}
        <div className="p-4 md:p-8 lg:p-12 xl:p-16 lg:pt-32 flex flex-col justify-start min-h-screen bg-white overflow-y-auto">
          <div className={`hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 ${hasUmlautsInTitle ? 'mb-12' : 'mb-8'}`}>
            <Link href="/werkzeuge" className="hover:text-black transition-colors">
              Kollektion
            </Link>
            <span>/</span>
            <Link
              href={`/werkzeuge/${categorySlug}`}
              className="hover:text-black transition-colors"
            >
              {categoryLabel}
            </Link>
            {subcategoryLabel && (
              <>
                <span>/</span>
                <span>{subcategoryLabel}</span>
              </>
            )}
            {subtypeLabel && (
              <>
                <span>/</span>
                <span>{subtypeLabel}</span>
              </>
            )}
          </div>

          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-oswald font-bold uppercase leading-[0.9] mb-3 md:mb-4">
              {productData.title}
            </h1>
            {productData.originalName && (
              <p className="text-base md:text-lg lg:text-xl text-gray-500 font-medium italic mb-3 md:mb-4">
                {productData.originalName}
              </p>
            )}
            {(() => {
              const parsePrice = (value?: string | null) => {
                if (!value) return null
                const cleaned = value.replace(/[^\d,.-]/g, "").replace(",", ".")
                const num = parseFloat(cleaned)
                return Number.isFinite(num) ? num : null
              }

              const vendorPrices = (productData.vendors || [])
                .map((v: any) => parsePrice(v.price))
                .filter((n: number | null): n is number => n !== null)

              if (vendorPrices.length === 0) {
                return productData.priceRange ? (
                  <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold font-oswald">
              {productData.priceRange}
                  </p>
                ) : null
              }

              const min = Math.min(...vendorPrices)
              const max = Math.max(...vendorPrices)
              const format = (n: number) =>
                n.toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })

              const label =
                min === max
                  ? `Ab ${format(min)}€`
                  : `${format(min)}€ – ${format(max)}€`

              return (
                <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#6B7F59]">
                  {label}
            </p>
              )
            })()}
          </div>

          {productData.description &&
            typeof productData.description === "string" &&
            productData.description.trim() && (
              <div className="mb-8 md:mb-10">
                <ReadMore
                  text={productData.description}
                  maxLines={4}
                  className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed"
                />
            </div>
            )}

          {productData.vendors && productData.vendors.length > 0 && (
            <div className="space-y-3 md:space-y-4 mb-12 md:mb-16">
              {productData.vendors.map(
                (
                  vendor: {
                    name: string
                    url: string
                    price?: string
                    shipping_cost?: string
                  },
                  index: number,
                ) => (
                  <VendorButton
                    key={index}
                    name={vendor.name}
                    url={vendor.url}
                    price={vendor.price}
                    shipping_cost={vendor.shipping_cost}
                  />
                ),
              )}
              <p className="text-xs text-gray-400 text-center uppercase tracking-wider">
                * Wir erhalten eine Provision von Partnerlinks.
            </p>
          </div>
          )}

          <div className="grid gap-8 md:gap-12">
            {productData.features && productData.features.length > 0 && (
             <div>
                <h3 className="font-oswald font-bold text-xl md:text-2xl lg:text-3xl uppercase border-b-2 border-black pb-3 md:pb-4 mb-4 md:mb-6">
                  Eigenschaften
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {productData.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 md:gap-3">
                      <div className="w-1.5 h-1.5 bg-[#6B7F59] mt-2 shrink-0 rounded-full" />
                      <span className="font-medium text-gray-700 text-sm md:text-base">
                        {feature}
                      </span>
                      </li>
                   ))}
                </ul>
             </div>
            )}

            {(productData.usage || productData.care || productData.history) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {productData.usage &&
                  typeof productData.usage === "string" &&
                  productData.usage.trim() && (
                    <div className="bg-[#F2F0EA] p-4 md:p-6 lg:p-8 border-2 border-black/5">
                      <h4 className="font-bold uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4 text-[#6B7F59]">
                        Verwendung
                      </h4>
                      <ReadMore
                        text={productData.usage}
                        maxLines={4}
                        className="text-xs md:text-sm lg:text-base leading-relaxed text-gray-700"
                      />
                </div>
                  )}
                {productData.care &&
                  typeof productData.care === "string" &&
                  productData.care.trim() && (
                    <div className="bg-[#F2F0EA] p-4 md:p-6 lg:p-8 border-2 border-black/5">
                      <h4 className="font-bold uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4 text-[#6B7F59]">
                        Pflege
                      </h4>
                      <ReadMore
                        text={productData.care}
                        maxLines={4}
                        className="text-xs md:text-sm lg:text-base leading-relaxed text-gray-700"
                      />
                </div>
                  )}
                {productData.history &&
                  typeof productData.history === "string" &&
                  productData.history.trim() && (
                    <div className="bg-[#F2F0EA] p-4 md:p-6 lg:p-8 md:col-span-2 border-2 border-black/5">
                      <h4 className="font-bold uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4 text-[#6B7F59]">
                        Geschichte
                      </h4>
                      <ReadMore
                        text={productData.history}
                        maxLines={4}
                        className="text-xs md:text-sm lg:text-base leading-relaxed text-gray-700"
                      />
             </div>
                  )}
             </div>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="relative z-10 bg-white px-4 md:px-8 lg:px-12 py-12 md:py-16 border-t-2 border-black">
          <div className="max-w-[1800px] mx-auto">
            <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 mb-3 md:mb-4">
              Ähnliche Artikel
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-oswald font-bold uppercase tracking-tighter mb-6 md:mb-8">
              Mehr aus dieser Kategorie
            </h2>

            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex gap-4 md:gap-6 lg:gap-8 pb-4 min-w-max">
                {relatedProducts.map((rp, index) => (
                  <div
                    key={rp.id}
                    className="w-[240px] md:w-[320px] lg:w-[360px] flex-shrink-0"
                  >
                    <ProductCard
                      title={rp.title}
                      originalName={rp.originalName}
                      description={rp.description}
                      priceRange={rp.priceRange}
                      category={rp.category}
                      subcategory={rp.subcategory}
                      subtype={rp.subtype}
                      slug={rp.slug}
                      imageUrl={rp.imageUrl}
                      isNew={rp.isNew}
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

