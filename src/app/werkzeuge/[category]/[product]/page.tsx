import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { VendorButton } from "@/components/VendorButton"
import { ImageGallery } from "./image-gallery"
import { ReadMore } from "@/components/ReadMore"

import { supabase } from '@/lib/supabase'

export default async function ProductPage({
  params
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product: slug } = await params

  // Fetch product from database
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    return notFound()
  }

  // Transform data to match frontend interface
  const allImages = data.images && Array.isArray(data.images) && data.images.length > 0
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
    slug: data.slug,
    priceRange: data.price_range,
    isNew: data.is_new,
    features: data.features || [],
    history: data.history,
    usage: data.usage,
    care: data.care,
    imageUrl: data.image_url,
    images: allImages,
    vendors: (data.vendors && Array.isArray(data.vendors)) ? data.vendors : [],
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left: Sticky Image Gallery - 50% width */}
        <div className="relative bg-[#F2F0EA] lg:h-screen lg:sticky lg:top-20 flex items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full flex items-center justify-center mb-10">
              <ImageGallery images={productData.images} title={productData.title} />

              {/* Product Badge */}
              {productData.isNew && (
                <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-black text-white px-4 py-2 font-bold uppercase tracking-widest text-sm z-20">
                  Neuheit
                </div>
              )}
            </div>
          </div>

          {/* Mobile Breadcrumb overlay */}
          <div className="absolute top-24 left-4 md:left-8 lg:hidden z-20">
            <Link href={`/werkzeuge/${category}`} className="bg-white/90 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors">
              ← Zurück
            </Link>
          </div>
        </div>

        {/* Right: Content - 50% width */}
        <div className="p-8 md:p-12 lg:p-16 lg:pt-32 flex flex-col justify-start min-h-screen bg-white overflow-y-auto">

          <div className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-8">
            <Link href="/werkzeuge" className="hover:text-black transition-colors">Kollektion</Link>
            <span>/</span>
            <Link href={`/werkzeuge/${category}`} className="hover:text-black transition-colors">{category.replace(/-/g, ' ')}</Link>
          </div>

          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-oswald font-bold uppercase leading-[0.9] mb-4">
              {productData.title}
            </h1>
            {productData.originalName && (
              <p className="text-lg md:text-xl text-gray-500 font-medium italic mb-6">
                {productData.originalName}
              </p>
            )}
            <p className="text-2xl md:text-3xl font-bold font-oswald">
              {productData.priceRange}
            </p>
          </div>

          {productData.description && typeof productData.description === 'string' && productData.description.trim() && (
            <div className="mb-12">
              <ReadMore
                text={productData.description}
                maxLines={4}
                className="text-lg md:text-xl text-gray-700 leading-relaxed"
              />
            </div>
          )}

          {productData.vendors && productData.vendors.length > 0 && (
            <div className="space-y-4 mb-16">
              {productData.vendors.map((vendor: { name: string; url: string; price?: string; shipping_cost?: string }, index: number) => (
                <VendorButton
                  key={index}
                  name={vendor.name}
                  url={vendor.url}
                  price={vendor.price}
                  shipping_cost={vendor.shipping_cost}
                />
              ))}
              <p className="text-xs text-gray-400 text-center uppercase tracking-wider">
                * Wir erhalten eine Provision von Partnerlinks.
              </p>
            </div>
          )}

          <div className="grid gap-12">
            {productData.features && productData.features.length > 0 && (
              <div>
                <h3 className="font-oswald font-bold text-2xl md:text-3xl uppercase border-b-2 border-black pb-4 mb-6">Eigenschaften</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productData.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#6B7F59] mt-2 shrink-0 rounded-full" />
                      <span className="font-medium text-gray-700 text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(productData.usage || productData.care || productData.history) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {productData.usage && typeof productData.usage === 'string' && productData.usage.trim() && (
                  <div className="bg-[#F2F0EA] p-6 md:p-8 border-2 border-black/5">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Verwendung</h4>
                    <ReadMore
                      text={productData.usage}
                      maxLines={4}
                      className="text-sm md:text-base leading-relaxed text-gray-700"
                    />
                  </div>
                )}
                {productData.care && typeof productData.care === 'string' && productData.care.trim() && (
                  <div className="bg-[#F2F0EA] p-6 md:p-8 border-2 border-black/5">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Pflege</h4>
                    <ReadMore
                      text={productData.care}
                      maxLines={4}
                      className="text-sm md:text-base leading-relaxed text-gray-700"
                    />
                  </div>
                )}
                {productData.history && typeof productData.history === 'string' && productData.history.trim() && (
                  <div className="bg-[#F2F0EA] p-6 md:p-8 md:col-span-2 border-2 border-black/5">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Geschichte</h4>
                    <ReadMore
                      text={productData.history}
                      maxLines={4}
                      className="text-sm md:text-base leading-relaxed text-gray-700"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

// lets add something to staging
