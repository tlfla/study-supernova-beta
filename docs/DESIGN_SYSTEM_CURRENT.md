# Current Design System Audit
*Generated: September 30, 2025*  
*Last code change: commit `031b242` on 2025-09-29 20:01:14*  
*Audited by: Comprehensive codebase scan*

---

## 1. CSS Custom Properties

### Location: `src/styles/tailwind.css` (lines 6-53)

All CSS variables are defined in the `:root` selector within `@layer base`.

#### Primary Color Palette
```css
--primary-700: #0D8E83;
--primary-600: #0FA396;
--primary-500: #11B5A4;  /* Main brand color - Turquoise */
--primary-400: #3BC6B8;
--primary-300: #6ED7CC;
```

#### Status Colors
```css
--success-500: #2DC98A;
--success-700: #047857;
--danger-500: #FF6B6B;
--danger-700: #B91C1C;
--warning-500: #FFC85C;
--info-500: #38BDF8;
```

#### Bookmark Colors
```css
--bookmark-500: #FFB436;  /* Amber fill */
--bookmark-600: #E2A52F;  /* Darker amber */
```

#### Neutral Colors (Soft, not harsh black/white)
```css
--bg-base: #F6F8FA;        /* Page backgrounds */
--bg-raised: #EEF2F6;      /* Raised surface backgrounds */
--bg-card: #FAFBFC;        /* Card backgrounds */
--text-primary: #0F172A;   /* Main text color (near-black) */
--text-secondary: #64748B; /* Secondary text (gray) */
```

#### Borders & Strokes
```css
--stroke-soft: rgba(15, 23, 42, 0.06);    /* Very subtle borders */
--border-muted: rgba(15, 23, 42, 0.12);   /* Standard borders */
--border-strong: rgba(15, 23, 42, 0.18);  /* Emphasized borders */
```

#### Glassmorphism Effects
```css
--glass-bg: rgba(255, 255, 255, 0.65);
--glass-border: rgba(255, 255, 255, 0.6);
--glass-highlight: rgba(255, 255, 255, 0.35);
```

#### Elevation Shadows
```css
--shadow-raised: 0 6px 16px rgba(15, 23, 42, 0.06);     /* Cards */
--shadow-emphasis: 0 12px 28px rgba(15, 23, 42, 0.12);  /* Hover states */
--shadow-floating: 0 16px 32px rgba(15, 23, 42, 0.16);  /* Modals */
```

#### Quiz Answer States
```css
--wrong-answer-bg: rgba(255, 107, 107, 0.15);    /* Light red */
--wrong-answer-text: #B91C1C;
--correct-answer-bg: rgba(45, 201, 138, 0.15);   /* Light green */
--correct-answer-text: #047857;
```

### Global Defaults (lines 55-62)
```css
* {
  border-color: var(--border-muted);
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
}
```

---

## 2. Tailwind Configuration

### Location: `tailwind.config.ts`

