/**
 * Get ctor name.
 *
 * @param {*} value
 * @returns {string|undefined}
 */
export function getCtorName(value) {
  if (value === null) return 'Null';
  if (value === undefined) return 'Undefined';
  return (value.constructor && value.constructor.name) || undefined;
}
