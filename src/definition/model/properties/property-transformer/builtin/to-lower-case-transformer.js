import {InvalidArgumentError} from '../../../../../errors/index.js';

/**
 * To lower case transformer.
 *
 * @param {*} value
 * @param {undefined} options
 * @param {object} context
 * @returns {string|undefined|null}
 */
export function toLowerCaseTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === 'string') return value.toLowerCase();
  throw new InvalidArgumentError(
    'The property transformer %v requires a String value, but %v was given.',
    context.transformerName,
    value,
  );
}
