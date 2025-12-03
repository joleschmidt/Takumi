'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface VendorButtonProps {
  name: string
  url: string
  price?: string
  shipping_cost?: string
}

export function VendorButton({ name, url, price, shipping_cost }: VendorButtonProps) {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)

  useEffect(() => {
    try {
      const domain = new URL(url).hostname.replace('www.', '')
      // Use Google's favicon service
      setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=32`)
    } catch {
      setFaviconUrl(null)
    }
  }, [url])

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <Button
        size="lg"
        className="w-full h-auto min-h-[4rem] rounded-none bg-white text-[#1A1A1A] border-2 border-black hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] text-sm md:text-base font-bold uppercase tracking-widest flex items-center justify-between px-6 md:px-8 gap-4 py-3 transition-colors duration-200"
      >
        <div className="flex items-center gap-3 flex-1">
          {faviconUrl && (
            <div className="relative w-6 h-6 shrink-0">
              <Image
                src={faviconUrl}
                alt={name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1">
            <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.18em]">
              Bei {name} kaufen
            </div>
            {shipping_cost && (
              <div className="text-[11px] normal-case tracking-normal mt-1 opacity-80">
                Versand: {shipping_cost}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {price && (
            <span className="text-base md:text-lg font-oswald font-bold tracking-tight">
              {price}
            </span>
          )}
          <ArrowUpRight className="shrink-0" />
        </div>
      </Button>
    </a>
  )
}

// hallooo, mache ein test für staging