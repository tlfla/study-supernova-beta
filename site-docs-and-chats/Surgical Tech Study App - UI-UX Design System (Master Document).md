
_Version 2.0 - Post-Redesign_  
_Last Updated: September 30, 2025_  
_Status: Source of Truth for All Visual & UI Implementation_

---

## Document Purpose

This is the **authoritative reference** for all visual design, UI patterns, and styling decisions in the Surgical Tech Study App. All code implementations must align with this document. When conflicts arise, this document supersedes previous decisions.

---

## 1. Design Philosophy

### Core Principles

1. **Clinical Calm**: Medical-grade clarity without sterility
2. **Purposeful Color**: Color indicates meaning, not decoration
3. **Hierarchy Through Space**: Generous whitespace, not visual noise
4. **Consistent Patterns**: Same interactions work the same everywhere
5. **Mobile-First**: Optimized for studying on-the-go

### Target Feel

- Professional but approachable
- Confident but not intimidating
- Modern but not trendy
- Efficient but not rushed

---

## 2. Color System

### 2.1 Primary Brand Colors

```css
--primary-700: #0D8E83;  /* Dark teal - hover states */
--primary-600: #0FA396;  /* Medium teal - emphasis */
--primary-500: #11B5A4;  /* Main brand color - primary actions */
--primary-400: #3BC6B8;  /* Light teal - accents */
--primary-300: #6ED7CC;  /* Pale teal - backgrounds */
```

**Usage:**

- `primary-500`: Primary buttons, progress bars, active states
- `primary-600`: Headings, important text, icons
- `primary-700`: Hover states on buttons
- `primary-300`: Subtle backgrounds (10-15% opacity)

### 2.2 Semantic Colors

#### Success (Correct Answers)

```css
--success-500: #2DC98A;  /* Bright green - correct indicators */
--success-700: #047857;  /* Dark green - text on light backgrounds */
--correct-answer-bg: rgba(45, 201, 138, 0.15);  /* 15% opacity for backgrounds */
--correct-answer-text: #047857;
```

#### Danger (Wrong Answers, Destructive Actions)

```css
--danger-500: #FF6B6B;   /* Bright red - error indicators */
--danger-700: #B91C1C;   /* Dark red - text */
--wrong-answer-bg: rgba(255, 107, 107, 0.15);  /* 15% opacity for backgrounds */
--wrong-answer-text: #B91C1C;
```

#### Warning

```css
--warning-500: #FFC85C;  /* Amber - caution states */
```

#### Info

```css
--info-500: #38BDF8;     /* Sky blue - informational elements */
```

#### Bookmark

```css
--bookmark-500: #FFB436;  /* Amber fill - active bookmarks */
--bookmark-600: #E2A52F;  /* Darker amber - hover states */
```

### 2.3 Neutral Palette

#### Backgrounds

```css
--bg-base: #F6F8FA;      /* Page backgrounds - soft gray-blue */
--bg-raised: #EEF2F6;    /* Elevated surfaces - slightly darker */
--bg-card: #FAFBFC;      /* Card backgrounds - almost white */
```

#### Text

```css
--text-primary: #0F172A;    /* Main body text - near black */
--text-secondary: #64748B;  /* Supporting text, labels - medium gray */
```

#### Borders & Dividers

```css
--stroke-soft: rgba(15, 23, 42, 0.06);    /* Subtle borders - 6% opacity */
--border-muted: rgba(15, 23, 42, 0.12);   /* Standard borders - 12% opacity */
--border-strong: rgba(15, 23, 42, 0.18);  /* Emphasized borders - 18% opacity */
```

### 2.4 Glassmorphism Effects

```css
--glass-bg: rgba(255, 255, 255, 0.65);
--glass-border: rgba(255, 255, 255, 0.6);
--glass-highlight: rgba(255, 255, 255, 0.35);
```

**Usage:** Bottom tab bar only

### 2.5 Shadows & Elevation

```css
--shadow-raised: 0 6px 16px rgba(15, 23, 42, 0.06);      /* Cards */
--shadow-emphasis: 0 12px 28px rgba(15, 23, 42, 0.12);   /* Hover states */
--shadow-floating: 0 16px 32px rgba(15, 23, 42, 0.16);   /* Modals, overlays */
```

---

## 3. Category Colors

### 3.1 Color Assignments

