'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface Article {
  id?: string
  title: string
  content: string
  excerpt?: string
  author?: string
  published_date?: string
  source_url?: string
  og_image_url?: string
  category?: string
}

interface ArticleFormProps {
  article?: Article
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    excerpt: article?.excerpt || '',
    author: article?.author || '',
    published_date: article?.published_date 
      ? new Date(article.published_date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    source_url: article?.source_url || '',
    og_image_url: article?.og_image_url || '',
    category: article?.category || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || null,
        author: formData.author || null,
        published_date: formData.published_date ? new Date(formData.published_date).toISOString() : null,
        source_url: formData.source_url || '',
        og_image_url: formData.og_image_url || null,
        category: formData.category || null,
      }

      const url = article?.id 
        ? `/api/articles/${article.id}`
        : '/api/articles'
      
      const method = article?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save article')
      }

      router.push('/admin/artikel')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      <form onSubmit={handleSubmit}>
        {/* Hero Section */}
        <section className="pt-16 pb-8 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] border-b border-black">
          <div className="max-w-[1800px] mx-auto w-full">
            <div className="flex items-center gap-4 mb-8">
              <Link href="/admin/artikel">
                <Button type="button" variant="outline" className="border-black">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 mb-8">
                <p className="font-bold">Fehler:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div>
                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-widest mb-2 block text-[#6B7F59]">
                  Kategorie
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Bonsai, Werkzeuge, Pflege..."
                  className="bg-white border-black uppercase tracking-widest"
                />
              </div>

              <div>
                <Label htmlFor="title" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Titel *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white border-black text-2xl font-oswald font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="published_date" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                    Veröffentlichungsdatum
                  </Label>
                  <Input
                    id="published_date"
                    type="date"
                    value={formData.published_date}
                    onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    className="bg-white border-black"
                  />
                </div>
                <div>
                  <Label htmlFor="author" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                    Autor
                  </Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="bg-white border-black"
                  />
                </div>
                <div>
                  <Label htmlFor="source_url" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                    Quell-URL *
                  </Label>
                  <Input
                    id="source_url"
                    type="url"
                    value={formData.source_url}
                    onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                    required
                    placeholder="https://..."
                    className="bg-white border-black font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="excerpt" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Kurzbeschreibung
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  placeholder="Kurze Zusammenfassung des Artikels..."
                  className="bg-white border-black leading-relaxed"
                />
              </div>

              <div>
                <Label htmlFor="og_image_url" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Titelbild URL
                </Label>
                <Input
                  id="og_image_url"
                  value={formData.og_image_url}
                  onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                  placeholder="/images/article.jpg"
                  className="bg-white border-black font-mono text-sm"
                />
                {formData.og_image_url && (
                  <div className="relative w-full aspect-[21/9] bg-[#F2F0EA] overflow-hidden border-2 border-black mt-4">
                    <img
                      src={formData.og_image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="h-[1px] w-full bg-black"></div>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 md:px-8 lg:px-12 py-16 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <div>
              <Label htmlFor="content" className="text-sm font-bold uppercase tracking-widest mb-4 block">
                Inhalt (HTML) *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={30}
                placeholder="<h2>Überschrift</h2>&#10;<p>Absatz...</p>"
                className="bg-white border-black font-mono text-sm leading-relaxed"
              />
              <p className="text-xs text-gray-500 mt-2">
                HTML-Formatierung wird unterstützt. Verwenden Sie &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt; etc.
              </p>
            </div>

            <div className="flex gap-4 pt-8">
              <Button
                type="submit"
                disabled={loading}
                className="bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold px-8 py-6 text-lg"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? 'Wird gespeichert...' : 'Speichern'}
              </Button>
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}

