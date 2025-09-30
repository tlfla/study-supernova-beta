/**
 * Category color mapping and utility functions
 * Centralized source of truth for category colors across the app
 */

const CATEGORY_COLORS: Record<string, string> = {
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

/**
 * Get the color for a specific category
 * @param category - The category name
 * @param opacity - Optional opacity value (0-1). If < 1, returns rgba format
 * @returns Hex color string or rgba string if opacity is specified
 */
export function getCategoryColor(category: string, opacity: number = 1): string {
  const baseColor = CATEGORY_COLORS[category] || '#11B5A4'; // Fallback to primary-500
  
  if (opacity < 1) {
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return baseColor;
}

/**
 * Get all available categories
 */
export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_COLORS);
}
