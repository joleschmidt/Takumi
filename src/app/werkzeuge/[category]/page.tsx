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

  if (categoryProducts.length === 0) {
    // In a real app, you might want to check if the category is valid even if empty
    // For now, if no products, we treat it as potential empty category or invalid
    // But let's just show empty state instead of 404 to be softer
  }

  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mb-12 space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
           <a href="/" className="hover:text-foreground">Home</a>
           <span>/</span>
           <a href="/werkzeuge" className="hover:text-foreground">Werkzeuge</a>
           <span>/</span>
           <span className="text-foreground capitalize">{title}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold">{title}</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Entdecken Sie unsere Auswahl in der Kategorie {title}.
        </p>
      </div>

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">Momentan keine Produkte in dieser Kategorie.</p>
        </div>
      )}
    </div>
  )
}


