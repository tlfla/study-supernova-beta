# Surgical Tech Study App - Category Color Scheme Documentation

**Last Updated:** September 30, 2025  
**Purpose:** Maintain consistent category color coding across all app features

---

## Color Implementation

### TypeScript/JavaScript Function

```typescript
/**
 * Returns the appropriate color for a given category
 * @param category - The category name (case-sensitive)
 * @param opacity - Optional opacity value (0-1). Default is 1 (solid)
 * @returns Color as hex string or rgba string
 */
function getCategoryColor(category: string, opacity: number = 1): string {
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
    'Professional and Administrative Responsibilities': '#B591D6'
  };
  
  const baseColor = colors[category] || '#11B5A4'; // Fallback to primary teal
  
  if (opacity < 1) {
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return baseColor;
}
```

---

## Complete Color Reference Table

| Category | Hex Color | RGB | Color Family | Use Case |
|----------|-----------|-----|--------------|----------|
| Anatomy & Physiology | `#E85D75` | 232, 93, 117 | Pink | Body structure and function |
| Microbiology | `#4CAF82` | 76, 175, 130 | Green | Microorganisms and infection |
| Pharmacology | `#4A9FE8` | 74, 159, 232 | Blue | Medications and anesthesia |
| Sterilization and Decontamination | `#8B7BC7` | 139, 123, 199 | Purple | Infection control procedures |
| Cardiovascular | `#E85D6B` | 232, 93, 107 | Pink-Red | Heart and vascular surgery |
| General Surgery | `#6B7280` | 107, 114, 128 | Gray | General surgical procedures |
| Genitourinary | `#F5B947` | 245, 185, 71 | Gold | Urinary and reproductive systems |
| Neurology | `#5A7C99` | 90, 124, 153 | Blue-Gray | Brain and nervous system |
| Ophthalmic | `#FF9F5A` | 255, 159, 90 | Orange | Eye surgery |
| Orthopedic | `#5BA3D4` | 91, 163, 212 | Sky Blue | Bone and joint surgery |
| Otorhinolaryngology | `#64B5F6` | 100, 181, 246 | Bright Blue | ENT (ear, nose, throat) |
| Peripheral Vascular | `#F08C84` | 240, 140, 132 | Peach | Blood vessel surgery |
| Plastics and Reconstructive | `#EDAD5C` | 237, 173, 92 | Cream | Reconstructive procedures |
| Obstetrics and Gynecology | `#E88A8A` | 232, 138, 138 | Rose | Women's health surgery |
| Preoperative | `#52C9B0` | 82, 201, 176 | Mint | Before surgery procedures |
| Postoperative | `#F4D03F` | 244, 208, 63 | Yellow | After surgery care |
| Professional and Administrative Responsibilities | `#B591D6` | 181, 145, 214 | Lavender | Ethics, legal, management |

---

## Usage Examples

### React/TSX Component
```tsx
<span 
  className="px-3 py-1.5 rounded-full text-xs font-semibold uppercase"
  style={{
    backgroundColor: getCategoryColor(category, 0.15), // 15% opacity background
    color: getCategoryColor(category, 1) // Solid text color
  }}
>
  {category}
</span>
```

### Progress Bar by Category
```tsx
<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
  <div 
    className="h-full rounded-full transition-all"
    style={{ 
      width: `${percentage}%`,
      backgroundColor: getCategoryColor(category)
    }}
  />
</div>
```

### Category Card
```tsx
<div 
  className="p-4 rounded-xl border-l-4"
  style={{ 
    borderLeftColor: getCategoryColor(category),
    backgroundColor: getCategoryColor(category, 0.08)
  }}
>
  <h3 className="font-semibold">{category}</h3>
  <p>Content here</p>
</div>
```

---

## Design Principles

1. **Brightness:** All colors are saturated enough for small UI elements (pills, badges)
2. **Contrast:** Each color provides sufficient contrast against white backgrounds
3. **Distinctiveness:** Colors are visually distinct from each other for quick recognition
4. **Consistency:** Based on approved pastel selections, brightened for visibility
5. **Fallback:** Unknown categories default to primary teal `#11B5A4`

---

## Notes

- Color names in the function must match exactly (case-sensitive)
- Opacity parameter accepts values from 0 (transparent) to 1 (solid)
- Use 0.10-0.20 opacity for subtle backgrounds
- Use 1.0 opacity for text, borders, and solid fills
- Gray (#6B7280) chosen for "General Surgery" as neutral category

**Implementation Date:** September 2025