#### Content Paths
```typescript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

#### Theme Extensions

**Color Aliases** (HSL-based, mostly unused - relies on CSS vars instead):
```typescript
colors: {
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    300: 'hsl(var(--primary-300))',
    400: 'hsl(var(--primary-400))',
    500: 'hsl(var(--primary-500))',
    600: 'hsl(var(--primary-600))',
    700: 'hsl(var(--primary-700))',
  },
  secondary: {
    500: 'hsl(var(--secondary-500))',
  },
  bookmark: {
    500: 'hsl(var(--bookmark-500))',
    600: 'hsl(var(--bookmark-600))',
  },
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  danger: 'hsl(var(--danger))',
  info: 'hsl(var(--info))',
}
```

**Typography**:
```typescript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', ...]
}
```

**Plugins**: None currently configured.

---

## 3. Component Inventory

### 3.1 MinimalHeader
**Location**: `src/components/common/MinimalHeader.tsx`  
**Usage**: Quiz Options, Review, Profile pages

**Current Styling**:
- **Container**: `fixed top-0 left-0 right-0 z-40`
- **Background**: `bg-white`
- **Border**: `border-b` with `borderColor: 'var(--stroke-soft)'`
- **Height**: `h-14` (56px)
- **Padding**: `px-4` + safe-area padding
- **Layout**: Flexbox, space-between

**Title**:
- **Position**: `absolute left-1/2 -translate-x-1/2` (centered)
- **Size**: `text-lg` (18px)
- **Weight**: `font-semibold`
- **Color**: `var(--text-primary)`

**Home Button** (left):
- **Size**: `w-6 h-6` icon
- **Touch target**: `p-3 -ml-3` (48x48px)
- **Color**: `var(--primary-500)`
- **Hover**: `backgroundColor: rgba(17, 181, 164, 0.1)`

**Right Action** (optional):
- **Touch target**: `p-3 -mr-3`

### 3.2 BottomTabBar
**Location**: `src/components/common/BottomTabBar.tsx`  
**Usage**: All pages

**Container**:
- **Position**: `fixed bottom-0 left-0 right-0 z-50`
- **Effect**: `backdrop-blur-xl`
- **Background**: `var(--glass-bg)`
- **Border**: Top border with `var(--glass-border)`
- **Shadow**: `0 -4px 16px rgba(15, 23, 42, 0.04)`
- **Height**: `h-16` (64px)
- **Safe area**: Bottom, left, right padding

**Tabs** (5 total):
```typescript
[
  { path: '/', label: 'Home', icon: Home },
  { path: '/quiz-options', label: 'Quiz', icon: Play },
  { path: '/review', label: 'Review', icon: RotateCcw },
  { path: '/study', label: 'Study', icon: GraduationCap },
  { path: '/profile', label: 'Profile', icon: User }
]
```

**Tab Button Styling**:
- **Layout**: `flex flex-col items-center justify-center`
- **Padding**: `px-4 py-2`
- **Border radius**: `rounded-xl`
- **Active state**:
  - Color: `var(--primary-600)`
  - Background: `rgba(17, 181, 164, 0.1)`
- **Inactive state**:
  - Color: `#64748B` (gray)
  - Background: `transparent`
- **Hover** (inactive):
  - Color: `var(--primary-500)`
  - Background: `rgba(17, 181, 164, 0.05)`

**Icon**: `h-6 w-6` (24px)  
**Label**: 
- Size: `text-[12px]` with `fontSize: max(12px, 1rem)` enforcement
- Weight: `font-medium`

### 3.3 Card Component
**Location**: `src/components/common/Card.tsx`  
**Usage**: All pages (Dashboard, Profile, Review, Quiz Options)

**Base Classes**: `rounded-2xl border p-6`

**Base Styles** (applied via inline style):
```javascript
{
  backgroundColor: 'var(--bg-card)',
  boxShadow: 'var(--shadow-raised)',
  borderColor: 'var(--stroke-soft)'
}
```

**Variants**:
- `default`: Standard card (no additional classes)
- `elevated`: Same as default (no visual difference)
- `outlined`: Adds `border-2` (thicker border)

**Dimensions**:
- Border radius: `rounded-2xl` (16px)
- Padding: `p-6` (24px all sides)
- Border width: `1px` (default), `2px` (outlined)

### 3.4 Button Component
**Location**: `src/components/common/Button.tsx`  
**Usage**: Throughout app

**Base Classes**:
```typescript
'inline-flex items-center justify-center font-medium rounded-lg 
transition-colors duration-200 focus:outline-none focus:ring-2 
focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
```

**Variants**:
- **Primary**: 
  - Background: `bg-primary-500`
  - Hover: `hover:bg-primary-600`
  - Text: `text-white`
  - Focus ring: `focus:ring-primary-500`
  
- **Secondary**:
  - Background: `bg-secondary-500`
  - Hover: `hover:bg-secondary-600`
  - Text: `text-white`
  - Focus ring: `focus:ring-secondary-500`
  
- **Outline**:
  - Border: `border-2 border-primary-500`
  - Text: `text-primary-500`
  - Hover: `hover:bg-primary-500 hover:text-white`
  - Focus ring: `focus:ring-primary-500`

**Size Classes**:
- `sm`: `py-2 px-4 text-sm`
- `md`: `py-3 px-6 text-base` (default)
- `lg`: `py-4 px-8 text-lg`

**Loading State**: Shows spinner + "Loading..." text

### 3.5 Dropdown Component
**Location**: `src/components/common/Dropdown.tsx`  
**Usage**: Quiz Options, Review (filters)

**Trigger Button**:
- **Classes**: `rounded-xl px-3 py-2`
- **Background**: `var(--bg-card)`
- **Border**: `1px solid`
- **Border color**: 
  - Default: `var(--border-muted)`
  - Hover: `var(--border-strong)`
