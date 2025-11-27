import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface ProductCardProps {
  title: string
  originalName?: string
  description: string
  priceRange: string
  category: string
  slug: string
  imageUrl?: string
  isNew?: boolean
}

export function ProductCard({
  title,
  originalName,
  description,
  priceRange,
  category,
  slug,
  imageUrl,
  isNew,
}: ProductCardProps) {
  return (
    <Link href={`/werkzeuge/${category}/${slug}`} className="group h-full">
      <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card flex flex-col">
        <div className="relative aspect-[4/5] bg-stone-100 overflow-hidden">
          {isNew && (
            <Badge className="absolute top-3 left-3 z-10 bg-primary hover:bg-primary/90 text-white border-none">
              Neu
            </Badge>
          )}
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300 bg-stone-50">
              <span className="text-4xl">🛠️</span>
            </div>
          )}
        </div>
        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-oswald font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                {title}
              </h3>
              {originalName && (
                <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wide uppercase">
                  {originalName}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-2 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {description}
          </p>
        </CardContent>
        <CardFooter className="p-5 pt-0 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{priceRange}</span>
          <span className="text-primary font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center">
            Details <ArrowRight className="ml-1 h-3 w-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}

