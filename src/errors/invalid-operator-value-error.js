import {format} from '@e22m4u/util-format';

/**
 * Invalid operator value error.
 */
export class InvalidOperatorValueError extends Error {
  /**
   * Constructor.
   *
   * @param {string} operator
   * @param {string} expected
   * @param {*} value
   */
  constructor(operator, expected, value) {
    super(
      format(
        'Condition of {%s: ...} should have %s, %v given.',
        operator,
        expected,
        value,
      ),
    );
  }
}
