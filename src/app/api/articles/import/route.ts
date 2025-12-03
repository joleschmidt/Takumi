import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ArticleImportData, validateArticleData, normalizeArticleData } from '@/lib/article'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const articleData: ArticleImportData = body

    // Validate the data
    const validation = validateArticleData(articleData)
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Normalize the data
    const normalizedData = normalizeArticleData(articleData)

    // Check if article with same source_url already exists
    const { data: existing } = await supabase
      .from('articles')
      .select('id')
      .eq('source_url', normalizedData.source_url)
      .single()

    if (existing) {
      // Update existing article
      const { data, error } = await supabase
        .from('articles')
        .update({
          title: normalizedData.title,
          content: normalizedData.content,
          excerpt: normalizedData.excerpt,
          author: normalizedData.author,
          published_date: normalizedData.published_date || null,
          og_image_url: normalizedData.og_image_url,
          category: normalizedData.category,
          price: normalizedData.price || null,
          price_currency: normalizedData.price_currency || 'EUR',
          metadata: normalizedData.metadata,
          images: normalizedData.images,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating article:', error)
        return NextResponse.json(
          { error: 'Failed to update article', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, article: data, action: 'updated' },
        { status: 200 }
      )
    } else {
      // Insert new article
      const { data, error } = await supabase
        .from('articles')
        .insert({
          title: normalizedData.title,
          content: normalizedData.content,
          excerpt: normalizedData.excerpt,
          author: normalizedData.author,
          published_date: normalizedData.published_date || null,
          source_url: normalizedData.source_url,
          og_image_url: normalizedData.og_image_url,
          category: normalizedData.category,
          price: normalizedData.price || null,
          price_currency: normalizedData.price_currency || 'EUR',
          metadata: normalizedData.metadata,
          images: normalizedData.images,
        })
        .select()
        .single()

      if (error) {
        console.error('Error inserting article:', error)
        return NextResponse.json(
          { error: 'Failed to create article', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, article: data, action: 'created' },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

