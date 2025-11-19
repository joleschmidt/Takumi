import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center">Über Takumi</h1>
        <div className="relative aspect-video md:aspect-[16/9] rounded-lg overflow-hidden">
          <Image 
            src="/images/japanese-garden.jpg" 
            alt="Japanischer Garten" 
            fill
            className="object-cover"
          />
        </div>
        <div className="prose prose-stone dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            Takumi (匠) bedeutet "Meister" oder "Handwerker" im Japanischen. Es steht für jemanden, der sein Handwerk nicht nur beherrscht, sondern es mit Hingabe und Perfektion ausübt.
          </p>
          <p>
            Unsere Mission ist es, diese Handwerkskunst nach Deutschland zu bringen. Wir sind kein gewöhnlicher Online-Shop, sondern eine Kurationsplattform für Menschen, die den Wert von Qualität verstehen.
          </p>
          <h3>Unsere Werte</h3>
          <ul>
            <li><strong>Authentizität:</strong> Nur echte japanische Werkzeuge.</li>
            <li><strong>Nachhaltigkeit:</strong> Werkzeuge fürs Leben, nicht für eine Saison.</li>
            <li><strong>Bildung:</strong> Wir vermitteln das Wissen zur richtigen Nutzung.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

