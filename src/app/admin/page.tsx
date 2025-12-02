import Link from 'next/link'
import { Package, FileText, ArrowRight } from 'lucide-react'
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-4">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Verwalten Sie Produkte und Artikel für die Takumi-Website.
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
    </div>
  )
}

