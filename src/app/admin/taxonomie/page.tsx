import { createServerClient } from '@/lib/supabase-server'
import { TaxonomyManager } from '@/components/admin/TaxonomyManager'

export const dynamic = 'force-dynamic'

export default async function AdminTaxonomyPage() {
  const supabase = await createServerClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, category, subcategory, subtype, image_url')
    .order('category', { ascending: true })
    .order('subcategory', { ascending: true })
    .order('title', { ascending: true })

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter">
          Taxonomie
        </h1>
        <p className="text-red-600 text-sm">
          Fehler beim Laden der Produkte: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
          Struktur
        </p>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-3">
          Kategorien & Unterkategorien
        </h1>
        <p className="text-sm text-gray-700 max-w-2xl">
          Ziehen Sie Produkte per Drag & Drop zwischen den Spalten, um
          Unterkategorien zuzuweisen. Änderungen werden direkt gespeichert.
        </p>
      </div>

      <TaxonomyManager products={products || []} />
    </div>
  )
}


