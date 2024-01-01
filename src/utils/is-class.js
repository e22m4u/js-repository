/**
 * Returns true if the given value is ES6 class.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isClass(value) {
  if (!value) return false;
  return (
    typeof value === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(value))
  );
}
