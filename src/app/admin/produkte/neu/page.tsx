import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-oswald font-bold uppercase tracking-tighter mb-2">
          Neues Produkt erstellen
        </h1>
        <p className="text-muted-foreground">
          Erstellen Sie ein neues Produkt für die Takumi-Kollektion.
        </p>
      </div>

      <ProductForm />
    </div>
  )
}

