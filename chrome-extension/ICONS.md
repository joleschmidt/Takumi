# Extension Icons

Die Extension benötigt Icons für die Chrome Extension UI. Sie haben drei Optionen:

## Option 1: Platzhalter-Icons erstellen

Erstellen Sie drei einfache PNG-Dateien:
- `icon16.png` (16x16 Pixel)
- `icon48.png` (48x48 Pixel)
- `icon128.png` (128x128 Pixel)

Sie können einfache Icons mit einem Text-Editor oder Online-Tools erstellen.

## Option 2: Manifest anpassen (für Tests)

Entfernen Sie die Icon-Referenzen aus `manifest.json`:

```json
{
  "action": {
    "default_popup": "popup.html"
    // Icon-Referenzen entfernen
  },
  // icons-Sektion entfernen
}
```

Chrome wird dann Standard-Icons verwenden.

## Option 3: Online Icon Generator

Verwenden Sie einen Online Icon Generator wie:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

Generieren Sie Icons und benennen Sie sie entsprechend um.

