# DPM Marigot – Design Brainstorm

## Approach A — "Artisan Moderne" (Bauhaus Craft)
<response>
<text>
**Design Movement**: Bauhaus Craft — functional beauty rooted in skilled handwork
**Core Principles**:
1. Asymmetric editorial grid: text blocks offset against full-bleed imagery
2. Generous whitespace to signal premium quality and confidence
3. Strong typographic hierarchy using weight contrast (heavy display / light body)
4. Restrained palette with one bold accent

**Color Philosophy**: Off-white (#F8F6F2) canvas + deep charcoal (#1C1C1E) for authority + a single warm steel-blue (#2563EB) for trust and action. The warmth of the off-white softens the industrial feel and evokes freshly painted walls.

**Layout Paradigm**: Staggered two-column editorial — large image left, text right, alternating per section. Hero uses a split-screen: left half image, right half headline. No full-width centered hero.

**Signature Elements**:
- Thin horizontal rule dividers with section labels in small-caps
- Bold section numbers (01, 02, 03…) in light grey as background texture

**Interaction Philosophy**: Smooth scroll with subtle parallax on hero image. Hover states on cards lift with a 4px shadow. CTA button has a fill-sweep animation.

**Animation**: Fade-up entrance for text blocks on scroll (framer-motion). Hero image has a slow Ken Burns zoom.

**Typography System**: `Playfair Display` (700) for headlines / `DM Sans` (400/500) for body. Headline size: 56px desktop, 36px mobile.
</text>
<probability>0.08</probability>
</response>

---

## Approach B — "Chantier Propre" (Industrial Precision) ← SELECTED
<response>
<text>
**Design Movement**: Industrial Precision — the confidence of a master craftsman's workshop
**Core Principles**:
1. Structured asymmetry: wide left-aligned text columns with image panels breaking the grid
2. Tactile depth: subtle concrete-texture overlays and hard-edged card shadows
3. Purposeful contrast: near-black sections alternate with bright white sections
4. Every CTA is unmissable — high-contrast button with directional arrow

**Color Philosophy**: Pure white (#FFFFFF) + slate-900 (#0F172A) for structure + a vivid slate-blue (#1D4ED8) for trust. A warm amber (#F59E0B) accent for urgency/highlight badges. The combination reads as professional, local, and reliable.

**Layout Paradigm**: Alternating full-width bands (white / dark / white). Hero is left-aligned with a large before/after image panel on the right. Services section uses a 2×2 card grid with icon + title + description. No centered "blob" layouts.

**Signature Elements**:
- Diagonal clip-path dividers between sections (subtle 3° angle)
- Bold numeric counters (stats: +10 avis, 4.5/5) as visual anchors
- Pill-shaped trust badges (✔ Finitions haut de gamme)

**Interaction Philosophy**: Hover on service cards reveals a coloured left-border accent. CTA button has a subtle right-arrow slide animation. Before/after slider is interactive.

**Animation**: Staggered fade-in for service cards. Counter animation for stats. Smooth scroll reveal for testimonials.

**Typography System**: `Sora` (700/800) for headlines / `Inter` (400/500) for body — but used with strong weight contrast and large size differences to avoid the "generic Inter" trap. Headline: 60px / Body: 16px / Small labels: 12px uppercase tracked.
</text>
<probability>0.07</probability>
</response>

---

## Approach C — "Lumière Intérieure" (French Residential Elegance)
<response>
<text>
**Design Movement**: French Residential Elegance — the feeling of a beautifully renovated Parisian apartment
**Core Principles**:
1. Soft, airy aesthetic with generous padding and serif accents
2. Pastel stone tones (#EDE8E0) as background, deep forest green (#1A3A2A) as primary
3. Photography-first: large full-bleed images with minimal text overlay
4. Handwritten-style accent font for warmth

**Color Philosophy**: Stone (#EDE8E0) + Forest green (#1A3A2A) + Gold (#C9A84C). Evokes quality renovation, natural materials, and timeless taste. Warm and reassuring for homeowners.

**Layout Paradigm**: Masonry-style gallery sections. Hero uses a full-bleed image with a frosted glass card overlay for the headline. Services in a horizontal scroll strip on mobile, 4-column grid on desktop.

**Signature Elements**:
- Thin gold underlines on section headings
- Rounded image frames with a soft drop shadow
- Subtle grain texture on stone-coloured backgrounds

**Interaction Philosophy**: Gentle hover zoom on gallery images. Smooth accordion for FAQ. Floating WhatsApp button with pulse animation.

**Animation**: Fade-in from bottom with slight blur for all sections. Hero text has a typewriter reveal effect.

**Typography System**: `Cormorant Garamond` (600) for display / `Nunito Sans` (400) for body. Headline: 52px / Subheading: 22px / Body: 15px.
</text>
<probability>0.06</probability>
</response>
