'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface VendorButtonProps {
  name: string
  url: string
}

export function VendorButton({ name, url }: VendorButtonProps) {
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
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Button
        size="lg"
        className="w-full h-16 rounded-none bg-[#1a1a1a] text-white hover:bg-[#6B7F59] text-lg font-bold uppercase tracking-widest flex items-center justify-between px-8 gap-4"
      >
        <div className="flex items-center gap-3">
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
          <span>Bei {name} kaufen</span>
        </div>
        <ArrowUpRight className="shrink-0" />
      </Button>
    </a>
  )
}

