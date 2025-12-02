import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (slug) {
      query = query.eq('slug', slug).single()
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products', details: error.message },
        { status: 500 }
      )
    }

    // Transform data to match frontend interface
    const transformed = Array.isArray(data) 
      ? data.map(transformProduct)
      : transformProduct(data)

    return NextResponse.json(
      slug ? { product: transformed } : { products: transformed },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

function transformProduct(dbProduct: any) {
  return {
    id: dbProduct.id,
    title: dbProduct.title,
    originalName: dbProduct.original_name,
    description: dbProduct.description,
    category: dbProduct.category,
    slug: dbProduct.slug,
    priceRange: dbProduct.price_range,
    isNew: dbProduct.is_new,
    features: dbProduct.features || [],
    history: dbProduct.history,
    usage: dbProduct.usage,
    care: dbProduct.care,
    imageUrl: dbProduct.image_url,
  }
}

