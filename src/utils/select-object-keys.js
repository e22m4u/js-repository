import {InvalidArgumentError} from '../errors/index.js';

/**
 * Select object keys.
 *
 * @param {object} obj
 * @param {string[]} keys
 * @returns {object}
 */
export function selectObjectKeys(obj, keys) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj))
    throw new InvalidArgumentError(
      'The first argument of selectObjectKeys ' +
        'should be an Object, but %v was given.',
      obj,
    );
  if (!Array.isArray(keys))
    throw new InvalidArgumentError(
      'The second argument of selectObjectKeys ' +
        'should be an Array of String, but %v was given.',
      keys,
    );
  keys.forEach(key => {
    if (typeof key !== 'string')
      throw new InvalidArgumentError(
        'The second argument of selectObjectKeys ' +
          'should be an Array of String, but %v was given.',
        key,
      );
  });
  const result = {};
  const allKeys = Object.keys(obj);
  allKeys.forEach(key => {
    if (keys.includes(key)) result[key] = obj[key];
  });
  return result;
}