- **Focus**: `focus:ring-2 focus:ring-primary-500`

**Dropdown Menu**:
- **Position**: `absolute z-10 mt-1 w-full`
- **Classes**: `rounded-xl shadow-lg max-h-60 overflow-auto`
- **Background**: `var(--bg-card)`
- **Border**: `1px solid var(--border-muted)`

**Options**:
- **Padding**: `px-4 py-3`
- **Hover**: `hover:bg-gray-50`
- **Selected**: `bg-primary-50 text-primary-600`
- **Disabled**: `opacity-50 cursor-not-allowed`

### 3.6 Modal Component
**Location**: `src/components/common/Modal.tsx`  
**Usage**: Quiz (Save & Exit), Profile (Edit)

**Backdrop**:
- **Background**: `bg-black/40`
- **Effect**: `backdrop-blur-sm`
- **Click**: Closes modal

**Modal Container**:
- **Max width**: `max-w-md`
- **Background**: `bg-white/90`
- **Border**: `border border-border`
- **Classes**: `rounded-xl shadow-lg backdrop-blur-sm`

**Header**:
- **Padding**: `p-6`
- **Border**: `border-b border-border`
- **Title size**: `text-lg font-semibold`
- **Close button**: `p-1 rounded-lg` with hover effects

**Content**: `p-6`

**Actions**: `p-6 pt-0 border-t border-border`

### 3.7 ProgressRing Component
**Location**: `src/components/common/ProgressRing.tsx`  
**Usage**: Dashboard (study progress)

**Container**: Relative positioned div

**SVG**:
- **Size**: Default `120x120px` (configurable)
- **Rotation**: `transform -rotate-90` (starts from top)

**Background Circle**:
- **Stroke**: `currentColor` with `text-gray-200`
- **Stroke width**: Default `8px`

**Progress Circle**:
- **Stroke**: `var(--primary-500)`
- **Stroke width**: Default `8px`
- **Cap**: `strokeLinecap="round"`
- **Animation**: `transition-all duration-300 ease-in-out`

**Center Text**:
- **Position**: `absolute inset-0 flex items-center justify-center`
- **Size**: `text-4xl` (36px)
- **Weight**: `font-bold`
- **Color**: `var(--primary-600)`

### 3.8 Category Pills/Badges
**Location**: Used in Quiz, Review, Results pages

**Standard Styling** (Quiz page example):
```tsx
className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
style={{
  backgroundColor: getCategoryColor(category, 0.15),  // 15% opacity
  color: getCategoryColor(category, 1)
}}
```

**Dimensions**:
- Padding: `px-3 py-1.5` (12px horizontal, 6px vertical)
- Border radius: `rounded-full`
- Text: `text-xs font-semibold uppercase tracking-wide`

---

## 4. Page-Specific Layouts

### 4.1 Dashboard (`/`)
**File**: `src/pages/Dashboard.tsx`

**Page Background**: `style={{ backgroundColor: 'var(--bg-base)' }}`  
**Container**: `max-w-7xl mx-auto px-4 pt-6 pb-20`  
**Header**: None (uses inline app title)  
**Bottom Nav**: Visible

**Structure**:
1. **App Title** (line 103-108):
   - Icon: `BookOpen w-8 h-8` + Text: `text-2xl font-bold`
   - Color: `var(--primary-600)` (icon), `var(--text-primary)` (text)

2. **Study Progress Card** (line 111):
   - Classes: `rounded-2xl border p-6 mb-6`
   - Background: `var(--bg-card)`
   - Shadow: `var(--shadow-raised)`
   - Contains: Exam countdown + Progress ring

3. **Main Action Buttons** (line 142-176):
   - Container: `max-w-2xl mx-auto px-8`
   - Layout: `flex flex-col gap-3`
   - Buttons: "Start Quiz" (primary), "Review Missed" (outline)

4. **Category Performance Snippet** (line 179-216):
   - Classes: `rounded-2xl border p-5`
   - Shows top 3 categories with progress bars
   - "View all →" link to `/profile#performance`

### 4.2 Quiz Options (`/quiz-options`)
**File**: `src/pages/QuizOptions.tsx`

