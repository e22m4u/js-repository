/**
 * Get ctor name.
 *
 * @param value
 */
export function getCtorName(value) {
  if (value === null) return 'Null';
  if (value === undefined) return 'Undefined';
  return (value.constructor && value.constructor.name) || undefined;
}
