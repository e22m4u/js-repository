/**
 * Is plain object.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return Boolean(
    typeof value === 'object' &&
      value &&
      !Array.isArray(value) &&
      (!value.constructor ||
        (value.constructor && value.constructor.name === 'Object')),
  );
}
