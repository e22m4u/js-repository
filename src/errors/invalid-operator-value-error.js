import {format} from 'util';
import {valueToString} from '../utils/index.js';

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
        'Condition of {%s: ...} should have %s, %s given.',
        operator,
        expected,
        valueToString(value),
      ),
    );
  }
}