**Page Background**: `var(--bg-base)`  
**Container**: `max-w-4xl mx-auto px-4 pb-8 pt-16`  
**Header**: MinimalHeader ("Quiz Options")  
**Bottom Nav**: Visible

**Structure**:
1. **Quiz Configuration Card**:
   - Wrapped in standard `<Card>` component
   - Contains 5 form sections with spacing: `space-y-5`
   
2. **Form Inputs**:
   - **Dropdowns**: Category, Question Source, Quiz Mode, Time Limit
   - **Number input**: Question count (min=5, max=100, step=5)
   - **Quick-pick chips**: 10, 20, 30 buttons
   
3. **Start Quiz Button** (line 210-217):
   - Background: `var(--primary-500)`
   - Hover: `var(--primary-600)`
   - Padding: `px-8 py-3`
   - Text: `text-white font-medium`

### 4.3 Active Quiz (`/quiz`)
**File**: `src/pages/Quiz.tsx`

**Page Background**: `var(--bg-base)`  
**Header**: Custom sticky header (not MinimalHeader)  
**Bottom Nav**: Hidden (full-screen quiz mode)

**Header Structure** (line 195-223):
- **Position**: `sticky top-0 z-30`
- **Background**: `bg-white`
- **Border**: `border-b` with `var(--stroke-soft)`
- **Contains**: 
  - Quit button (left)
  - Question counter (center)
  - Timer + Bookmark (right)
  
**Progress Bar** (line 225-232):
- Background: `var(--bg-raised)`
- Fill: `var(--primary-500)`
- Height: `h-2`

**Question Card** (line 272):
- Classes: `rounded-2xl border p-5`
- Background: `var(--bg-card)`
- Shadow: `var(--shadow-raised)`
- Contains:
  - Category pill (dynamic color)
  - Question text
  - 4 answer options with letter badges
  - Explanation panel (practice mode)
  - Navigation buttons

**Answer Options** (line 295-331):
- **Layout**: `space-y-3`
- **Button**: `w-full p-4 rounded-xl border-2`
- **Default**: `border: var(--border-muted)`, `bg: white`
- **Selected**: `border: var(--primary-500)`, `bg: rgba(17, 181, 164, 0.1)`
- **Correct (feedback)**: `border: var(--success-500)`
- **Wrong (feedback)**: `bg: var(--wrong-answer-bg)`, `border: var(--danger-500)`

### 4.4 Results/Quiz Summary (`/results`)
**File**: `src/pages/Results.tsx`

**Page Background**: `var(--bg-base)`  
**Container**: `max-w-4xl mx-auto px-4 py-8`  
**Header**: MinimalHeader ("Quiz Summary")  
**Bottom Nav**: Visible

**Structure**:
1. **Horizontal Score Cards** (line 157-184):
   - Grid: `grid-cols-3 gap-3`
   - Each card: `rounded-2xl border p-4 text-center`
   - Background: `var(--bg-card)`
   - Shows: Correct count, Incorrect count, Score %

2. **Action Buttons** (line 187-222):
   - Retry Quiz (primary turquoise)
   - Bookmark All (amber outline)
   - Review Missed (teal outline)

3. **Question Review Section**:
   - Each question in a card: `rounded-2xl border p-5`
   - Shows all 4 options with color coding:
     - User's wrong answer: Red background + left border
     - Correct answer: Green background + left border
     - Other options: Gray background
   - Explanation: Blue-tinted background

### 4.5 Review (`/review`)
**File**: `src/pages/Review.tsx`

**Page Background**: `var(--bg-base)`  
**Container**: `max-w-7xl mx-auto px-4 py-6 pt-16`  
**Header**: MinimalHeader ("Review & Study")  
**Bottom Nav**: Visible

**Structure**:
1. **Filter Card** (line 146-197):
   - Standard `<Card>` component
   - Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
   - Contains: Filter, Category, Difficulty, Search input

2. **Question Cards** (line 247-351):
   - Layout: `space-y-4`
   - Each card: `rounded-2xl border`
   - Background: `white`
   - Shadow: `var(--shadow-raised)`
   - Hover: `shadow: var(--shadow-emphasis)`
   
3. **Card Contents**:
   - Bookmark button (top-right, absolute)
   - Category pill
   - Question text
   - Correct answer only (green panel)
   - Expandable explanation (blue panel)
   - Study links

