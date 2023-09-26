import {format} from '@e22m4u/js-format';

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
        'Condition of {%s: ...} should have %s, but %v given.',
        operator,
        expected,
        value,
      ),
    );
  }
}
