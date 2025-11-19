export interface Product {
  id: string
  title: string
  originalName?: string
  description: string
  category: string
  slug: string
  priceRange: string
  isNew?: boolean
  features: string[]
  history: string
  usage: string
  care: string
  imageUrl?: string
}

export const products: Product[] = [
  {
    id: "1",
    title: "Okatsune 103 Gartenschere",
    originalName: "Okatsune Sentei Basami 103",
    description: "Die legendäre Gartenschere aus Hiroshima. Geschmiedet aus Izumo Yasugi Stahl, bekannt für extreme Schärfe und einfache Handhabung. Ein Klassiker.",
    category: "scheren-zangen",
    slug: "okatsune-103",
    priceRange: "50€ - 70€",
    isNew: true,
    features: ["Izumo Yasugi Stahl", "Rot-Weiße Griffe für Sichtbarkeit", "Rockwell Härte 60-61"],
    history: "Geschmiedet in Hiroshima nach alter Samurai-Schwert-Tradition.",
    usage: "Allround-Gartenschere für Gehölze bis 25mm Durchmesser.",
    care: "Nach Gebrauch reinigen und ölen. Harz entfernen.",
    imageUrl: "/images/garden-shears.jpg"
  },
  {
    id: "2",
    title: "Niwaki Zugsäge 240mm",
    originalName: "Niwaki Sentei Nokogiri",
    description: "Eine unglaublich effiziente Zugsäge. Der Schnitt erfolgt auf Zug, was das Blatt dünner und den Schnitt präziser macht.",
    category: "saegen-beile",
    slug: "niwaki-zugsaege-240",
    priceRange: "35€ - 50€",
    features: ["Impulsgehärtete Zähne", "Austauschbares Blatt", "Ergonomischer Gummigriff"],
    history: "Japanische Sägen (Nokogiri) schneiden auf Zug, eine Technik, die hunderte Jahre alt ist.",
    usage: "Ideal für Äste bis 10cm. Sauberer Schnitt fördert die Wundheilung.",
    care: "Nicht biegen. Harz regelmäßig entfernen.",
    imageUrl: "/images/artisan-tools.jpg"
  },
  {
    id: "3",
    title: "Hori Hori Grabemesser",
    originalName: "Hori Hori",
    description: "Das ultimative Allzweckwerkzeug. Graben, Sägen, Schneiden, Pflanzen – alles mit einem Werkzeug. Robust und unverwüstlich.",
    category: "bodenbearbeitung",
    slug: "hori-hori-classic",
    priceRange: "25€ - 40€",
    features: ["Beidseitiger Schliff (glatt/gezahnt)", "Durchgehender Erl", "Holzgriff"],
    history: "Ursprünglich von Bonsai-Sammlern verwendet, um Yamadori (Bäume aus der Natur) auszugraben. 'Hori' bedeutet graben.",
    usage: "Pflanzen, Jäten, Wurzeln sägen, Pflanzlöcher graben.",
    care: "Trocken lagern. Holzgriff gelegentlich ölen.",
    imageUrl: "/images/garden-trowel.jpg"
  },
  {
    id: "4",
    title: "Tobisho Hiryu Astschere",
    originalName: "Tobisho Hiryu",
    description: "Handgeschmiedete Astschere der Extraklasse. 'Hiryu' bedeutet fliegender Drache. Eine Schönheit aus Yamagata.",
    category: "scheren-zangen",
    slug: "tobisho-hiryu",
    priceRange: "120€ - 150€",
    features: ["Handgeschmiedeter Carbonstahl", "Verlöteter Griff für Balance", "Einzigartiger 'Klick' beim Schließen"],
    history: "Tobisho ist eine kleine Manufaktur in Yamagata, berühmt für ihre handwerkliche Perfektion.",
    usage: "Präzisionsschnitt für anspruchsvolle Gärtner.",
    care: "Mit Camellia-Öl pflegen. Nur von Hand schärfen.",
    imageUrl: "/images/pruning-shears.jpg"
  },
  {
    id: "5",
    title: "Bambusbesen Groß",
    originalName: "Take-Boki",
    description: "Der klassische Besen für den japanischen Garten. Robust und dennoch sanft zu Moos und Kies.",
    category: "besen-rechen",
    slug: "bambusbesen-gross",
    priceRange: "20€ - 30€",
    features: ["Naturbambus", "Traditionelle Bindung", "Langer Stiel"],
    history: "Seit Jahrhunderten unverändert in Tempelgärten im Einsatz.",
    usage: "Laub von Moosflächen oder Kies fegen.",
    care: "Trocken aufhängen, nicht auf den Borsten stehen lassen.",
    imageUrl: "/images/japanese-garden.jpg"
  }
]