### 4.6 Profile (`/profile`)
**File**: `src/pages/Profile.tsx`

**Page Background**: `var(--bg-base)`  
**Container**: `max-w-4xl mx-auto px-4 py-8 pt-16`  
**Header**: MinimalHeader ("Profile") with Edit button  
**Bottom Nav**: Visible

**Structure**:
1. **User Info Card** (line 101-143):
   - Classes: `rounded-2xl border p-6 mb-6`
   - Contains: Avatar, name, email, exam date display
   - Edit button (top-right)

2. **Edit Modal** (line 146-264):
   - Background: `bg-black/50` overlay
   - Modal: `bg-white rounded-2xl shadow-xl max-w-md`
   - Contains: Name, Email, Exam Date inputs

3. **Preferences Card** (line 267):
   - Standard `<Card>` component
   - Toggle switches for: Notifications, Sound, Dark Mode, High Contrast

4. **Category Performance Card** (line 378):
   - Standard `<Card>` with `id="performance"`
   - Shows all 10 categories with progress bars
   - Dynamic colors via `getCategoryColor()`

5. **Your Stats Card** (line 420):
   - 3-column grid: Attempted, Correct, Accuracy

---

## 5. Color Usage Audit

### Most Used Colors (by frequency):

**CSS Variable References** (53 instances across 9 pages):
1. `var(--primary-500)` - 15+ uses (buttons, icons, borders)
2. `var(--primary-600)` - 10+ uses (hover states, headings)
3. `var(--bg-card)` - 12+ uses (card backgrounds)
4. `var(--bg-base)` - 9 uses (page backgrounds)
5. `var(--text-primary)` - 10+ uses (headings, body text)
6. `var(--text-secondary)` - 8+ uses (labels, captions)
7. `var(--stroke-soft)` - 8+ uses (card borders)
8. `var(--shadow-raised)` - 12+ uses (card elevations)

**Hardcoded Colors Still in Use**:
- `#64748B` - Used in BottomTabBar inactive state (should use `var(--text-secondary)`)
- `rgba(17, 181, 164, 0.1)` - Used for hover/active backgrounds (multiple files)
- `rgba(17, 181, 164, 0.05)` - Used for hover backgrounds (multiple files)
- `bg-gray-50`, `bg-gray-100`, `bg-gray-200` - Scattered Tailwind classes
- `text-gray-600`, `text-gray-700`, `text-gray-900` - Scattered Tailwind classes

### Inconsistencies Found:

1. **Mixed Primary Color Usage**:
   - ✅ Most components use `var(--primary-500)`
   - ⚠️ BottomTabBar uses hardcoded `#64748B` for inactive state
   - ⚠️ Multiple files use hardcoded `rgba(17, 181, 164, X)` instead of CSS var with opacity

2. **Gray Scale Inconsistency**:
   - Some components use CSS vars: `var(--text-secondary)`
   - Others use Tailwind classes: `text-gray-600`, `bg-gray-50`
   - Modal uses: `bg-white/90` instead of `var(--bg-card)`

3. **Border Colors**:
   - ✅ Most use `var(--stroke-soft)` or `var(--border-muted)`
   - ⚠️ Some still use `border-gray-200`, `border-gray-300`

4. **Shadow Usage**:
   - ✅ Cards consistently use `var(--shadow-raised)`
   - ⚠️ Some components still use Tailwind: `shadow-sm`, `shadow-lg`

---

## 6. Category Color System

### Implementation
**Found in 4 files**: `Dashboard.tsx`, `Quiz.tsx`, `Review.tsx`, `Profile.tsx`

**Function Signature**:
```typescript
function getCategoryColor(category: string, opacity: number = 1): string
```

