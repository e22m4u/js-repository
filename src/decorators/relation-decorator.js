import 'reflect-metadata';
import {isClass} from '../utils/index.js';
import {cloneDeep} from '../utils/index.js';
import {DecoratorTargetType} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {getDecoratorTargetType} from '../utils/index.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

/**
 * Relation decorator.
 *
 * @param {object} relationDef
 * @returns {Function}
 */
export function relation(relationDef) {
  return function (...args) {
    // validate target
    const targetType = getDecoratorTargetType(...args);
    if (targetType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new InvalidArgumentError(
        'The @relation decorator is only supported for an instance property.',
      );
    const target = args[0];
    const propertyKey = args[1];
    // clone if the given argument
    // is the definition object
    if (
      relationDef &&
      typeof relationDef === 'object' &&
      !Array.isArray(relationDef)
    ) {
      relationDef = cloneDeep(relationDef);
    }
    // or throw an error
    else {
      throw new InvalidArgumentError(
        'The first argument of the @relation decorator must be ' +
          'the relation definition object, but %v given.',
        relationDef,
      );
    }
    // get the model class metadata
    let relationsDef = Reflect.getOwnMetadata(
      ModelDecoratorKeys.RELATION_DEFS,
      target.constructor,
    );
    // create a new metadata if needed
    if (relationsDef == null) {
      relationsDef = {};
    }
    // or clone the metadata object
    else if (
      relationsDef &&
      typeof relationsDef === 'object' &&
      !Array.isArray(relationsDef)
    ) {
      relationsDef = cloneDeep(relationsDef);
    }
    // or throw an error
    else {
      throw new InvalidArgumentError(
        'The relations definition metadata of the model ' +
          'class %s must be an Object, but %v given.',
        target.constructor.name,
        relationsDef,
      );
    }
    // prepare the "model" option
    if (relationDef.model) {
      // resolve the factory value
      if (
        typeof relationDef.model === 'function' &&
        !isClass(relationDef.model)
      ) {
        relationDef.model = relationDef.model();
      }
      // convert the model class to its name
      if (isClass(relationDef.model)) {
        relationDef.model = relationDef.model.name;
      }
    }
    // add the relation definition
    // to the model class metadata
    relationsDef[propertyKey] = relationDef;
    Reflect.defineMetadata(
      ModelDecoratorKeys.RELATION_DEFS,
      relationsDef,
      target.constructor,
    );
  };
}
