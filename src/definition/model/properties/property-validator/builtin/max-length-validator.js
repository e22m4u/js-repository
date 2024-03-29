import {InvalidArgumentError} from '../../../../../errors/index.js';

/**
 * Max length validator.
 *
 * @param {*} value
 * @param {number|boolean} options
 * @param {object} context
 * @returns {boolean}
 */
export function maxLengthValidator(value, options, context) {
  if (value == null || options === false) return true;
  if (typeof options !== 'number')
    throw new InvalidArgumentError(
      'The validator %v requires the "options" argument ' +
        'as a Number, but %v given.',
      context.validatorName,
      options,
    );
  if (typeof value === 'string' || Array.isArray(value))
    return value.length <= options;
  throw new InvalidArgumentError(
    'The property validator %v requires a String ' +
      'or an Array value, but %v given.',
    context.validatorName,
    value,
  );
}
