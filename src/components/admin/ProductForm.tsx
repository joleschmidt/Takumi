'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, Plus, ArrowUp, ArrowDown, Lock, LockOpen, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id?: string
  title: string
  original_name?: string
  description: string
  category: string
  subcategory?: string | null
  subtype?: string | null
  slug: string
  price_range: string
  is_new?: boolean
  features?: string[]
  history?: string
  usage?: string
  care?: string
  image_url?: string
  images?: string[]
  vendors?: Array<{ name: string; url: string; price?: string; shipping_cost?: string }>
}

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [vendors, setVendors] = useState<Array<{ name: string; url: string; price?: string; shipping_cost?: string }>>(
    product?.vendors && product.vendors.length > 0
      ? product.vendors
      : [{ name: '', url: '', price: '', shipping_cost: '' }]
  )

  const [images, setImages] = useState<Array<string>>(
    product?.images && product.images.length > 0
      ? product.images
      : product?.image_url
        ? [product.image_url]
        : ['']
  )

  const [imageErrors, setImageErrors] = useState<boolean[]>(() => images.map(() => false))

  // URL-Felder sollen sich wie normale Inputs verhalten – Locks sind nur Edit-Modus-Toggle
  const [editableImages, setEditableImages] = useState<boolean[]>(() => images.map(() => true))
  const [editableVendorUrls, setEditableVendorUrls] = useState<boolean[]>(
    () => (product?.vendors && product.vendors.length > 0 ? product.vendors.map(() => true) : [true])
  )

  const [vendorPriceLoading, setVendorPriceLoading] = useState<boolean[]>(
    () => (product?.vendors && product.vendors.length > 0 ? product.vendors.map(() => false) : [false])
  )

  const imageInputRefs = useRef<Array<HTMLInputElement | null>>([])
  const vendorUrlInputRefs = useRef<Array<HTMLInputElement | null>>([])

  const [formData, setFormData] = useState({
    title: product?.title || '',
    original_name: product?.original_name || '',
    description: product?.description || '',
    category: product?.category || 'scheren-zangen',
    subcategory: product?.subcategory || '',
    subtype: product?.subtype || '',
    slug: product?.slug || '',
    price_range: product?.price_range || '',
    is_new: product?.is_new || false,
    features: (product?.features || []).join('\n'),
    history: product?.history || '',
    usage: product?.usage || '',
    care: product?.care || '',
    image_url: product?.image_url || '',
  })

  // Category management
  const builtinCategories = [
    { value: 'scheren-zangen', label: 'Scheren & Zangen' },
    { value: 'saegen-beile', label: 'Sägen & Beile' },
    { value: 'bodenbearbeitung', label: 'Bodenbearbeitung' },
    { value: 'besen-rechen', label: 'Besen & Rechen' },
    { value: 'zubehoer', label: 'Zubehör' },
  ]

  // If product already has a non-standard category, include it in the list
  const initialExtraCategory =
    product?.category &&
      !builtinCategories.some(c => c.value === product.category)
      ? {
        value: product.category,
        label: product.category.replace(/-/g, ' '),
      }
      : null

  const [categories, setCategories] = useState(
    initialExtraCategory ? [...builtinCategories, initialExtraCategory] : builtinCategories,
  )

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategorySlug, setNewCategorySlug] = useState('')

  const slugifyCategory = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // strip accents
      .replace(/&/g, ' und ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const getVendorTotalInfo = (vendor: { price?: string; shipping_cost?: string }) => {
    const parsePrice = (value?: string | null) => {
      if (!value) return null
      const cleaned = value.replace(/[^\d,.,-]/g, '').replace(',', '.')
      const num = parseFloat(cleaned)
      return Number.isFinite(num) ? num : null
    }

    const priceNum = parsePrice(vendor.price)
    const shippingNum = parsePrice(vendor.shipping_cost)

    if (priceNum === null && shippingNum === null) return null

    const total = (priceNum ?? 0) + (shippingNum ?? 0)
    const formattedTotal = total.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    const parts: string[] = []
    if (vendor.price) parts.push(`Preis: ${vendor.price}`)
    if (vendor.shipping_cost) parts.push(`Versand: ${vendor.shipping_cost}`)

    return {
      breakdown: parts.join(' · '),
      totalLabel: `${formattedTotal}€`,
    }
  }

  const handleFetchVendorPrice = async (index: number) => {
    const vendor = vendors[index]
    if (!vendor?.url) return

    // Set loading state
    setVendorPriceLoading(prev => {
      const next = [...prev]
      next[index] = true
      return next
    })

    try {
      const res = await fetch(`/api/vendor-price?url=${encodeURIComponent(vendor.url)}`)
      if (!res.ok) {
        console.warn('Preisabfrage fehlgeschlagen', await res.text())
        return
      }
      const data = await res.json()
      if (data?.price) {
        const newVendors = [...vendors]
        newVendors[index] = {
          ...newVendors[index],
          price: data.price as string,
        }
        setVendors(newVendors)
      }
    } catch (err) {
      console.error('Preisabfrage Fehler', err)
    } finally {
      // Clear loading state
      setVendorPriceLoading(prev => {
        const next = [...prev]
        next[index] = false
        return next
      })
    }
  }

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
      const validVendors = vendors
        .filter(v => v.name.trim().length > 0 && v.url.trim().length > 0)
        .map(v => ({
          name: v.name.trim(),
          url: v.url.trim(),
          price: v.price?.trim() || undefined,
          shipping_cost: v.shipping_cost?.trim() || undefined,
        }))

      // Determine lowest vendor price (ignoring Versand) and use it as price_range
      const parsePriceNumber = (value?: string) => {
        if (!value) return null
        const cleaned = value.replace(/[^\d,.,,]/g, '').replace(',', '.')
        const num = parseFloat(cleaned)
        return Number.isFinite(num) ? num : null
      }

      let lowestPriceNumeric: number | null = null
      let lowestPriceLabel: string | null = null

      for (const v of validVendors) {
        const priceNum = parsePriceNumber(v.price)
        if (priceNum === null) continue
        if (lowestPriceNumeric === null || priceNum < lowestPriceNumeric) {
          lowestPriceNumeric = priceNum
          const formatted = priceNum.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          lowestPriceLabel = `${formatted}€`
        }
      }

      const derivedPriceRange = lowestPriceLabel || formData.price_range

      const payload = {
        title: formData.title,
        original_name: formData.original_name || null,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory?.trim() || null,
        subtype: formData.subtype?.trim() || null,
        slug: formData.slug,
        price_range: derivedPriceRange,
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
      <form onSubmit={handleSubmit} className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pb-24 pt-2 space-y-4">

        {/* Sticky admin toolbar with Back + Save */}
        <div className="sticky top-20 z-40 pt-4 pb-4 bg-[#FAFAF8]/95 backdrop-blur-sm pb-3  -mx-4 md:-mx-8 lg:-mx-12 pb-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin/produkte">
                <Button
                  type="button"
                  variant="outline"
                  className="border-black h-9 px-3 text-xs font-bold uppercase tracking-widest"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>

            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="bg-black text-white hover:bg-[#6B7F59] uppercase tracking-widest font-bold px-6 py-3 text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Speichern…' : 'Speichern'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Left: Image Preview/Input */}
          <div className="relative bg-[#F5F5F0] rounded-none border border-black/10 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Produktbilder
                </p>
                <h2 className="font-oswald font-bold text-xl uppercase mt-1">
                  Visuals & Reihenfolge
                </h2>
              </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                onClick={() => {
                  setImages([...images, ''])
                  setImageErrors(prev => [...prev, false])
                }}
                    className="border-black h-8 px-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                Bild
                  </Button>
                </div>

            <div className="space-y-3">
              <div>
                <div className="space-y-3">
                  {images.map((image, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      {image.trim() && !imageErrors[index] && (
                        <div className="relative w-20 h-20 bg-white border border-black/20 overflow-hidden shrink-0">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={() => {
                              setImageErrors(prev => {
                                const next = [...prev]
                                next[index] = true
                                return next
                              })
                            }}
                          />
                        </div>
                      )}
                      {image.trim() && imageErrors[index] && (
                        <div className="relative w-20 h-20 bg-white border border-black/20 overflow-hidden shrink-0 flex items-center justify-center text-[10px] text-gray-500 text-center px-1">
                          Bild konnte nicht geladen werden
                        </div>
                      )}
                      <div className="flex flex-col gap-1 shrink-0 mt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (index > 0) {
                              const newImages = [...images]
                              const temp = newImages[index]
                              newImages[index] = newImages[index - 1]
                              newImages[index - 1] = temp
                              setImages(newImages)
                              // Update main image_url if we moved the first image
                              if (index === 1) {
                                setFormData(prev => ({ ...prev, image_url: newImages[0] }))
                              } else if (index === 0) {
                                setFormData(prev => ({ ...prev, image_url: newImages[0] }))
                              }
                            }
                          }}
                          disabled={index === 0}
                          className="border-black h-6 w-6 p-0 hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Nach oben"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (index < images.length - 1) {
                              const newImages = [...images]
                              const temp = newImages[index]
                              newImages[index] = newImages[index + 1]
                              newImages[index + 1] = temp
                              setImages(newImages)
                              // Update main image_url if we moved the first image
                              if (index === 0) {
                                setFormData(prev => ({ ...prev, image_url: newImages[0] }))
                              }
                            }
                          }}
                          disabled={index === images.length - 1}
                          className="border-black h-6 w-6 p-0 hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Nach unten"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-500 shrink-0 w-6 text-center pt-2">
                          {index + 1}
                        </span>
                        <Textarea
                          ref={el => {
                            imageInputRefs.current[index] = el as unknown as HTMLInputElement
                          }}
                          value={image}
                          readOnly={!editableImages[index]}
                          onChange={(e) => {
                            const value = e.target.value
                            const newImages = [...images]
                            newImages[index] = value
                            setImages(newImages)

                            setImageErrors(prev => {
                              const next = [...prev]
                              // Wenn der Nutzer die URL ändert, erneut versuchen zu laden
                              next[index] = false
                              return next
                            })

                            // Update main image_url if it's the first image
                            if (index === 0) {
                              setFormData(prev => ({ ...prev, image_url: value }))
                            }
                          }}
                          placeholder="https://assets.katogroup.eu/i/..."
                          rows={1}
                          className="bg-white border-black font-mono text-[11px] leading-snug flex-1 resize-none overflow-hidden whitespace-nowrap"
                          style={{ height: '2.25rem', minHeight: '2.25rem' }}
                        />
                      </div>
                      <div className="flex gap-1 shrink-0 mt-1 items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditableImages(prev => {
                              const next = [...prev]
                              next[index] = !next[index]
                              return next
                            })
                          }}
                          className="border-black h-8 w-8 p-0 flex items-center justify-center"
                          title={editableImages[index] ? 'Bearbeiten beenden' : 'Bearbeiten'}
                        >
                          {editableImages[index] ? (
                            <LockOpen className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                        </Button>
                        {images.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newImages = images.filter((_, i) => i !== index)
                              const newErrors = imageErrors.filter((_, i) => i !== index)
                            setImages(newImages)
                              setImageErrors(newErrors)

                            if (index === 0 && newImages.length > 0) {
                              setFormData(prev => ({ ...prev, image_url: newImages[0] }))
                            } else if (newImages.length === 0) {
                              setFormData(prev => ({ ...prev, image_url: '' }))
                            }
                          }}
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-8 w-8 p-0 flex items-center justify-center"
                          title="Entfernen"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* {images[0] && images[0].trim() && (
                <div className="relative w-full max-w-xs aspect-square bg-white border-2 border-black mx-auto">
                  <div className="absolute -top-2 left-2 bg-black text-white text-xs px-2 py-1 font-bold uppercase">
                    Hauptbild
                  </div>
                  <img
                    src={images[0]}
                    alt="Hauptbild Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )} */}
            </div>
          </div>

          {/* Right: Form Fields */}
          <div className="flex flex-col gap-8">

            {error && (
              <div className="bg-red-50 border border-red-500 text-red-700 p-4 text-sm">
                <p className="font-bold">Fehler:</p>
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Titel *
                </Label>
                <Textarea
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  rows={1}
                  className="bg-white border-black text-2xl font-oswald font-bold uppercase resize-none overflow-hidden whitespace-nowrap"
                  style={{ height: '2.25rem', minHeight: '2.25rem' }}
                />
              </div>

              <div>
                <Label htmlFor="original_name" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Original Name (Japanisch)
                </Label>
                <Textarea
                  id="original_name"
                  value={formData.original_name}
                  onChange={(e) => setFormData({ ...formData, original_name: e.target.value })}
                  rows={1}
                  className="bg-white border-black italic resize-none overflow-hidden whitespace-nowrap"
                  style={{ height: '2.25rem', minHeight: '2.25rem' }}
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Slug (URL) *
                </Label>
                <Textarea
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  placeholder="okatsune-103"
                  rows={1}
                  className="bg-white border-black font-mono text-base leading-snug resize-none overflow-hidden whitespace-nowrap"
                  style={{ height: '2.25rem', minHeight: '2.25rem' }}
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Kategorie *
                </Label>

                <div className="flex flex-col gap-2">
                  {/* Select existing or trigger "new" */}
                  <div className="flex gap-2">
                <select
                  id="category"
                  value={formData.category}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '__new__') {
                          setShowNewCategoryForm(true)
                        } else {
                          setShowNewCategoryForm(false)
                          setFormData(prev => ({ ...prev, category: value }))
                        }
                      }}
                  required
                  className="w-full px-3 py-2 border-2 border-black bg-white font-bold uppercase tracking-widest"
                >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                      <option value="__new__">+ Neue Kategorie …</option>
                </select>
                  </div>

                  {showNewCategoryForm && (
                    <div className="border border-black/30 bg-[#F5F5F0] p-3 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-600">
                        Neue Kategorie anlegen
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] font-bold uppercase tracking-widest mb-1 block">
                            Anzeigename
                          </Label>
                          <Input
                            value={newCategoryName}
                            onChange={(e) => {
                              const name = e.target.value
                              setNewCategoryName(name)
                              setNewCategorySlug(prev => (prev ? prev : slugifyCategory(name)))
                            }}
                            placeholder="z.B. Bonsai & Zubehör"
                            className="bg-white border-black text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] font-bold uppercase tracking-widest mb-1 block">
                            Slug (URL)
                          </Label>
                          <Input
                            value={newCategorySlug}
                            onChange={(e) => setNewCategorySlug(slugifyCategory(e.target.value))}
                            placeholder="bonsai-zubehoer"
                            className="bg-white border-black text-xs font-mono"
                          />
                          <p className="text-[10px] text-gray-500 mt-1">
                            Wird als <span className="font-mono">/werkzeuge/[slug]</span> verwendet.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-black h-7 px-3 text-[11px] uppercase tracking-widest"
                          onClick={() => {
                            setShowNewCategoryForm(false)
                            setNewCategoryName('')
                            setNewCategorySlug('')
                          }}
                        >
                          Abbrechen
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-black text-white hover:bg-[#6B7F59] h-7 px-3 text-[11px] uppercase tracking-widest"
                          disabled={!newCategorySlug}
                          onClick={() => {
                            if (!newCategorySlug) return
                            const label =
                              newCategoryName || newCategorySlug.replace(/-/g, ' ')
                            const newCat = { value: newCategorySlug, label }

                            setCategories(prev => {
                              if (prev.some(c => c.value === newCat.value)) return prev
                              return [...prev, newCat]
                            })

                            setFormData(prev => ({ ...prev, category: newCat.value }))

                            setShowNewCategoryForm(false)
                            setNewCategoryName('')
                            setNewCategorySlug('')
                          }}
                        >
                          Speichern
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest mb-2 block">
                    Unterkategorie
                  </Label>
                  <Input
                    value={formData.subcategory || ''}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, subcategory: e.target.value }))
                    }
                    placeholder="z.B. Sägen, Beile"
                    className="bg-white border-black text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest mb-2 block">
                    Typ
                  </Label>
                  <Input
                    value={formData.subtype || ''}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, subtype: e.target.value }))
                    }
                    placeholder="z.B. Einhandsäge, Klappsäge"
                    className="bg-white border-black text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="price_range" className="text-sm font-bold uppercase tracking-widest mb-2 block">
                  Preisbereich *
                </Label>
                <Textarea
                  id="price_range"
                  value={formData.price_range}
                  onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
                  required
                  placeholder="50€ - 70€"
                  rows={1}
                  className="bg-white border-black text-xl font-bold leading-snug resize-none overflow-hidden whitespace-nowrap"
                  style={{ height: '2.25rem', minHeight: '2.25rem' }}
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
                    onClick={() => {
                      setVendors([...vendors, { name: '', url: '', price: '', shipping_cost: '' }])
                      setVendorPriceLoading(prev => [...prev, false])
                      setEditableVendorUrls(prev => [...prev, true])
                    }}
                    className="border-black h-8 px-3"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Händler hinzufügen
                  </Button>
                </div>
                <div className="space-y-4">
                  {vendors.map((vendor, index) => (
                    <div key={index} className="border-2 border-black/10 p-4 space-y-3">
                      <div className="flex gap-2">
                        <Textarea
                          value={vendor.name}
                          onChange={(e) => {
                            const newVendors = [...vendors]
                            newVendors[index].name = e.target.value
                            setVendors(newVendors)
                          }}
                          placeholder="Shop Name (z.B. Dictum)"
                          rows={1}
                          className="bg-white border-black flex-1 text-sm leading-snug resize-none overflow-hidden whitespace-nowrap"
                          style={{ height: '2.25rem', minHeight: '2.25rem' }}
                        />
                        <Textarea
                          ref={el => {
                            vendorUrlInputRefs.current[index] = el as unknown as HTMLInputElement
                          }}
                          value={vendor.url}
                          readOnly={!editableVendorUrls[index]}
                          onChange={(e) => {
                            const newVendors = [...vendors]
                            newVendors[index].url = e.target.value
                            setVendors(newVendors)
                          }}
                          placeholder="https://www.dictum.com/..."
                          rows={1}
                          className="bg-white border-black flex-1 font-mono text-[11px] leading-snug resize-none overflow-hidden whitespace-nowrap"
                          style={{ height: '2.25rem', minHeight: '2.25rem' }}
                        />
                        <div className="flex gap-1 shrink-0 items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditableVendorUrls(prev => {
                                const next = [...prev]
                                next[index] = !next[index]
                                return next
                              })
                              if (!editableVendorUrls[index]) {
                                const input = vendorUrlInputRefs.current[index]
                                if (input) {
                                  input.focus()
                                  input.select()
                                }
                              }
                            }}
                            className="border-black h-8 w-8 p-0 flex items-center justify-center"
                            title={editableVendorUrls[index] ? 'Bearbeiten beenden' : 'Bearbeiten'}
                          >
                            {editableVendorUrls[index] ? (
                              <LockOpen className="h-3 w-3" />
                            ) : (
                              <Lock className="h-3 w-3" />
                            )}
                          </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newVendors = vendors.filter((_, i) => i !== index)
                              const newEditable = editableVendorUrls.filter((_, i) => i !== index)
                              const newLoading = vendorPriceLoading.filter((_, i) => i !== index)
                              setVendors(
                                newVendors.length > 0 ? newVendors : [{ name: '', url: '', price: '', shipping_cost: '' }],
                              )
                              setEditableVendorUrls(newEditable.length > 0 ? newEditable : [false])
                              setVendorPriceLoading(newLoading.length > 0 ? newLoading : [false])
                          }}
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-8 w-8 p-0 flex items-center justify-center"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-dashed border-black/20 pt-3 mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-widest mb-1 block text-gray-600">
                            Preis
                          </Label>
                            <div className="flex gap-2">
                            <Textarea
                              value={vendor.price || ''}
                              onChange={(e) => {
                                const newVendors = [...vendors]
                                newVendors[index].price = e.target.value
                                setVendors(newVendors)
                              }}
                              placeholder="z.B. 65€"
                              rows={1}
                              className="bg-white border-black text-sm flex-1 leading-snug resize-none overflow-hidden whitespace-nowrap"
                              style={{ height: '2.25rem', minHeight: '2.25rem' }}
                            />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleFetchVendorPrice(index)
                                }}
                                disabled={!vendor.url || vendor.url.trim().length === 0 || vendorPriceLoading[index]}
                                className="border-black h-9 w-9 p-0 flex items-center justify-center text-sm font-bold shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                title={
                                  vendorPriceLoading[index]
                                    ? 'Preis wird abgerufen...'
                                    : vendor.url
                                      ? 'Preis automatisch abrufen'
                                      : 'Bitte zuerst URL eingeben'
                                }
                              >
                                {vendorPriceLoading[index] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  '€'
                                )}
                              </Button>
                            </div>
                        </div>
                        <div>
                          <Label className="text-xs font-bold uppercase tracking-widest mb-1 block text-gray-600">
                            Versandkosten
                          </Label>
                          <Input
                            value={vendor.shipping_cost || ''}
                            onChange={(e) => {
                              const newVendors = [...vendors]
                              newVendors[index].shipping_cost = e.target.value
                              setVendors(newVendors)
                            }}
                            placeholder="z.B. 5€ oder kostenlos"
                            className="bg-white border-black text-sm"
                          />
                        </div>
                        </div>

                        {getVendorTotalInfo(vendor) && (
                          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
                            <span className="text-gray-500">
                              {getVendorTotalInfo(vendor)?.breakdown}
                            </span>
                            <span className="font-bold text-[#1A1A1A]">
                              ca. {getVendorTotalInfo(vendor)?.totalLabel}
                              <span className="ml-1 text-gray-500 normal-case">gesamt</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Close right column */}
          </div>

          {/* Save button already in header – no extra footer button */}
        </div>
      </form>
    </div>
  )
}

