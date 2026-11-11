---
name: Wasl Modern Ed
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#4a4455'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#7b7486'
  outline-variant: '#ccc3d7'
  surface-tint: '#7331df'
  primary: '#5300b7'
  on-primary: '#ffffff'
  primary-container: '#6d28d9'
  on-primary-container: '#dac5ff'
  inverse-primary: '#d3bbff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#403f4f'
  on-tertiary: '#ffffff'
  tertiary-container: '#585667'
  on-tertiary-container: '#d0cce0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ebddff'
  primary-fixed-dim: '#d3bbff'
  on-primary-fixed: '#250059'
  on-primary-fixed-variant: '#5b00c5'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#e4e0f5'
  tertiary-fixed-dim: '#c7c4d8'
  on-tertiary-fixed: '#1b1a29'
  on-tertiary-fixed-variant: '#464555'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
  surface-base: '#FFFFFF'
  surface-subtle: '#F8FAFC'
  surface-lavender: '#F5F3FF'
  text-muted: '#64748B'
  text-body: '#334155'
  status-verified: '#10B981'
  status-urgent: '#F59E0B'
  status-alert: '#EF4444'
  border-subtle: '#E2E8F0'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 56px
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 42px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system is engineered for educational matchmaking and talent deployment, tailored to connect three vital educational pillars: Schools, Parents, and Teachers.

### Brand Personality & Emotional Voice
- **Empathetic & Approachable:** Warm, optimistic, and welcoming. Education is deeply communal, so the interface eliminates intimidating institutional barriers while retaining dignity.
- **Trustworthy & Rigorous:** Credential verification, transparent availability, and teacher vetting require an unambiguous air of professional security.
- **Efficient & Purposeful:** Designed for rapid, reliable matching under pressing academic deadlines (such as urgent substitution and school staffing needs).

### Design Movement: Modern Humanist Soft-Tech
The visual identity harmonizes modern clean interfaces with soft, tactile warmth. It combines generous border radii, subtle atmospheric purple tints, crisp typographic contrast, and deliberate role-based iconography. The interface avoids dense enterprise layouts in favor of an open, tripartite structural balance that honors both Arabic (RTL primary) and English (LTR secondary) fluidly.

## Colors

The color palette centers around an authoritative yet warm violet spectrum, paired with pure surfaces and slate neutrals.

### Palette Hierarchy & Intent
- **Primary (`#6D28D9`):** The primary interactive anchor. Used for high-emphasis call-to-action buttons, key brand marks, active selection boundaries, and verified icon emphases.
- **Secondary (`#8B5CF6`):** Secondary interactive accents, focused highlights, hover states, and graphic flourishes.
- **Tertiary (`#EDE9FE`):** Soft lavender wash utilized for card headers, badge backdrops, subtle active tab fills, and hover highlights.
- **Neutral (`#1E293B`):** Deep charcoal slate engineered for high-contrast primary typography and key UI outlines, preventing harsh pitch-black contrast.

### Functional & Semantic Accents
- **Verified (`#10B981`):** Applied exclusively to identity, qualification, and background verification seals, alongside real-time positive availability.
- **Urgent (`#F59E0B`):** Reserved for immediate school staffing shortages, pending matches, and time-sensitive inquiries.
- **Alert (`#EF4444`):** Flags missing compliance, system errors, or application rejections.

Status indicators must never rely on color alone; they must pair color tokens with semantic iconography and localized status text.

## Typography

The typography framework supports dual-script clarity across Arabic and Latin texts. Plus Jakarta Sans handles Latin contexts with soft geometric warmth, pairing naturally with modern Arabic typefaces (such as IBM Plex Sans Arabic or Cairo) in multilingual deployment.

### Structural Typographic Principles
- **Bilingual Proportion & Baselines:** Line-height multipliers are expanded across body and display styles (minimum 1.5x) to prevent vertical clipping of Arabic ascenders and diacritics while preserving clean metrics in English.
- **RTL-First Flow:** All alignments anchor to `start` (`right` in Arabic, `left` in English) to guarantee natural visual balance across viewports.
- **Hierarchy Enactment:**
  - `display-hero` anchors prominent landing value statements.
  - `headline-lg` and `headline-md` identify role categories (Schools, Parents, Teachers) and section blocks.
  - `label-lg` and `label-md` govern buttons, interactive states, and navigational targets.
  - `label-sm` defines pill badges, verification chips, and metadata tags.

## Layout & Spacing

The layout model employs a fluid 12-column grid anchored by a tripartite ("Rule of Three") structural rhythm across key landing pathways and dashboard views.

### Grid Architecture & Breakpoints
- **Desktop (1024px and above):** 12-column layout with 24px (`1.5rem`) gutters and 32px (`2rem`) margins. Tripartite cards (School, Parent, Teacher pathways) span 4 columns each in equal visual weight. A persistent side navigation rail anchors the start boundary.
- **Tablet (768px - 1023px):** 8-column layout with 20px gutters. Pathway elements collapse into a 2-up grid with the primary featured category spanning full width.
- **Mobile (Below 768px):** 4-column layout with 16px (`1rem`) gutters and 16px margins. Multi-column cards reorder into a stacked vertical list. Navigation transitions to an expandable drawer or bottom app bar.