**Full Implementation** (from `src/pages/Quiz.tsx`, lines 3-39):
```typescript
function getCategoryColor(category: string, opacity: number = 1) {
  const colors: Record<string, string> = {
    'Anatomy & Physiology': '#E85D75',
    'Microbiology': '#4CAF82',
    'Pharmacology': '#4A9FE8',
    'Sterilization and Decontamination': '#8B7BC7',
    'Cardiovascular': '#E85D6B',
    'General Surgery': '#6B7280',
    'Genitourinary': '#F5B947',
    'Neurology': '#5A7C99',
    'Ophthalmic': '#FF9F5A',
    'Orthopedic': '#5BA3D4',
    'Otorhinolaryngology': '#64B5F6',
    'Peripheral Vascular': '#F08C84',
    'Plastics and Reconstructive': '#EDAD5C',
    'Obstetrics and Gynecology': '#E88A8A',
    'Preoperative': '#52C9B0',
    'Postoperative': '#F4D03F',
    'Professional and Administrative Responsibilities': '#B591D6',
    'Surgical Procedures': '#6B7280',
    'Instrumentation': '#5BA3D4',
    'Patient Care': '#52C9B0',
    'Medical Ethics': '#B591D6',
    'Emergency Procedures': '#E85D6B',
    'Post-Operative Care': '#F4D03F'
  };
  
  const baseColor = colors[category] || '#11B5A4'; // Fallback to primary-500

  if (opacity < 1) {
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return baseColor;
}
```

### Category Color Map (23 categories):

| Category | Hex Color | RGB | Visual |
|----------|-----------|-----|--------|
| Anatomy & Physiology | `#E85D75` | rgb(232, 93, 117) | 🔴 Red-Pink |
| Microbiology | `#4CAF82` | rgb(76, 175, 130) | 🟢 Green |
| Pharmacology | `#4A9FE8` | rgb(74, 159, 232) | 🔵 Blue |
| Sterilization and Decontamination | `#8B7BC7` | rgb(139, 123, 199) | 🟣 Purple |
| Cardiovascular | `#E85D6B` | rgb(232, 93, 107) | 🔴 Red |
| General Surgery | `#6B7280` | rgb(107, 114, 128) | ⚫ Gray |
| Genitourinary | `#F5B947` | rgb(245, 185, 71) | 🟡 Yellow |
| Neurology | `#5A7C99` | rgb(90, 124, 153) | 🔵 Slate Blue |
| Ophthalmic | `#FF9F5A` | rgb(255, 159, 90) | 🟠 Orange |
| Orthopedic | `#5BA3D4` | rgb(91, 163, 212) | 🔵 Sky Blue |
| Otorhinolaryngology | `#64B5F6` | rgb(100, 181, 246) | 🔵 Light Blue |
| Peripheral Vascular | `#F08C84` | rgb(240, 140, 132) | 🔴 Coral |
| Plastics and Reconstructive | `#EDAD5C` | rgb(237, 173, 92) | 🟡 Gold |
| Obstetrics and Gynecology | `#E88A8A` | rgb(232, 138, 138) | 🔴 Light Red |
| Preoperative | `#52C9B0` | rgb(82, 201, 176) | 🟢 Teal |
| Postoperative | `#F4D03F` | rgb(244, 208, 63) | 🟡 Yellow |
| Professional and Administrative | `#B591D6` | rgb(181, 145, 214) | 🟣 Lavender |
| Surgical Procedures | `#6B7280` | rgb(107, 114, 128) | ⚫ Gray |
| Instrumentation | `#5BA3D4` | rgb(91, 163, 212) | 🔵 Sky Blue |
| Patient Care | `#52C9B0` | rgb(82, 201, 176) | 🟢 Teal |
| Medical Ethics | `#B591D6` | rgb(181, 145, 214) | 🟣 Lavender |
| Emergency Procedures | `#E85D6B` | rgb(232, 93, 107) | 🔴 Red |
| Post-Operative Care | `#F4D03F` | rgb(244, 208, 63) | 🟡 Yellow |

**Default/Fallback**: `#11B5A4` (primary-500 turquoise)

### Usage Locations:
1. **Dashboard** (line 10): Category performance bars
2. **Quiz** (line 3): Category pills on question cards
3. **Review** (line 69): Category pills on review cards
4. **Profile** (line 10): Category performance section

### Opacity Variants:
- **0.15**: Category pill backgrounds (Quiz, Review)
- **1.0**: Category pill text, progress bar fills

---

## 7. Spacing & Sizing Patterns

### Card Padding
**Standard**: `p-6` (24px all sides)  
**Compact**: `p-5` (20px all sides) - Used in some question cards  
**Small**: `p-4` (16px all sides) - Used in score cards

### Section Gaps
**Standard**: `mb-6` (24px) - Between major sections  
**Tight**: `space-y-3` (12px) - Between answer options, form fields  
**Comfortable**: `space-y-4` (16px) - Between review cards  
**Spacious**: `space-y-5` (20px) - Between form sections in Quiz Options

