# Design Analysis — GameGear Nexus

> **Source of truth:** Canva exports in `design/game gear.zip` (7 PNG files, dated 2026-08-26).  
> **Analysis date:** 2026-09-01  
> **Design canvas:** 1366 px wide (desktop only — no mobile/tablet variants supplied).

---

## 1. Design Inventory

| File | Mapped Page | Dimensions | Purpose |
|------|-------------|------------|---------|
| `1.png` | **Homepage** | 1366 × 4608 | Full scroll landing page — hero, features, categories, banner, contact |
| `2.png` | **Communication Gadgets** | 1366 × 768 | Category landing with sub-category navigation |
| `3.png` | **Entertainment Gadgets** | 1366 × 768 | Category landing with sub-category navigation |
| `4.png` | **Computer Gadgets** | 1366 × 768 | Category landing with sub-category navigation |
| `5.png` | **Wearable Gadgets** | 1366 × 768 | Category landing with sub-category navigation |
| `6.png` | **Photography Gadgets** | 1366 × 768 | Category landing with sub-category navigation |
| `7.png` | **Power & Charging Gadgets** | 1366 × 768 | Category landing with sub-category navigation |

### Expected Pages — Verification

| Expected Page | Confirmed? | Notes |
|---------------|------------|-------|
| Homepage | ✅ Yes | `1.png` — full long-form page |
| Communication Gadgets | ✅ Yes | `2.png` |
| Entertainment Gadgets | ✅ Yes | `3.png` |
| Computer Gadgets | ✅ Yes | `4.png` |
| Wearable Gadgets | ✅ Yes | `5.png` |
| Photography Gadgets | ✅ Yes | `6.png` |
| Power & Charging Gadgets | ✅ Yes | `7.png` (title reads "POWER AND CHARGING GADGETS") |
| Contact | ⚠️ Partial | **Not a standalone page.** Contact is a **section on the homepage** (bottom-left panel). No dedicated contact page design exists. |

### Pages NOT in Designs (gaps)

- Sub-category listing pages (e.g. `/communication/smartphones`)
- Product / review detail pages
- Article / insight pages
- About page
- Search results
- Admin / CMS dashboard
- Mobile or tablet layouts
- Global site header with persistent nav bar
- Footer (only contact panel + image collage on homepage)

---

## 2. Page-by-Page Breakdown

### 2.1 Homepage (`1.png`)

A single long-scroll page with six distinct sections:

#### Section A — Hero / Brand Header
- **Logo:** "GAMEGEAR NEXUS" with hexagonal atomic icon between "GAMEGEAR" and "NEXUS"
- **Tagline:** "DISCOVER. COMPARE. DOMINATE."
- **Left block:** Soft pink/peach background panel
  - Headline: "Next-Gen Gear, Expertly Reviewed."
  - CTA link: "VIEW PROPERTIES" *(likely placeholder — should read "View Reviews" or similar in implementation; flag for stakeholder confirmation)*
- **Right:** Tall smartphone mockup (Polish UI labels visible — decorative only)
- **Background:** Pink desk setup photo (keyboard, mouse, phone)

#### Section B — Three-Column Feature Cards
- **Background:** Deep violet/purple gradient
- **Three cards** with square images + cyan titles:
  1. "On-device and generative AI power" — holographic screen in hand
  2. "Intelligent homes and ecosystems" — RGB gaming setup
  3. "Multi-device ownership and specialization" — audio device knobs
- **Below cards:** Three-column body text over dark low-opacity soundboard background image

#### Section C — "What we are about"
- **Headline:** "What we are about" (large serif)
- **Body paragraph:** Site purpose — product reviews, buying guides, tech news
- **Sub-heading:** "Explore our solutions"
- **Six category cards** (glassmorphism, dark semi-transparent, rounded corners):
  1. Communication gadgets
  2. Entertainment gadgets
  3. Computer gadgets
  4. Wearable gadgets
  5. Photography gadgets
  6. Power and charging gadgets *(offset above main row)*

#### Section D — Intermediate Banner
- **Background:** Grayscale retro tech photo (Dreamcast, controllers, packaging)
- **Overlay text:** "Power up your next-level tech journey with fresh gadget insights, gaming gear reviews, and the smartest picks for modern users."

#### Section E — Contact / Footer
- **Left panel:** Solid purple background
  - "CONTACT US!" headline
  - Phone: `0793510481`
  - Email: `jetagakoi@gmail.com`
  - "SOCIAL" heading + circular cyan icons (Facebook, Twitter, Instagram)
