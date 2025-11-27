import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Takumi - Japanische Gartenwerkzeuge mit Seele",
  description: "Entdecken Sie Handgefertigte japanische Gartenwerkzeuge. Eine kuratierte Auswahl für Enthusiasten, die Qualität und Tradition schätzen.",
};

import { SmoothScroll } from "@/components/SmoothScroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-[#F2F0EA] font-sans antialiased",
        inter.variable,
        oswald.variable
      )}>
        <SmoothScroll>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
