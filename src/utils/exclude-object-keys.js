import {InvalidArgumentError} from '../errors/index.js';

/**
 * Exclude object keys.
 *
 * @param {object} obj
 * @param {string|string[]} keys
 * @returns {object}
 */
export function excludeObjectKeys(obj, keys) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new InvalidArgumentError(
      'Parameter "obj" must be an Object, but %v was given.',
      obj,
    );
  }
  const result = {...obj};
  keys = Array.isArray(keys) ? keys : [keys];
  keys.forEach(key => delete result[key]);
  return result;
}
