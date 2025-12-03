# Takumi Design System

## Core Philosophy
"Earned-Led Culture Agency" aesthetic meets Japanese Craftsmanship. High impact, bold typography, high contrast, mixed with the soulfulness of nature and steel. The design emphasizes fluid scrolling, layered sections, and immersive full-viewport experiences.

---

## Typography

### Font Families
- **Headings**: `Oswald` (Google Font) - Variable: `--font-oswald`
  - Usage: Uppercase, Bold (700), Tight tracking (`tracking-tighter` or `tracking-widest`)
  - Scale: Massive for heroes (`text-[12vw]`), Large for sections (`text-6xl` to `text-9xl`)
- **Body**: `Inter` (Google Font) - Variable: `--font-sans`
  - Usage: Clean, legible, often `text-muted-foreground` or high contrast against dark backgrounds

### Typography Scale
- **Hero Text**: `text-[12vw]` with `leading-[0.9]` for ultra-tight spacing
- **Section Headers**: `text-6xl md:text-9xl` with `tracking-tighter`
- **Subheaders**: `text-sm font-bold uppercase tracking-widest text-gray-500`
- **Body Text**: `text-lg md:text-xl` or `text-xl md:text-2xl` for emphasis

---

## Color Palette

### Primary Colors
- **Background Light**: `#F2F0EA` (Premium Beige/Cream) - Primary background
- **Background Dark**: `#1A1A1A` (Deep Black) - Alternate sections
- **Background White**: `#FFFFFF` or `#FAFAF8` - Contrast sections
- **Text Dark**: `#1A1A1A` (Almost Black)
- **Text Light**: `#FAFAF8` (Warm White) - For dark backgrounds

### Accent Colors
- **Moss Green**: `#6B7F59` - Used for emphasis, dots, highlights
- **Red Accent**: `#BC002D` - Used for Japanese character (匠) in logo

### Semantic Colors
- **Borders**: `border-black` or `border-black/10` for subtle dividers
- **Hover States**: `hover:bg-black hover:text-white` for high contrast inversions

---

## Layout & Spacing

### Viewport Height Philosophy
All full-screen sections (except hero and marquee) use:
```tsx
min-h-[calc(100vh-5rem+10vh)]
```
- `100vh`: Full viewport height
- `-5rem`: Subtract navbar height (80px)
- `+10vh`: Add 10% extra for fluid scrolling effect

**Exceptions:**
- **Hero Section**: `sticky top-0 z-0 min-h-screen` (full viewport, sticky)
- **Marquee Section**: `py-8` (compact, no height constraint)
- **Image Containers**: `h-[calc(100vh-5rem+10vh)]` to match section height

### Section Structure Pattern
```tsx
<section className="relative z-10 min-h-[calc(100vh-5rem+10vh)] px-4 md:px-8 lg:px-12 bg-[#F2F0EA] flex items-center">
  <div className="max-w-[1800px] mx-auto w-full">
    {/* content */}
  </div>
</section>
```

### Section Stacking & Overlap
- **Hero**: `sticky top-0 z-0` - Base layer that stays in place
- **Subsequent Sections**: `relative z-10` (or higher) - Slide over hero
- **Background Alternation**: Alternate between `bg-[#F2F0EA]`, `bg-[#1A1A1A]`, `bg-white` to create visual breaks

---

## Component Patterns

### Sticky Hero Section
```tsx
<section className="sticky top-0 z-0 min-h-screen flex flex-col justify-center px-4 md:px-8 lg:px-12 pt-32 bg-[#F2F0EA]">
  {/* Hero content with massive typography */}
</section>
```

### Full-Height Image Sections
```tsx
<section className="relative z-10 min-h-[calc(100vh-5rem+10vh)] flex items-center justify-center overflow-hidden bg-black">
  <Image fill className="object-cover" />
  {/* Overlay content */}
</section>
```

### Split Layout (Text + Image)
```tsx
<section className="relative z-10 min-h-[calc(100vh-5rem+10vh)] px-4 md:px-8 lg:px-12 bg-[#1A1A1A] flex items-center">
  <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
    {/* Text content */}
    <div className="relative w-full h-[calc(100vh-5rem+10vh)] overflow-hidden">
      <Image fill className="object-cover" />
    </div>
  </div>
</section>
```

### Categories Grid (Full-Bleed Images)
```tsx
<section className="relative z-10 bg-white min-h-[calc(100vh-5rem+10vh)]">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
    {categories.map((category) => (
      <Link className="group relative min-h-[50vh] md:min-h-screen flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
        </div>
        {/* Content overlay */}
      </Link>
    ))}
  </div>
</section>
```

