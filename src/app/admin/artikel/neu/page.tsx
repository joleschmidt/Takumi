import { ArticleForm } from '@/components/admin/ArticleForm'

export default function NewArticlePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-2">
          Neuen Artikel erstellen
        </h1>
        <p className="text-muted-foreground">
          Erstellen Sie einen neuen Artikel für das Takumi Journal.
        </p>
      </div>

      <ArticleForm />
    </div>
  )
}

