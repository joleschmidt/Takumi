'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id?: string
  title: string
  original_name?: string
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
  vendors?: Array<{ name: string; url: string }>
}

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [vendors, setVendors] = useState<Array<{ name: string; url: string }>>(
    product?.vendors && product.vendors.length > 0 
      ? product.vendors
      : [{ name: '', url: '' }]
  )

  const [images, setImages] = useState<Array<string>>(
    product?.images && product.images.length > 0
      ? product.images
      : product?.image_url
        ? [product.image_url]
        : ['']
  )

  const [formData, setFormData] = useState({
    title: product?.title || '',
    original_name: product?.original_name || '',
    description: product?.description || '',
    category: product?.category || 'scheren-zangen',
    slug: product?.slug || '',
    price_range: product?.price_range || '',
    is_new: product?.is_new || false,
    features: (product?.features || []).join('\n'),
    history: product?.history || '',
    usage: product?.usage || '',
    care: product?.care || '',
    image_url: product?.image_url || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Parse features from newline-separated strings
      const features = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0)
      
      // Filter out empty images and vendors
      const validImages = images.filter(img => img.trim().length > 0)
      const validVendors = vendors.filter(v => v.name.trim().length > 0 && v.url.trim().length > 0)

      const payload = {
        title: formData.title,
        original_name: formData.original_name || null,
        description: formData.description,
        category: formData.category,
        slug: formData.slug,
        price_range: formData.price_range,
        is_new: formData.is_new,
        features,
        history: formData.history || null,
        usage: formData.usage || null,
        care: formData.care || null,
        image_url: formData.image_url || (validImages.length > 0 ? validImages[0] : null),
        images: validImages.length > 0 ? validImages : null,
        vendors: validVendors.length > 0 ? validVendors : [],
      }

      const url = product?.id 
        ? `/api/products/${product.id}`
        : '/api/products'
      
      const method = product?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save product')
      }

      router.push('/admin/produkte')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          
          {/* Left: Image Preview/Input */}
          <div className="relative bg-[#F5F5F0] lg:h-[calc(100vh-5rem+10vh)] lg:sticky lg:top-20 flex items-start justify-center p-8 md:p-16 overflow-y-auto">
            <div className="relative w-full space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-bold uppercase tracking-widest">
                    Bilder
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setImages([...images, ''])}
                    className="border-black h-8 px-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Bild hinzufügen
                  </Button>
                </div>
                <div className="space-y-3">
                  {images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={image}
                        onChange={(e) => {
                          const newImages = [...images]
                          newImages[index] = e.target.value
                          setImages(newImages)
                          // Update main image_url if it's the first image
                          if (index === 0) {
                            setFormData(prev => ({ ...prev, image_url: e.target.value }))
                          }
                        }}
                        placeholder="https://assets.katogroup.eu/i/..."
                        className="bg-white border-black font-mono text-xs flex-1"
                      />
                      {images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                        onClick={() => {
                          const newImages = images.filter((_, i) => i !== index)
                          setImages(newImages)
                          if (index === 0 && newImages.length > 0) {
                            setFormData(prev => ({ ...prev, image_url: newImages[0] }))
                          } else if (newImages.length === 0) {
                            setFormData(prev => ({ ...prev, image_url: '' }))
                          }
                        }}
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {images[0] && images[0].trim() && (
                <div className="relative aspect-square bg-white border-2 border-black">
                  <img
                    src={images[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="p-8 md:p-16 lg:pt-32 flex flex-col justify-center min-h-[calc(100vh-5rem+10vh)] space-y-8">
            
            <div className="flex items-center gap-4 mb-4">
              <Link href="/admin/produkte">
                <Button type="button" variant="outline" className="border-black">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4">
                <p className="font-bold">Fehler:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Titel *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white border-black text-2xl font-oswald font-bold uppercase"
                />
              </div>

              <div>
                <Label htmlFor="original_name" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Original Name (Japanisch)
                </Label>
                <Input
                  id="original_name"
                  value={formData.original_name}
                  onChange={(e) => setFormData({ ...formData, original_name: e.target.value })}
                  className="bg-white border-black italic"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Slug (URL) *
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="okatsune-103"
                  className="bg-white border-black font-mono"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Kategorie *
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full px-3 py-2 border-2 border-black bg-white font-bold uppercase tracking-widest"
                >
                  <option value="scheren-zangen">Scheren & Zangen</option>
                  <option value="saegen-beile">Sägen & Beile</option>
                  <option value="bodenbearbeitung">Bodenbearbeitung</option>
                  <option value="besen-rechen">Besen & Rechen</option>
                  <option value="zubehoer">Zubehör</option>
                </select>
              </div>

              <div>
                <Label htmlFor="price_range" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Preisbereich *
                </Label>
                <Input
                  id="price_range"
                  value={formData.price_range}
                  onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                  required
                  placeholder="50€ - 70€"
                  className="bg-white border-black text-xl font-bold"
                />
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  id="is_new"
                  checked={formData.is_new}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                />
                <Label htmlFor="is_new" className="text-sm font-bold uppercase tracking-widest">
                  Als "Neu" markieren
                </Label>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Beschreibung *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={6}
                  className="bg-white border-black leading-relaxed"
                />
              </div>

              <div>
                <Label htmlFor="features" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Eigenschaften (eine pro Zeile)
                </Label>
                <Textarea
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={4}
                  placeholder="Izumo Yasugi Stahl&#10;Rot-Weiße Griffe&#10;Rockwell Härte 60-61"
                  className="bg-white border-black font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="usage" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                    Verwendung
                  </Label>
                  <Textarea
                    id="usage"
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    rows={4}
                    className="bg-[#F5F5F0] border-black text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="care" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                    Pflege
                  </Label>
                  <Textarea
                    id="care"
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    rows={4}
                    className="bg-[#F5F5F0] border-black text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="history" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Geschichte
                </Label>
                <Textarea
                  id="history"
                  value={formData.history}
                  onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                  rows={4}
                  className="bg-[#F5F5F0] border-black text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-bold uppercase tracking-widest">
                    Händler
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVendors([...vendors, { name: '', url: '' }])}
                    className="border-black h-8 px-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Händler hinzufügen
                  </Button>
                </div>
                <div className="space-y-3">
                  {vendors.map((vendor, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={vendor.name}
                        onChange={(e) => {
                          const newVendors = [...vendors]
                          newVendors[index].name = e.target.value
                          setVendors(newVendors)
                        }}
                        placeholder="Shop Name (z.B. Dictum)"
                        className="bg-white border-black flex-1"
                      />
                      <Input
                        value={vendor.url}
                        onChange={(e) => {
                          const newVendors = [...vendors]
                          newVendors[index].url = e.target.value
                          setVendors(newVendors)
                        }}
                        placeholder="https://www.dictum.com/..."
                        className="bg-white border-black flex-1 font-mono text-xs"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newVendors = vendors.filter((_, i) => i !== index)
                          setVendors(newVendors.length > 0 ? newVendors : [{ name: '', url: '' }])
                        }}
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8">
              <Button
                type="submit"
                disabled={loading}
                className="bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold px-8 py-6 text-lg"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? 'Wird gespeichert...' : 'Speichern'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

