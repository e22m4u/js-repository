import {InvalidArgumentError} from '../../../../../errors/index.js';

/**
 * To title case transformer.
 *
 * @param {*} value
 * @param {undefined} options
 * @param {object} context
 * @returns {string|undefined|null}
 */
export function toTitleCaseTransformer(value, options, context) {
  if (value == null) return value;
  if (typeof value === 'string')
    return value.replace(/\p{L}\S*/gu, text => {
      return text.charAt(0).toUpperCase() + text.substring(1).toLowerCase();
    });
  throw new InvalidArgumentError(
    'The property transformer %v requires a String value, but %v given.',
    context.transformerName,
    value,
  );
}
