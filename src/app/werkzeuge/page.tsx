import { supabase } from '@/lib/supabase'
import { WerkzeugeClient } from "./client"

export default async function WerkzeugePage() {
  // Fetch all products from database
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  // Transform data to match frontend interface
  const products = (data || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    originalName: p.original_name,
    description: p.description,
    category: p.category,
    slug: p.slug,
    priceRange: p.price_range,
    isNew: p.is_new,
    features: p.features || [],
    history: p.history,
    usage: p.usage,
    care: p.care,
    imageUrl: p.image_url,
  }))

  return <WerkzeugeClient products={products} />
}
