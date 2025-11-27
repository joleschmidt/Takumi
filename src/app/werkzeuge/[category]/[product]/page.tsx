import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { products } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, ShoppingBag, ExternalLink, Info } from "lucide-react"

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
    <div className="container px-4 py-12 md:py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
         <Link href="/" className="hover:text-foreground">Home</Link>
         <span>/</span>
         <Link href="/werkzeuge" className="hover:text-foreground">Werkzeuge</Link>
         <span>/</span>
         <Link href={`/werkzeuge/${category}`} className="hover:text-foreground capitalize">{category.replace(/-/g, ' ')}</Link>
         <span>/</span>
         <span className="text-foreground truncate max-w-[200px]">{productData.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden relative group">
             {/* Main Image Placeholder */}
             <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-300">
                <span className="text-6xl">🖼️</span>
             </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
             {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-stone-50 rounded-md cursor-pointer hover:bg-stone-100 transition-colors" />
             ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-8">
          <div>
            {productData.isNew && (
              <Badge className="mb-4 bg-primary hover:bg-primary/90">Neuheit</Badge>
            )}
            <h1 className="text-3xl md:text-4xl font-oswald font-bold text-foreground mb-2">
              {productData.title}
            </h1>
            {productData.originalName && (
              <p className="text-lg text-muted-foreground font-medium italic">
                {productData.originalName}
              </p>
            )}
            <div className="mt-4 text-xl font-medium">
              {productData.priceRange}
            </div>
          </div>

          <Separator />

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed">
              {productData.description}
            </p>
          </div>

          {/* Affiliate / Buying Options */}
          <div className="bg-muted/30 p-6 rounded-lg space-y-4 border border-border/50">
            <h3 className="font-medium flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Verfügbar bei unseren Partnern
            </h3>
            <div className="grid gap-3">
              <Button className="w-full justify-between group" size="lg">
                <span>Bei Dictum kaufen</span>
                <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button variant="outline" className="w-full justify-between group" size="lg">
                <span>Bei Amazon ansehen</span>
                <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center pt-2">
              *Wir erhalten eine kleine Provision, wenn Sie über diese Links kaufen. Der Preis bleibt für Sie gleich.
            </p>
          </div>

          <div className="space-y-6">
             <div>
                <h3 className="font-oswald font-bold text-xl mb-3">Besonderheiten</h3>
                <ul className="grid gap-2">
                   {productData.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                         <Check className="h-5 w-5 text-primary shrink-0" />
                         <span>{feature}</span>
                      </li>
                   ))}
                </ul>
             </div>

             <Separator />

             <div className="grid gap-6 md:grid-cols-2">
                <div>
                   <h3 className="font-oswald font-bold text-lg mb-2">Einsatzbereich</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">{productData.usage}</p>
                </div>
                <div>
                   <h3 className="font-oswald font-bold text-lg mb-2">Pflege</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">{productData.care}</p>
                </div>
             </div>

             <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="font-oswald font-bold text-lg mb-2 text-primary flex items-center gap-2">
                   <Info className="h-4 w-4" />
                   Die Geschichte
                </h3>
                <p className="text-stone-700 dark:text-stone-300 italic leading-relaxed">
                   "{productData.history}"
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}


