import {Service} from '@e22m4u/js-service';
import {trimTransformer} from './builtin/index.js';
import {toUpperCaseTransformer} from './builtin/index.js';
import {toLowerCaseTransformer} from './builtin/index.js';
import {InvalidArgumentError} from '../../../../errors/index.js';

/**
 * Property transformer registry.
 */
export class PropertyTransformerRegistry extends Service {
  /**
   * Transformers.
   *
   * @type {object}
   */
  _transformers = {
    trim: trimTransformer,
    toUpperCase: toUpperCaseTransformer,
    toLowerCase: toLowerCaseTransformer,
  };

  /**
   * Add transformer.
   *
   * @param {string} name
   * @param {Function} transformer
   * @returns {PropertyTransformerRegistry}
   */
  addTransformer(name, transformer) {
    if (!name || typeof name !== 'string')
      throw new InvalidArgumentError(
        'A name of the property transformer must ' +
          'be a non-empty String, but %v was given.',
        name,
      );
    if (name in this._transformers)
      throw new InvalidArgumentError(
        'The property transformer %v is already defined.',
        name,
      );
    if (typeof transformer !== 'function')
      throw new InvalidArgumentError(
        'The property transformer %v must be a Function, but %v was given.',
        name,
        transformer,
      );
    this._transformers[name] = transformer;
    return this;
  }

  /**
   * Has transformer.
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasTransformer(name) {
    return Boolean(this._transformers[name]);
  }

  /**
   * Get transformer.
   *
   * @param {string} name
   * @returns {Function}
   */
  getTransformer(name) {
    const transformer = this._transformers[name];
    if (!transformer)
      throw new InvalidArgumentError(
        'The property transformer %v is not defined.',
        name,
      );
    return transformer;
  }
}
