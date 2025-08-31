import {InvalidArgumentError} from '../../../../../errors/index.js';

/**
 * Trim transformer.
 *
 * @param {*} value
 * @param {undefined} options
 * @param {object} context
 * @returns {string|undefined|null}
 */
export function trimTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === 'string') return value.trim();
  throw new InvalidArgumentError(
    'The property transformer %v requires a String value, but %v was given.',
    context.transformerName,
    value,
  );
}
