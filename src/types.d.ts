/**
 * Free-form object with open properties.
 */
export declare type AnyObject = {
  [property: string]: unknown;
};

/**
 * Makes specific field as optional.
 */
export declare type PartialBy<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

/**
 * Model data.
 */
export declare type ModelData = {
  [property: string]: unknown;
};

/**
 * Model id.
 */
export declare type ModelId = unknown;

/**
 * Flatten.
 */
type Identity<T> = T;
export declare type Flatten<T> = Identity<{[k in keyof T]: T[k]}>;

/**
 * A callable type with the "new" operator
 * allows class and constructor.
 */
export interface Constructor<T = unknown> {
  new (...args: any[]): T;
}

/**
 * Representing a value or promise. This type is used
 * to represent results of synchronous/asynchronous
 * resolution of values.
 */
export type ValueOrPromise<T> = T | PromiseLike<T>;
