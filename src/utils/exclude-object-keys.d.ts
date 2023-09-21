/**
 * Exclude object keys.
 *
 * @param obj
 * @param keys
 */
export declare function excludeObjectKeys<T extends object>(
  obj: T,
  keys: string | string[],
): Partial<T>;
