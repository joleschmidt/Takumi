import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { createServerClient } from '@/lib/supabase-server'

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} Min`
}

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerClient()

  // Try to find article by slug (from source_url) or by id
  let article = null

  // First try to find by source_url containing the slug
  const { data: articlesByUrl } = await supabase
    .from('articles')
    .select('*')
    .or(`source_url.ilike.%${slug}%,id.eq.${slug}`)
    .limit(1)

  if (articlesByUrl && articlesByUrl.length > 0) {
    article = articlesByUrl[0]
  } else {
    // Fallback: try by id
    const { data: articleById } = await supabase
      .from('articles')
      .select('*')
      .eq('id', slug)
      .single()

    if (articleById) {
      article = articleById
    }
  }

  if (!article) {
    notFound();
  }

  const readTime = article.content ? calculateReadTime(article.content) : '5 Min'
  const publishedDate = article.published_date
    ? new Date(article.published_date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date(article.created_at || '').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-8 lg:px-12 bg-[#FAFAF8]">
        <div className="max-w-[1800px] mx-auto w-full">

          <Link href="/artikel" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Zurück zu allen Artikeln
          </Link>

          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] mb-4 block">
              {article.category || 'Artikel'}
            </span>
            <h1 className="text-[10vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-8">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{readTime} Lesezeit</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{publishedDate}</span>
              </div>
              {article.author && (
                <>
                  <span>•</span>
                  <span>{article.author}</span>
                </>
              )}
            </div>
            <div className="h-[1px] w-full bg-black"></div>
          </div>

          {/* Featured Image */}
          {article.og_image_url && (
            <div className="relative w-full aspect-[21/9] bg-[#F2F0EA] overflow-hidden border-2 border-black mb-16">
              <Image
                src={article.og_image_url}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 md:px-8 lg:px-12 pb-32 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div
            className="prose prose-lg max-w-none prose-headings:font-oswald prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-black prose-h2:text-4xl prose-h2:mb-6 prose-h3:text-2xl prose-h3:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 prose-p:mb-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>

      {/* Related Articles / CTA */}
      <section className="px-4 md:px-8 lg:px-12 py-24 bg-[#F2F0EA]">
        <div className="max-w-[1800px] mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-oswald font-bold uppercase tracking-tighter mb-8">
            Mehr Wissen
          </h2>
          <Link href="/artikel" className="inline-flex items-center gap-2 text-lg font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
            Alle Artikel ansehen
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </section>

    </div>
  );
}
