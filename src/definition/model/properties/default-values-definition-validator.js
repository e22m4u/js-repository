import {Service} from '@e22m4u/js-service';
import {ModelDataValidator} from '../model-data-validator.js';
import {InvalidArgumentError} from '../../../errors/index.js';

/**
 * Default values definition validator.
 */
export class DefaultValuesDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} propDefs
   */
  validate(modelName, propDefs) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'A first argument of DefaultValuesDefinitionValidator.validate ' +
          'should be a non-empty String, but %v given.',
        modelName,
      );
    if (!propDefs || typeof propDefs !== 'object' || Array.isArray(propDefs))
      throw new InvalidArgumentError(
        'The provided option "properties" of the model %v ' +
          'should be an Object, but %v given.',
        modelName,
        propDefs,
      );
    Object.keys(propDefs).forEach(propName => {
      const propDef = propDefs[propName];
      if (typeof propDef === 'string') return;
      if (!('default' in propDef)) return;
      const propValue =
        propDef.default instanceof Function
          ? propDef.default()
          : propDef.default;
      try {
        this.getService(ModelDataValidator).validatePropertyValue(
          modelName,
          propName,
          propDef,
          propValue,
        );
      } catch (error) {
        if (error instanceof InvalidArgumentError)
          throw new InvalidArgumentError(
            `A default value is invalid. ${error.message}`,
          );
        throw error;
      }
    });
  }
}
