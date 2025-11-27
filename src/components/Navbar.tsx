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
    title: "Shears & Pliers",
    href: "/werkzeuge/scheren-zangen",
    description: "Precision tools for Bonsai & pruning.",
    image: "/images/garden-shears.jpg"
  },
  {
    title: "Saws & Axes",
    href: "/werkzeuge/saegen-beile",
    description: "Japanese pull saws & hatchets.",
    image: "/images/artisan-tools.jpg"
  },
  {
    title: "Soil Work",
    href: "/werkzeuge/bodenbearbeitung",
    description: "Hori Hori & forged hoes.",
    image: "/images/garden-trowel.jpg"
  },
  {
    title: "Brooms & Rakes",
    href: "/werkzeuge/besen-rechen",
    description: "Traditional bamboo tools.",
    image: "/images/craftsman-workshop.jpg"
  },
]

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-black/10 bg-[#F2F0EA]/90 backdrop-blur-md supports-[backdrop-filter]:bg-[#F2F0EA]/60">
      <div className="container mx-auto flex h-20 items-center px-4 md:px-8">

        {/* Logo */}
        <Link href="/" className="mr-12 flex items-center space-x-2">
          <span className="text-3xl font-oswald font-bold tracking-tighter uppercase text-black">Takumi</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent data-[state=open]:bg-transparent text-black">
                  Collection
                </NavigationMenuTrigger>
                <NavigationMenuContent className="!bg-white border border-black shadow-xl p-0 w-auto min-w-[600px]">
                  <div className="grid grid-cols-2 gap-0 w-[600px] lg:w-[800px]">
                    {tools.map((tool) => (
                      <NavigationMenuLink key={tool.title} asChild>
                        <Link
                          href={tool.href}
                          className="group block select-none space-y-1 p-6 leading-none no-underline outline-none transition-colors hover:bg-black hover:text-white border-b border-r border-gray-100 last:border-b-0 even:border-r-0 h-full relative overflow-hidden"
                        >
                          <div className="flex items-start gap-4 z-10 relative">
                            <div className="w-16 h-16 relative shrink-0 overflow-hidden border border-gray-200 group-hover:border-white/30 transition-colors">
                              <Image
                                src={tool.image}
                                alt={tool.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              />
                            </div>
                            <div>
                              <div className="text-lg font-oswald font-bold uppercase mb-1 text-black group-hover:text-white">{tool.title}</div>
                              <p className="text-sm text-gray-600 leading-snug group-hover:text-gray-300 font-medium">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="absolute top-6 right-6 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white" />
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 text-center border-t border-black">
                    <Link href="/werkzeuge" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:underline">
                      View All Products <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/handwerker" className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent px-4 py-2 hover:underline underline-offset-4 decoration-2 text-black">
                    Artisans
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/ratgeber" className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent px-4 py-2 hover:underline underline-offset-4 decoration-2 text-black">
                    Journal
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/ueber-uns" className="text-sm font-bold uppercase tracking-widest bg-transparent hover:bg-transparent px-4 py-2 hover:underline underline-offset-4 decoration-2 text-black">
                    About
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
              <span className="font-oswald font-bold text-4xl uppercase tracking-tighter">Takumi</span>
            </Link>
            <div className="pr-6">
              <div className="flex flex-col space-y-6">
                <div className="space-y-4 pb-6 border-b border-black">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Collection</p>
                  {tools.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-2xl font-oswald font-bold uppercase hover:text-[#6B7F59] transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                  <Link href="/werkzeuge" className="block text-sm font-bold uppercase tracking-widest pt-2">View All →</Link>
                </div>

                <Link href="/handwerker" className="text-3xl font-oswald font-bold uppercase hover:text-[#6B7F59]">
                  Artisans
                </Link>
                <Link href="/ratgeber" className="text-3xl font-oswald font-bold uppercase hover:text-[#6B7F59]">
                  Journal
                </Link>
                <Link href="/ueber-uns" className="text-3xl font-oswald font-bold uppercase hover:text-[#6B7F59]">
                  About
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
              placeholder="Search..."
              className="pl-8 bg-muted/30 shadow-none border-none focus-visible:ring-0"
            />
          </div>
          <ShoppingBag className="h-6 w-6 cursor-pointer hover:opacity-60 transition-opacity text-black" />
        </div>

      </div>
    </header>
  )
}
