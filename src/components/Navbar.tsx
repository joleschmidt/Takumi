"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag } from "lucide-react"

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
    description: "Präzisionswerkzeuge für Bonsai, Ikebana und Formschnitt.",
  },
  {
    title: "Sägen & Beile",
    href: "/werkzeuge/saegen-beile",
    description: "Scharfe japanische Zugsägen und handgeschmiedete Beile.",
  },
  {
    title: "Bodenbearbeitung",
    href: "/werkzeuge/bodenbearbeitung",
    description: "Hori Hori, Hacken und Sicheln für die perfekte Beetpflege.",
  },
  {
    title: "Besen & Rechen",
    href: "/werkzeuge/besen-rechen",
    description: "Traditionelle Bambusbesen und Rechen für Zen-Gärten.",
  },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold tracking-tight">Takumi</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Werkzeuge</NavigationMenuTrigger>
                <NavigationMenuContent className="!bg-white border border-border shadow-lg">
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    {tools.map((tool) => (
                      <ListItem
                        key={tool.title}
                        title={tool.title}
                        href={tool.href}
                      >
                        {tool.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/handwerker" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Handwerker
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/ratgeber" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Ratgeber
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/ueber-uns" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Über Uns
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menü öffnen</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <span className="font-serif font-bold text-2xl">Takumi</span>
            </Link>
            <div className="my-4 pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {tools.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link href="/handwerker" className="text-muted-foreground hover:text-foreground">
                  Handwerker
                </Link>
                <Link href="/ratgeber" className="text-muted-foreground hover:text-foreground">
                  Ratgeber
                </Link>
                <Link href="/ueber-uns" className="text-muted-foreground hover:text-foreground">
                  Über Uns
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Suche..."
                className="pl-8 md:w-[300px] lg:w-[300px] bg-muted/50"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-foreground/70">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

