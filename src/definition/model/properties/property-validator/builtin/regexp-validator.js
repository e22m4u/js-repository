import {stringToRegexp} from '../../../../../utils/index.js';
import {InvalidArgumentError} from '../../../../../errors/index.js';

/**
 * Regexp validator.
 *
 * @param {*} value
 * @param {string|RegExp|boolean} options
 * @param {object} context
 * @returns {boolean}
 */
export function regexpValidator(value, options, context) {
  if (options === false) return true;
  if (typeof options !== 'string' && !(options instanceof RegExp))
    throw new InvalidArgumentError(
      'The validator %v requires the "options" argument ' +
        'as a String or RegExp, but %v given.',
      context.validatorName,
      options,
    );
  if (typeof value === 'string') {
    const regexp = stringToRegexp(options);
    return regexp.test(value);
  }
  throw new InvalidArgumentError(
    'The property validator %v requires ' + 'a String value, but %v given.',
    context.validatorName,
    value,
  );
}
