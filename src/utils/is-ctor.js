/**
 * Is ctor.
 *
 * @param value
 * @returns {boolean}
 */
export function isCtor(value) {
  if (!value) return false;
  return typeof value === 'function' && 'prototype' in value;
}
