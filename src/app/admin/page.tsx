import Link from 'next/link'
import { Package, FileText, ArrowRight, Layers } from 'lucide-react'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createServerClient()

  // Get counts
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: articleCount } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })

  // Load simple taxonomy overview from products
  const { data: taxonomyRows } = await supabase
    .from('products')
    .select('category, subcategory, subtype')
    .order('category', { ascending: true })
    .order('subcategory', { ascending: true })
    .order('subtype', { ascending: true })

  type TaxonomyEntry = {
    category: string | null
    subcategory: string | null
    subtype: string | null
  }

  const taxonomy = (taxonomyRows || []) as TaxonomyEntry[]

  const groups = taxonomy.reduce((acc: Record<string, Record<string, Set<string>>>, row) => {
    const cat = row.category || 'Unkategorisiert'
    const sub = row.subcategory || '—'
    const type = row.subtype || ''

    if (!acc[cat]) acc[cat] = {}
    if (!acc[cat][sub]) acc[cat][sub] = new Set<string>()
    if (type) acc[cat][sub].add(type)
    return acc
  }, {})

  const categories = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'de'))

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-4">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Verwalten Sie Produkte, Artikel und die Taxonomie Ihrer Kollektion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/produkte" className="group">
          <div className="border-2 border-black bg-white p-8 hover:bg-black hover:text-white transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <Package className="h-12 w-12 group-hover:scale-110 transition-transform" />
              <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
            <h2 className="text-2xl font-oswald font-bold uppercase mb-2">Produkte</h2>
            <p className="text-muted-foreground group-hover:text-gray-300 mb-4">
              {productCount || 0} Produkte in der Datenbank
            </p>
            <p className="text-sm font-medium">Produkte verwalten →</p>
          </div>
        </Link>

        <Link href="/admin/artikel" className="group">
          <div className="border-2 border-black bg-white p-8 hover:bg-black hover:text-white transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-12 w-12 group-hover:scale-110 transition-transform" />
              <ArrowRight className="h-6 w-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </div>
            <h2 className="text-2xl font-oswald font-bold uppercase mb-2">Artikel</h2>
            <p className="text-muted-foreground group-hover:text-gray-300 mb-4">
              {articleCount || 0} Artikel in der Datenbank
            </p>
            <p className="text-sm font-medium">Artikel verwalten →</p>
          </div>
        </Link>
      </div>

      {/* Taxonomy overview */}
      <section className="border-2 border-black bg-[#F2F0EA] p-6 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Taxonomie
            </p>
            <h2 className="font-oswald font-bold text-xl md:text-2xl uppercase mt-1 flex items-center gap-2">
              Kategorien & Unterkategorien
            </h2>
          </div>
          <Link
            href="/admin/taxonomie"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <span className="border border-black bg-white px-3 py-1 group-hover:bg-black group-hover:text-white transition-colors">
              Taxonomie bearbeiten
            </span>
            <Layers className="h-4 w-4 text-[#6B7F59] group-hover:text-white" />
          </Link>
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-gray-600">
            Noch keine Produkte vorhanden. Unterkategorien und Subtypen werden automatisch
            aus den Produktdaten abgeleitet (<code>subcategory</code>, <code>subtype</code> in Supabase).
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {categories.map(([cat, subMap]) => (
              <div key={cat} className="border border-black/20 bg-white p-4 space-y-3">
                <div className="font-oswald font-bold uppercase tracking-widest text-xs text-gray-500">
                  Hauptkategorie
                </div>
                <div className="font-oswald font-bold text-lg uppercase mb-1">
                  {cat.replace(/-/g, ' ')}
                </div>
                <div className="space-y-2">
                  {Object.entries(subMap).map(([sub, types]) => (
                    <div key={sub}>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#6B7F59]">
                        Unterkategorie
                      </div>
                      <div className="text-sm font-semibold">
                        {sub === '—' ? <span className="text-gray-500">– keine –</span> : sub}
                      </div>
                      {types.size > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {[...types].map((t) => (
                            <span
                              key={t}
                              className="border border-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-gray-500">
                  Nur Vorschau. Zum Bearbeiten öffnen Sie{' '}
                  <span className="font-mono">/admin/taxonomie</span>.
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

