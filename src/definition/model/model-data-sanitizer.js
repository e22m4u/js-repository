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
    if (!modelName || typeof modelName !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "modelName" must be a String, but %v was given.',
        modelName,
      );
    }
    if (!modelData || typeof modelData !== 'object') {
      throw new InvalidArgumentError(
        'Parameter "modelData" must be an Object, but %v was given.',
        modelData,
      );
    }
    return this.getService(
      ModelDefinitionUtils,
    ).excludeObjectKeysByRelationNames(modelName, modelData);
  }
}
