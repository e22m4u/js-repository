/**
 * Returns true if the given value
 * is a constructor function or a class.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isCtor(value) {
  if (!value) return false;
  return typeof value === 'function' && 'prototype' in value;
}
