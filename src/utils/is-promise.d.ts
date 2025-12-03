/**
 * Check whether a value is a Promise-like
 * instance. Recognizes both native promises
 * and third-party promise libraries.
 *
 * @param value
 */
export declare function isPromise<T>(
  value: T | PromiseLike<T> | undefined
): value is PromiseLike<T>;