**23 unique category colors** (exact hex values must match `getCategoryColor()` function):

|Category|Hex|RGB|Visual|
|---|---|---|---|
|Anatomy & Physiology|`#E85D75`|rgb(232, 93, 117)|Pink-Red|
|Microbiology|`#4CAF82`|rgb(76, 175, 130)|Green|
|Pharmacology|`#4A9FE8`|rgb(74, 159, 232)|Blue|
|Sterilization and Decontamination|`#8B7BC7`|rgb(139, 123, 199)|Purple|
|Cardiovascular|`#E85D6B`|rgb(232, 93, 107)|Red|
|General Surgery|`#6B7280`|rgb(107, 114, 128)|Gray|
|Genitourinary|`#F5B947`|rgb(245, 185, 71)|Yellow|
|Neurology|`#5A7C99`|rgb(90, 124, 153)|Slate Blue|
|Ophthalmic|`#FF9F5A`|rgb(255, 159, 90)|Orange|
|Orthopedic|`#5BA3D4`|rgb(91, 163, 212)|Sky Blue|
|Otorhinolaryngology|`#64B5F6`|rgb(100, 181, 246)|Light Blue|
|Peripheral Vascular|`#F08C84`|rgb(240, 140, 132)|Coral|
|Plastics and Reconstructive|`#EDAD5C`|rgb(237, 173, 92)|Gold|
|Obstetrics and Gynecology|`#E88A8A`|rgb(232, 138, 138)|Light Red|
|Preoperative|`#52C9B0`|rgb(82, 201, 176)|Teal|
|Postoperative|`#F4D03F`|rgb(244, 208, 63)|Yellow|
|Professional and Administrative|`#B591D6`|rgb(181, 145, 214)|Lavender|

**Fallback:** `#11B5A4` (primary-500) for unknown categories

### 3.2 Implementation

**Location:** `src/lib/categoryColors.ts` (centralized utility)

```typescript
export function getCategoryColor(category: string, opacity: number = 1): string
```

**Opacity Variants:**

- `1.0` (solid): Text, progress bar fills, solid borders
- `0.15` (15%): Pill backgrounds, subtle highlights
- `0.08` (8%): Card section backgrounds

**Usage:**

- Category pills on question cards
- Progress bars on dashboard/profile
- Section backgrounds in review cards

---

## 4. Typography

### 4.1 Font Family

```css
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 
             BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 
             'Arial', 'Noto Sans', sans-serif;
```

**Inter** loaded via Google Fonts with weights: 400, 500, 600, 700

### 4.2 Type Scale

#### Page Titles

- **Size:** `text-2xl` (24px)
- **Weight:** `font-bold` (700)
- **Color:** `var(--text-primary)`
- **Usage:** Dashboard app title, major page headings

#### Section Headers (H2)

- **Size:** `text-xl` (20px) or `text-lg` (18px)
- **Weight:** `font-semibold` (600) or `font-bold` (700)
- **Color:** `var(--text-primary)`
- **Usage:** Card titles, section dividers

#### Subsection Headers (H3)

- **Size:** `text-lg` (18px)
- **Weight:** `font-bold` (700)
- **Color:** `var(--text-primary)`
- **Usage:** Within cards for content groups

#### Body Text

- **Size:** `text-base` (16px)
- **Weight:** `font-normal` (400)
- **Color:** `var(--text-primary)`
- **Line height:** `leading-relaxed` (1.625)
- **Usage:** Question text, explanations, general content

#### Secondary Text

- **Size:** `text-sm` (14px)
- **Weight:** `font-medium` (500)
- **Color:** `var(--text-secondary)`
- **Usage:** Labels, captions, metadata

#### Small Text

- **Size:** `text-xs` (12px)
- **Weight:** `font-medium` (500) or `font-semibold` (600)
- **Color:** `var(--text-secondary)`
- **Usage:** Category pills, tab labels, tiny indicators

#### Special: Score Display

- **Size:** `text-4xl` (36px)
- **Weight:** `font-bold` (700)
- **Color:** `var(--primary-600)`
- **Usage:** Progress ring percentage

### 4.3 Special Text Treatments

#### Category Pills

```css
text-transform: uppercase;
letter-spacing: 0.05em;
font-size: 12px;
font-weight: 600;
```

#### Monospace (Timers)

