import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { isAdmin } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from('articles')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create article', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ article: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
