/**
 * Invalid operator value error.
 */
export declare class InvalidOperatorValueError extends Error {
  /**
   * Constructor.
   *
   * @param operator
   * @param expects
   * @param value
   */
  constructor(operator: string, expects: string, value: unknown);
}