```css
font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Courier New', monospace;
font-variant-numeric: tabular-nums;
```

---

## 5. Spacing System

### 5.1 Base Unit: 4px (Tailwind default)

### 5.2 Common Spacing Patterns

#### Card Padding

- **Standard:** `p-6` (24px all sides)
- **Compact:** `p-5` (20px all sides) - Question cards
- **Small:** `p-4` (16px all sides) - Score cards, tight layouts

#### Section Gaps

- **Large:** `mb-6` or `space-y-6` (24px) - Between major sections
- **Medium:** `space-y-4` (16px) - Between related elements
- **Small:** `space-y-3` (12px) - Between form fields, list items

#### Page Containers

- **Horizontal:** `px-4` (16px) - Mobile default
- **Top:** `pt-16` (64px) or `pt-6` (24px) - Depends on header presence
- **Bottom:** `pb-20` (80px) - Clearance for bottom nav

#### Container Max Widths

- **Narrow:** `max-w-2xl` (672px) - Dashboard buttons, focused content
- **Medium:** `max-w-4xl` (896px) - Quiz options, results, profile
- **Wide:** `max-w-7xl` (1280px) - Dashboard, review (multi-column)

---

## 6. Border Radius

- **Small:** `rounded-lg` (8px) - Buttons, inputs
- **Medium:** `rounded-xl` (12px) - Dropdowns, answer options
- **Large:** `rounded-2xl` (16px) - Cards (standard)
- **Full:** `rounded-full` - Pills, progress indicators, avatar shapes

---

## 7. Component Specifications

### 7.1 Buttons

#### Primary Button

```css
Background: var(--primary-500)
Hover: var(--primary-600)
Text: white
Padding: py-3 px-6 (12px/24px)
Border radius: rounded-xl (12px)
Font: text-base font-semibold
Shadow: none (flat design)
Transition: background-color 200ms
```

#### Outline Button

```css
Border: 2px solid var(--primary-500)
Background: transparent
Hover background: var(--primary-500)
Text: var(--primary-600)
Hover text: white
Padding: py-3 px-6
Border radius: rounded-xl
Font: text-base font-semibold
```

#### Destructive Outline Button

```css
Border: 2px solid var(--danger-500)
Background: transparent
Text: var(--danger-700)
Hover background: var(--danger-500)
Hover text: white
```

#### Text Button (Tertiary)

```css
Background: transparent
Text: var(--text-secondary)
Hover background: var(--bg-raised)
Padding: py-3 px-4
No border
```

#### Icon Buttons

```css
Size: 40x40px (p-2 on 24px icon)
Border radius: rounded-lg
Background: transparent
Hover: rgba(17, 181, 164, 0.1)
```

### 7.2 Cards

#### Standard Card

```css
Classes: rounded-2xl border p-6
Background: var(--bg-card)
Border: 1px solid var(--stroke-soft)
Shadow: var(--shadow-raised)
Hover shadow: var(--shadow-emphasis) (optional)
```

#### Emphasized Card

```css
Border: 2px solid var(--border-muted)
Shadow: var(--shadow-emphasis)
```

### 7.3 Form Inputs

#### Text Input / Dropdown

```css
Border: 2px solid var(--border-muted)
Background: white
Padding: py-3 px-4 (12px/16px)
Border radius: rounded-xl
Font: text-base
Height: 48px (auto with padding)
Focus: border-color var(--primary-500), ring-2 ring-primary-500
```

#### Number Input

```css
Same as text input
Text align: center
Font weight: font-semibold
```

#### Search Input

```css
Same as text input
Padding left: pl-10 (40px) - room for icon
Icon: absolute left-3, gray-400
```

### 7.4 Progress Indicators

#### Progress Ring

```css
Size: 120x120px (configurable)
Background stroke: text-gray-200, 8px width
Progress stroke: var(--primary-500), 8px width
Stroke cap: round
Center text: text-4xl font-bold, color var(--primary-600)
```

#### Progress Bar

```css
Height: 2px or 3px
Background: #E5E7EB (gray-200) or var(--bg-raised)
Fill: var(--primary-500)
Transition: width 300ms ease-in-out
```

#### Category Progress Bars

```css
Container: h-3 rounded-full, bg var(--bg-raised)
Fill: h-full rounded-full, bg getCategoryColor(category, 1)
Width: Dynamic percentage
Transition: width 300ms
```

