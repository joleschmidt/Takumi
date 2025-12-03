export interface Article {
  id?: string
  title: string
  content: string
  excerpt?: string
  author?: string
  published_date?: string | Date
  source_url: string
  og_image_url?: string
  category?: string
  price?: number
  price_currency?: string
  metadata?: Record<string, any>
  images?: string[]
  created_at?: string | Date
  updated_at?: string | Date
}

export interface ArticleImportData {
  title: string
  content: string
  excerpt?: string
  author?: string
  published_date?: string
  source_url: string
  og_image_url?: string
  category?: string
  price?: number
  price_currency?: string
  metadata?: Record<string, any>
  images?: string[]
}

/**
 * Parse price from various formats
 * Supports: "€29.99", "29,99 EUR", "EUR 29.99", "$29.99", "29.99 USD", etc.
 */
export function parsePrice(priceString: string | number | undefined): { price: number | null; currency: string } {
  if (!priceString) {
    return { price: null, currency: 'EUR' }
  }

  // If it's already a number, return it
  if (typeof priceString === 'number') {
    return { price: priceString, currency: 'EUR' }
  }

  const str = String(priceString).trim()

  // Currency mapping
  const currencyMap: Record<string, string> = {
    '€': 'EUR',
    'EUR': 'EUR',
    'EURO': 'EUR',
    '$': 'USD',
    'USD': 'USD',
    'US$': 'USD',
    '£': 'GBP',
    'GBP': 'GBP',
    '¥': 'JPY',
    'JPY': 'JPY',
    'JP¥': 'JPY',
  }

  // Try to extract currency and price
  let currency = 'EUR' // default
  let price: number | null = null

  // Pattern 1: Currency symbol/name + number (e.g., "€29.99", "EUR 29.99")
  const pattern1 = /([€$£¥]|EUR|USD|GBP|JPY|EURO|US\$|JP¥)\s*([\d.,]+)/i
  const match1 = str.match(pattern1)
  if (match1) {
    const currencyStr = match1[1].toUpperCase()
    currency = currencyMap[currencyStr] || currencyStr
    const priceStr = match1[2].replace(',', '.')
    price = parseFloat(priceStr)
  }

  // Pattern 2: Number + currency (e.g., "29.99 EUR", "29,99€")
  if (!price) {
    const pattern2 = /([\d.,]+)\s*([€$£¥]|EUR|USD|GBP|JPY|EURO|US\$|JP¥)/i
    const match2 = str.match(pattern2)
    if (match2) {
      const priceStr = match2[1].replace(',', '.')
      price = parseFloat(priceStr)
      const currencyStr = match2[2].toUpperCase()
      currency = currencyMap[currencyStr] || currencyStr
    }
  }

  // Pattern 3: Just a number (assume EUR)
  if (!price) {
    const numberMatch = str.match(/([\d.,]+)/)
    if (numberMatch) {
      const priceStr = numberMatch[1].replace(',', '.')
      price = parseFloat(priceStr)
    }
  }

  return { price, currency }
}

/**
 * Validate article import data
 */
export function validateArticleData(data: ArticleImportData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required')
  }

  if (!data.source_url || !isValidUrl(data.source_url)) {
    errors.push('Valid source_url is required')
  }

  if (data.price !== undefined && data.price !== null && (isNaN(data.price) || data.price < 0)) {
    errors.push('Price must be a valid positive number')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Check if string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Normalize article data before saving
 */
export function normalizeArticleData(data: ArticleImportData): ArticleImportData {
  return {
    ...data,
    title: data.title.trim(),
    content: data.content.trim(),
    excerpt: data.excerpt?.trim() || undefined,
    source_url: data.source_url.trim(),
    price_currency: data.price_currency || 'EUR',
    images: data.images || [],
    metadata: data.metadata || {},
  }
}

