---
name: Clinical Intelligence Core
colors:
  surface: '#f8fafa'
  surface-dim: '#d8dadb'
  surface-bright: '#f8fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f4'
  surface-container: '#eceeee'
  surface-container-high: '#e6e8e9'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1d'
  on-surface-variant: '#3f484a'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f1'
  outline: '#6f797a'
  outline-variant: '#bfc8ca'
  surface-tint: '#1d6871'
  primary: '#00454c'
  on-primary: '#ffffff'
  primary-container: '#0d5e67'
  on-primary-container: '#92d5df'
  inverse-primary: '#8ed1db'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#60320f'
  on-tertiary: '#ffffff'
  tertiary-container: '#7c4824'
  on-tertiary-container: '#ffbb91'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaeef8'
  primary-fixed-dim: '#8ed1db'
  on-primary-fixed: '#001f23'
  on-primary-fixed-variant: '#004f57'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbc7'
  tertiary-fixed-dim: '#feb78a'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#6b3a17'
  background: '#f8fafa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e3'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-tabular:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 32px
  gutter: 24px
---

## Brand & Style
This design system is anchored in the **Corporate/Modern** aesthetic, prioritizing clarity, clinical precision, and administrative efficiency. The target audience—healthcare administrators and financial officers—requires a high-density information environment that remains calm and navigable. 

The emotional response is one of **unwavering reliability and institutional trust**. By utilizing a restrained color palette and purposeful whitespace, the design system minimizes cognitive load, allowing critical medical and financial data to surface naturally. The visual language avoids decorative elements in favor of functional clarity and structural integrity.

## Colors
The primary palette utilizes a **Deep Teal (#0D5E67)** to establish a sense of modern healthcare authority, bridging the gap between traditional medical blues and progressive technology teals. 

For financial metrics, a high-contrast **Success Emerald** and **Danger Rose** are used to provide immediate status recognition on balance sheets and patient billing modules. The neutral palette is built on a "Slate" scale, using cool grays to maintain a sterile, clean environment. The background is a very light off-white to reduce glare during long periods of use, while surfaces remain pure white to denote active workspace areas.

## Typography
This design system utilizes **Public Sans** for all typographic levels. Chosen for its institutional clarity and excellent legibility in dense data environments, it provides a neutral yet authoritative tone.

A specific **Data Tabular** style is defined for financial columns and patient IDs to ensure vertical alignment of numbers across large tables. Headlines use a tighter letter-spacing to maintain a strong visual anchor, while labels use all-caps with increased tracking for clear categorization of form fields and metadata.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure, allowing the dashboard to scale from tablet views to ultra-wide surgical monitors. 

A strict **4px baseline grid** governs all vertical rhythm. Standard margins are set to 32px to provide breathing room between the navigation sidebar and the primary content area. Information density is managed through three tiered spacing presets: "Compact" for data-heavy tables, "Normal" for standard forms, and "Spacious" for high-level executive summaries.

## Elevation & Depth
Depth is communicated through **Tonal Layering** combined with **Ambient Shadows**. This design system avoids heavy shadows to maintain a clean, clinical look.

- **Level 0 (Background):** The base canvas at #F8FAFC.
- **Level 1 (Cards):** Pure white surfaces with a subtle 1px border (#E2E8F0) and a soft, low-opacity shadow (4px blur, 2% opacity) to signify lift.
- **Level 2 (Dropdowns/Modals):** A more pronounced shadow (12px blur, 8% opacity) to indicate temporary interaction layers.
- **Inner Depth:** Used for input fields to suggest "read-only" or "editable" states through slight inset borders rather than shadows.

## Shapes
The shape language is **Soft (0.25rem)**, striking a balance between the rigid efficiency of sharp corners and the overly casual nature of fully rounded elements. 

Small components like checkboxes and tag badges use the base 4px radius. Larger containers like dashboard cards and modals use the `rounded-lg` (8px) setting to subtly soften the interface. Interaction indicators, such as active states in the sidebar, use a vertical "pill" bar on the left edge rather than rounding the entire container.

## Components
- **Buttons:** Primary buttons use the Deep Teal background with white text. Secondary buttons use a ghost style with a slate border. Danger actions for financial deletions use a subtle red tint background with bold red text.
- **Cards:** The primary container for all dashboard widgets. Every card must include a consistent header with a Title (Title-sm) and optional Action Menu (icon-only).
- **Data Tables:** Highly structured with sticky headers. Row hover states use a very subtle blue tint (#F1F5F9). Success/Danger colors are applied only to the text of financial figures, never the background, to maintain readability.
- **Status Chips:** Small, low-saturation background fills with high-saturation text for "Admitted," "Discharged," or "Pending" states.
- **Input Fields:** Large, clear hit areas with a 1px slate border that thickens and changes to Deep Teal on focus.
- **Progress Indicators:** Linear bars used for budget tracking or patient volume capacity, utilizing the success/danger palette to communicate thresholds.