### 7.5 Category Pills/Badges

```css
Padding: px-4 py-1.5 (16px/6px)
Border radius: rounded-full
Background: getCategoryColor(category, 0.15)
Text color: getCategoryColor(category, 1)
Font: text-xs font-semibold uppercase tracking-wide
```

### 7.6 Modals

#### Backdrop

```css
Background: rgba(0, 0, 0, 0.5)
Backdrop filter: blur(4px) - optional
```

#### Modal Container

```css
Background: white
Border radius: rounded-2xl
Shadow: var(--shadow-floating)
Max width: max-w-md
Padding: 0 (children handle padding)
```

#### Modal Header

```css
Padding: p-6
Border bottom: 1px solid var(--stroke-soft)
Title: text-xl font-bold
```

#### Modal Content

```css
Padding: p-6
```

#### Modal Actions

```css
Padding: p-6 (or p-6 pt-0 if no border-top)
Layout: space-y-3 (stacked buttons)
```

---

## 8. Layout Patterns

### 8.1 Global Page Structure

#### All Pages (Except Quiz)

```css
Background: var(--bg-base)
Padding top: pt-16 (64px) - MinimalHeader clearance
Padding bottom: pb-20 (80px) - BottomTabBar clearance
Container: max-w-[varies] mx-auto px-4
```

#### Quiz Page (Full-Screen)

```css
Background: var(--bg-base)
No bottom nav (hidden)
Custom header: 3-layer structure (header/controls/progress)
Padding top: 131px (cumulative header heights)
```

### 8.2 MinimalHeader Component

**Specs:**

```css
Position: fixed top-0 left-0 right-0 z-40
Height: h-14 (56px)
Background: white
Border bottom: 1px solid var(--stroke-soft)
Layout: flex items-center justify-between px-4
Safe area: paddingTop: max(16px, env(safe-area-inset-top))
```

**Elements:**

- **Home button (left):** 24x24px icon, turquoise, 48x48px touch target
- **Title (center):** text-lg font-semibold, absolute centered
- **Action button (right, optional):** Same sizing as home button

### 8.3 BottomTabBar Component

**Specs:**

```css
Position: fixed bottom-0 left-0 right-0 z-50
Height: h-16 (64px)
Background: var(--glass-bg)
Backdrop filter: backdrop-blur-xl
Border top: 1px solid var(--glass-border)
Shadow: 0 -4px 16px rgba(15, 23, 42, 0.04)
Safe area: paddingBottom: max(16px, env(safe-area-inset-bottom))
```

**Tab Buttons:**

```css
Layout: flex flex-col items-center justify-center
Padding: px-4 py-2
Border radius: rounded-xl
Icon: w-6 h-6 (24px)
Label: text-[12px] font-medium, with font-size: max(12px, 1rem)
Active: color var(--primary-600), bg rgba(17, 181, 164, 0.1)
Inactive: color #64748B, bg transparent
Hover (inactive): color var(--primary-500), bg rgba(17, 181, 164, 0.05)
```

**5 Tabs:**

1. Home
2. Quiz
3. Review
4. Study
5. Profile

### 8.4 Quiz Page Layout (3-Layer Header)

**Layer 1: Minimal Header (56px)**

```css
Quit button only (X icon, left side)
```

**Layer 2: Control Bar (57px)**

```css
Background: var(--bg-raised)
Contains: Timer | Question counter | Bookmark button
Layout: flex justify-between, max-w-4xl mx-auto
```

**Layer 3: Progress Bar (8px + 10px spacing = 18px)**

```css
Height: 2px
Background: #E5E7EB
Fill: var(--primary-500)
Dynamic width based on question progress
```

**Total header height:** 131px

---

## 9. Interactive States

### 9.1 Hover States

#### Buttons

- Primary: Darken background to `var(--primary-600)`
- Outline: Fill with `var(--primary-500)`, text white
- Text: Background `var(--bg-raised)`

#### Cards

- Optional: Shadow from `--shadow-raised` to `--shadow-emphasis`

#### Icon Buttons

- Background: `rgba(17, 181, 164, 0.1)`

### 9.2 Active/Selected States

#### Answer Options (Quiz)

- Border: `2px solid var(--primary-500)`
- Background: `rgba(17, 181, 164, 0.1)`
- Letter badge: Background `var(--primary-500)`, text white