- **Right panel:** 2×4 grid of square tech lifestyle photos

---

### 2.2 Category Pages (`2.png` – `7.png`)

All six category pages share an identical **layout template**:

| Element | Description |
|---------|-------------|
| **Background** | Purple-to-indigo horizontal gradient (left saturated, right darker) |
| **Title** | Large white all-caps serif, top-left |
| **Sub-category nav** | Vertical stack of black pill buttons with white border + white text |
| **Visual area** | Right 60–70% — overlapping image collage with transparency, custom clip paths, layered z-index |

#### Sub-Categories per Page

| Category Page | Sub-Category Buttons |
|---------------|---------------------|
| Communication Gadgets | Smartphones, Tablets, Smartwatches |
| Entertainment Gadgets | TV, Gaming Consoles, Headphones, Speakers |
| Computer Gadgets | Laptops, Desktops, Printers |
| Wearable Gadgets | Fitness trackers, Smart watches, Smart glasses |
| Photography Gadgets | Digital cameras, Action cameras, Drone cameras |
| Power & Charging Gadgets | Chargers, Power banks, Wireless charging pads |

**Note:** Designs show sub-category buttons but no destination page designs. Implementation must define whether these link to filtered product lists, anchor sections, or future sub-category pages.

---

## 3. Shared Sections & Patterns

### Global (cross-page)
- Purple gradient backgrounds
- White serif display typography for headings
- Black pill buttons with white borders
- High-quality tech lifestyle photography
- Layered collage compositions with transparency

### Homepage-only
- Brand logo + tagline
- Hero CTA
- Three-column feature cards
- Category discovery cards ("Explore our solutions")
- Retro-tech banner
- Contact panel + social links + photo grid

### Category template (reusable)
- Category title header
- Vertical sub-category pill navigation
- Image collage hero area

---

## 4. Navigation Structure

```
Homepage (/)
├── Hero
├── Feature highlights
├── Category cards → Category pages
│   ├── /communication-gadgets
│   ├── /entertainment-gadgets
│   ├── /computer-gadgets
│   ├── /wearable-gadgets
│   ├── /photography-gadgets
│   └── /power-charging-gadgets
├── Banner (inline, no link)
└── Contact section (anchor #contact)
```

**Observations:**
- No persistent top navigation bar in any design
- No logo link-back on category pages
- Category cards on homepage are the primary navigation mechanism
- Sub-category pills on category pages have no visible link targets in designs
- Social icons in contact section have no URLs specified

**Recommended addition (not in design):** Minimal sticky header with logo + home link on category pages for usability. Must match visual identity — document as implementation decision requiring approval.

---

## 5. Typography

| Role | Style | Approximate Match | Usage |
|------|-------|-------------------|-------|
| Display / Headings | High-contrast serif, all-caps | Playfair Display, Cinzel, or Bodoni Moda | Page titles, section headings, logo text |
| Body | Clean geometric sans-serif | Inter, Montserrat, or DM Sans | Paragraphs, card descriptions, feature text |
| Buttons / Labels | Serif (category pages) or sans-serif (homepage cards) | Same as display or Inter | Pill buttons, CTA links |
| Accent overlay text | Bold italic sans-serif | — | "iPhone G / NEXT GENERATION CONCEPT" on Communication page |

### Scale (estimated from 1366 px canvas)

| Token | Size (approx) | Weight |
|-------|---------------|--------|
| `text-hero` | 48–64 px | 700 |
| `text-section` | 36–48 px | 700 |
| `text-card-title` | 18–24 px | 600 |
| `text-body` | 14–16 px | 400 |
| `text-button` | 14–16 px | 600 |
| `text-tagline` | 12–14 px | 500, letter-spacing wide |

---

## 6. Color Palette

| Token | Hex (approx) | Usage |
|-------|-------------|-------|
| `purple-900` | `#2D0B5A` | Deepest background |
| `purple-700` | `#6B21A8` | Gradient mid-tone |
| `purple-500` | `#A855F7` | Gradient start (category pages) |
| `indigo-950` | `#0A041A` | Gradient end (right side) |
| `cyan-400` | `#22D3EE` | Accent text, social icon backgrounds |
| `pink-200` | `#FBCFE8` | Hero left panel background |
| `pink-100` | `#FCE7F3` | Hero peach variant |
| `black` | `#000000` | Button fills |
| `white` | `#FFFFFF` | Text, borders |
| `white/20` | `rgba(255,255,255,0.2)` | Glassmorphism card backgrounds |
| `burgundy/80` | `rgba(128,0,32,0.8)` | Wearable page overlay |

