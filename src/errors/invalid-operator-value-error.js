import {format} from '@e22m4u/format';

/**
 * Invalid operator value error.
 */
export class InvalidOperatorValueError extends Error {
  /**
   * Constructor.
   *
   * @param operator
   * @param expected
   * @param value
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
