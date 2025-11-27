import Image from "next/image"

export default function HandwerkerPage() {
  return (
    <div className="container px-4 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-oswald font-bold">Die Handwerker</h1>
          <p className="text-xl text-muted-foreground">
            Lernen Sie die Menschen hinter den Werkzeugen kennen. 
            In Kürze stellen wir Ihnen hier die Schmieden und Meister aus Japan vor.
          </p>
          <div className="h-px w-24 bg-primary mx-auto mt-8" />
        </div>
        <div className="relative aspect-video md:aspect-[16/9] rounded-lg overflow-hidden">
          <Image 
            src="/images/blacksmith.jpg" 
            alt="Traditioneller japanischer Schmied bei der Arbeit" 
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  )
}

