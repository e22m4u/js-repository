import {InvalidArgumentError} from '../errors/index.js';

/**
 * Model name to model key.
 *
 * @param {string} modelName
 * @returns {string}
 */
export function modelNameToModelKey(modelName) {
  if (!modelName || typeof modelName !== 'string' || /\s/.test(modelName))
    throw new InvalidArgumentError(
      'The model name should be a non-empty String ' +
        'without spaces, but %v given.',
      modelName,
    );
  return modelName.toLowerCase().replace(/[-_]/g, '');
}
