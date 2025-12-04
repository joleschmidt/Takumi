'use client'

import { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

type Product = {
  id: string
  title: string
  category: string | null
  subcategory: string | null
  subtype: string | null
  image_url: string | null
}

type TaxonomyManagerProps = {
  products: Product[]
}

type DragState = {
  productId: string
  fromCategory: string
  fromSubcategory: string
} | null

type CategoryDescription = {
  category: string
  subcategory: string | null
  description: string | null
}

export function TaxonomyManager({ products }: TaxonomyManagerProps) {
  const [localProducts, setLocalProducts] = useState(products)
  const [dragState, setDragState] = useState<DragState>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [extraSubs, setExtraSubs] = useState<Record<string, string[]>>({})
  const [newSubName, setNewSubName] = useState<Record<string, string>>({})
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [editingDesc, setEditingDesc] = useState<Record<string, string>>({})
  const [savingDesc, setSavingDesc] = useState<string | null>(null)
  const [savedDesc, setSavedDesc] = useState<string | null>(null)

  const grouped = useMemo(() => {
    const byCat: Record<string, Record<string, Product[]>> = {}

    for (const p of localProducts) {
      const cat = p.category || 'Unkategorisiert'
      const sub = p.subcategory || '—'
      if (!byCat[cat]) byCat[cat] = {}
      if (!byCat[cat][sub]) byCat[cat][sub] = []
      byCat[cat][sub].push(p)
    }

    // Ensure extra subcategories exist even if they currently have no products
    Object.entries(extraSubs).forEach(([cat, subs]) => {
      if (!byCat[cat]) byCat[cat] = {}
      subs.forEach(sub => {
        if (!byCat[cat][sub]) byCat[cat][sub] = []
      })
    })

    return Object.entries(byCat).sort(([a], [b]) => a.localeCompare(b, 'de'))
  }, [localProducts, extraSubs])

  async function updateProductTaxonomy(
    productId: string,
    category: string | null,
    subcategory: string | null,
  ) {
    setSavingId(productId)
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          subcategory,
        }),
      })
      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error('Failed to update taxonomy', await res.text())
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Taxonomy update error', e)
    } finally {
      setSavingId(null)
    }
  }

  const handleDrop = (cat: string, sub: string) => {
    if (!dragState) return
    const { productId } = dragState

    setLocalProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? {
              ...p,
              category: cat === 'Unkategorisiert' ? null : cat,
              subcategory: sub === '—' ? null : sub,
            }
          : p,
      ),
    )

    updateProductTaxonomy(
      productId,
      cat === 'Unkategorisiert' ? null : cat,
      sub === '—' ? null : sub,
    )

    setDragState(null)
  }

  const toggleCollapsed = (cat: string, sub: string) => {
    const key = `${cat}::${sub}`
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleAddSubcategory = (cat: string) => {
    const nameRaw = (newSubName[cat] || '').trim()
    if (!nameRaw) return

    const name = nameRaw
    setExtraSubs(prev => {
      const existing = prev[cat] || []
      if (existing.includes(name)) return prev
      return {
        ...prev,
        [cat]: [...existing, name],
      }
    })
    setNewSubName(prev => ({ ...prev, [cat]: '' }))
  }

  // Load descriptions on mount
  useEffect(() => {
    async function loadDescriptions() {
      try {
        const res = await fetch('/api/category-descriptions')
        if (res.ok) {
          const data = await res.json()
          const descMap: Record<string, string> = {}
          for (const desc of data.descriptions || []) {
            const key = desc.subcategory
              ? `${desc.category}::${desc.subcategory}`
              : desc.category
            descMap[key] = desc.description || ''
          }
          setDescriptions(descMap)
          setEditingDesc(descMap)
        }
      } catch (e) {
        console.error('Failed to load descriptions', e)
      }
    }
    loadDescriptions()
  }, [])

  const getDescKey = (cat: string, sub?: string | null) => {
    return sub && sub !== '—' ? `${cat}::${sub}` : cat
  }

  const handleSaveDescription = async (cat: string, sub?: string | null) => {
    const key = getDescKey(cat, sub)
    const desc = editingDesc[key] || ''
    const savingKey = `${cat}::${sub || 'main'}`

    setSavingDesc(savingKey)
    try {
      const res = await fetch('/api/category-descriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          subcategory: sub && sub !== '—' ? sub : null,
          description: desc.trim() || null,
        }),
      })

      if (res.ok) {
        setDescriptions(prev => ({ ...prev, [key]: desc.trim() }))
        setSavedDesc(savingKey)
        // Clear success message after 3 seconds
        setTimeout(() => setSavedDesc(null), 3000)
      } else {
        console.error('Failed to save description', await res.text())
      }
    } catch (e) {
      console.error('Error saving description', e)
    } finally {
      setSavingDesc(null)
    }
  }

  return (
    <div className="space-y-6">
      {grouped.map(([cat, subMap]) => (
        <section
          key={cat}
          className="border-2 border-black bg-white p-4 md:p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Hauptkategorie
              </p>
              <h2 className="font-oswald font-bold text-2xl md:text-3xl uppercase">
                {cat.replace(/-/g, ' ')}
              </h2>
            </div>
          </div>

          {/* Description editor for main category */}
          <div className="border border-black/20 bg-[#F5F5F0] p-4 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-600 block">
              Beschreibung für {cat.replace(/-/g, ' ')}
            </label>
            <Textarea
              value={editingDesc[cat] || ''}
              onChange={e =>
                setEditingDesc(prev => ({ ...prev, [cat]: e.target.value }))
              }
              placeholder="Beschreibungstext für diese Hauptkategorie..."
              rows={3}
              className="bg-white border-black text-sm resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              {savedDesc === `${cat}::main` && (
                <span className="text-xs text-[#6B7F59] font-bold uppercase tracking-widest">
                  ✓ Gespeichert
                </span>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() => handleSaveDescription(cat)}
                disabled={savingDesc === `${cat}::main`}
                className="bg-black text-white hover:bg-[#6B7F59] h-7 px-3 text-[11px] uppercase tracking-widest"
              >
                {savingDesc === `${cat}::main` ? 'Speichert...' : 'Speichern'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(subMap)
              .sort(([a], [b]) => a.localeCompare(b, 'de'))
              .map(([sub, productsInSub]) => (
                <div
                  key={sub}
                  className="border-2 border-black bg-[#F2F0EA] p-3 flex flex-col gap-3 min-h-[120px]"
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    handleDrop(cat, sub)
                  }}
                >
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => toggleCollapsed(cat, sub)}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7F59] flex items-center justify-between">
                        <span>Unterkategorie</span>
                        <span>
                          {collapsed[`${cat}::${sub}`] ? '+' : '–'}
                        </span>
                      </p>
                      <p className="text-sm font-semibold">
                      {sub === '—' ? (
                        <span className="text-gray-500">– keine –</span>
                      ) : (
                        sub
                      )}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {productsInSub.length} Produkt
                        {productsInSub.length === 1 ? '' : 'e'}
                      </p>
                    </button>

                    {/* Description editor for subcategory */}
                    {sub !== '—' && (
                      <div className="border border-black/10 bg-white p-2 space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block">
                          Beschreibung
                        </label>
                        <Textarea
                          value={editingDesc[getDescKey(cat, sub)] || ''}
                          onChange={e =>
                            setEditingDesc(prev => ({
                              ...prev,
                              [getDescKey(cat, sub)]: e.target.value,
                            }))
                          }
                          placeholder="Beschreibungstext..."
                          rows={2}
                          className="bg-white border-black text-xs resize-none"
                        />
                        <div className="space-y-1">
                          {savedDesc === `${cat}::${sub}` && (
                            <span className="text-[10px] text-[#6B7F59] font-bold uppercase tracking-widest block text-center">
                              ✓ Gespeichert
                            </span>
                          )}
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSaveDescription(cat, sub)}
                            disabled={savingDesc === `${cat}::${sub}`}
                            className="w-full bg-black text-white hover:bg-[#6B7F59] h-6 px-2 text-[10px] uppercase tracking-widest"
                          >
                            {savingDesc === `${cat}::${sub}` ? 'Speichert...' : 'Speichern'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {!collapsed[`${cat}::${sub}`] && (
                    <div className="flex-1 flex flex-col gap-2">
                      {productsInSub.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          draggable
                          onDragStart={() =>
                            setDragState({
                              productId: p.id,
                              fromCategory: cat,
                              fromSubcategory: sub,
                            })
                          }
                          className="flex items-center gap-2 border border-black bg-white px-2 py-1 text-left hover:bg-black hover:text-white transition-colors cursor-move"
                        >
                          <div className="relative w-10 h-10 bg-[#F5F5F0] overflow-hidden border border-black/20 shrink-0">
                            {p.image_url ? (
                              <Image
                                src={p.image_url}
                                alt={p.title}
                                fill
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-oswald font-bold uppercase leading-tight line-clamp-2">
                              {p.title}
                            </p>
                            {p.subtype && (
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                {p.subtype}
                              </p>
                            )}
                          </div>
                          {savingId === p.id && (
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">
                              Speichert…
                            </span>
                          )}
                        </button>
                      ))}
                      {productsInSub.length === 0 && (
                        <p className="text-[11px] text-gray-500">
                          Produkte hierher ziehen, um sie dieser Unterkategorie
                          zuzuordnen.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Add new subcategory for this main category */}
          <div className="mt-3 border border-dashed border-black/30 bg-[#F5F5F0] p-3 flex flex-col md:flex-row gap-2 md:items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
              Neue Unterkategorie für {cat.replace(/-/g, ' ')}
            </p>
            <div className="flex-1 flex gap-2">
              <input
                value={newSubName[cat] || ''}
                onChange={e =>
                  setNewSubName(prev => ({ ...prev, [cat]: e.target.value }))
                }
                placeholder="z.B. Sägen, Beile, Einhandsägen"
                className="flex-1 px-2 py-1 border border-black bg-white text-xs"
              />
              <Button
                type="button"
                size="sm"
                className="bg-black text-white hover:bg-[#6B7F59] h-7 px-3 text-[11px] uppercase tracking-widest"
                onClick={() => handleAddSubcategory(cat)}
              >
                Hinzufügen
              </Button>
            </div>
          </div>
        </section>
      ))}

      {localProducts.length === 0 && (
        <div className="border-2 border-dashed border-black/30 p-6 text-sm text-gray-600">
          Noch keine Produkte vorhanden. Legen Sie zuerst Produkte an, um die
          Taxonomie zu strukturieren.
        </div>
      )}

      <div className="border border-black/20 bg-[#F5F5F0] p-3 text-[11px] text-gray-600 flex items-center justify-between gap-2">
        <p>
          Änderungen an Kategorien und Unterkategorien werden sofort gespeichert,
          wenn Sie Produkte per Drag & Drop verschieben.
        </p>
        <Button
          type="button"
          size="sm"
          className="bg-black text-white hover:bg-[#6B7F59] h-7 px-3 text-[11px] uppercase tracking-widest"
          onClick={() => window.location.reload()}
        >
          Ansicht aktualisieren
        </Button>
      </div>
    </div>
  )
}