### Button Heights
**Small**: `py-2` (8px top/bottom) = ~40px total  
**Medium**: `py-3` (12px top/bottom) = ~48px total (most common)  
**Large**: `py-4` (16px top/bottom) = ~56px total

### Input Field Heights
**Standard**: `py-3` (12px top/bottom) = ~48px total  
**Compact**: `py-2` (8px top/bottom) = ~40px total

### Container Widths
**Narrow**: `max-w-2xl` (672px) - Dashboard action buttons  
**Medium**: `max-w-4xl` (896px) - Quiz Options, Results, Profile  
**Wide**: `max-w-7xl` (1280px) - Dashboard, Review

### Border Radius
**Small**: `rounded-lg` (8px) - Buttons, inputs  
**Medium**: `rounded-xl` (12px) - Dropdowns, answer options  
**Large**: `rounded-2xl` (16px) - Cards (most common)  
**Full**: `rounded-full` - Category pills, progress indicators

### Icon Sizes
**Small**: `w-4 h-4` (16px) - In-line icons  
**Medium**: `w-5 h-5` (20px) - Buttons, badges  
**Standard**: `w-6 h-6` (24px) - Navigation icons  
**Large**: `w-8 h-8` (32px) - App logo, modal icons

---

## 8. Typography Hierarchy

### Page Titles
**Dashboard App Title**:
- Size: `text-2xl` (24px)
- Weight: `font-bold`
- Color: `var(--text-primary)`

**MinimalHeader Titles**:
- Size: `text-lg` (18px)
- Weight: `font-semibold`
- Color: `var(--text-primary)`

### Section Headers
**Card Titles** (h2):
- Size: `text-xl` (20px) or `text-lg` (18px)
- Weight: `font-semibold` or `font-bold`
- Color: `var(--text-primary)` or `text-gray-900`

**Subsection Headers** (h3):
- Size: `text-lg` (18px)
- Weight: `font-bold`
- Color: `var(--text-primary)`

### Body Text
**Primary**:
- Size: `text-base` (16px) - Default
- Weight: `font-normal` (400)
- Color: `var(--text-primary)`

**Secondary**:
- Size: `text-sm` (14px)
- Weight: `font-medium` or `font-normal`
- Color: `var(--text-secondary)` or `text-gray-600`

### Small Text / Captions
**Labels**:
- Size: `text-sm` (14px)
- Weight: `font-medium` or `font-semibold`
- Color: `var(--text-primary)` or `text-gray-700`

**Captions/Hints**:
- Size: `text-xs` (12px)
- Weight: `font-medium`
- Color: `var(--text-secondary)` or `text-gray-500`

### Special Text
**Category Pills**:
- Size: `text-xs` (12px)
- Weight: `font-semibold`
- Transform: `uppercase`
- Tracking: `tracking-wide`

**Tab Labels** (Bottom Nav):
- Size: `text-[12px]` with `fontSize: max(12px, 1rem)` enforcement
- Weight: `font-medium`

**Score Display** (Progress Ring):
- Size: `text-4xl` (36px)
- Weight: `font-bold`
- Color: `var(--primary-600)`

### Font Family
**All Text**: Inter (from Google Fonts), with system fallbacks:
```css
font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 
             BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', 
             'Arial', 'Noto Sans', sans-serif
```

---

## 9. Issues & Inconsistencies Detected

### Critical Issues
- [ ] **No issues blocking functionality**

### Design System Inconsistencies

#### 1. Hardcoded Colors vs CSS Variables
- ⚠️ BottomTabBar uses `#64748B` instead of `var(--text-secondary)`
- ⚠️ Multiple components use `rgba(17, 181, 164, X)` instead of CSS var with opacity
- ⚠️ Scattered Tailwind gray classes (`bg-gray-50`, `text-gray-600`) mixed with CSS vars

**Recommendation**: Complete migration to CSS variables for all color references.

#### 2. Tailwind Config vs Actual Usage
- ⚠️ Tailwind config defines HSL-based color aliases (e.g., `hsl(var(--primary-500))`)
- ⚠️ Actual code uses direct CSS var references (e.g., `var(--primary-500)`)
- ⚠️ Tailwind config expects HSL variables, but CSS defines hex colors

**Recommendation**: Either:
  - Update Tailwind config to match hex-based CSS vars, OR
  - Convert CSS vars to HSL format

