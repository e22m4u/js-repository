/**
 * Value to string.
 *
 * @param value
 * @return {string}
 */
export function valueToString(value) {
  if (typeof value === 'string') return `"${value}"`;
  if (value instanceof String) return String(value);
  if (
    value &&
    typeof value === 'object' &&
    value.constructor &&
    value.constructor.name
  ) {
    return value.constructor.name;
  }
  if (value instanceof Function) return 'Function';
  return String(value);
}
