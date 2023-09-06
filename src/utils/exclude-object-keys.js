import {InvalidArgumentError} from '../errors/index.js';

/**
 * Exclude object keys.
 *
 * @param obj
 * @param keys
 */
export function excludeObjectKeys(obj, keys) {
  if (typeof obj !== 'object' || !obj || Array.isArray(obj))
    throw new InvalidArgumentError(
      'Cannot exclude keys from a non-Object value, %s given.',
      obj,
    );
  const result = {...obj};
  keys = Array.isArray(keys) ? keys : [keys];
  keys.forEach(key => delete result[key]);
  return result;
}