---

## Navigation & Dropdown

### Navbar
- **Position**: `fixed top-0 z-50`
- **Background**: `bg-[#F2F0EA]/90 backdrop-blur-md` - Matches hero background
- **Height**: `h-20` (5rem / 80px)
- **Border**: `border-b border-black/10`

### Dropdown Menu (Collection)
- **Container**: `!bg-white border border-black shadow-xl rounded-none`
- **Grid**: `grid grid-cols-2 gap-0` with `border-b border-r border-black`
- **Items**: 
  - Padding: `p-8`
  - Hover: `hover:bg-black hover:text-white`
  - Image: `w-20 h-20 border-2 border-black` with `grayscale group-hover:grayscale-0`
  - Arrow: `opacity-0` to `opacity-100` on hover with slide animation
- **Footer**: `bg-[#F2F0EA] border-t-2 border-black hover:bg-black hover:text-white`

---

## Animation Patterns

### Framer Motion Variants

#### Text Reveal (Slide Up)
```tsx
const revealText = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};
```

#### Stagger Container
```tsx
const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

### Scroll-Triggered Animations
- **Sections**: Use `whileInView` with `viewport={{ once: true, margin: "-100px" }}`
- **Fade In**: `initial={{ opacity: 0, y: 100 }}` to `whileInView={{ opacity: 1, y: 0 }}`

### Hover Animations
- **Images**: `grayscale` to `grayscale-0` with `scale-105` on hover
- **Arrows**: Rotate from `-45deg` to `0deg` or translate `translate-x-1`
- **Backgrounds**: `bg-white` to `bg-black` with text color inversion
- **Transitions**: `duration-300` to `duration-1000` depending on element

### Smooth Scrolling
- **Library**: Lenis
- **Configuration**: 
  - Default: `duration: 1.2`, `wheelMultiplier: 1`
  - Shop pages: `duration: 0.8`, `wheelMultiplier: 1.2` (snappier)

---

## Image Patterns

### Aspect Ratios
- **Portrait**: `aspect-[4/5]` or `aspect-[3/4]`
- **Landscape**: `aspect-[16/9]` or natural aspect
- **Full Height**: `h-[calc(100vh-5rem+10vh)]` with `object-cover`

### Image Effects
- **Grayscale on Default**: `grayscale group-hover:grayscale-0`
- **Scale on Hover**: `group-hover:scale-105 transition-transform duration-1000`
- **Overlay**: `bg-black/30 group-hover:bg-black/10` for text readability

---

## Responsive Breakpoints

### Standard Tailwind Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Common Patterns
- **Padding**: `px-4 md:px-8 lg:px-12`
- **Text Size**: `text-6xl md:text-9xl`
- **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Height**: `min-h-[50vh] md:min-h-screen`

---

## Component Examples

### Section Header
```tsx
<p className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-8">
  Section Label
</p>
```

### Massive Hero Headline
```tsx
<h1 className="text-[12vw] leading-[0.9] font-oswald font-bold uppercase tracking-tighter text-black">
  Japanese Garden Tools
</h1>
```

### Section Title
```tsx
<h2 className="text-6xl md:text-9xl font-oswald font-bold uppercase tracking-tighter leading-none mb-16">
  We Are Takumi
</h2>
```

### Button/Link Style
```tsx
<Link href="/path" className="group flex items-center gap-2 text-lg font-bold uppercase tracking-wider hover:opacity-60 transition-opacity">
  Explore Collection
  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
</Link>
```

### Marquee Section
```tsx
<motion.section className="relative z-10 py-8 bg-[#1A1A1A] text-[#FAFAF8] overflow-hidden whitespace-nowrap">
  <motion.div
    animate={{ x: ["0%", "-50%"] }}
    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
    className="flex items-center gap-12 text-4xl md:text-6xl font-oswald font-bold uppercase tracking-widest"
  >
    {/* Content */}
  </motion.div>
