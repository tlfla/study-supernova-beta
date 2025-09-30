/**
 * Color utility functions for consistent color usage across the app
 */

/**
 * Returns the primary color with specified opacity
 * @param opacity - Value between 0 and 1
 * @returns rgba color string
 */
export function getPrimaryWithOpacity(opacity: number): string {
  return `rgba(17, 181, 164, ${opacity})`;
}
