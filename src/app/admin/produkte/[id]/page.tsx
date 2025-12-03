import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-2">
          Produkt bearbeiten
        </h1>
        <p className="text-muted-foreground">
          Bearbeiten Sie: {product.title}
        </p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}