</motion.section>
```

---

## Design Principles

1. **Full Viewport Immersion**: Every major section should feel like a complete experience
2. **Layered Depth**: Use sticky positioning and z-index to create overlapping sections
3. **High Contrast**: Bold black/white with minimal gray for maximum impact
4. **Fluid Motion**: Smooth scrolling with natural section transitions
5. **Brutalist Grids**: Sharp edges, visible borders, no rounded corners (except specific cases)
6. **Typography First**: Let massive, bold text be the hero
7. **Grayscale to Color**: Images start muted, reveal color on interaction
8. **Alternating Backgrounds**: Prevent monotony with light/dark/white alternation

---

## Implementation Notes

- **Navbar Height**: Always account for `5rem` (80px) when calculating viewport heights
- **Container Width**: Use `max-w-[1800px] mx-auto` for content containers
- **Section Padding**: Standard `px-4 md:px-8 lg:px-12` for horizontal spacing
- **Z-Index Hierarchy**: Hero (z-0) → Sections (z-10) → Navbar (z-50)
- **Smooth Scroll**: Wrap entire app in `SmoothScroll` component for Lenis integration

---

## Marquee Section (Scroll-Driven Animation)

### Implementation
The marquee section uses scroll-driven animation instead of automatic looping:

```tsx
const { scrollYProgress } = useScroll();
const xTranslation = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

<motion.div
  style={{ x: xTranslation }}
  className="flex items-center gap-12 text-4xl md:text-6xl font-oswald font-bold uppercase tracking-widest w-fit"
>
  {/* Content */}
</motion.div>
```

### Bullet Point Alignment
Bullet points (●) must be vertically centered with text:
- Use `flex items-center justify-center` with `transform: translateY(-0.25em)`
- Color: `text-[#6B7F59]` (Moss Green)
- No drag functionality - purely scroll-driven

---

## Product Grid Patterns

### Product Card Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-black/10">
  {products.map((product) => (
    <div className="-ml-[1px] -mt-[1px]">
      <ProductCard {...product} />
    </div>
  ))}
</div>
```

### Category Grid
- Use `border-t border-l border-black/10` on container
- Use `-ml-[1px] -mt-[1px]` on items to prevent double borders
- Hover states: `hover:bg-black hover:text-white` for high contrast

---

## Form & Input Patterns

### Search Input
```tsx
<Input
  type="text"
  placeholder="Suchen..."
  className="pl-8 bg-muted/30 shadow-none border-none focus-visible:ring-0"
/>
```
- **NO shadow** - plain style
- **NO border** - minimal appearance
- Background: `bg-muted/30`

---

## Error States & Empty States

### Empty Product Grid
```tsx
<div className="py-32 text-center border border-black/10 bg-[#F5F5F0]">
  <h3 className="font-oswald text-2xl uppercase mb-2">Keine Werkzeuge gefunden</h3>
  <p className="text-gray-500">Diese Kollektion wird derzeit kuratiert.</p>
</div>
```

---

## Accessibility Considerations

- **Text Contrast**: Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- **Focus States**: Use `focus-visible:ring-[3px]` for keyboard navigation
- **Alt Text**: Always provide descriptive alt text for images
- **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)

---

## Performance Optimization

- **Image Loading**: Use `priority` prop for above-the-fold images
- **Lazy Loading**: Use Next.js Image component with default lazy loading
- **Animation Performance**: Use `transform` and `opacity` for animations (GPU-accelerated)
- **Smooth Scroll**: Lenis provides optimized smooth scrolling

---

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **CSS Features**: Uses modern CSS (calc, viewport units, backdrop-filter)
- **JavaScript**: Requires ES6+ support (Next.js handles transpilation)

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Home page with hero, marquee, categories
│   ├── layout.tsx            # Root layout with fonts and SmoothScroll
│   ├── globals.css           # Global styles and CSS variables
│   └── [routes]/             # Page routes
├── components/
│   ├── Navbar.tsx            # Navigation with dropdown
│   ├── Footer.tsx             # Footer component
│   ├── ProductCard.tsx        # Product card component
│   └── SmoothScroll.tsx       # Lenis smooth scroll wrapper
└── lib/
    ├── data.ts               # Product data
    └── utils.ts              # Utility functions
```

---

## Quick Reference

### Color Hex Codes
- `#F2F0EA` - Light Background (Premium Beige/Cream)
- `#1A1A1A` - Dark Background (Deep Black)
- `#6B7F59` - Moss Green (Accent)
- `#BC002D` - Red Accent (Logo character only)
- `#FAFAF8` - Warm White (Text on dark)

### Font Classes
- `font-oswald` - Headings (Oswald)
- `font-sans` - Body text (Inter)

### Common Utilities
- `leading-none` - Remove line height
- `tracking-tighter` - Tight letter spacing
- `tracking-widest` - Wide letter spacing
- `uppercase` - Uppercase text
- `rounded-none` - No border radius (brutalist)

### Border Patterns
- `border-2 border-black` - Brutalist 2px borders
- `border-b-2 border-r-2 border-black` - Grid borders (no overlaps)
- `border-black/10` - Subtle dividers
