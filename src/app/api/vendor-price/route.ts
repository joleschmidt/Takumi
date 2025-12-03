import { NextRequest, NextResponse } from 'next/server'

/**
 * Super lightweight HTML scraper for a few known shop domains.
 *
 * NOTE (read this before shipping to prod):
 * - This is best-effort parsing of public product pages, no auth, no cookies.
 * - It will break whenever the shop changes its markup.
 * - Long-term you probably want:
 *   - Either official partner APIs (Amazon PA API etc.)
 *   - Or a dedicated price-tracking backend that you fully control.
 */

async function scrapeAmazonPrice(productUrl: string): Promise<string | null> {
    const res = await fetch(productUrl, {
        // Pretend to be a normal browser – some shops gate on UA / language
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        },
        // Do not send credentials; we only look at the public price
        cache: 'no-store',
    })

    if (!res.ok) return null
    const html = await res.text()

    // Try several common Amazon price patterns, in order.
    const patterns: RegExp[] = [
        /id="priceblock_ourprice"[^>]*>\s*([^<]+)\s*</i,
        /id="priceblock_dealprice"[^>]*>\s*([^<]+)\s*</i,
        /id="priceblock_saleprice"[^>]*>\s*([^<]+)\s*</i,
        /class="a-offscreen"\s*>\s*([^<]+)\s*</i, // generic hidden price span
    ]

    for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[1]) {
            // Normalize whitespace, keep currency symbol as-is (€, etc.)
            const raw = match[1].replace(/\s+/g, ' ').trim()
            if (raw) return raw
        }
    }

    return null
}

async function scrapeGenericPrice(productUrl: string): Promise<string | null> {
    const res = await fetch(productUrl, {
        headers: {
            'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
            'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        },
        cache: 'no-store',
    })

    if (!res.ok) return null
    const html = await res.text()

    // Very naive: look for something that looks like a price (xx,xx €) in a "price" container.
    const priceContainer = html.match(/<(?:span|div)[^>]*(?:price|amount)[^>]*>([\s\S]{0,200}?<\/(?:span|div)>)/i)
    const segment = priceContainer ? priceContainer[1] : html
    const priceMatch = segment.match(/(\d{1,4}[.,]\d{2}\s*€)/)
    if (priceMatch && priceMatch[1]) {
        return priceMatch[1].replace(/\s+/g, ' ').trim()
    }

    return null
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
    }

    try {
        const hostname = new URL(url).hostname.toLowerCase()
        let price: string | null = null

        if (hostname.includes('amazon.')) {
            price = await scrapeAmazonPrice(url)
        } else {
            // Fallback heuristic for other shops
            price = await scrapeGenericPrice(url)
        }

        if (!price) {
            return NextResponse.json(
                {
                    ok: false,
                    url,
                    price: null,
                    message: 'Kein Preis im HTML gefunden – Markup des Shops hat sich vermutlich geändert.',
                },
                { status: 404 },
            )
        }

        return NextResponse.json(
            {
                ok: true,
                url,
                price,
            },
            { status: 200 },
        )
    } catch (error) {
        console.error('Error while scraping vendor price', error)
        return NextResponse.json(
            {
                ok: false,
                url,
                price: null,
                message: 'Fehler beim Abrufen des Preises',
            },
            { status: 500 },
        )
    }
}



