/**
 * Capitalize.
 *
 * @param {string} string
 * @returns {string}
 */
export function capitalize(string) {
  if (!string || typeof string !== 'string') return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}
