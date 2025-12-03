import { createClient } from '@supabase/supabase-js'
import { products } from '../src/lib/data'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function migrateProducts() {
  console.log('Starting product migration...\n')

  for (const product of products) {
    try {
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single()

      if (existing) {
        console.log(`✓ Product "${product.title}" already exists, skipping...`)
        continue
      }

      // Insert product (let DB generate UUID)
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          original_name: product.originalName,
          description: product.description,
          category: product.category,
          slug: product.slug,
          price_range: product.priceRange,
          is_new: product.isNew || false,
          features: product.features || [],
          history: product.history,
          usage: product.usage,
          care: product.care,
          image_url: product.imageUrl,
        })
        .select()
        .single()

      if (error) {
        console.error(`✗ Error inserting "${product.title}":`, error.message)
      } else {
        console.log(`✓ Migrated: ${product.title}`)
      }
    } catch (error) {
      console.error(`✗ Error processing "${product.title}":`, error)
    }
  }

  console.log('\n✅ Migration completed!')
}

migrateProducts()

