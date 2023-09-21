/**
 * Any object.
 */
export declare type AnyObject = {
  [property: string]: unknown;
};

/**
 * Model data.
 */
export declare type ModelData = {
  [property: string]: PropertyData;
};

/**
 * Property data.
 */
export type PropertyData =
  | PropertyData[]
  | ModelData
  | string
  | number
  | boolean
  | null
  | undefined;

/**
 * Identifier.
 */
export declare type Identifier = number | string;
