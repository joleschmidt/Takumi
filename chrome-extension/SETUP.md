# Setup Instructions

## Environment Variables

Erstellen Sie eine `.env.local` Datei im Root-Verzeichnis des Next.js Projekts:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Extension Icons

Erstellen Sie drei Icon-Dateien im `chrome-extension` Ordner:
- `icon16.png` (16x16 Pixel)
- `icon48.png` (48x48 Pixel)  
- `icon128.png` (128x128 Pixel)

Oder entfernen Sie die Icon-Referenzen aus `manifest.json` für Tests.

## Testing

1. Starten Sie den Next.js Dev Server: `npm run dev`
2. Laden Sie die Extension in Chrome (siehe README.md)
3. Navigieren Sie zu einer Artikel-Seite
4. Klicken Sie auf das Extension-Icon
5. Die extrahierten Daten sollten angezeigt werden

