import Link from 'next/link'
import { createServerClient } from '@/lib/supabase-server'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesPage() {
  const supabase = await createServerClient()
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Fehler beim Laden der Artikel: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-2">
            Artikel verwalten
          </h1>
          <p className="text-muted-foreground">
            {articles?.length || 0} Artikel in der Datenbank
          </p>
        </div>
        <Link href="/admin/artikel/neu">
          <Button className="bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold">
            <Plus className="h-4 w-4 mr-2" />
            Neuer Artikel
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-0 border-t border-l border-black">
        {articles?.map((article) => (
          <div key={article.id} className="group border-b border-r border-black hover:bg-gray-100 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 items-center">
              <div className="md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] mb-2 block">
                  {article.category || 'Unkategorisiert'}
                </span>
                <h2 className="text-4xl md:text-5xl font-oswald font-bold uppercase mb-4 group-hover:translate-x-4 transition-transform duration-300">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-lg text-gray-600 font-medium max-w-md mb-4">
                    {article.excerpt}
                  </p>
                )}
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  {article.published_date && (
                    <>
                      <span>{new Date(article.published_date).toLocaleDateString('de-DE')}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>{article.author || 'Unbekannt'}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/artikel/${article.id}`}>
                    <Button 
                      variant="outline" 
                      className="border-black hover:bg-black hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Bearbeiten
                    </Button>
                  </Link>
                  <form action={`/admin/artikel/${article.id}/delete`} method="POST">
                    <Button 
                      type="submit"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </div>

              <div className="relative w-full aspect-[4/3] bg-[#F2F0EA] overflow-hidden border-2 border-black">
                {article.og_image_url ? (
                  <Image
                    src={article.og_image_url}
                    alt={article.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl">📝</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!articles || articles.length === 0) && (
        <div className="text-center py-12 border-2 border-dashed border-black/20 rounded-lg">
          <p className="text-muted-foreground mb-4">Noch keine Artikel vorhanden.</p>
          <Link href="/admin/artikel/neu">
            <Button className="bg-black text-white hover:bg-[#6B7F59]">
              Ersten Artikel erstellen
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

