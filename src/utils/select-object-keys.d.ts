/**
 * Select object keys.
 *
 * @param obj
 * @param keys
 */
export declare function selectObjectKeys<T extends object>(
  obj: T,
  keys: string[],
): Partial<T>;
