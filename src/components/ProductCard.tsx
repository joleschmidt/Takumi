import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface ProductCardProps {
  title: string
  originalName?: string
  description: string
  priceRange: string
  category: string
  subcategory?: string | null
  subtype?: string | null
  slug: string
  imageUrl?: string
  isNew?: boolean
  priority?: boolean
}

export function ProductCard({
  title,
  originalName,
  description,
  priceRange,
  category,
  subcategory,
  subtype,
  slug,
  imageUrl,
  isNew,
  priority = false,
}: ProductCardProps) {
  return (
    <Link
      href={`/werkzeuge/${category}/${slug}`}
      className="group block h-full border border-black/10 bg-white hover:border-black transition-colors duration-300"
    >
      <div className="relative aspect-[4/5] bg-[#F5F5F0] overflow-hidden border-b border-black/10">
        {isNew && (
          <div className="absolute top-0 left-0 z-10 bg-black text-white text-xs font-bold uppercase px-3 py-1 tracking-widest">
            New
          </div>
        )}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover scale-105 group-hover:scale-115 transition-transform duration-700 grayscale group-hover:grayscale-0"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-300">
            <span className="text-4xl grayscale">🛠️</span>
          </div>
        )}

        {/* Hover overlay with "View" button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
          <div className="bg-white text-black px-6 py-2 uppercase font-bold text-sm tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            View
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 flex flex-col h-[180px] md:h-[200px] justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59]">{category.replace(/-/g, ' ')}</span>
            <span className="font-bold text-xs md:text-sm">{priceRange}</span>
          </div>
          <h3 className="font-oswald font-bold text-xl md:text-2xl uppercase leading-none mb-1 group-hover:underline decoration-2 underline-offset-4">
            {title}
          </h3>
          {originalName && (
            <p className="text-xs text-gray-400 font-medium tracking-wide uppercase mb-3 md:mb-4">
              {originalName}
            </p>
          )}
          <p className="text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mt-3 md:mt-4">
          Details <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
        </div>
      </div>
    </Link>
  )
}
