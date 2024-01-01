import 'reflect-metadata';
import {isClass} from '../utils/index.js';
import {Service} from '@e22m4u/js-service';
import {cloneDeep} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

/**
 * Model decorator utils.
 */
export class ModelDecoratorUtils extends Service {
  /**
   * Has model definition in.
   *
   * @param {*} target
   * @returns {boolean}
   */
  hasModelDefinitionIn(target) {
    return (
      typeof target === 'function' &&
      Reflect.hasMetadata(ModelDecoratorKeys.MODEL_DEF, target)
    );
  }

  /**
   * Get model definition from.
   *
   * @param {Function} target
   * @returns {object}
   */
  getModelDefinitionFrom(target) {
    // validate target type
    if (!isClass(target))
      throw new InvalidArgumentError(
        'The given model must be a ES6 class, but %v given.',
        target,
      );
    // get model definition
    let modelDef = Reflect.getOwnMetadata(ModelDecoratorKeys.MODEL_DEF, target);
    if (!modelDef || typeof modelDef !== 'object' || Array.isArray(modelDef))
      throw new InvalidArgumentError(
        'The given class %s does not have the model definition.',
        target.name,
      );
    modelDef = cloneDeep(modelDef);
    // get the properties definition
    const propDefs = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      target,
    );
    if (propDefs) {
      if (typeof propDefs === 'object' && !Array.isArray(propDefs)) {
        modelDef.properties = propDefs;
      } else {
        throw new InvalidArgumentError(
          'The properties definition metadata of the model ' +
            'class %s must be an Object, but %v given.',
          target.name,
          propDefs,
        );
      }
    }
    // get the relations definition
    const relDefs = Reflect.getOwnMetadata(
      ModelDecoratorKeys.RELATION_DEFS,
      target,
    );
    if (relDefs) {
      if (typeof relDefs === 'object' && !Array.isArray(relDefs)) {
        modelDef.relations = relDefs;
      } else {
        throw new InvalidArgumentError(
          'The relations definition metadata of the model ' +
            'class %s must be an Object, but %v given.',
          target.name,
          relDefs,
        );
      }
    }
    return modelDef;
  }
}
