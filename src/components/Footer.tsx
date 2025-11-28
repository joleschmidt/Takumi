"use client"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-oswald font-bold uppercase">Takumi</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Traditionelle japanische Gartenwerkzeuge, kuratiert für Enthusiasten, die Handwerkskunst und Langlebigkeit schätzen.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Entdecken</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/werkzeuge" className="hover:text-foreground transition-colors">Alle Werkzeuge</a></li>
              <li><a href="/handwerker" className="hover:text-foreground transition-colors">Die Handwerker</a></li>
              <li><a href="/ratgeber" className="hover:text-foreground transition-colors">Ratgeber & Pflege</a></li>
              <li><a href="/ueber-uns" className="hover:text-foreground transition-colors">Unsere Philosophie</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Kategorien</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/werkzeuge/scheren-zangen" className="hover:text-foreground transition-colors">Scheren & Zangen</a></li>
              <li><a href="/werkzeuge/saegen-beile" className="hover:text-foreground transition-colors">Sägen & Beile</a></li>
              <li><a href="/werkzeuge/bodenbearbeitung" className="hover:text-foreground transition-colors">Bodenbearbeitung</a></li>
              <li><a href="/werkzeuge/besen-rechen" className="hover:text-foreground transition-colors">Besen & Rechen</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a></li>
              <li><a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a></li>
              <li><a href="/transparenz" className="hover:text-foreground transition-colors">Affiliate Transparenz</a></li>
              <li>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).openCookieSettings) {
                      (window as any).openCookieSettings();
                    }
                  }}
                  className="hover:text-foreground transition-colors text-left"
                >
                  Cookie-Einstellungen
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Takumi. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}


