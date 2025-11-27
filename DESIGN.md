# Takumi Design System

## Core Philosophy
"Earned-Led Culture Agency" aesthetic meets Japanese Craftsmanship. High impact, bold typography, high contrast, mixed with the soulfulness of nature and steel.

## Typography
- **Headings**: `Oswald` (Google Font).
  - Usage: Uppercase, Bold (700), Tight tracking (`tracking-tighter` or `tracking-widest`).
  - Scale: Massive for heroes (`text-[10vw]`), Large for sections (`text-6xl`).
- **Body**: `Inter` (Google Font).
  - Usage: Clean, legible, often `text-muted-foreground` or high contrast against dark backgrounds.

## Color Palette
- **Primary Background**: `#FAFAF8` (Warm White) or `#1a1a1a` / `#000000` (Dark/Black).
- **Text**: `#1a1a1a` (Almost Black) or `#FAFAF8` (Warm White).
- **Accent**: `#6B7F59` (Moss Green) - Used sparingly for emphasis dots, rules, or small highlights.
- **Surface**: `#F5F5F0` (Light Gray/Beige) for hover states.

## Layout Patterns
1.  **Typography Hero**: Massive, screen-filling text. Staggered reveals.
2.  **Split Layouts**: 50/50 visual split between bold text/content and full-bleed imagery.
3.  **Grid Lists**: Brutalist grids with visible borders (`border-black`), usually 3-4 columns.
4.  **Marquee**: Infinite scrolling text strips for "hype" factor.

## Animation (Framer Motion)
- **Text Reveal**: Slide up from bottom (`y: "100%"` to `0%`) with masking.
- **Stagger**: Children elements appear with `0.1s` delay.
- **Hover**: 
  - Images: `grayscale` to `color`, or opacity reveal.
  - Links: Arrow rotation (`-45deg` to `0deg`).

## Component Examples

### Section Header
```tsx
<h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">
  Section Label
</h2>
```

### Big Headline
```tsx
<h1 className="text-6xl md:text-8xl font-oswald font-bold uppercase tracking-tighter leading-[0.9]">
  Title Here
</h1>
```