### Gradients

```css
/* Category page background */
background: linear-gradient(to right, #A855F7, #4C1D95, #0A041A);

/* Homepage feature section */
background: linear-gradient(to bottom, #6B21A8, #2D0B5A);
```

---

## 7. Spacing System

Design uses an informal 8 px grid. Recommended Tailwind-aligned tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4 px | Tight icon gaps |
| `space-2` | 8 px | Button internal padding |
| `space-4` | 16 px | Card internal padding |
| `space-6` | 24 px | Between stacked buttons |
| `space-8` | 32 px | Section internal gaps |
| `space-12` | 48 px | Between major blocks |
| `space-16` | 64 px | Section vertical padding |
| `space-24` | 96 px | Large section breaks |

**Page max-width:** Content appears full-bleed at 1366 px. Recommend `max-w-7xl` (1280 px) centered with responsive padding for implementation.

---

## 8. Border Radius

| Element | Radius |
|---------|--------|
| Pill buttons | `9999px` (fully rounded) |
| Category cards (homepage) | ~12–16 px |
| Image containers (collage) | ~16–24 px (mixed — some have diagonal clip-path cuts) |
| Glass panels | ~16 px |
| Social icons | `50%` (circle) |
| Large white container (Photography/Power pages) | ~32–48 px top-left and bottom-left |

**Special shapes:** Several collage images use custom `clip-path` with chamfered/diagonal corners (not pure border-radius). These must be recreated with CSS `clip-path` or SVG masks.

---

## 9. Buttons & CTAs

### Pill Button (Category Pages)
```
Background: #000000
Border: 1px solid #FFFFFF
Border-radius: 9999px
Text: white, uppercase serif
Padding: ~12px 32px
Width: uniform (~200px)
Stack: vertical, ~16px gap
Hover: not specified — recommend subtle white/10 background lift
```

### Text CTA (Homepage Hero)
```
Style: underlined or plain text link
Color: dark on pink background
Label: "VIEW PROPERTIES" (needs content review)
```

### Category Cards (Homepage)
```
Background: rgba(0,0,0,0.4) with backdrop-blur
Border-radius: ~16px
Icon: small, top-right corner
Label: bottom-left, white text
Hover: not specified — recommend scale(1.02) + brightness
```

---

## 10. Cards & Reusable UI Patterns

| Component | Pages | Description |
|-----------|-------|-------------|
| `FeatureCard` | Homepage | Image + cyan title + optional body |
| `CategoryCard` | Homepage | Glassmorphism card with icon + label |
| `PillButton` | Category pages | Black pill with white border |
| `ContactPanel` | Homepage | Purple panel with contact info + socials |
| `PhotoGrid` | Homepage | 2×4 square image grid |
| `BannerSection` | Homepage | Full-width image + centered overlay text |
| `ImageCollage` | Category pages | Layered overlapping images with transparency |
| `SectionHeading` | All | Large serif white heading |
| `BrandLogo` | Homepage | Icon + "GAMEGEAR NEXUS" + tagline |

---

## 11. Images & Graphics

### Homepage
- Hero desk setup (keyboard, mouse, phone on pink surface)
- Smartphone mockup (decorative — replace with brand-appropriate asset)
- Three feature card photos (AI hologram, gaming setup, audio knobs)
- Soundboard background (low-opacity, behind text columns)
- Six category card thumbnail/icon images
- Retro tech banner (Dreamcast, controllers)
- Eight contact section grid photos (cameras, headphones, knobs, etc.)

### Category Pages (unique per page)
Each category page has 3–5 collage images with overlapping composition. These are editorial/mood images, not product catalog shots.

### Logo
- Hexagonal atomic/orbit icon (geometric, line-art style)
- Render as inline SVG for scalability

### Social Icons
- Facebook, Twitter/X, Instagram — circular cyan backgrounds

---

## 12. Background Treatments

| Treatment | Where |
|-----------|-------|
| Solid purple gradient | Category pages, homepage sections |
| Photo with dark overlay | Feature text section (soundboard) |
| Photo with grayscale filter | Retro tech banner |
| Glassmorphism (blur + transparency) | Category cards, collage overlays |
| Soft pink solid | Hero left panel |
| Semi-transparent white panel | Photography/Power page containers |

