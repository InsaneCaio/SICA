# Design System Strategy: The Curated Archive

## 1. Overview & Creative North Star: "The Digital Curator"
The Creative North Star for this design system is **The Digital Curator**. In a world of cluttered medical and data-heavy interfaces, this system acts as a high-end editorial lens—bringing clarity, authority, and breathability to complex information. 

We move beyond the "template" look by rejecting the rigid containment of 1px lines. Instead, we utilize **Tonal Layering** and **Intentional Asymmetry**. By treating the screen as a series of physical, stacked surfaces (like fine vellum or frosted glass), we create a premium environment that feels less like software and more like a prestigious clinical archive. The goal is a "Clinical Precision" that feels human, breathable, and indisputably authoritative.

---

## 2. Colors & Surface Architecture
The palette is rooted in a "Cold-Clean" spectrum, using blue-tinted neutrals to maintain a sterile yet premium clinical feel.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions.

### Surface Hierarchy & Nesting
We define depth by nesting tokens from the Surface palette. This creates a "Logical Stack":
*   **Base Layer:** `surface` (#f7f9fb) – The canvas for the entire application.
*   **Secondary Sectioning:** `surface-container-low` (#f2f4f6) – Used for sidebars, utility bars, or grouping related content.
*   **Prominent Content Cards:** `surface-container-lowest` (#ffffff) – Used for the highest level of information focus, naturally "popping" against the darker base layers without needing a shadow.
*   **The Signature CTA:** Use `primary` (#004786) for high-impact actions, but leverage a subtle linear gradient transitioning into `primary-container` (#005faf) to provide a "liquid" depth that flat buttons lack.

### Glass & Transparency
For overlays, drawers, and modal headers, utilize **Glassmorphism**:
*   **Token:** `surface-container-lowest` at 80% opacity.
*   **Effect:** 16px Backdrop Blur.
*   **Purpose:** This prevents the UI from feeling "blocked off," allowing the clinical context to bleed through the edges of the interaction.

---

## 3. Typography: Editorial Authority
The type system pairs a high-character geometric sans-serif with a hyper-functional neutral for a "Modern Editorial" feel.

*   **Headlines (Manrope):** The voice of the system. Use `display-lg` through `headline-sm` in Manrope. Its wide apertures and modern geometry convey expertise and precision. 
*   **Body & Data (Inter):** The workhorse. Inter is used for all `body` and `label` tokens. Its high x-height ensures readability in dense clinical charts or long-form medical archives.
*   **Hierarchy Note:** Use generous letter-spacing (tracking) for `label-sm` tokens in uppercase to create a "Museum Label" aesthetic for metadata.

---

## 4. Elevation & Depth: The Layering Principle
We do not use elevation to denote "height" in a vacuum; we use it to denote **Physicality**.

*   **Tonal Stacking:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a natural "lift" through contrast alone.
*   **Ambient Shadows:** When a floating element (like a FAB or Popover) is required, use **Cloud Shadows**: `rgba(25, 28, 30, 0.06)` with a 32px to 48px blur. The shadow is never black; it is a soft tint of the `on-surface` color, mimicking laboratory lighting.
*   **The Ghost Border Fallback:** If a container must sit on an identical color (e.g., White on White), use a "Ghost Border": 1px width using `outline-variant` at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons
*   **Primary:** `primary` background, `on-primary` text. 12px corner radius. Use a subtle 4px vertical gradient for a premium sheen.
*   **Secondary:** `surface-container-high` background with `on-surface` text. No border.
*   **Tertiary:** No background. `primary` text weight set to Bold.

### Chips (The Pill)
*   **Styling:** 9999px roundedness.
*   **Usage:** Use `secondary-container` for active states. Chips should feel like tactile physical tabs found in a high-end filing system.

### Cards & Lists
*   **Rule:** Forbid the use of divider lines. 
*   **Alternative:** Separate list items using 8px of vertical white space or by alternating background shades between `surface` and `surface-container-low`.
*   **Cards:** 12px roundedness. Content padding should be generous (24px+) to maintain the "breathable" brand promise.

### Input Fields
*   **Style:** Minimalist. Use `surface-container-highest` as a subtle background fill.
*   **Focus State:** Instead of a thick border, use a 2px "Glow" of `primary-fixed` or a color shift of the background fill.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use extreme white space. If a layout feels "full," it is likely missing the clinical, breathable quality required.
*   **Do** use asymmetrical layouts. A 60/40 split for content and metadata is more "Editorial" than a standard 50/50 grid.
*   **Do** rely on `primary-fixed` (#d4e3ff) for highlighting subtle data points without the aggression of the main `primary` blue.

### Don't
*   **Don't** use pure black (#000000). Use `on-surface` (#191c1e) to maintain the soft-clinical look.
*   **Don't** use standard "drop shadows." If it looks like a shadow from 2015, the blur is too small and the opacity is too high.
*   **Don't** place borders on cards. If the card isn't visible, adjust the background color of the section it sits on.

---

## 7. Signature Elements
To truly separate this system from a standard UI, we implement:
1.  **The Metadata Rail:** A dedicated vertical column using `label-sm` (Inter) for secondary clinical data, separated by white space rather than lines.
2.  **Tonal Progress Bars:** Use `primary-fixed` as the track and `primary` as the indicator—avoiding high-contrast grey tracks to keep the UI feeling integrated and high-end.