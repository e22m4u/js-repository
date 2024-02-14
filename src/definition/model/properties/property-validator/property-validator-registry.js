import {Service} from '@e22m4u/js-service';
import {regexpValidator} from './builtin/index.js';
import {maxLengthValidator} from './builtin/index.js';
import {minLengthValidator} from './builtin/index.js';
import {InvalidArgumentError} from '../../../../errors/index.js';

/**
 * Property validator registry.
 */
export class PropertyValidatorRegistry extends Service {
  /**
   * Validators.
   *
   * @type {object}
   */
  _validators = {
    maxLength: maxLengthValidator,
    minLength: minLengthValidator,
    regexp: regexpValidator,
  };

  /**
   * Add validator.
   *
   * @param {string} name
   * @param {Function} validator
   * @returns {PropertyValidatorRegistry}
   */
  addValidator(name, validator) {
    if (!name || typeof name !== 'string')
      throw new InvalidArgumentError(
        'A name of the property validator must ' +
          'be a non-empty String, but %v given.',
        name,
      );
    if (name in this._validators)
      throw new InvalidArgumentError(
        'The property validator %v is already defined.',
        name,
      );
    if (typeof validator !== 'function')
      throw new InvalidArgumentError(
        'The property validator %v must be a Function, but %v given.',
        name,
        validator,
      );
    this._validators[name] = validator;
    return this;
  }

  /**
   * Has validator.
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasValidator(name) {
    return Boolean(this._validators[name]);
  }

  /**
   * Get validator.
   *
   * @param {string} name
   * @returns {Function}
   */
  getValidator(name) {
    const validator = this._validators[name];
    if (!validator)
      throw new InvalidArgumentError(
        'The property validator %v is not defined.',
        name,
      );
    return validator;
  }
}