#### Bottom Nav Tabs

- Icon/text: `var(--primary-600)`
- Background: `rgba(17, 181, 164, 0.1)`

#### Bookmarks

- Active: Fill with `var(--bookmark-500)`, background tint
- Inactive: Gray outline, transparent fill

### 9.3 Feedback States

#### Correct Answer (After Submission)

- Background: `var(--correct-answer-bg)` (15% opacity green)
- Border left: `4px solid var(--success-500)`
- Text: `var(--correct-answer-text)`
- Icon: Checkmark, green

#### Wrong Answer (After Submission)

- Background: `var(--wrong-answer-bg)` (15% opacity red)
- Border left: `4px solid var(--danger-500)`
- Text: `var(--wrong-answer-text)`
- Icon: X, red
- **Note:** NEVER use solid red fill during quiz

### 9.4 Focus States

```css
outline: none
ring: 2px solid var(--primary-500)
ring-offset: 2px
```

---

## 10. Animation & Transitions

### 10.1 Standard Transitions

```css
transition: all 200ms ease-in-out
```

**Applied to:**

- Button backgrounds
- Border colors
- Text colors
- Hover states

### 10.2 Progress Animations

```css
transition: width 300ms ease-in-out
```

**Applied to:**

- Progress bars
- Category performance bars

### 10.3 Transform Animations

```css
transition: transform 200ms ease-in-out
```

**Applied to:**

- Chevron rotations (expand/collapse)
- Scale effects (optional)

### 10.4 Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Responsive Breakpoints

### 11.1 Tailwind Default Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### 11.2 Mobile-First Approach

- Design for 375px width first (iPhone SE)
- Test at 414px (iPhone Pro Max)
- Expand layout at `md:` breakpoint (768px+)

### 11.3 Common Responsive Patterns

#### Grid Layouts

```css
Mobile: grid-cols-1
Tablet: md:grid-cols-2
Desktop: lg:grid-cols-3 or lg:grid-cols-4
```

#### Container Padding

```css
Mobile: px-4
Desktop: px-6 or px-8
```

#### Font Scaling

```css
Use clamp() for fluid typography:
font-size: clamp(14px, 3.2vw, 16px)
```

---

## 12. iOS 26 Specific Requirements

