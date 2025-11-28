"use client";

export default function TransparenzPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">
      <section className="pt-32 pb-24 px-4 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="border-b border-black pb-8 mb-12">
            <h1 className="text-[10vw] md:text-6xl leading-[0.8] font-oswald font-bold uppercase tracking-tighter">
              Affiliate Transparenz
            </h1>
          </div>

          <div className="prose prose-lg max-w-none space-y-8 text-base leading-relaxed">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Transparenz bei Werbung und Affiliate-Links</h2>
                <p>
                  Wir sind verpflichtet, Ihnen transparent zu machen, wenn wir für die Empfehlung von Produkten oder Dienstleistungen eine Vergütung erhalten. Diese Seite informiert Sie über unsere Affiliate-Partnerschaften und Werbemaßnahmen.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Was sind Affiliate-Links?</h2>
                <p>
                  Affiliate-Links sind spezielle Links, die es uns ermöglichen, eine Provision zu erhalten, wenn Sie über unseren Link ein Produkt kaufen oder eine Dienstleistung in Anspruch nehmen. Für Sie entstehen dabei keine zusätzlichen Kosten. Der Preis des Produkts bleibt für Sie gleich, unabhängig davon, ob Sie über unseren Link oder direkt beim Anbieter kaufen.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Unsere Affiliate-Partner</h2>
                <p>
                  {/* TODO: Bitte listen Sie hier Ihre tatsächlichen Affiliate-Partner auf */}
                  <em>Derzeit verwenden wir keine Affiliate-Links auf dieser Website.</em>
                </p>
                <p className="mt-4">
                  Falls wir in Zukunft Affiliate-Partnerschaften eingehen, werden wir diese hier transparent auflisten, einschließlich:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Name des Affiliate-Partners</li>
                  <li>Art der Partnerschaft</li>
                  <li>Hinweise zu den verlinkten Produkten</li>
                </ul>
                <p className="text-sm text-gray-600 mt-4">
                  <em>Beispiel: "Wir sind Teilnehmer des Partnerprogramms von [Partner-Name], einem Affiliate-Programm, das zur Bereitstellung eines Mediums für Websites konzipiert wurde, mittels dessen durch die Platzierung von Werbeanzeigen und Links zu [Partner-Name] Werbekostenerstattung verdient werden kann."</em>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Kennzeichnung von Affiliate-Links</h2>
                <p>
                  Alle Affiliate-Links auf dieser Website werden entsprechend gekennzeichnet. Dies kann durch:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Einen Hinweis direkt beim Link (z. B. "Affiliate-Link" oder "Werbung")</li>
                  <li>Ein Symbol oder eine Markierung</li>
                  <li>Einen Hinweis im Text</li>
                </ul>
                <p className="mt-4">
                  Wir bemühen uns, alle Affiliate-Links klar und deutlich zu kennzeichnen, damit Sie jederzeit wissen, wenn Sie auf einen solchen Link klicken.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Unabhängigkeit unserer Empfehlungen</h2>
                <p>
                  Wichtig ist uns, dass Sie wissen: Unsere Empfehlungen basieren auf unserer eigenen Einschätzung und Erfahrung. Die Tatsache, dass wir für einen Link eine Provision erhalten können, beeinflusst nicht unsere Meinung über ein Produkt oder eine Dienstleistung. Wir empfehlen nur Produkte, von denen wir überzeugt sind oder die wir selbst getestet haben.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Cookies und Tracking</h2>
                <p>
                  Wenn Sie auf einen Affiliate-Link klicken, wird in der Regel ein Cookie in Ihrem Browser gespeichert. Dieses Cookie ermöglicht es dem Affiliate-Partner zu erkennen, dass Sie von unserer Website gekommen sind. Die Speicherdauer dieser Cookies variiert je nach Partner und kann mehrere Tage bis Wochen betragen.
                </p>
                <p className="mt-4">
                  Weitere Informationen zur Verwendung von Cookies finden Sie in unserer{" "}
                  <a 
                    href="/datenschutz" 
                    className="text-[#6B7F59] hover:underline"
                  >
                    Datenschutzerklärung
                  </a>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Rechtliche Grundlage</h2>
                <p>
                  Diese Transparenzerklärung entspricht den Anforderungen des Telemediengesetzes (TMG) und der Datenschutz-Grundverordnung (DSGVO). Wir sind verpflichtet, Sie über kommerzielle Inhalte und Werbung auf unserer Website zu informieren.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-oswald font-bold uppercase mb-4">Kontakt</h2>
                <p>
                  Wenn Sie Fragen zu unseren Affiliate-Partnerschaften haben, können Sie uns jederzeit kontaktieren. Unsere Kontaktdaten finden Sie im{" "}
                  <a 
                    href="/impressum" 
                    className="text-[#6B7F59] hover:underline"
                  >
                    Impressum
                  </a>.
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-black/10">
                <p className="text-sm text-gray-600">
                  <em>Stand: {new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