#### 3. Duplicate getCategoryColor() Function
- ⚠️ Same function defined in 4 different page files
- ⚠️ No central utility file

**Recommendation**: Move to `src/lib/categoryColors.ts` for DRY principle.

#### 4. Modal Background Variations
- ⚠️ Modal component uses `bg-white/90`
- ⚠️ Profile edit modal uses `bg-white`
- ⚠️ Cards use `var(--bg-card)`

**Recommendation**: Standardize modal backgrounds.

#### 5. Shadow Usage
- ✅ Cards consistently use `var(--shadow-raised)`
- ⚠️ Some components still have Tailwind classes: `shadow-sm`, `shadow-lg`, `shadow-xl`

**Recommendation**: Complete migration to CSS shadow variables.

#### 6. Border Inconsistency
- ✅ Most borders use `var(--stroke-soft)` or `var(--border-muted)`
- ⚠️ Some use Tailwind: `border-gray-200`, `border-gray-300`

**Recommendation**: Remove all `border-gray-*` in favor of CSS vars.

### Minor Issues

#### 7. Unused Tailwind Config
- ⚠️ Secondary color (`--secondary-500`) defined in Tailwind but never used
- ⚠️ `border`, `input`, `ring`, `background`, `foreground` colors defined but unused

**Recommendation**: Clean up unused color definitions.

#### 8. Component Variant System
- ⚠️ Card variants (`elevated`, `outlined`) are defined but `elevated` does nothing different from `default`

**Recommendation**: Either implement visual differences or remove unused variants.

#### 9. Toast Component
- ⚠️ Toast utility classes defined in CSS but Toast component exists as separate React component
- ⚠️ Potential duplication

**Recommendation**: Verify which implementation is being used.

---

## 10. Files Analyzed

### CSS/Style Files (2)
- ✅ `src/styles/tailwind.css` - Main CSS with all custom properties
- ✅ `src/App.css` - Global app styles
- ✅ `tailwind.config.ts` - Tailwind configuration

### Component Files (7)
- ✅ `src/components/common/MinimalHeader.tsx`
- ✅ `src/components/common/BottomTabBar.tsx`
- ✅ `src/components/common/Card.tsx`
- ✅ `src/components/common/Button.tsx`
- ✅ `src/components/common/Dropdown.tsx`
- ✅ `src/components/common/Modal.tsx`
- ✅ `src/components/common/ProgressRing.tsx`

### Page Files (9)
- ✅ `src/pages/Dashboard.tsx`
- ✅ `src/pages/QuizOptions.tsx`
- ✅ `src/pages/Quiz.tsx`
- ✅ `src/pages/Results.tsx`
- ✅ `src/pages/Review.tsx`
- ✅ `src/pages/Profile.tsx`
- ✅ `src/pages/Setup.tsx`
- ✅ `src/pages/Flashcards.tsx`
- ✅ `src/pages/Study.tsx`

### Configuration Files (3)
- ✅ `index.html` - iOS 26 viewport meta tags
- ✅ `package.json` - Dependencies (scanned)
- ✅ `tailwind.config.ts` - Theme configuration

---

## 11. Summary Statistics

- **Total CSS Variables Defined**: 27
- **Total Component Files**: 7
- **Total Page Files**: 9
- **Total Category Colors**: 23 + 1 fallback
- **Hardcoded Color References**: ~20 instances
- **CSS Variable Usage**: ~80 instances

---

## 12. Next Steps Recommendations

### Immediate Priorities (High Impact)
1. ✅ **Consolidate getCategoryColor()**: Move to shared utility
2. ✅ **Replace hardcoded colors**: Complete CSS variable migration
3. ✅ **Fix Tailwind config**: Align with hex-based CSS vars
4. ✅ **Standardize grays**: Remove Tailwind gray classes

### Medium Priority
5. ✅ **Clean unused Tailwind colors**: Remove secondary, unused HSL vars
6. ✅ **Standardize shadows**: Complete shadow variable migration
7. ✅ **Standardize borders**: Complete border variable migration

### Low Priority (Polish)
8. ✅ **Review Card variants**: Implement or remove unused variants
9. ✅ **Audit Toast implementation**: Choose one approach
10. ✅ **Typography scale refinement**: Consider more granular sizing

---

*End of Design System Audit*
