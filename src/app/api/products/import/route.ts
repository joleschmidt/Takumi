import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Vendor {
  name: string
  url: string
}

interface ProductImportData {
  title: string
  description: string
  category: string
  slug: string
  price_range: string
  is_new?: boolean
  features?: string[]
  history?: string
  usage?: string
  care?: string
  image_url?: string
  images?: string[]
  original_name?: string
  vendors?: Vendor[]
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatPriceRange(price: number | undefined, currency: string): string {
  if (!price) return ''
  const formattedPrice = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
  return `${formattedPrice}€`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const productData: ProductImportData = body

    // Validate required fields
    if (!productData.title || productData.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors: ['Title is required'] },
        { status: 400 }
      )
    }

    if (!productData.category || productData.category.trim().length === 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors: ['Category is required'] },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = productData.slug || generateSlug(productData.title)

    // Check if product with same slug already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      // Prepare images array - limit to first 5 images
      const images = productData.images && Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images.slice(0, 5) // Limit to first 5 images
        : productData.image_url
          ? [productData.image_url]
          : []

      // Update existing product
      const { data, error } = await supabase
        .from('products')
        .update({
          title: productData.title.trim(),
          original_name: productData.original_name?.trim(),
          description: productData.description?.trim() || productData.title.trim(),
          category: productData.category.trim(),
          slug: slug,
          price_range: productData.price_range || '',
          is_new: productData.is_new || false,
          features: productData.features || [],
          history: productData.history?.trim(),
          usage: productData.usage?.trim(),
          care: productData.care?.trim(),
          image_url: productData.image_url,
          images: images,
          vendors: productData.vendors || [],
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating product:', error)
        return NextResponse.json(
          { error: 'Failed to update product', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, product: data, action: 'updated' },
        { status: 200 }
      )
    } else {
      // Prepare images array - limit to first 5 images
      const images = productData.images && Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images.slice(0, 5) // Limit to first 5 images
        : productData.image_url
          ? [productData.image_url]
          : []

      // Insert new product
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: productData.title.trim(),
          original_name: productData.original_name?.trim(),
          description: productData.description?.trim() || productData.title.trim(),
          category: productData.category.trim(),
          slug: slug,
          price_range: productData.price_range || '',
          is_new: productData.is_new || false,
          features: productData.features || [],
          history: productData.history?.trim(),
          usage: productData.usage?.trim(),
          care: productData.care?.trim(),
          image_url: productData.image_url,
          images: images,
          vendors: productData.vendors || [],
        })
        .select()
        .single()

      if (error) {
        console.error('Error inserting product:', error)
        return NextResponse.json(
          { error: 'Failed to create product', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { success: true, product: data, action: 'created' },
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

