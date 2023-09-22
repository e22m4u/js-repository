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
