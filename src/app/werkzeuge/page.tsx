import { ProductCard } from "@/components/ProductCard"
import { products } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export default function WerkzeugePage() {
  return (
    <div className="container px-4 py-12 md:py-16">
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-oswald font-bold">Unsere Werkzeug-Kollektion</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Eine kuratierte Auswahl der besten japanischen Gartenwerkzeuge. 
          Jedes Stück wurde aufgrund seiner Qualität, Geschichte und Handwerkskunst ausgewählt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filter Placeholder */}
        <div className="hidden md:block space-y-8">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Kategorien</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/werkzeuge/scheren-zangen" className="hover:text-primary transition-colors">Scheren & Zangen</a></li>
              <li><a href="/werkzeuge/saegen-beile" className="hover:text-primary transition-colors">Sägen & Beile</a></li>
              <li><a href="/werkzeuge/bodenbearbeitung" className="hover:text-primary transition-colors">Bodenbearbeitung</a></li>
              <li><a href="/werkzeuge/besen-rechen" className="hover:text-primary transition-colors">Besen & Rechen</a></li>
            </ul>
          </div>
          <div className="space-y-4">
             <h3 className="font-bold text-lg">Handwerk</h3>
             <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer">Handgeschmiedet</Badge>
                <Badge variant="secondary" className="cursor-pointer">Carbonstahl</Badge>
                <Badge variant="secondary" className="cursor-pointer">Traditionell</Badge>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


