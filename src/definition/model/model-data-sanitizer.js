import {Service} from '@e22m4u/js-service';
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
   * @returns {object}
   */
  sanitize(modelName, modelData) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of ModelDataSanitizer.sanitize ' +
          'should be a string, but %v was given.',
        modelName,
      );
    if (!modelData || typeof modelData !== 'object')
      throw new InvalidArgumentError(
        'The second argument of ModelDataSanitizer.sanitize ' +
          'should be an Object, but %v was given.',
        modelData,
      );
    return this.getService(
      ModelDefinitionUtils,
    ).excludeObjectKeysByRelationNames(modelName, modelData);
  }
}
