# Chrome Extension Article Importer - Implementation Summary

## ✅ Completed Components

### 1. Supabase Database
- ✅ Created `articles` table with all required fields including `price` and `price_currency`
- ✅ Added indexes for performance
- ✅ Created trigger for automatic `updated_at` timestamp

### 2. Next.js Backend
- ✅ Supabase Client setup (`src/lib/supabase.ts`)
- ✅ Article TypeScript interfaces (`src/lib/article.ts`)
- ✅ Price parsing and normalization functions
- ✅ API Import endpoint (`src/app/api/articles/import/route.ts`)
- ✅ API GET endpoint for articles (`src/app/api/articles/route.ts`)

### 3. Chrome Extension
- ✅ Manifest.json with all required permissions
- ✅ Content script for article extraction (`content.js`)
  - Extracts Open Graph tags
  - Extracts Schema.org JSON-LD data
  - Extracts meta tags
  - **Price extraction from multiple sources:**
    - Schema.org `offers.price` or `price` property
    - Meta tags (`product:price:amount`, `og:price:amount`)
    - Regex patterns in text (€29.99, 29,99 EUR, etc.)
  - Extracts main content
  - Extracts all images
- ✅ Popup UI (`popup.html`, `popup.js`, `styles.css`)
- ✅ Background service worker (`background.js`)

## 📋 Setup Required

### 1. Environment Variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Extension Icons
See `chrome-extension/ICONS.md` for instructions on creating or removing icon requirements.

### 3. Install Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-extension` folder

## 🚀 Usage

1. Start Next.js dev server: `npm run dev`
2. Navigate to any article page in Chrome
3. Click the extension icon
4. Review and edit extracted data (especially price if needed)
5. Click "Importieren" to save to database

## 🔍 Price Extraction Details

The extension extracts prices from multiple sources in priority order:

1. **Schema.org JSON-LD** (highest priority)
   - `Product.offers.price`
   - `Product.price`
   - `Offer.price`

2. **Meta Tags**
   - `product:price:amount`
   - `og:price:amount`

3. **Text Patterns** (fallback)
   - "€29.99", "29,99 EUR", "EUR 29.99"
   - "$29.99", "29.99 USD"
   - Supports EUR, USD, GBP, JPY

## 📁 File Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── content.js            # Article extraction logic
├── popup.html            # Popup UI
├── popup.js              # Popup logic
├── styles.css            # Popup styling
├── background.js         # Service worker
├── README.md             # Extension documentation
├── SETUP.md              # Setup instructions
└── ICONS.md              # Icon creation guide

src/
├── lib/
│   ├── supabase.ts       # Supabase client
│   └── article.ts        # TypeScript interfaces & helpers
└── app/
    └── api/
        └── articles/
            ├── import/
            │   └── route.ts  # POST endpoint
            └── route.ts      # GET endpoint
```

## 🧪 Testing

1. Test on various article pages:
   - News articles
   - Blog posts
   - Product pages (for price extraction)
   - E-commerce pages

2. Verify price extraction:
   - Pages with Schema.org markup
   - Pages with meta tags
   - Pages with prices in text

3. Check database:
   - Articles are saved correctly
   - Prices are parsed correctly
   - Images are stored as URLs
   - Metadata is preserved in JSONB field

## 🔧 Configuration

### Change API URL
The extension defaults to `http://localhost:3000/api/articles/import`. To change:
1. Open Chrome DevTools in the extension popup
2. Use Chrome Storage API or modify `popup.js`

### Production Deployment
Update the API URL in `popup.js` or use Chrome Storage to point to your production API endpoint.

## 📝 Notes

- Images are stored as URLs only (no download)
- Prices are normalized to decimal format
- Currency is stored separately
- Duplicate articles (same `source_url`) are updated, not duplicated
- All metadata is preserved in the `metadata` JSONB field

