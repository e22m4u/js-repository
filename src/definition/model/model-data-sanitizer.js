import {Service} from '../../service/index.js';
import {InvalidArgumentError} from '../../errors/index.js';
import {ModelDefinitionUtils} from './model-definition-utils.js';

/**
 * Model data validator.
 */
export class ModelDataSanitizer extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} modelData
   * @return {object}
   */
  sanitize(modelName, modelData) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of ModelDataSanitizer.sanitize ' +
          'must be a string, but %v given.',
        modelName,
      );
    if (!modelData || typeof modelData !== 'object')
      throw new InvalidArgumentError(
        'The second argument of ModelDataSanitizer.sanitize ' +
          'must be an Object, but %v given.',
        modelData,
      );
    return this.get(ModelDefinitionUtils).excludeObjectKeysByRelationNames(
      modelName,
      modelData,
    );
  }
}
