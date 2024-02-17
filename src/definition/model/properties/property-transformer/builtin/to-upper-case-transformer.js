import {InvalidArgumentError} from '../../../../../errors/index.js';

/**
 * To upper case transformer.
 *
 * @param {*} value
 * @param {undefined} options
 * @param {object} context
 * @returns {string|undefined|null}
 */
export function toUpperCaseTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === 'string') return value.toUpperCase();
  throw new InvalidArgumentError(
    'The property transformer %v requires a String value, but %v given.',
    context.transformerName,
    value,
  );
}
