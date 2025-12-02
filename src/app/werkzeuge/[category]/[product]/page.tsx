import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { VendorButton } from "@/components/VendorButton"
import { ImageGallery } from "./image-gallery"

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

        {/* Left: Sticky Image Gallery */}
        <div className="relative bg-[#F5F5F0] lg:h-[calc(100vh-5rem+10vh)] lg:sticky lg:top-20 flex items-center justify-center p-8 md:p-16">
          <div className="relative w-full">
            <ImageGallery images={productData.images} title={productData.title} />

            {/* Product Badge */}
            {productData.isNew && (
              <div className="absolute top-8 left-8 bg-black text-white px-4 py-2 font-bold uppercase tracking-widest text-sm z-20">
                Neuheit
              </div>
            )}
          </div>

          {/* Mobile Breadcrumb overlay */}
          <div className="absolute top-24 left-4 md:left-8 lg:hidden z-20">
            <Link href={`/werkzeuge/${category}`} className="bg-white/80 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-widest border border-black/10">
              ← Zurück
            </Link>
          </div>
        </div>

        {/* Right: Content */}
        <div className="p-8 md:p-16 lg:pt-32 flex flex-col justify-center min-h-[calc(100vh-5rem+10vh)]">

          <div className="hidden lg:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-12">
            <Link href="/werkzeuge" className="hover:text-black transition-colors">Kollektion</Link>
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

          {productData.description && productData.description.trim() && (
            <div className="prose prose-lg max-w-none mb-12 text-gray-600 leading-relaxed">
              <p className="whitespace-pre-line">{productData.description}</p>
            </div>
          )}

          {productData.vendors && productData.vendors.length > 0 && (
            <div className="space-y-4 mb-16">
              {productData.vendors.map((vendor: { name: string; url: string }, index: number) => (
                <VendorButton
                  key={index}
                  name={vendor.name}
                  url={vendor.url}
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
                <h3 className="font-oswald font-bold text-2xl uppercase border-b border-black pb-4 mb-6">Eigenschaften</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productData.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#6B7F59] mt-2 shrink-0 rounded-full" />
                      <span className="font-medium text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(productData.usage || productData.care || productData.history) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {productData.usage && productData.usage.trim() && (
                  <div className="bg-[#F5F5F0] p-8">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Verwendung</h4>
                    <p className="text-sm leading-relaxed">{productData.usage}</p>
                  </div>
                )}
                {productData.care && productData.care.trim() && (
                  <div className="bg-[#F5F5F0] p-8">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Pflege</h4>
                    <p className="text-sm leading-relaxed">{productData.care}</p>
                  </div>
                )}
                {productData.history && productData.history.trim() && (
                  <div className="bg-[#F5F5F0] p-8 md:col-span-2">
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-4 text-[#6B7F59]">Geschichte</h4>
                    <p className="text-sm leading-relaxed">{productData.history}</p>
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
