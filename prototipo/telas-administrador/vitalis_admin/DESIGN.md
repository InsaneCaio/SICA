# Design System Document: The Clinical Precision Framework

## 1. Overview & Creative North Star: "The Curated Clinical Archive"
Healthcare administration is traditionally defined by density and visual clutter. This design system rejects the "spreadsheet-first" mentality. Our Creative North Star is **The Curated Clinical Archive**. 

We move beyond a standard utility app to create an editorial-grade administrative experience. We achieve this through "Breathable Density"—where high-data environments remain legible through intentional white space, sophisticated tonal layering, and high-contrast typography. We break the "template" look by utilizing asymmetrical layouts for dashboard headers and overlapping surface elements that suggest a physical, multi-layered workspace rather than a flat digital screen.

## 2. Colors: Tonal Depth over Structural Lines
We define boundaries through light and shadow, not ink. 

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. You must define visual boundaries solely through background color shifts or subtle tonal transitions. A `surface-container-low` card sitting on a `surface` background provides all the separation a user needs.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of fine paper. 
- **Base:** `surface` (#f7f9fb)
- **Primary Containers:** `surface-container-low` (#f2f4f6) for large layout blocks.
- **Active Elements/Cards:** `surface-container-lowest` (#ffffff) to provide "pop" and focus.
- **Nesting:** When a component lives inside a container, it must shift one tier (e.g., a white `surface-container-lowest` card inside a light grey `surface-container-low` sidebar).

### The "Glass & Gradient" Rule
To elevate the experience:
- **Glassmorphism:** Use for floating navigation or temporary overlays. Apply `surface` at 80% opacity with a 16px backdrop-blur.
- **Signature Textures:** For primary CTAs and high-level metric cards, use a subtle linear gradient from `primary` (#005faf) to `primary_fixed` (#d4e3ff) at a 135-degree angle. This adds "soul" to the data.

## 3. Typography: Editorial Authority
By pairing the geometric stability of **Manrope** for displays with the functional clarity of **Inter**, we create a hierarchy that feels both authoritative and accessible.

- **Display & Headlines (Manrope):** Large, bold, and confident. Use `display-lg` for dashboard summaries to give the data a "hero" feel.
- **Titles & Body (Inter):** High legibility for dense medical records.
- **The Rationale:** Manrope’s wide apertures bring a "Modern Editorial" feel, while Inter’s tall x-height ensures that even `body-sm` (0.75rem) remains legible in complex data tables.

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "heavy" for a sterile healthcare environment. We use **Tonal Layering**.

- **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on a `surface-container-high` background to create a soft, natural lift without a single shadow.
- **Ambient Shadows:** If a floating element (like a Modal) requires a shadow, use a "Cloud Shadow": `box-shadow: 0 12px 40px rgba(25, 28, 30, 0.06);`. The color is a tinted version of `on-surface` (#191c1e), mimicking natural light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in forms, use `outline-variant` at **15% opacity**. Never use 100% opaque borders.

## 5. Components: Administrative Efficiency

### Buttons
- **Primary:** Gradient-filled (`primary` to `primary_fixed_variant`), `md` (0.75rem) corner radius. Focus states use a 2px `surface` gap with a `primary` ring.
- **Tertiary:** No background, no border. Use `primary` text weight 600.

### Input Fields & Forms
- **Modern Inputs:** Use `surface-container-highest` for the input background with a bottom-only "Ghost Border" that expands to a full `primary` stroke on focus.
- **Labels:** Always use `label-md` in `on-surface-variant`. Never hide labels.

### Data Tables & Lists (The Core of Admin)
- **Forbid Dividers:** Do not use horizontal lines between rows. Use alternating row colors (`surface` vs `surface-container-low`) or 16px of vertical padding to create separation.
- **The "Data-Heavy" Layout:** Use `body-sm` for table cells to maximize information density, but ensure headers are `title-sm` to anchor the columns.

### Specific Administrative Components
- **The "Pulse" Badge:** For live patient status, use `tertiary` with a soft 4px glow to indicate real-time updates without alarming the user.
- **Contextual Trays:** Instead of full-page refreshes, use right-aligned slide-out trays (`surface-container-lowest`) with a heavy backdrop-blur on the content behind it.

## 6. Do's and Don'ts

### Do
- **Do** use `9999px` (full) roundedness for chips and status indicators to contrast against the `12px` (md) roundedness of containers.
- **Do** lean into asymmetry. For example, a dashboard header can have a large `display-md` title on the left and a cluster of small `label-sm` metadata on the right.
- **Do** use `primary_container` (#eaf0ff) as a subtle background for highlighted rows in a data table.

### Don't
- **Don't** use pure black (#000000) for text. Use `on-surface` (#191c1e) to maintain a premium, soft-touch feel.
- **Don't** use standard 1px borders to separate the sidebar from the main content. Use a shift from `surface-dim` to `surface`.
- **Don't** overcrowd the screen. Even in data-heavy layouts, ensure a minimum of `24px` (1.5rem) padding around the main content blocks.