### Spacing Scale
- `space-xs` (4px): Chip internal spacing, badge icon gap.
- `space-sm` (8px): Icon-to-text separation, tight field label gaps.
- `space-md` (16px): Standard form element padding, intra-card element spacing.
- `space-lg` (24px): Card interior container padding, stacked card margins.
- `space-xl` (40px): Section block margins and headline offsets.

## Elevation & Depth

Visual depth is communicated through clean surface-container stacking paired with diffused ambient shadows, avoiding harsh borders or stark artificial skeuomorphism.

### Depth Hierarchy
- **Level 0 (Flat / Canvas):** Applied to the base background (`#F8FAFC` or `#F5F3FF`). Zero elevation.
- **Level 1 (Subtle Cards & Inputs):** Default state for cards, tables, and form fields. Uses an immaculate white surface (`#FFFFFF`), a hairline outline (`1px solid #E2E8F0`), and an ambient shadow: `0px 2px 8px -2px rgba(30, 41, 59, 0.05)`.
- **Level 2 (Hover & Active Pathway Cards):** Triggered on hovering cards and selecting primary roles. The surface elevates with an ambient purple-tinted shadow: `0px 10px 25px -5px rgba(109, 40, 217, 0.12)`, accompanied by a subtle outline transition to `#8B5CF6`.
- **Level 3 (Modals, Overlays & Mobile Drawers):** Floating overlays, filter sheets, and navigation drawers utilize `0px 20px 35px -10px rgba(15, 23, 42, 0.18)` combined with a frosted backdrop (`backdrop-filter: blur(8px); background-color: rgba(15, 23, 42, 0.35)`).

## Shapes

The design system adopts a balanced rounded aesthetic (level 2), blending human warmth with architectural stability.

### Geometry Specifications
- **Cards & Primary Modules:** Standardized to `rounded-xl` (16px / 1rem radius) or `rounded-2xl` (24px / 1.5rem radius) for hero callouts, giving role cards a friendly, touchable presence.
- **Buttons & Form Inputs:** Set to `rounded-md` to `rounded-lg` (8px - 10px) to preserve crisp legibility and clear target bounds.
- **Badges, Tags & Chips:** Full pill geometry (`rounded-full` / 9999px) to establish visual distinction from rectangular structural cards.
- **Avatars & Role Icons:** Squircle geometry (12px radius) for institution profiles, and circular framing for individual teacher avatars.

## Components

### Buttons
- **Primary CTA:** Deep violet fill (`#6D28D9`), pure white text, minimum height 48px, padded with 24px horizontal clearance. Hover state shifts to `#5B21B6` with an elevation increase to Level 2.
- **Secondary CTA:** Subtle lavender tint (`#EDE9FE`) with primary violet label (`#6D28D9`). No border.
- **Outline / Ghost:** Hairline slate border (`#E2E8F0`), body text color (`#334155`), transitioning to violet outline on hover.
- **Urgent Action CTA:** Vibrant amber backdrop (`#F59E0B`) with white text, utilized specifically for immediate substitution prompts.

### Role Selector Cards (Tripartite Model)
- Used for role selection across landing and onboarding screens (School, Parent, Teacher).
- **Structure:** Vertical flex container featuring a dedicated 48px squircle icon container at top-start, bold role title (`headline-sm`), two-line summary (`body-md`), and a trailing action button.
- **Selected State:** Border switches from `#E2E8F0` to a 2px stroke in `#6D28D9`, background lightens to `#F5F3FF`, and an active checkmark badge appears at the top-end corner.

### Chips & Verification Badges
- **Verified Chip:** Emerald green badge (`#10B981` at 10% opacity) with solid emerald icon (shield/checkmark) and `#047857` label (`label-sm`). Rendered only for authenticated degrees and verified identities.
- **Subject / Grade Tag:** Pill-shaped, neutral slate background (`#F1F5F9`), `#475569` text, 6px vertical by 12px horizontal padding.
- **Availability Indicator:** Dual dot-and-text badge. Green dot signifies "Immediate", amber dot denotes "Partial / Scheduled", and gray dot reflects "Booked".

### Input Fields & Selectors
- Background `#FFFFFF`, border `1.5px solid #E2E8F0`, 12px vertical padding, 16px horizontal padding.
- Focus state provides a 3px outer glow ring in `#EDE9FE` with a border transition to `#6D28D9`.
- Input fields support leading or trailing icon placement agnostic of RTL/LTR directionality.

### Progress & Onboarding Bar
- Profile completeness tracking displayed during teacher onboarding.
- 8px height, rounded-full track (`#E2E8F0`) with a smooth gradient fill (`#8B5CF6` to `#6D28D9`) denoting completion percentage, accompanied by explicit text: "65% مكتمل" (65% Complete).

### Empty & Zero States
- Centered container utilizing muted atmospheric illustrations, an informative headline (`headline-sm`), an explanatory description (`body-md`), and a single primary action button to guide first-time users.