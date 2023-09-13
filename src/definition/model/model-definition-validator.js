import {Service} from '@e22m4u/service';
import {InvalidArgumentError} from '../../errors/index.js';
import {RelationsDefinitionValidator} from './relations/index.js';
import {PropertiesDefinitionValidator} from './properties/index.js';

/**
 * Model definition validator.
 */
export class ModelDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param modelDef
   */
  validate(modelDef) {
    if (!modelDef || typeof modelDef !== 'object' || Array.isArray(modelDef))
      throw new InvalidArgumentError(
        'The model definition should be an Object, but %v given.',
        modelDef,
      );
    if (!modelDef.name || typeof modelDef.name !== 'string')
      throw new InvalidArgumentError(
        'The model definition requires the option "name" ' +
          'as a non-empty String, but %v given.',
        modelDef.name,
      );
    if (modelDef.datasource && typeof modelDef.datasource !== 'string')
      throw new InvalidArgumentError(
        'The provided option "datasource" of the model %v ' +
          'should be a String, but %v given.',
        modelDef.name,
        modelDef.datasource,
      );
    if (modelDef.base && typeof modelDef.base !== 'string')
      throw new InvalidArgumentError(
        'The provided option "base" of the model %v ' +
          'should be a String, but %v given.',
        modelDef.name,
        modelDef.base,
      );
    if (modelDef.tableName && typeof modelDef.tableName !== 'string')
      throw new InvalidArgumentError(
        'The provided option "tableName" of the model %v ' +
          'should be a String, but %v given.',
        modelDef.name,
        modelDef.tableName,
      );
    if (modelDef.properties) {
      if (
        typeof modelDef.properties !== 'object' ||
        Array.isArray(modelDef.properties)
      ) {
        throw new InvalidArgumentError(
          'The provided option "properties" of the model %v ' +
            'should be an Object, but %v given.',
          modelDef.name,
          modelDef.properties,
        );
      }
      this.getService(PropertiesDefinitionValidator).validate(
        modelDef.name,
        modelDef.properties,
      );
    }
    if (modelDef.relations) {
      if (
        typeof modelDef.relations !== 'object' ||
        Array.isArray(modelDef.relations)
      ) {
        throw new InvalidArgumentError(
          'The provided option "relations" of the model %v ' +
            'should be an Object, but %v given.',
          modelDef.name,
          modelDef.relations,
        );
      }
      this.getService(RelationsDefinitionValidator).validate(
        modelDef.name,
        modelDef.relations,
      );
    }
  }
}
