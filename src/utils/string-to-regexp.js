/**
 * String to RegExp.
 *
 * @param {string|RegExp} pattern
 * @param {string|undefined} flags
 * @returns {RegExp}
 */
export function stringToRegexp(pattern, flags = undefined) {
  if (pattern instanceof RegExp) {
    return new RegExp(pattern, flags);
  }
  return new RegExp(pattern, flags);
}
