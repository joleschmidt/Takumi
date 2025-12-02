import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { products } from '@/lib/data'

// Website categories mapping (from products and navigation)
const WEBSITE_CATEGORIES = [
  'Scheren & Zangen',
  'Sägen & Beile',
  'Bodenbearbeitung',
  'Besen & Rechen',
  'Pflege & Zubehör',
]

export async function GET(request: NextRequest) {
  try {
    // Get categories from imported articles
    const { data, error } = await supabase
      .from('articles')
      .select('category')
      .not('category', 'is', null)

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch categories', details: error.message },
        { status: 500 }
      )
    }

    // Get unique categories from articles
    const articleCategories = Array.from(new Set(data.map(item => item.category)))
      .filter(Boolean)

    // Get unique categories from products
    const productCategories = Array.from(new Set(products.map(p => p.category)))
      .filter(Boolean)
      .map(slug => {
        // Map slug to display name
        const categoryMap: Record<string, string> = {
          'scheren-zangen': 'Scheren & Zangen',
          'saegen-beile': 'Sägen & Beile',
          'bodenbearbeitung': 'Bodenbearbeitung',
          'besen-rechen': 'Besen & Rechen',
          'zubehoer': 'Pflege & Zubehör',
        }
        return categoryMap[slug] || slug
      })

    // Combine all categories (website categories + article categories)
    const allCategories = Array.from(new Set([
      ...WEBSITE_CATEGORIES,
      ...productCategories,
      ...articleCategories,
    ])).sort()

    return NextResponse.json({ categories: allCategories }, { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

