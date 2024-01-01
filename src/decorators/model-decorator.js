import 'reflect-metadata';
import {isClass} from '../utils/index.js';
import {cloneDeep} from '../utils/index.js';
import {DecoratorTargetType} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {getDecoratorTargetType} from '../utils/index.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

/**
 * Model decorator.
 *
 * @param {object|undefined} modelDef
 * @returns {Function}
 */
export function model(modelDef = undefined) {
  return function (...args) {
    // validate target
    const targetType = getDecoratorTargetType(...args);
    if (targetType !== DecoratorTargetType.CONSTRUCTOR)
      throw new InvalidArgumentError(
        'The @model decorator is only supported for a class.',
      );
    const target = args[0];
    // create the model definition
    // object if not provided
    if (modelDef == null) {
      modelDef = {};
    }
    // or clone if the given argument
    // has the "object" type
    else if (
      modelDef &&
      typeof modelDef === 'object' &&
      !Array.isArray(modelDef)
    ) {
      modelDef = cloneDeep(modelDef);
      delete modelDef.properties;
      delete modelDef.relations;
    }
    // or throw an error
    else {
      throw new InvalidArgumentError(
        'The provided argument of the @model decorator ' +
          'must be the model definition object, but %v given.',
        modelDef,
      );
    }
    // prepare the "base" option
    if (modelDef.base) {
      // resolve the factory value
      if (typeof modelDef.base === 'function' && !isClass(modelDef.base)) {
        modelDef.base = modelDef.base();
      }
      // convert the model class to its name
      if (isClass(modelDef.base)) {
        modelDef.base = modelDef.base.name;
      }
    }
    // do use target name if no model name provided
    if (!modelDef.name) modelDef.name = target.name;
    Reflect.defineMetadata(ModelDecoratorKeys.MODEL_DEF, modelDef, target);
  };
}
