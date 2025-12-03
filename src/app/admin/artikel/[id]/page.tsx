import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { ArticleForm } from '@/components/admin/ArticleForm'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createServerClient()
  
  const { data: article, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !article) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-2">
          Artikel bearbeiten
        </h1>
        <p className="text-muted-foreground">
          Bearbeiten Sie: {article.title}
        </p>
      </div>

      <ArticleForm article={article} />
    </div>
  )
}

