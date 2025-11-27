import Image from "next/image"

export default function RatgeberPage() {
  return (
    <div className="container px-4 py-12 md:py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-oswald font-bold">Ratgeber & Pflege</h1>
          <p className="text-xl text-muted-foreground">
            Erfahren Sie, wie Sie Ihre japanischen Werkzeuge richtig pflegen, schärfen und anwenden.
          </p>
        </div>
        <div className="relative aspect-video md:aspect-[16/9] rounded-lg overflow-hidden">
          <Image 
            src="/images/gardening-tools.jpg" 
            alt="Gartenwerkzeuge für die Pflege" 
            fill
            className="object-cover"
          />
        </div>
        <div className="grid gap-6 mt-12 text-left">
           <div className="border rounded-lg p-6 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-bold text-xl mb-2">Grundlagen der Pflege</h3>
              <p className="text-muted-foreground">Wie Sie Rost vermeiden und die Schärfe erhalten.</p>
           </div>
           <div className="border rounded-lg p-6 hover:bg-muted/30 transition-colors cursor-pointer">
              <h3 className="font-bold text-xl mb-2">Stahlkunde</h3>
              <p className="text-muted-foreground">Der Unterschied zwischen Carbonstahl und rostfreiem Stahl.</p>
           </div>
        </div>
      </div>
    </div>
  )
}

