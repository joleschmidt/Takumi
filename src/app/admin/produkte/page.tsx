import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = await createServerClient()
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden der Produkte: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-2">
            Produkte verwalten
          </h1>
          <p className="text-muted-foreground">
            {products?.length || 0} Produkte in der Datenbank
          </p>
        </div>
        <Link href="/admin/produkte/neu">
          <Button className="bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold">
            <Plus className="h-4 w-4 mr-2" />
            Neues Produkt
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div
            key={product.id}
            className="border-2 border-black bg-white group hover:bg-black hover:text-white transition-all duration-300"
          >
            {/* Klick auf Bild/Infos -> öffentliche Produktseite */}
            <Link href={`/werkzeuge/${product.category}/${product.slug}`} className="block">
              <div className="relative w-full h-[220px] md:h-[240px] lg:h-[260px] bg-[#F5F5F0] overflow-hidden border-b-2 border-black">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">🛠️</span>
                  </div>
                )}
                {product.is_new && (
                  <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold uppercase px-2 py-1 tracking-widest group-hover:bg-white group-hover:text-black">
                    Neu
                  </div>
                )}
              </div>

              <div className="p-6 pb-4">
                <div className="mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] group-hover:text-[#6B7F59]">
                    {product.category?.replace(/-/g, ' ')}
                  </span>
                </div>
                <h3 className="font-oswald font-bold text-xl uppercase mb-1">
                  {product.title}
                </h3>
                {product.original_name && (
                  <p className="text-xs text-gray-400 group-hover:text-gray-300 italic mb-2">
                    {product.original_name}
                  </p>
                )}
                <p className="text-sm font-bold">{product.price_range}</p>
              </div>
            </Link>

            <div className="px-6 pb-6">
              <div className="flex gap-2">
                <Link href={`/admin/produkte/${product.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-black group-hover:border-white group-hover:text-black group-hover:bg-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </Button>
                </Link>
                <form
                  action={`/admin/produkte/${product.id}/delete`}
                  method="POST"
                  className="flex-1"
                >
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full border-red-500 text-red-500 group-hover:border-red-500 group-hover:text-red-500 group-hover:bg-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-lg">
          <p className="text-muted-foreground mb-4">Noch keine Produkte vorhanden.</p>
          <Link href="/admin/produkte/neu">
            <Button className="bg-black text-white hover:bg-[#6B7F59]">
              Erstes Produkt erstellen
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