---

## 13. Gradients

1. **Category page horizontal:** `#A855F7` → `#4C1D95` → `#0A041A`
2. **Homepage feature section vertical:** `#6B21A8` → `#2D0B5A`
3. **Contact panel:** Solid `#6B21A8` or similar (no gradient)

---

## 14. Decorative Elements

- Hexagonal atomic logo icon
- Diagonal clip-path cuts on collage image frames
- Semi-transparent rectangular overlays (maroon, white, grey)
- Cyan glow effect on wireless charger (Power page)
- Vertical text rotation ("NEXT GENERATION CONCEPT")
- Low-opacity background photos behind text

---

## 15. Responsive / Mobile Information

**None provided.** All designs are 1366 px wide desktop layouts.

### Recommended Responsive Strategy (implementation decision)

| Breakpoint | Approach |
|------------|----------|
| `< 768px` | Stack hero vertically; category cards → 1-col; collage → simplified single hero image; pill buttons → full-width stack |
| `768–1024px` | 2-col category cards; simplified collage |
| `> 1024px` | Match design at ~1280–1366 px |

---

## 16. Repeated Components Summary

```
BrandLogo
SiteHeader (recommended, not in design)
HeroSection
FeatureCardGrid
AboutSection
CategoryCardGrid
PromoBanner
ContactSection
  ├── ContactInfo
  ├── SocialLinks
  └── PhotoGrid
CategoryPageLayout (template)
  ├── CategoryTitle
  ├── SubCategoryNav (PillButton[])
  └── ImageCollage
PillButton
SectionHeading
GradientBackground
GlassCard
```

---

## 17. CMS-Managed vs Static Content

### Should be CMS-managed (dynamic)
- Category names, slugs, descriptions, ordering
- Sub-category names, slugs, ordering
- Feature card titles, descriptions, images
- "What we are about" body text
- Banner quote text
- Contact phone, email, social URLs
- Category page collage images
- Photo grid images
- Future: products, reviews, articles

### Can remain static (code-level)
- Layout structure and component composition
- Gradient/color tokens (design system)
- Typography scale
- Logo SVG geometry
- Route definitions
- Animation/transition behavior

### Needs stakeholder confirmation
- Hero CTA text ("VIEW PROPERTIES" appears incorrect)
- Social media profile URLs
- Whether sub-category pills link anywhere yet
- Brand tagline final copy

---

## 18. Accessibility Notes

- Color contrast: white on purple generally passes WCAG AA for large text; verify cyan on purple for small text
- All pill buttons need `:focus-visible` rings
- Collage images should have descriptive `alt` text
- Contact phone/email should be clickable (`tel:`, `mailto:`)
- Social icons need `aria-label`
- Semantic landmarks: `<header>`, `<main>`, `<section>`, `<footer>`
- Skip-to-content link recommended (no design provided)

---

## 19. Asset Extraction Checklist

Before implementation, the following must be sourced:

- [ ] Logo icon as SVG
- [ ] Hero desk photo (high-res, licensed)
- [ ] 3 feature card images
- [ ] 6 category card icons/thumbnails
- [ ] Retro tech banner photo
- [ ] 8 contact grid photos
- [ ] 3–5 collage images per category page (30+ total)
- [ ] Social media icon SVGs
- [ ] Favicon / app icon
- [ ] Open Graph / social share image

**Option:** Extract and optimize from Canva PNGs for initial build; replace with licensed assets before production launch.

---

## 20. Open Questions / Ambiguities

1. **"VIEW PROPERTIES"** — Typo or placeholder? Likely should be "View Reviews" or "Explore Gear".
2. **No mobile designs** — Responsive behavior must be inferred.
3. **No sub-category destination pages** — Scope of Phase 2+ undefined.
4. **No product/review pages** — Site purpose mentions reviews but no detail page designs exist.
5. **No global navigation** — Category pages lack a way back to home in the design.
6. **Contact as section only** — `/contact` route may redirect to `/#contact` or render the same section.
7. **Numbered PNG filenames** — No metadata mapping file from Canva; mapping done by visual inspection.
8. **Duplicate project folder** — Assets originally in `~/Desktop/nexus-gamegear/`, copied to workspace `design/`.
9. **Polish text on phone mockup** — Decorative; replace with English or generic UI.
10. **Social URLs** — Not provided in design.