### 12.1 Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
```

### 12.2 Safe Area Insets

```css
.safe-top { padding-top: max(16px, env(safe-area-inset-top)); }
.safe-bottom { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
.safe-left { padding-left: env(safe-area-inset-left); }
.safe-right { padding-right: env(safe-area-inset-right); }
```

**Applied to:**

- MinimalHeader (top)
- BottomTabBar (bottom, left, right)

### 12.3 Dynamic Viewport Height

```css
min-height: 100dvh (not 100vh)
```

### 12.4 Keyboard Handling

- Use `interactive-widget=resizes-content` primarily
- VisualViewport API for advanced cases
- Bottom nav must not overlay keyboard

---

## 13. Accessibility Requirements

### 13.1 Color Contrast

- **Body text:** Minimum 4.5:1 against background
- **Large text (18px+):** Minimum 3:1
- **UI components:** Minimum 3:1

### 13.2 Touch Targets

- **Minimum size:** 48x48px (including padding)
- **Spacing:** 8px minimum between targets

### 13.3 Focus Indicators

- Always visible on keyboard navigation
- 2px solid ring, primary color
- Never `outline: none` without alternative

### 13.4 Screen Reader Support

- Semantic HTML elements
- `aria-label` on icon-only buttons
- `aria-expanded` on expandable sections
- `role="status"` for dynamic updates

---

## 14. Page-Specific Designs

### 14.1 Dashboard

**Layout:**

1. Study Progress Card (with exam countdown in header)
2. Two action buttons (Start Quiz, Review Missed) - 80% width, stacked
3. Top Categories snippet (3 categories, "View all →" link)

**Key Elements:**

- Progress ring: 120px, turquoise stroke
- Exam countdown: In card header, teal badge
- Category bars: Use actual category colors

### 14.2 Quiz Options

**Layout:**

1. MinimalHeader
2. Single card with form (5 sections)
3. Start Quiz button at bottom

**Form Inputs:**

- All dropdowns: 2px borders, 48px height
- Number input: Centered, semibold
- Quick-pick chips: 10, 20, 30

### 14.3 Active Quiz

**Layout:**

1. 3-layer header (quit | controls | progress)
2. Question card (category pill, question, 4 options)
3. Check Answer button (practice) OR Next button (exam)
4. NO bottom nav

**Key Elements:**

- Category pill ALWAYS visible (both modes)
- Timer in control bar
- Bookmark button in control bar
- Progress bar turquoise
- Answer options: Neutral borders until selected

### 14.4 Results

**Layout:**

1. MinimalHeader
2. "Quiz Complete!" header (text-2xl)
3. 3-column score cards (Correct, Incorrect, Score)
4. Action buttons (Retry, Bookmark All, Review Missed)
5. Question Review section (each question in card)

**Question Review Cards:**

- Show all 4 options
- Green highlight: Correct answer
- Red highlight: User's wrong answer
- Gray: Other options
- Explanation: Blue tinted background

### 14.5 Review

**Layout:**

1. MinimalHeader
2. Filter card (Category, Search)
3. List of bookmarked questions
4. Bottom nav visible

**Question Cards:**

- Show correct answer only (green panel)
- Expandable explanation (blue panel)
- Study links below
- Bookmark toggle (top-right)

### 14.6 Profile

**Layout:**

1. MinimalHeader with Edit button
2. User info card (avatar, name, email, exam date)
3. Preferences card (toggles)
4. Category Performance section
5. Stats card

**Category Performance:**

- All categories listed
- Progress bars use category colors
- Percentage on right

### 14.7 Study

**Layout:**

1. MinimalHeader
2. Subtitle card (description)
3. Filter by category
4. Audio Resources section
5. Medical Terminology section (when ready)

---

## 15. Implementation Rules

### 15.1 Never Hardcode These Values

- ❌ `#64748B` → Use `var(--text-secondary)`
- ❌ `rgba(17, 181, 164, 0.1)` → Use helper function `getPrimaryWithOpacity(0.1)`
- ❌ `bg-gray-50` → Use `style={{ backgroundColor: 'var(--bg-raised)' }}`
- ❌ `border-gray-200` → Use `style={{ borderColor: 'var(--stroke-soft)' }}`

### 15.2 Always Use CSS Variables

```typescript
✅ style={{ backgroundColor: 'var(--primary-500)' }}
✅ style={{ color: 'var(--text-primary)' }}
✅ style={{ borderColor: 'var(--border-muted)' }}
✅ style={{ boxShadow: 'var(--shadow-raised)' }}
```

### 15.3 Category Colors

```typescript
✅ import { getCategoryColor } from '@/lib/categoryColors';
✅ style={{ 
     backgroundColor: getCategoryColor(category, 0.15),
     color: getCategoryColor(category, 1)
   }}
```

### 15.4 Code Organization

- **Shared utility:** `src/lib/categoryColors.ts`
- **CSS variables:** `src/styles/tailwind.css`
- **Components:** `src/components/common/`
- **Pages:** `src/pages/`

---

## 16. Testing Checklist

Before any release, verify:

- [ ] All colors use CSS variables (no hardcoded hex)
- [ ] Category colors render correctly in all contexts
- [ ] Buttons have proper hover states
- [ ] Focus indicators visible on keyboard navigation
- [ ] Touch targets minimum 48x48px
- [ ] Safe areas respected on iOS
- [ ] Bottom nav hidden on quiz page
- [ ] Modal buttons all functional
- [ ] Text contrast meets WCAG AA
- [ ] Mobile responsive at 375px width
- [ ] Animations respect prefers-reduced-motion

---

## 17. Change Log

**Version 2.0 (2025-09-30)**

- Complete CSS variable migration
- Quiz page 3-layer header structure
- Consolidated getCategoryColor() function
- Modal button structure standardized
- iOS 26 safe area implementation
- Header consistency across all pages
- Bottom nav hiding on quiz page

**Version 1.0 (2025-09-25)**

- Initial design system
- Basic color palette
- Component specifications

---

## 18. Future Considerations

**Not Yet Implemented:**

- Dark mode (infrastructure ready, not designed)
- Animation variants for results page
- Haptic feedback patterns
- Advanced accessibility features
- Tablet-optimized layouts (1024px+)

---

_End of Master UI/UX Design System Document_