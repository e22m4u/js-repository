import {InvalidArgumentError} from '../errors/index.js';

/**
 * Select object keys.
 *
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export function selectObjectKeys(obj, keys) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new InvalidArgumentError(
      'Parameter "obj" must be an Object, but %v was given.',
      obj,
    );
  }
  if (!Array.isArray(keys)) {
    throw new InvalidArgumentError(
      'Parameter "keys" must be an Array, but %v was given.',
      keys,
    );
  }
  keys.forEach((key, index) => {
    if (typeof key !== 'string') {
      throw new InvalidArgumentError(
        'Element %d of the parameter "keys" must be a String, ' +
          'but %v was given.',
        index,
        key,
      );
    }
  });
  const result = {};
  const allKeys = Object.keys(obj);
  allKeys.forEach(key => {
    if (keys.includes(key)) {
      result[key] = obj[key];
    }
  });
  return result;
}
