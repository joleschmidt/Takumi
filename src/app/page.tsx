import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Hammer, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-stone-100 dark:bg-stone-900">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/hero-banner-alt2.jpg" 
            alt="Japanischer Garten mit Teich" 
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-stone-900/50 dark:bg-stone-900/70" />
        </div>
        
        <div className="container px-4 md:px-6 relative z-10 py-24 md:py-32">
          <div className="max-w-3xl space-y-6">
            <Badge variant="outline" className="border-white/30 text-white px-4 py-1 text-sm uppercase tracking-wider bg-white/10 backdrop-blur-sm">
              Traditionelle Handwerkskunst
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white">
              Japanische <br />
              <span className="text-white/90 italic">Gartenwerkzeuge</span> <br />
              mit Seele.
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-[600px] leading-relaxed">
              Entdecken Sie Werkzeuge, die nicht nur funktionieren, sondern inspirieren. 
              Handgeschmiedet von Meistern, gemacht für Generationen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="text-base px-8 bg-white text-stone-900 hover:bg-white/90">
                <Link href="/werkzeuge">
                  Kollektion entdecken
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8 border-white/30 text-white hover:bg-white/10">
                <Link href="/ratgeber">
                  Ratgeber lesen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative h-[calc(100vh-4rem)] flex items-center bg-background">
        <div className="container px-4 md:px-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Mehr als nur Werkzeug
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                In Japan ist die Gartenarbeit ("Niwaki") eine spirituelle Praxis. Das Werkzeug ist dabei nicht bloß Mittel zum Zweck, sondern eine Verlängerung der Hand des Gärtners.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Wir bei Takumi glauben, dass gutes Werkzeug die Beziehung zwischen Mensch und Natur vertieft. Deshalb kuratieren wir ausschließlich Produkte, die unseren strengen Kriterien an Qualität, Tradition und Ästhetik genügen.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="flex flex-col gap-2">
                  <Hammer className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-bold">Meisterhandwerk</h3>
                  <p className="text-sm text-muted-foreground">Geschmiedet in traditionellen Familienbetrieben.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Leaf className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-bold">Nachhaltigkeit</h3>
                  <p className="text-sm text-muted-foreground">Langlebige Materialien statt Wegwerfprodukte.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <ShieldCheck className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-bold">Geprüfte Qualität</h3>
                  <p className="text-sm text-muted-foreground">Jedes Werkzeug von Experten getestet.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Heart className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-bold">Leidenschaft</h3>
                  <p className="text-sm text-muted-foreground">Von Gärtnern für Gärtner ausgewählt.</p>
                </div>
              </div>
            </div>
            <div className="relative h-full min-h-[400px] md:min-h-[500px] bg-stone-100 rounded-lg overflow-hidden">
               <Image 
                 src="/images/craftsman-workshop.jpg" 
                 alt="Traditionelle Handwerkskunst in Japan" 
                 fill
                 className="object-cover"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-h-screen py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Kategorien</h2>
              <p className="text-muted-foreground">Finden Sie das perfekte Werkzeug für jede Aufgabe.</p>
            </div>
            <Link href="/werkzeuge" className="hidden md:flex items-center text-primary hover:text-primary/80 font-medium group">
              Alle ansehen <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.title} href={category.href} className="group">
                <Card className="h-full overflow-hidden border-none shadow-none bg-background hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                     <Image 
                       src={category.image} 
                       alt={category.title}
                       fill
                       className="object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif font-bold text-xl mb-2 group-hover:text-primary transition-colors">{category.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 md:hidden text-center">
             <Link href="/werkzeuge" className="inline-flex items-center text-primary font-medium">
              Alle Kategorien ansehen <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Product / Story Teaser */}
      <section className="max-h-screen py-24 bg-stone-900 text-stone-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
             <div className="w-full md:w-1/2 aspect-video bg-stone-800 rounded-lg overflow-hidden relative">
                <Image 
                  src="/images/pruning-shears.jpg" 
                  alt="Okatsune Gartenschere" 
                  fill
                  className="object-cover"
                />
             </div>
             <div className="w-full md:w-1/2 space-y-6">
                <div className="uppercase tracking-widest text-sm text-primary">Im Fokus</div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold">Die Kunst des <br/>Okatsune Schnitts</h2>
                <p className="text-stone-300 text-lg leading-relaxed">
                  Okatsune Scheren aus Hiroshima sind der Goldstandard für japanische Gärtner. 
                  Erfahren Sie, warum der einfache rote und weiße Griff weltweit für unübertroffene Schärfe steht.
                </p>
                <Button asChild className="bg-white text-stone-900 hover:bg-stone-200 mt-4">
                  <Link href="/werkzeuge/scheren-zangen/okatsune-103">
                    Zum Produkt
                  </Link>
                </Button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    title: "Scheren & Zangen",
    description: "Präzise Schnitte für gesunde Pflanzen. Von der feinen Bonsaischere bis zur robusten Astschere.",
    href: "/werkzeuge/scheren-zangen",
    icon: "✂️",
    image: "/images/garden-shears.jpg",
  },
  {
    title: "Sägen & Beile",
    description: "Japanische Zugsägen (Nokogiri) gleiten durch Holz wie durch Butter.",
    href: "/werkzeuge/saegen-beile",
    icon: "🪚",
    image: "/images/artisan-tools.jpg",
  },
  {
    title: "Bodenbearbeitung",
    description: "Das Hori Hori Messer und geschmiedete Hacken für die perfekte Erde.",
    href: "/werkzeuge/bodenbearbeitung",
    icon: "🌱",
    image: "/images/garden-trowel.jpg",
  },
  {
    title: "Pflege & Zubehör",
    description: "Alles für die Werkzeugpflege: Camellia Öl, Schleifsteine und mehr.",
    href: "/werkzeuge/zubehoer",
    icon: "🧼",
    image: "/images/craftsman-workshop.jpg",
  },
];
