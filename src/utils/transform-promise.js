import {isPromise} from './is-promise.js';

/**
 * Transform a value or promise with a function that
 * produces a new value or promise.
 *
 * @param {*} valueOrPromise
 * @param {Function} transformer
 * @returns {*}
 */
export function transformPromise(valueOrPromise, transformer) {
  return isPromise(valueOrPromise)
    ? valueOrPromise.then(transformer)
    : transformer(valueOrPromise);
}
