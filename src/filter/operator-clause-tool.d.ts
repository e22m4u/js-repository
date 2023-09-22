import {Service} from '@e22m4u/js-service';

/**
 * Operator clause tool.
 */
export declare class OperatorClauseTool extends Service {
  /**
   * Compare.
   *
   * @param val1
   * @param val2
   */
  compare(val1: unknown, val2: unknown): number;

  /**
   * Test all operators.
   *
   * @param clause
   * @param value
   */
  testAll(clause: object, value: unknown): boolean | undefined;

  /**
   * Test eq/neq operator.
   *
   * @example
   * ```ts
   * {
   *   eq: 'foo',
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   neq: 'foo',
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testEqNeq(clause: object, value: unknown): boolean | undefined;

  /**
   * Test lt/gt/lte/gte operator.
   *
   * @example
   * ```ts
   * {
   *   lt: 10,
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   lte: 10,
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   gt: 10,
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   gte: 10,
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testGtLt(clause: object, value: unknown): boolean | undefined;

  /**
   * Test inc operator.
   *
   * @example
   * ```ts
   * {
   *   inc: ['foo', 'bar'],
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testInq(clause: object, value: unknown): boolean | undefined;

  /**
   * Test nin operator.
   *
   * @example
   * ```ts
   * {
   *   nin: ['foo', 'bar'],
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testNin(clause: object, value: unknown): boolean | undefined;

  /**
   * Test between operator.
   *
   * @example
   * ```ts
   * {
   *   between: [10, 20],
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testBetween(clause: object, value: unknown): boolean | undefined;

  /**
   * Test exists operator.
   *
   * @example
   * ```ts
   * {
   *   exists: true,
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testExists(clause: object, value: unknown): boolean | undefined;

  /**
   * Test like operator.
   *
   * @example
   * ```ts
   * {
   *   like: 'foo',
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testLike(clause: object, value: unknown): boolean | undefined;

  /**
   * Test nlike operator.
   *
   * @example
   * ```ts
   * {
   *   nlike: 'foo',
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testNlike(clause: object, value: unknown): boolean | undefined;

  /**
   * Test ilike operator.
   *
   * @example
   * ```ts
   * {
   *   ilike: 'foo',
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testIlike(clause: object, value: unknown): boolean | undefined;

  /**
   * Test nilike operator.
   *
   * @example
   * ```ts
   * {
   *   nilike: 'foo',
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testNilike(clause: object, value: unknown): boolean | undefined;

  /**
   * Test regexp.
   *
   * @example
   * ```ts
   * {
   *   regexp: 'foo.*',
   * }
   * ```
   *
   * @example
   * ```ts
   * {
   *   regexp: 'foo.*',
   *   flags: 'i',
   * }
   * ```
   *
   * @param clause
   * @param value
   */
  testRegexp(clause: object, value: unknown): boolean | undefined;
}
