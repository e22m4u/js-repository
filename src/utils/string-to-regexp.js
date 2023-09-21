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
  let regex = '';
  for (let i = 0, n = pattern.length; i < n; i++) {
    const char = pattern.charAt(i);
    if (char === '%') {
      regex += '.*';
    } else {
      regex += char;
    }
  }
  return new RegExp(regex, flags);
}
