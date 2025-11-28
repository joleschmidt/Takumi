"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Search, ShoppingBag, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

const tools = [
  {
    title: "Scheren & Zangen",
    href: "/werkzeuge/scheren-zangen",
    description: "Präzisionswerkzeuge für Bonsai & Schnitt.",
    image: "/images/garden-shears.jpg"
  },
  {
    title: "Sägen & Beile",
    href: "/werkzeuge/saegen-beile",
    description: "Japanische Zugsägen & Beile.",
    image: "/images/artisan-tools.jpg"
  },
  {
    title: "Bodenbearbeitung",
    href: "/werkzeuge/bodenbearbeitung",
    description: "Hori Hori & geschmiedete Hacken.",
    image: "/images/garden-trowel.jpg"
  },
  {
    title: "Besen & Rechen",
    href: "/werkzeuge/besen-rechen",
    description: "Traditionelle Bambuswerkzeuge.",
    image: "/images/craftsman-workshop.jpg"
  },
]

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#F2F0EA]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#F2F0EA]/60">
      <div className="container mx-auto flex h-20 items-center px-4 md:px-8">

        {/* Logo */}
        <Link href="/" className="mr-12 flex items-center space-x-2">
          <span className="text-3xl font-oswald font-bold tracking-tighter uppercase text-black leading-none">Takumi<span className="text-[#BC002D] inline-flex items-center justify-center" style={{ transform: 'translateY(-0.05em)', lineHeight: '1' }}>匠</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent data-[state=open]:bg-transparent text-black">
                  Kollektion
                </NavigationMenuTrigger>
                <NavigationMenuContent className="!bg-white border-2 border-black shadow-xl p-0 w-auto min-w-[600px] rounded-none">
                  <div className="grid grid-cols-2 w-[600px] lg:w-[800px]">
                    {tools.map((tool, index) => {
                      const isFirstRow = index < 2;
                      const isFirstCol = index % 2 === 0;
                      return (
                        <NavigationMenuLink key={tool.title} asChild>
                          <Link
                            href={tool.href}
                            className={cn(
                              "group block select-none p-8 leading-none no-underline outline-none h-full relative bg-white hover:bg-black transition-colors duration-150",
                              isFirstRow && "border-b-2 border-black",
                              isFirstCol && "border-r-2 border-black"
                            )}
                          >
                            <div className="flex items-start gap-4 relative">
                              <div className="w-20 h-20 relative shrink-0 overflow-hidden border-2 border-black group-hover:border-white transition-colors duration-150">
                                <Image
                                  src={tool.image}
                                  alt={tool.title}
                                  fill
                                  sizes="80px"
                                  className="object-cover grayscale group-hover:grayscale-0 transition-filter duration-200"
                                  loading="lazy"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="text-xl font-oswald font-bold uppercase mb-2 text-black group-hover:text-white tracking-tighter transition-colors duration-150">{tool.title}</div>
                                <p className="text-sm text-gray-600 group-hover:text-gray-200 leading-snug font-medium transition-colors duration-150">
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="absolute top-8 right-8 w-6 h-6 text-black group-hover:text-white transition-all duration-150" />
                          </Link>
                        </NavigationMenuLink>
                      );
                    })}
                  </div>
                  <div className="bg-[#F2F0EA] p-6 text-center border-t-2 border-black hover:bg-black group transition-colors duration-150">
                    <Link href="/werkzeuge" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black group-hover:text-white transition-colors duration-150">
                      Alle Produkte ansehen <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/handwerker" className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent px-4 py-2 hover:underline underline-offset-4 decoration-2 text-black">
                    Marken
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/ratgeber" className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent px-4 py-2 hover:underline underline-offset-4 decoration-2 text-black">
                    Magazin
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/ueber-uns" className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent px-4 py-2 hover:underline underline-offset-4 decoration-2 text-black">
                    Über Uns
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-8 w-8" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 w-full border-r-0 bg-[#FAFAF8]">
            <Link href="/" className="flex items-center mb-12">
              <span className="font-oswald font-bold text-4xl uppercase tracking-tighter">Takumi <span className="text-[#BC002D]">匠</span></span>
            </Link>
            <div className="pr-6">
              <div className="flex flex-col space-y-6">
                <div className="space-y-4 pb-6 border-b border-black">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Kollektion</p>
                  {tools.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-2xl font-oswald font-bold uppercase hover:text-[#6B7F59] transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                  <Link href="/werkzeuge" className="block text-sm font-bold uppercase tracking-widest pt-2">Alle Ansehen →</Link>
                </div>

                <Link href="/handwerker" className="text-3xl font-oswald font-bold uppercase hover:text-[#6B7F59]">
                  Marken
                </Link>
                <Link href="/ratgeber" className="text-3xl font-oswald font-bold uppercase hover:text-[#6B7F59]">
                  Magazin
                </Link>
                <Link href="/ueber-uns" className="text-3xl font-oswald font-bold uppercase hover:text-[#6B7F59]">
                  Über Uns
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="hidden md:block relative w-full max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Suchen..."
              className="pl-8 bg-muted/30 shadow-none border-none focus-visible:ring-0"
            />
          </div>
          <ShoppingBag className="h-6 w-6 cursor-pointer hover:opacity-60 transition-opacity text-black" />
        </div>

      </div>
    </header>
  )
}
