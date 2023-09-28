import {Service} from '@e22m4u/js-service';
import {DataType as Type} from './data-type.js';
import {capitalize} from '../../../utils/index.js';
import {InvalidArgumentError} from '../../../errors/index.js';
import {PrimaryKeysDefinitionValidator} from './primary-keys-definition-validator.js';

/**
 * Properties definition validator.
 */
export class PropertiesDefinitionValidator extends Service {
  /**
   * Validate.
   *
   * @param {string} modelName
   * @param {object} propDefs
   */
  validate(modelName, propDefs) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of PropertiesDefinitionValidator.validate ' +
          'should be a non-empty String, but %v given.',
        modelName,
      );
    if (!propDefs || typeof propDefs !== 'object' || Array.isArray(propDefs)) {
      throw new InvalidArgumentError(
        'The provided option "properties" of the model %v ' +
          'should be an Object, but %v given.',
        modelName,
        propDefs,
      );
    }
    const propNames = Object.keys(propDefs);
    propNames.forEach(propName => {
      const propDef = propDefs[propName];
      this._validateProperty(modelName, propName, propDef);
    });
    this.getService(PrimaryKeysDefinitionValidator).validate(
      modelName,
      propDefs,
    );
  }

  /**
   * Validate property.
   *
   * @param {string} modelName
   * @param {string} propName
   * @param {object} propDef
   */
  _validateProperty(modelName, propName, propDef) {
    if (!modelName || typeof modelName !== 'string')
      throw new InvalidArgumentError(
        'The first argument of PropertiesDefinitionValidator._validateProperty ' +
          'should be a non-empty String, but %v given.',
        modelName,
      );
    if (!propName || typeof propName !== 'string')
      throw new InvalidArgumentError(
        'The property name of the model %v should be ' +
          'a non-empty String, but %v given.',
        modelName,
        propName,
      );
    if (!propDef)
      throw new InvalidArgumentError(
        'The property %v of the model %v should have ' +
          'a property definition, but %v given.',
        propName,
        modelName,
        propDef,
      );
    if (typeof propDef === 'string') {
      if (!Object.values(Type).includes(propDef))
        throw new InvalidArgumentError(
          'In case of a short property definition, the property %v ' +
            'of the model %v should have one of data types: %l, but %v given.',
          propName,
          modelName,
          Object.values(Type),
          propDef,
        );
      return;
    }
    if (!propDef || typeof propDef !== 'object' || Array.isArray(propDef)) {
      throw new InvalidArgumentError(
        'In case of a full property definition, the property %v ' +
          'of the model %v should be an Object, but %v given.',
        propName,
        modelName,
        propDef,
      );
    }
    if (!propDef.type || !Object.values(Type).includes(propDef.type))
      throw new InvalidArgumentError(
        'The property %v of the model %v requires the option "type" ' +
          'to have one of data types: %l, but %v given.',
        propName,
        modelName,
        Object.values(Type),
        propDef.type,
      );
    if (propDef.itemType && !Object.values(Type).includes(propDef.itemType)) {
      throw new InvalidArgumentError(
        'The provided option "itemType" of the property %v in the model %v ' +
          'should have one of data types: %l, but %v given.',
        propName,
        modelName,
        Object.values(Type),
        propDef.itemType,
      );
    }
    if (propDef.model && typeof propDef.model !== 'string')
      throw new InvalidArgumentError(
        'The provided option "model" of the property %v in the model %v ' +
          'should be a String, but %v given.',
        propName,
        modelName,
        propDef.model,
      );
    if (propDef.primaryKey && typeof propDef.primaryKey !== 'boolean')
      throw new InvalidArgumentError(
        'The provided option "primaryKey" of the property %v in the model %v ' +
          'should be a Boolean, but %v given.',
        propName,
        modelName,
        propDef.primaryKey,
      );
    if (propDef.columnName && typeof propDef.columnName !== 'string')
      throw new InvalidArgumentError(
        'The provided option "columnName" of the property %v in the model %v ' +
          'should be a String, but %v given.',
        propName,
        modelName,
        propDef.columnName,
      );
    if (propDef.columnType && typeof propDef.columnType !== 'string')
      throw new InvalidArgumentError(
        'The provided option "columnType" of the property %v in the model %v ' +
          'should be a String, but %v given.',
        propName,
        modelName,
        propDef.columnType,
      );
    if (propDef.required && typeof propDef.required !== 'boolean')
      throw new InvalidArgumentError(
        'The provided option "required" of the property %v in the model %v ' +
          'should be a Boolean, but %v given.',
        propName,
        modelName,
        propDef.required,
      );
    if (propDef.required && propDef.default !== undefined)
      throw new InvalidArgumentError(
        'The property %v of the model %v is a required property, ' +
          'so it should not have the option "default" to be provided.',
        propName,
        modelName,
      );
    if (propDef.primaryKey && propDef.required)
      throw new InvalidArgumentError(
        'The property %v of the model %v is a primary key, ' +
          'so it should not have the option "required" to be provided.',
        propName,
        modelName,
      );
    if (propDef.primaryKey && propDef.default !== undefined)
      throw new InvalidArgumentError(
        'The property %v of the model %v is a primary key, ' +
          'so it should not have the option "default" to be provided.',
        propName,
        modelName,
      );
    if (propDef.itemType && propDef.type !== Type.ARRAY)
      throw new InvalidArgumentError(
        'The property %v of the model %v has the non-array type, ' +
          'so it should not have the option "itemType" to be provided.',
        propName,
        modelName,
        propDef.type,
      );
    if (
      propDef.model &&
      propDef.type !== Type.OBJECT &&
      propDef.itemType !== Type.OBJECT
    ) {
      if (propDef.type !== Type.ARRAY) {
        throw new InvalidArgumentError(
          'The option "model" is not supported for %s property type, ' +
            'so the property %v of the model %v should not have ' +
            'the option "model" to be provided.',
          capitalize(propDef.type),
          propName,
          modelName,
        );
      } else {
        throw new InvalidArgumentError(
          'The option "model" is not supported for Array property type of %s, ' +
            'so the property %v of the model %v should not have ' +
            'the option "model" to be provided.',
          capitalize(propDef.itemType),
          propName,
          modelName,
        );
      }
    }
  }
}
