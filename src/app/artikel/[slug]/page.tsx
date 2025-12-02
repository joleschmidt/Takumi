import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

// Blog articles data - später aus Supabase
const blogArticles = [
  {
    slug: "bonsai-schnitt-grundlagen",
    title: "Bonsai Schnitt Grundlagen",
    excerpt: "Die Kunst des Bonsai-Schnitts erfordert Geduld, Präzision und das richtige Werkzeug.",
    category: "Bonsai",
    image: "/images/garden-shears.jpg",
    readTime: "8 Min",
    date: "2024-01-15",
    content: `
      <h2>Die Grundlagen des Bonsai-Schnitts</h2>
      <p>Der Bonsai-Schnitt ist eine japanische Kunstform, die jahrhundertelange Tradition und Präzision erfordert. In diesem Artikel lernen Sie die wichtigsten Grundlagen.</p>
      
      <h3>Das richtige Werkzeug</h3>
      <p>Für den Bonsai-Schnitt benötigen Sie spezielle Scheren, die für präzise Schnitte an dünnen Ästen entwickelt wurden. Japanische Bonsai-Scheren wie die Okatsune 103 sind hierfür ideal.</p>
      
      <h3>Schnitttechniken</h3>
      <p>Es gibt verschiedene Schnitttechniken, die je nach Bonsai-Art und gewünschtem Ergebnis angewendet werden. Der strukturelle Schnitt formt die Grundstruktur, während der Erhaltungsschnitt die Form beibehält.</p>
      
      <h3>Timing ist alles</h3>
      <p>Der richtige Zeitpunkt für den Schnitt hängt von der Baumart ab. Laubbäume werden am besten im späten Winter oder frühen Frühling geschnitten, während Nadelbäume im Spätsommer geschnitten werden sollten.</p>
    `
  },
  {
    slug: "japanische-zugsaege",
    title: "Japanische Zugsägen",
    excerpt: "Warum japanische Zugsägen anders sind und wie Sie sie richtig verwenden.",
    category: "Werkzeuge",
    image: "/images/artisan-tools.jpg",
    readTime: "12 Min",
    date: "2024-01-10",
    content: `
      <h2>Die Besonderheit japanischer Zugsägen</h2>
      <p>Japanische Zugsägen unterscheiden sich fundamental von westlichen Sägen. Während westliche Sägen beim Drücken schneiden, schneiden japanische Sägen beim Ziehen.</p>
      
      <h3>Warum beim Ziehen?</h3>
      <p>Das Ziehen ermöglicht dünnere Sägeblätter, die weniger Material entfernen und präzisere Schnitte ermöglichen. Dies ist besonders wichtig bei feinen Arbeiten im Garten.</p>
      
      <h3>Die richtige Technik</h3>
      <p>Beginnen Sie mit leichtem Druck und lassen Sie die Säge die Arbeit machen. Die scharfen Zähne greifen das Holz beim Ziehen perfekt.</p>
    `
  },
  {
    slug: "stahlpflege-und-schleifen",
    title: "Stahlpflege & Schleifen",
    excerpt: "Wie Sie Ihre japanischen Gartenwerkzeuge richtig pflegen und schärfen.",
    category: "Pflege",
    image: "/images/craftsman-workshop.jpg",
    readTime: "15 Min",
    date: "2024-01-05",
    content: `
      <h2>Die Kunst der Werkzeugpflege</h2>
      <p>Japanische Gartenwerkzeuge sind für die Ewigkeit gemacht - wenn sie richtig gepflegt werden. In diesem umfassenden Guide lernen Sie alles über Stahlpflege und Schleifen.</p>
      
      <h3>Schleifsteine wählen</h3>
      <p>Die Wahl des richtigen Schleifsteins ist entscheidend. Japanische Wassersteine bieten die beste Qualität für japanische Stähle.</p>
      
      <h3>Der Schleifprozess</h3>
      <p>Beginnen Sie mit einem groben Stein und arbeiten Sie sich zu feineren Körnungen vor. Der richtige Winkel ist entscheidend für eine scharfe Klinge.</p>
    `
  },
  {
    slug: "niwaki-formgebung",
    title: "Niwaki Formgebung",
    excerpt: "Die japanische Kunst, Bäume zu formen.",
    category: "Niwaki",
    image: "/images/japanese-garden.jpg",
    readTime: "10 Min",
    date: "2024-01-01",
    content: `
      <h2>Die Kunst der Niwaki-Formgebung</h2>
      <p>Niwaki ist die japanische Kunst, Bäume in Gärten zu formen. Im Gegensatz zu Bonsai werden Niwaki direkt im Garten geformt.</p>
      
      <h3>Grundlegende Formen</h3>
      <p>Es gibt verschiedene klassische Formen wie Chokkan (aufrecht), Moyogi (frei aufrecht) und Shakan (geneigt).</p>
    `
  },
  {
    slug: "horihori-messer",
    title: "Das Hori Hori Messer",
    excerpt: "Das vielseitigste Werkzeug im japanischen Garten.",
    category: "Werkzeuge",
    image: "/images/garden-trowel.jpg",
    readTime: "6 Min",
    date: "2023-12-28",
    content: `
      <h2>Das Hori Hori Messer - Ein Alleskönner</h2>
      <p>Das Hori Hori Messer ist eines der vielseitigsten Werkzeuge im japanischen Garten. Es kann graben, schneiden, pflanzen und vieles mehr.</p>
    `
  },
  {
    slug: "carbonstahl-vs-rostfrei",
    title: "Carbonstahl vs. Rostfrei",
    excerpt: "Der ultimative Vergleich zwischen Carbonstahl und rostfreiem Stahl.",
    category: "Wissen",
    image: "/images/blacksmith.jpg",
    readTime: "9 Min",
    date: "2023-12-25",
    content: `
      <h2>Carbonstahl oder Rostfrei?</h2>
      <p>Die Wahl zwischen Carbonstahl und rostfreiem Stahl ist eine der wichtigsten Entscheidungen beim Kauf von Gartenwerkzeugen.</p>
      
      <h3>Carbonstahl</h3>
      <p>Carbonstahl kann extrem scharf geschliffen werden und hält die Schärfe länger. Er benötigt jedoch regelmäßige Pflege, um Rost zu vermeiden.</p>
      
      <h3>Rostfreier Stahl</h3>
      <p>Rostfreier Stahl ist wartungsfreundlicher, erreicht aber selten die Schärfe von hochwertigem Carbonstahl.</p>
    `
  }
];

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const article = blogArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 md:px-8 lg:px-12 bg-[#FAFAF8]">
        <div className="max-w-[1800px] mx-auto w-full">
          
          <Link href="/artikel" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Zurück zu allen Artikeln
          </Link>

          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B7F59] mb-4 block">{article.category}</span>
            <h1 className="text-[10vw] leading-[0.8] font-oswald font-bold uppercase tracking-tighter mb-8">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.readTime} Lesezeit</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="h-[1px] w-full bg-black"></div>
          </div>

          {/* Featured Image */}
          <div className="relative w-full aspect-[21/9] bg-[#F2F0EA] overflow-hidden border-2 border-black mb-16">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 md:px-8 lg:px-12 pb-32 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div 
            className="prose prose-lg max-w-none prose-headings:font-oswald prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-black prose-h2:text-4xl prose-h2:mb-6 prose-h3:text-2xl prose-h3:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 prose-p:mb-6"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </section>

      {/* Related Articles / CTA */}
      <section className="px-4 md:px-8 lg:px-12 py-24 bg-[#F2F0EA]">
        <div className="max-w-[1800px] mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-oswald font-bold uppercase tracking-tighter mb-8">
            Mehr Wissen
          </h2>
          <Link href="/artikel" className="inline-flex items-center gap-2 text-lg font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
            Alle Artikel ansehen
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </section>

    </div>
  );
}

