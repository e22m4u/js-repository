import {valueToString} from './value-to-string.js';

/**
 * Array to string.
 *
 * @param array
 * @param joiner
 * @param orEmpty
 * @return {string|*|string}
 */
export function arrayToString(array, joiner = ', ', orEmpty = 'Array') {
  if (Array.isArray(array))
    return array.length ? array.map(valueToString).join(joiner) : orEmpty;
  return valueToString(array);
}
