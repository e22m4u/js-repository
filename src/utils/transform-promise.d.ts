import {ValueOrPromise} from '../types.js';

/**
 * Transform a value or promise with a function that
 * produces a new value or promise.
 *
 * @param valueOrPromise
 * @param transformer
 */
export declare function transformPromise<T, V>(
  valueOrPromise: ValueOrPromise<T>,
  transformer: (val: T) => ValueOrPromise<V>,
): ValueOrPromise<V>;
