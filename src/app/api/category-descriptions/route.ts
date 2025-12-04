import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const subcategory = searchParams.get('subcategory')

    let query = supabase.from('category_descriptions').select('*')
    
    if (category) {
      query = query.eq('category', category)
    }
    if (subcategory !== null) {
      if (subcategory === '') {
        query = query.is('subcategory', null)
      } else {
        query = query.eq('subcategory', subcategory)
      }
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch descriptions', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ descriptions: data || [] }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    // Use authenticated client (RLS policies allow authenticated users)
    const supabase = await createServerClient()

    const { category, subcategory, description } = body

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // Upsert: update if exists, insert if not
    // Only update description if it's provided (not null/empty)
    const upsertData: {
      category: string
      subcategory: string | null
      description?: string | null
      updated_at: string
    } = {
      category,
      subcategory: subcategory || null,
      updated_at: new Date().toISOString(),
    }
    
    // Only include description if it's not null/empty
    if (description !== null && description !== undefined && description.trim() !== '') {
      upsertData.description = description.trim()
    } else if (description === null || description === '') {
      // Allow explicitly setting to null/empty to clear description
      upsertData.description = null
    }

    const { data, error } = await supabase
      .from('category_descriptions')
      .upsert(upsertData, {
        onConflict: 'category,subcategory',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save description', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ description: data }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

