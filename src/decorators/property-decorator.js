import 'reflect-metadata';
import {isClass} from '../utils/index.js';
import {cloneDeep} from '../utils/index.js';
import {DecoratorTargetType} from '../utils/index.js';
import {InvalidArgumentError} from '../errors/index.js';
import {getDecoratorTargetType} from '../utils/index.js';
import {ModelDecoratorKeys} from './model-decorator-keys.js';

/**
 * Property decorator.
 *
 * @param {object|string} propertyDef
 * @returns {Function}
 */
export function property(propertyDef) {
  return function (...args) {
    // validate target
    const targetType = getDecoratorTargetType(...args);
    if (targetType !== DecoratorTargetType.INSTANCE_PROPERTY)
      throw new InvalidArgumentError(
        'The @property decorator is only supported for an instance property.',
      );
    const target = args[0];
    const propertyKey = args[1];
    // clone if the given argument
    // is the definition object
    if (
      propertyDef &&
      typeof propertyDef === 'object' &&
      !Array.isArray(propertyDef)
    ) {
      propertyDef = cloneDeep(propertyDef);
    }
    // or throw an error if the argument
    // is not a non-empty string (DataType)
    else if (!propertyDef || typeof propertyDef !== 'string') {
      throw new InvalidArgumentError(
        'The first argument of the @property decorator must be a name' +
          'of the data type or the property definition object, but %v given.',
        propertyDef,
      );
    }
    // get the model class metadata
    let propertiesDef = Reflect.getOwnMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      target.constructor,
    );
    // create a new metadata if needed
    if (propertiesDef == null) {
      propertiesDef = {};
    }
    // or clone the metadata object
    else if (
      propertiesDef &&
      typeof propertiesDef === 'object' &&
      !Array.isArray(propertiesDef)
    ) {
      propertiesDef = cloneDeep(propertiesDef);
    }
    // or throw an error
    else {
      throw new InvalidArgumentError(
        'The properties definition metadata of the model ' +
          'class %s must be an Object, but %v given.',
        target.constructor.name,
        propertiesDef,
      );
    }
    // prepare the "model" option
    if (typeof propertyDef === 'object' && propertyDef.model) {
      // resolve the factory value
      if (
        typeof propertyDef.model === 'function' &&
        !isClass(propertyDef.model)
      ) {
        propertyDef.model = propertyDef.model();
      }
      // convert the model class to its name
      if (isClass(propertyDef.model)) {
        propertyDef.model = propertyDef.model.name;
      }
    }
    // add the property definition
    // to the model class metadata
    propertiesDef[propertyKey] = propertyDef;
    Reflect.defineMetadata(
      ModelDecoratorKeys.PROPERTY_DEFS,
      propertiesDef,
      target.constructor,
    );
  };
}
