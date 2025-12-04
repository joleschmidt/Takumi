import { createServerClient } from '@/lib/supabase-server'
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} Min`
}

export default async function ArtikelPage() {
  const supabase = await createServerClient()
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_date', { ascending: false })
    .not('published_date', 'is', null)

  if (error) {
    console.error('Error fetching articles:', error)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">

      <section className="sticky top-0 z-0 pt-32 px-4 md:px-8 lg:px-12 bg-[#FAFAF8] min-h-[50vh] flex flex-col justify-center">
        <div className="max-w-[1800px] mx-auto w-full">
          <h1
            className="text-[10vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-12"
          >
            Artikel <span className="text-[#6B7F59]">&</span> Wissen
          </h1>
          <div className="h-[1px] w-full bg-black"></div>
        </div>
      </section>

      <section className="relative z-10 bg-white px-4 md:px-8 lg:px-12 pb-32 min-h-[calc(100vh-5rem+10vh)] pt-24">
        <div className="max-w-[1800px] mx-auto">

          <div className="grid grid-cols-1 gap-0">
            {articles && articles.length > 0 ? (
              articles.map((article) => {
                // Generate slug from title or use source_url
                const slug = article.source_url 
                  ? article.source_url.split('/').pop()?.replace(/\.html?$/, '') || article.id
                  : article.id
                
                const readTime = article.content ? calculateReadTime(article.content) : '5 Min'
                const publishedDate = article.published_date 
                  ? new Date(article.published_date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })
                  : new Date(article.created_at || '').toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })

                return (
                  <Link key={article.id} href={`/artikel/${slug}`}>
                <div className="group border-b border-black py-12 flex flex-col md:flex-row gap-8 md:items-center justify-between cursor-pointer transition-colors hover:bg-gray-100 relative overflow-hidden">

                  <div className="w-full md:w-1/3 z-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] mb-2 block">
                          {article.category || 'Artikel'}
                        </span>
                    <h2 className="text-4xl md:text-5xl font-oswald font-bold uppercase group-hover:translate-x-4 transition-transform duration-300 mb-4">
                      {article.title}
                    </h2>
                        {article.excerpt && (
                    <p className="text-lg text-gray-600 font-medium max-w-md mb-4">
                      {article.excerpt}
                    </p>
                        )}
                    <div className="flex gap-4 text-sm text-gray-500">
                          <span>{readTime} Lesezeit</span>
                      <span>•</span>
                          <span>{publishedDate}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/3 z-10">
                    <div className="relative w-full aspect-[4/3] bg-[#F2F0EA] overflow-hidden border-2 border-black">
                          {article.og_image_url ? (
                      <Image
                              src={article.og_image_url}
                        alt={article.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              <span className="text-4xl">📝</span>
                            </div>
                          )}
                    </div>
                  </div>

                  <div className="w-full md:w-auto z-10 md:pr-8">
                    <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                      <ArrowRight className="w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>

                </div>
              </Link>
                )
              })
            ) : (
              <div className="text-center py-24">
                <p className="text-gray-500 text-lg">Noch keine Artikel verfügbar.</p>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
